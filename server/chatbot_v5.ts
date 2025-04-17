import { GraphCypherQAChain } from "@langchain/community/chains/graph_qa/cypher";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { Driver, session as neo4jSession, Record } from "neo4j-driver";
import dotenv from "dotenv";

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

    this.neo4jGraph = new Neo4jGraph({
      url: neo4jUri,
      username: neo4jUser,
      password: neo4jPassword,
    });

    this.driver = (this.neo4jGraph as any).driver;

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
      await this.neo4jGraph.refreshSchema();
      console.log("[initialize] Neo4j schema refreshed.");

      // Check and create full-text index if needed
      console.log("[initialize] Verifying full-text index...");
      await this.verifyFullTextIndex();
      console.log("[initialize] Full-text index verified.");

      this.isReady = true; // Set ready only on full success
      console.log("[initialize] Chatbot initialization successful. Ready with Neo4j backend.");
    } catch (error) {
      console.error("[initialize] Initialization failed overall:", error);
      this.isReady = false; // Ensure isReady is false on any error
      // Re-throw the error so the initializationPromise rejects
      throw error;
    }
  }

  private async verifyFullTextIndex(): Promise<void> {
    const session = this.driver.session();
    console.log("[verifyFullTextIndex] Checking for index 'allNodesIndex'...");
    try {
      const result = await session.run(
        `SHOW INDEXES WHERE type = 'FULLTEXT' AND name = 'allNodesIndex'`
      );

      if (result.records.length === 0) {
        console.log("[verifyFullTextIndex] Index 'allNodesIndex' not found. Creating...");
        await this.createFullTextIndex();
      } else {
        console.log("[verifyFullTextIndex] Index 'allNodesIndex' found.");
        this.fullTextIndexExists = true;
      }
    } catch (error) {
      console.error("Error verifying full-text index:", error);
    } finally {
      await session.close();
    }
  }

  private async createFullTextIndex(): Promise<void> {
    const session = this.driver.session();
    console.log("[createFullTextIndex] Attempting to create index 'allNodesIndex'...");
    try {
      await session.run(
        `CREATE FULLTEXT INDEX allNodesIndex 
         FOR (n:Research|Publication|TeamMember|Student) 
         ON EACH [n.name, n.title, n.abstract, n.bio, n.authors]`
      );
      this.fullTextIndexExists = true;
      console.log("[createFullTextIndex] Successfully created full-text index 'allNodesIndex'.");
    } catch (error) {
      console.error("[createFullTextIndex] Failed to create full-text index 'allNodesIndex':", error);
      this.fullTextIndexExists = false;
      throw error; // Propagate error to fail initialization if index creation fails
    } finally {
      await session.close();
    }
  }

  public async processQuery(query: string): Promise<string> {
    console.log(`[processQuery] Received query: "${query}"`); // Added log
    if (!this.isReady) {
      console.log("[processQuery] Chatbot not ready, returning initialization message."); // Added log
      return "The chatbot is still initializing. Please try again in a moment.";
    }

    try {
      console.log("[processQuery] Checking Neo4j connection..."); // Added log
      // If Neo4j connection failed but we're still providing service
      if (!this.neo4jGraph || !this.driver) {
        console.log("[processQuery] Neo4j connection unavailable, using fallback."); // Added log
        return this.generateFallbackResponse(query);
      }
      
      console.log("[processQuery] Starting graph search..."); // Added log
      const results = await this.searchEntireGraph(query);
      console.log(`[processQuery] Search completed. Found ${results.length} results.`); // Added log

      if (results.length === 0) {
        console.log("[processQuery] No relevant information found, returning message."); // Added log
        return "I couldn't find relevant information. Could you try rephrasing your question?";
      }
      
      console.log("[processQuery] Generating response based on search results..."); // Added log
      const response = await this.generateResponse(query, results);
      console.log("[processQuery] Response generated successfully."); // Added log
      return response;
    } catch (error) {
      console.error("[processQuery] Error during query processing:", error); // Enhanced log
      console.log("[processQuery] Error occurred, generating fallback response."); // Added log
      return this.generateFallbackResponse(query);
    }
  }

  private async searchEntireGraph(query: string): Promise<Document[]> {
    try {
+     console.log("[searchEntireGraph] Attempting search with standard chain..."); // Added log
      // First try with the standard chain
      const chainResult = await this.chain.invoke({ query });
+     console.log("[searchEntireGraph] Standard chain invocation complete."); // Added log
      const formatted = this.formatResults(chainResult);

      if (formatted.length > 0) {
+       console.log("[searchEntireGraph] Found results with standard chain."); // Added log
        return formatted;
      }

+     console.log("[searchEntireGraph] Standard chain yielded no results, falling back to full graph search."); // Added log
      // Fallback to our enhanced search
      return this.fullGraphSearch(query);
    } catch (error) {
-     console.error("Search failed:", error);
+     console.error("[searchEntireGraph] Error during search:", error); // Enhanced log
+     console.log("[searchEntireGraph] Search failed, attempting full graph search as fallback."); // Added log
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
+     console.log("[fullGraphSearch] Attempting to get Neo4j session..."); // Added log
      session = this.driver.session();
+     console.log("[fullGraphSearch] Neo4j session acquired."); // Added log

      if (this.fullTextIndexExists) {
        try {
+         console.log("[fullGraphSearch] Attempting full-text index search..."); // Added log
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
+         console.log("[fullGraphSearch] Full-text index search complete."); // Added log
          return this.processSearchResults(result);
        } catch (error) {
-         console.error("Full-text search failed:", error);
+         console.error("[fullGraphSearch] Full-text search failed:", error); // Enhanced log
          this.fullTextIndexExists = false;
+         console.log("[fullGraphSearch] Full-text search failed, will attempt keyword search."); // Added log
        }
      }

      // If we get here, either index doesn't exist or full-text search failed
      return await this.keywordSearch(query, session);
    } finally {
      if (session !== null && session !== undefined) {
+       console.log("[fullGraphSearch] Closing Neo4j session."); // Added log
+       await session?.close();
+       console.log("[fullGraphSearch] Neo4j session closed."); // Added log
      } else if (!session) {
+       console.log("[fullGraphSearch] No session to close."); // Added log
      }
    }
  }

  private async keywordSearch(
    query: string,
    session: any
  ): Promise<Document[]> {
    const newSession = session || this.driver.session();
    try {
+     console.log("[keywordSearch] Attempting keyword search..."); // Added log
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
+     console.log("[keywordSearch] Keyword search complete."); // Added log
      return this.processSearchResults(result);
    } catch (error) {
-     console.error("Keyword search failed:", error);
+     console.error("[keywordSearch] Keyword search failed:", error); // Enhanced log
      return [];
    } finally {
      if (!session) {
+       console.log("[keywordSearch] Closing Neo4j session (created internally)."); // Added log
        await newSession.close();
+       console.log("[keywordSearch] Neo4j session closed."); // Added log
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
+   console.log("[generateResponse] Formatting context for LLM..."); // Added log
    const context = documents
      .map((doc) => `${doc.type.toUpperCase()}: ${doc.content}`)
      .join("\n\n");

+   console.log("[generateResponse] Initializing LLM for response generation..."); // Added log
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      temperature: 0.3,
    });

+   console.log("[generateResponse] Invoking LLM..."); // Added log
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
+   console.log("[generateResponse] LLM invocation complete."); // Added log

    return response.content.toString();
  }

  private generateFallbackResponse(query: string): string {
    // This method provides basic responses without needing Neo4j
    const lowercaseQuery = query.toLowerCase();
    
    // Research areas
    if (lowercaseQuery.includes("research") && (lowercaseQuery.includes("area") || lowercaseQuery.includes("focus"))) {
      return "The ViBeS Lab focuses on several key research areas including Visual Surveillance, Edge Computing, Generative Models, and Biometrics. Each area represents cutting-edge work in computer vision and AI.";
    }
    
    // Team information
    if (lowercaseQuery.includes("team") || lowercaseQuery.includes("professor") || lowercaseQuery.includes("faculty")) {
      return "Our team consists of faculty members, researchers, and students working collaboratively on visual biometrics and surveillance technologies. For detailed profiles, please check the team page on our website.";
    }
    
    // Publications
    if (lowercaseQuery.includes("publication") || lowercaseQuery.includes("paper") || lowercaseQuery.includes("journal")) {
      return "Our lab has published numerous papers in top conferences and journals. Recent publications focus on advanced computer vision algorithms, biometric systems, and AI-based surveillance. You can find the full publication list on our website.";
    }
    
    // Projects
    if (lowercaseQuery.includes("project") || lowercaseQuery.includes("work")) {
      return "Current projects at ViBeS Lab include developing privacy-preserving surveillance systems, efficient biometric recognition for edge devices, and novel applications of generative AI for synthetic data generation.";
    }
    
    // Default response
    return "I'm currently operating with limited functionality. I can provide general information about our research lab, but for specific details, please browse the website sections or try again later when full functionality is restored.";
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
