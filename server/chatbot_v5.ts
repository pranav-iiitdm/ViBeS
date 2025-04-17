import { GraphCypherQAChain } from "@langchain/community/chains/graph_qa/cypher";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { Driver, session as neo4jSession, Record, Session } from "neo4j-driver";
import dotenv from "dotenv";
import neo4j from "neo4j-driver"; // Import full neo4j-driver

// Load environment variables
dotenv.config();

interface Document {
  id: string;
  content: string;
  type: string;
  metadata: { [key: string]: any };
}

class ChatbotServiceV5 {
  private neo4jGraph: Neo4jGraph;
  private driver: Driver;
  private chain: GraphCypherQAChain;
  private isReady: boolean = false;
  private fullTextIndexExists: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    const neo4jUri =
      process.env.NEO4J_URI || "neo4j+s://69acfba4.databases.neo4j.io";
    const neo4jUser = process.env.NEO4J_USER || "neo4j";
    const neo4jPassword =
      process.env.NEO4J_PASSWORD ||
      "ZZciq7iG-3yfEby0pqoz6Hq6jbeUNcx_iciP-nzpZJA";
    
    console.log("Neo4j connection info:");
    console.log(`URI: ${neo4jUri.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`); // Hide password in logs
    console.log(`User: ${neo4jUser}`);
    console.log(`Password: ${neo4jPassword ? '***' : 'Not provided'}`);

    // Set Neo4j driver configuration with timeouts
    const neo4jConfig = {
      maxConnectionLifetime: 30000, // 30 seconds max connection lifetime
      connectionAcquisitionTimeout: 20000, // 20 seconds to acquire a connection
      connectionTimeout: 15000, // 15 seconds to establish a connection
    };
    
    console.log("[constructor] Using Neo4j connection config:", neo4jConfig);

    // Create a driver directly with configured timeouts
    const driver = neo4j.driver(
      neo4jUri,
      neo4j.auth.basic(neo4jUser, neo4jPassword),
      neo4jConfig
    );

    this.neo4jGraph = new Neo4jGraph({
      url: neo4jUri,
      username: neo4jUser,
      password: neo4jPassword,
    });

    // Override the driver with our custom configured one
    this.driver = driver;
    (this.neo4jGraph as any).driver = driver;

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      temperature: 0,
    });

    this.chain = GraphCypherQAChain.fromLLM({
      llm: llm,
      graph: this.neo4jGraph,
      returnDirect: true, // Return raw database results
    });

    this.initializationPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      console.log("[initialize] Starting chatbot initialization...");
      this.isReady = false; // Ensure isReady is false until success
      
      // Add connection timeout and retry
      let connected = false;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!connected && attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`Neo4j connection attempt ${attempts}/${maxAttempts}...`);
          await this.neo4jGraph.verifyConnectivity();
          connected = true;
          console.log("Successfully connected to Neo4j database");
        } catch (connError) {
          console.error(`Connection attempt ${attempts} failed:`, connError);
          if (attempts < maxAttempts) {
            console.log(`Retrying in 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }
      
      if (!connected) {
        console.error("[initialize] Failed to connect to Neo4j after multiple attempts. Initialization failed.");
        // Do NOT set isReady to true here
        // this.isReady = false; // Already set at the start
        throw new Error("Failed to connect to Neo4j database."); // Throw to reject the promise
      }
      
      console.log("[initialize] Refreshing Neo4j schema...");
      try {
        // Use the new timeout method instead
        await this.refreshSchemaWithTimeout(30000); // 30 seconds timeout
        console.log(`[initialize] Neo4j schema refreshed successfully.`);
      } catch (schemaError) {
        console.error("[initialize] Error during schema refresh:", schemaError);
        // Continue initialization even if schema refresh fails
        console.log("[initialize] Continuing initialization despite schema refresh failure.");
      }

      // Check and create full-text index if needed
      try {
        console.log("[initialize] Verifying full-text index...");
        await this.verifyFullTextIndex();
        console.log("[initialize] Full-text index verified.");
      } catch (indexError) {
        console.error("[initialize] Error during full-text index verification:", indexError);
        // Continue without full-text index
        console.log("[initialize] Continuing without full-text index. Will use fallback search methods.");
        this.fullTextIndexExists = false;
      }

      this.isReady = true; // Set ready only on full success
      console.log("[initialize] Chatbot initialization successful. Ready with Neo4j backend.");
    } catch (error) {
      console.error("[initialize] Initialization failed overall:", error);
      this.isReady = false; // Ensure isReady is false on any error
      // Re-throw the error so the initializationPromise rejects
      throw error;
    }
  }

  /**
   * Attempts to refresh the Neo4j schema with a timeout to prevent hanging
   * @param timeoutMs Timeout in milliseconds
   * @returns Promise that resolves when schema is refreshed or rejects on timeout
   */
  private async refreshSchemaWithTimeout(timeoutMs: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // Set a timeout to reject the promise if schema refresh takes too long
      const timeout = setTimeout(() => {
        console.error(`[refreshSchemaWithTimeout] Schema refresh timed out after ${timeoutMs}ms`);
        reject(new Error(`Schema refresh timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      try {
        console.log(`[refreshSchemaWithTimeout] Starting schema refresh with ${timeoutMs}ms timeout`);
        
        // Try to refresh the schema
        await this.neo4jGraph.refreshSchema();
        
        // Clear the timeout if successful
        clearTimeout(timeout);
        console.log(`[refreshSchemaWithTimeout] Schema refreshed successfully within timeout`);
        resolve();
      } catch (error) {
        // Clear the timeout to prevent rejection after catch
        clearTimeout(timeout);
        console.error(`[refreshSchemaWithTimeout] Schema refresh failed with error:`, error);
        reject(error);
      }
    });
  }

  private async verifyFullTextIndex(): Promise<void> {
    let session: Session | null = null;
    console.log("[verifyFullTextIndex] Checking for index 'allNodesIndex'...");
    
    try {
      session = this.driver.session();
      
      // Add a timeout around the index verification
      const indexCheckPromise = new Promise<void>(async (resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error("[verifyFullTextIndex] Index check timed out after 15 seconds");
          reject(new Error("Index check timed out"));
        }, 15000); // 15 second timeout
        
        try {
          if (!session) {
            clearTimeout(timeout);
            reject(new Error("Neo4j session is null"));
            return;
          }
          
          const result = await session.run(
            `SHOW INDEXES WHERE type = 'FULLTEXT' AND name = 'allNodesIndex'`
          );
          
          clearTimeout(timeout);
          
          if (result.records.length === 0) {
            console.log("[verifyFullTextIndex] Index 'allNodesIndex' not found. Creating...");
            await this.createFullTextIndex();
          } else {
            console.log("[verifyFullTextIndex] Index 'allNodesIndex' found.");
            this.fullTextIndexExists = true;
          }
          resolve();
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
      
      await indexCheckPromise;
    } catch (error) {
      console.error("[verifyFullTextIndex] Error verifying full-text index:", error);
      // Set to false to ensure we don't attempt to use it
      this.fullTextIndexExists = false;
      throw error;
    } finally {
      if (session) {
        try {
          await session.close();
          console.log("[verifyFullTextIndex] Neo4j session closed.");
        } catch (closeError) {
          console.error("[verifyFullTextIndex] Error closing session:", closeError);
        }
      }
    }
  }

  private async createFullTextIndex(): Promise<void> {
    let session: Session | null = null;
    console.log("[createFullTextIndex] Attempting to create index 'allNodesIndex'...");
    
    try {
      session = this.driver.session();
      
      // Add a timeout around the index creation
      const indexCreatePromise = new Promise<void>(async (resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error("[createFullTextIndex] Index creation timed out after 20 seconds");
          reject(new Error("Index creation timed out"));
        }, 20000); // 20 second timeout
        
        try {
          if (!session) {
            clearTimeout(timeout);
            reject(new Error("Neo4j session is null"));
            return;
          }
          
          await session.run(
            `CREATE FULLTEXT INDEX allNodesIndex 
             FOR (n:Research|Publication|TeamMember|Student) 
             ON EACH [n.name, n.title, n.abstract, n.bio, n.authors]`
          );
          
          clearTimeout(timeout);
          this.fullTextIndexExists = true;
          console.log("[createFullTextIndex] Successfully created full-text index 'allNodesIndex'.");
          resolve();
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
      
      await indexCreatePromise;
    } catch (error) {
      console.error("[createFullTextIndex] Failed to create full-text index 'allNodesIndex':", error);
      this.fullTextIndexExists = false;
      throw error; // Propagate error to fail initialization if index creation fails
    } finally {
      if (session) {
        try {
          await session.close();
          console.log("[createFullTextIndex] Neo4j session closed.");
        } catch (closeError) {
          console.error("[createFullTextIndex] Error closing session:", closeError);
        }
      }
    }
  }

  public async processQuery(query: string): Promise<string> {
    console.log(`[processQuery] Received query: "${query}"`);
    
    // 1. First check if the chatbot is fully initialized
    if (!this.isReady) {
      console.log("[processQuery] Chatbot not ready, returning initialization message.");
      return "The chatbot is still initializing. Please try again in a moment.";
    }

    try {
      // 2. Setup safety timeouts for the entire query process
      const queryPromise = new Promise<string>(async (resolve, reject) => {
        const queryTimeout = setTimeout(() => {
          console.error("[processQuery] Query processing timed out after 25 seconds");
          reject(new Error("Query processing timed out"));
        }, 25000); // 25 second timeout
        
        try {
          console.log("[processQuery] Checking Neo4j connection...");
          
          // 3. Check if Neo4j is available, but continue even if not
          let usingFallback = false;
          if (!this.neo4jGraph || !this.driver) {
            console.log("[processQuery] Neo4j connection unavailable, will use fallback.");
            usingFallback = true;
          } else {
            try {
              // Test Neo4j connection with a quick query
              await this.driver.verifyConnectivity();
            } catch (connError) {
              console.error("[processQuery] Neo4j verification failed:", connError);
              usingFallback = true;
            }
          }
          
          // 4. Use fallback immediately if Neo4j is unavailable
          if (usingFallback) {
            const fallbackResponse = this.generateFallbackResponse(query, "connection");
            clearTimeout(queryTimeout);
            resolve(fallbackResponse);
            return;
          }
          
          // 5. Attempt graph search with timeout
          console.log("[processQuery] Starting graph search...");
          let results: Document[] = [];
          
          try {
            // Wrap search in another promise with timeout
            const searchPromise = new Promise<Document[]>((resolveSearch, rejectSearch) => {
              const searchTimeout = setTimeout(() => {
                console.error("[processQuery] Graph search timed out after 15 seconds");
                rejectSearch(new Error("Graph search timed out"));
              }, 15000); // 15 second timeout
              
              this.searchEntireGraph(query)
                .then((searchResults) => {
                  clearTimeout(searchTimeout);
                  resolveSearch(searchResults);
                })
                .catch((searchError) => {
                  clearTimeout(searchTimeout);
                  console.error("[processQuery] Search error:", searchError);
                  rejectSearch(searchError);
                });
            });
            
            results = await searchPromise;
            console.log(`[processQuery] Search completed. Found ${results.length} results.`);
          } catch (searchError) {
            console.error("[processQuery] Controlled search error:", searchError);
            // Check if this was a timeout error
            const errorMessage = searchError instanceof Error ? searchError.message : String(searchError);
            if (errorMessage.includes("timed out")) {
              console.log("[processQuery] Search timed out, using timeout fallback response");
              const timeoutResponse = this.generateFallbackResponse(query, "timeout");
              clearTimeout(queryTimeout);
              resolve(timeoutResponse);
              return; // Exit early with the timeout response
            }
            // Continue with empty results for other errors, will use notfound fallback
          }

          // 6. Generate response based on search results or fallback
          let response: string;
          if (results.length === 0) {
            console.log("[processQuery] No relevant information found, using fallback response.");
            response = this.generateFallbackResponse(query, "notfound");
          } else {
            try {
              console.log("[processQuery] Generating response based on search results...");
              response = await this.generateResponse(query, results);
              console.log("[processQuery] Response generated successfully.");
            } catch (responseError) {
              console.error("[processQuery] Response generation error:", responseError);
              response = this.generateFallbackResponse(query, "general");
            }
          }
          
          clearTimeout(queryTimeout);
          resolve(response);
        } catch (processingError) {
          clearTimeout(queryTimeout);
          console.error("[processQuery] Unexpected processing error:", processingError);
          reject(processingError);
        }
      });
      
      // 7. Return result from the promise, with overall timeout
      return await queryPromise;
    } catch (error) {
      console.error("[processQuery] Error during query processing:", error);
      // Final fallback if everything else fails
      return this.generateFallbackResponse(query, "general");
    }
  }

  private async searchEntireGraph(query: string): Promise<Document[]> {
    try {
      console.log("[searchEntireGraph] Attempting search with standard chain..."); // Added log
      // First try with the standard chain
      const chainResult = await this.chain.invoke({ query });
      console.log("[searchEntireGraph] Standard chain invocation complete."); // Added log
      const formatted = this.formatResults(chainResult);

      if (formatted.length > 0) {
        console.log("[searchEntireGraph] Found results with standard chain."); // Added log
        return formatted;
      }

      console.log("[searchEntireGraph] Standard chain yielded no results, falling back to full graph search."); // Added log
      // Fallback to our enhanced search
      return this.fullGraphSearch(query);
    } catch (error) {
      console.error("[searchEntireGraph] Error during search:", error); // Enhanced log
      console.log("[searchEntireGraph] Search failed, attempting full graph search as fallback."); // Added log
      return this.fullGraphSearch(query);
    }
  }

  private processSearchResults(result: any): Document[] {
    const documents: Document[] = [];
    const seenIds = new Set<string>();

    result.records.forEach((record: Record) => {
      try {
        const node = record.get("node");
        const rel = record.get("r");
        const related = record.get("related");

        // Safely handle score conversion
        const rawScore = record.get("score");
        const score =
          typeof rawScore === "number"
            ? rawScore
            : rawScore?.toNumber?.() ||
              (typeof rawScore === "string" ? parseFloat(rawScore) : 1.0);

        if (node && !seenIds.has(node.elementId)) {
          documents.push(this.formatNode(node, score));
          seenIds.add(node.elementId);
        }

        if (related && !seenIds.has(related.elementId)) {
          documents.push(this.formatNode(related, score * 0.8));
          seenIds.add(related.elementId);
        }

        if (rel) {
          documents.push(
            this.formatRelationship(rel, node, related, score * 0.5)
          );
        }
      } catch (error) {
        console.error("Error processing record:", error);
      }
    });

    return documents;
  }

  private async fullGraphSearch(query: string): Promise<Document[]> {
    let session;
    try {
      console.log("[fullGraphSearch] Attempting to get Neo4j session..."); // Added log
      session = this.driver.session();
      console.log("[fullGraphSearch] Neo4j session acquired."); // Added log

      if (this.fullTextIndexExists) {
        try {
          console.log("[fullGraphSearch] Attempting full-text index search..."); // Added log
          const result = await session.run(
            `CALL db.index.fulltext.queryNodes("allNodesIndex", $query)
                        YIELD node, score
                        WHERE node:Research OR node:Publication OR node:TeamMember OR node:Student
                        WITH node, score
                        ORDER BY score DESC
                        LIMIT 20
                        OPTIONAL MATCH (node)-[r]->(related)
                        RETURN node, r, related, score`,
            { query }
          );
          console.log("[fullGraphSearch] Full-text index search complete."); // Added log
          return this.processSearchResults(result);
        } catch (error) {
          console.error("[fullGraphSearch] Full-text search failed:", error); // Enhanced log
          this.fullTextIndexExists = false;
          console.log("[fullGraphSearch] Full-text search failed, will attempt keyword search."); // Added log
        }
      }

      // If we get here, either index doesn't exist or full-text search failed
      return await this.keywordSearch(query, session);
    } finally {
      if (session !== null && session !== undefined) {
        console.log("[fullGraphSearch] Closing Neo4j session."); // Added log
        await session?.close();
        console.log("[fullGraphSearch] Neo4j session closed."); // Added log
      } else if (!session) {
        console.log("[fullGraphSearch] No session to close."); // Added log
      }
    }
  }

  private async keywordSearch(
    query: string,
    session: any
  ): Promise<Document[]> {
    const newSession = session || this.driver.session();
    try {
      console.log("[keywordSearch] Attempting keyword search..."); // Added log
      const keywords = query.toLowerCase().split(/\s+/);
      const result = await newSession.run(
        `MATCH (n)
                WHERE ANY(word IN $keywords WHERE 
                    toLower(n.name) CONTAINS word OR 
                    toLower(n.title) CONTAINS word OR 
                    toLower(n.abstract) CONTAINS word OR
                    toLower(n.bio) CONTAINS word)
                WITH n LIMIT 20
                OPTIONAL MATCH (n)-[r]->(related)
                RETURN n as node, r, related, 1.0 as score`,
        { keywords }
      );
      console.log("[keywordSearch] Keyword search complete."); // Added log
      return this.processSearchResults(result);
    } catch (error) {
      console.error("[keywordSearch] Keyword search failed:", error); // Enhanced log
      return [];
    } finally {
      if (!session) {
        console.log("[keywordSearch] Closing Neo4j session (created internally)."); // Added log
        await newSession.close();
        console.log("[keywordSearch] Neo4j session closed."); // Added log
      }
    }
  }

  private formatNode(node: any, score?: number): Document {
    const props = node.properties || {};
    const labels = node.labels || [];
    const type = labels[0] || "node";

    let content = "";
    if (props.name || props.title) content += `${props.name || props.title}\n`;
    if (props.abstract) content += `Abstract: ${props.abstract}\n`;
    if (props.bio) content += `Bio: ${props.bio}\n`;
    if (props.authors) content += `Authors: ${props.authors}\n`;

    return {
      id: node.elementId,
      content: content.trim(),
      type: type.toLowerCase(),
      metadata: { ...props, score, labels },
    };
  }

  private formatRelationship(
    rel: any,
    start: any,
    end: any,
    score?: number
  ): Document {
    const type = rel.type || "relationship";
    const startName =
      start.properties?.name || start.properties?.title || start.elementId;
    const endName =
      end.properties?.name || end.properties?.title || end.elementId;

    return {
      id: rel.elementId,
      content: `${startName} → [${type}] → ${endName}`,
      type: "relationship",
      metadata: {
        type,
        start: startName,
        end: endName,
        score,
      },
    };
  }

  private formatResults(result: any): Document[] {
    if (!result) return [];

    if (Array.isArray(result)) {
      return result.map((node: any) => this.formatNode(node));
    }

    if (result.rows) {
      return result.rows.flatMap((row: any) => {
        const docs: Document[] = [];
        if (row.node) docs.push(this.formatNode(row.node));
        if (row.related) docs.push(this.formatNode(row.related));
        if (row.rel)
          docs.push(this.formatRelationship(row.rel, row.node, row.related));
        return docs;
      });
    }

    return [];
  }

  private async generateResponse(
    query: string,
    documents: Document[]
  ): Promise<string> {
    console.log("[generateResponse] Formatting context for LLM..."); // Added log
    const context = documents
      .map((doc) => `${doc.type.toUpperCase()}: ${doc.content}`)
      .join("\n\n");

    console.log("[generateResponse] Initializing LLM for response generation..."); // Added log
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      temperature: 0.3,
    });

    console.log("[generateResponse] Invoking LLM..."); // Added log
    const response = await llm.invoke([
      {
        role: "system",
        content: `You are a research assistant analyzing graph database results.
        Provide concise, accurate responses based on the context.
        Highlight relationships between entities when relevant.
        
        Context:
        ${context}`,
      },
      {
        role: "user",
        content: query,
      },
    ]);
    console.log("[generateResponse] LLM invocation complete."); // Added log

    return response.content.toString();
  }

  private generateFallbackResponse(query: string, errorType: string = "general"): string {
    console.log(`[generateFallbackResponse] Generating fallback for error type: ${errorType}`);
    
    // Basic information we know without the database
    const basicInfo = `The Visual Biometrics and Surveillance Lab (ViBeS) is a research group focused on biometrics, computer vision, and surveillance applications.`;
    
    // Set of response templates based on error type
    const responses: { [key: string]: string[] } = {
      connection: [
        `I'm having trouble connecting to our knowledge base at the moment, but I can tell you that ${basicInfo} Your question was about "${query}". Please try again in a few minutes when our systems have had time to recover.`,
        `Our database connection is currently unavailable. ${basicInfo} You asked about "${query}", but I don't have the specific details right now. Please try again soon.`,
      ],
      timeout: [
        `It's taking longer than expected to process your question about "${query}". ${basicInfo} Please try a more specific or differently worded question.`,
        `Your question is complex and our search is taking too long. ${basicInfo} Could you try asking a more focused question?`,
      ],
      notfound: [
        `I couldn't find specific information about "${query}" in our knowledge base. ${basicInfo} Could you try rephrasing your question?`,
        `I don't have details about "${query}" in my current dataset. ${basicInfo} Is there something else about the lab you'd like to know?`,
      ],
      general: [
        `I'm sorry, I don't have enough information to answer your question about "${query}" properly. ${basicInfo} Please try asking something else about our lab.`,
        `I couldn't process your query about "${query}" as expected. ${basicInfo} Please try rephrasing your question.`,
      ],
    };
    
    // Select appropriate response array based on error type, defaulting to general
    const responseArray = responses[errorType] || responses.general;
    
    // Select a random response from the appropriate category
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  }

  public async close() {
    await this.neo4jGraph.close();
    await this.driver.close();
  }

  public async ensureInitialized(): Promise<void> {
    if (!this.initializationPromise) {
      // Should ideally not happen if constructor logic is sound
      console.error("Initialization promise not set!");
      this.initializationPromise = this.initialize();
    }
    await this.initializationPromise;
  }

  public async initializeForClient(): Promise<void> {
    if (this.isReady) {
      console.log("Chatbot already initialized");
      return;
    }
    
    console.log("Starting client-requested warm-up");
    
    try {
      // Force a sample query to warm up the system
      const warmupText = "What research areas do you focus on?";
      await this.processQuery(warmupText);
      console.log("Chatbot warm-up complete");
    } catch (error) {
      console.error("Chatbot warm-up failed:", error);
      throw error;
    }
  }
}

export const chatbotServicev5 = new ChatbotServiceV5();
export const chatbotServicev5Ready = chatbotServicev5.ensureInitialized();
