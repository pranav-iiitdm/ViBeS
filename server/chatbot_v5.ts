import { GraphCypherQAChain } from "langchain/chains/graph_qa/cypher";
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

  constructor() {
    const neo4jUri =
      process.env.NEO4J_URI || "neo4j+s://69acfba4.databases.neo4j.io";
    const neo4jUser = process.env.NEO4J_USER || "neo4j";
    const neo4jPassword =
      process.env.NEO4J_PASSWORD ||
      "ZZciq7iG-3yfEby0pqoz6Hq6jbeUNcx_iciP-nzpZJA";

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

    this.initialize();
  }

  private async initialize() {
    try {
      console.log("Initializing chatbot with Neo4j...");
      
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
        console.error("Failed to connect to Neo4j after multiple attempts");
        // Still set isReady so we can provide a fallback experience
        this.isReady = true;
        return;
      }
      
      await this.neo4jGraph.refreshSchema();

      // Check and create full-text index if needed
      await this.verifyFullTextIndex();

      this.isReady = true;
      console.log("Chatbot ready with Neo4j backend");
    } catch (error) {
      console.error("Initialization failed:", error);
      // Set isReady to true anyway so we can provide a fallback experience
      this.isReady = true;
    }
  }

  private async verifyFullTextIndex(): Promise<void> {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `SHOW INDEXES WHERE type = 'FULLTEXT' AND name = 'allNodesIndex'`
      );

      if (result.records.length === 0) {
        console.log("Creating full-text index...");
        await this.createFullTextIndex();
      } else {
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
    try {
      await session.run(
        `CREATE FULLTEXT INDEX allNodesIndex 
         FOR (n:Research|Publication|TeamMember|Student) 
         ON EACH [n.name, n.title, n.abstract, n.bio, n.authors]`
      );
      this.fullTextIndexExists = true;
      console.log("Created full-text index 'allNodesIndex'");
    } catch (error) {
      console.error("Failed to create full-text index:", error);
      this.fullTextIndexExists = false;
    } finally {
      await session.close();
    }
  }

  public async processQuery(query: string): Promise<string> {
    if (!this.isReady) {
      return "The chatbot is still initializing. Please try again in a moment.";
    }

    try {
      // If Neo4j connection failed but we're still providing service
      if (!this.neo4jGraph) {
        return "I'm currently operating with limited functionality. I can still try to answer general questions about the research lab.";
      }
      
      const results = await this.searchEntireGraph(query);
      if (results.length === 0) {
        return "I couldn't find relevant information. Could you try rephrasing your question?";
      }
      return this.generateResponse(query, results);
    } catch (error) {
      console.error("Error processing query:", error);
      return "I encountered an error while processing your query. Please try again later.";
    }
  }

  private async searchEntireGraph(query: string): Promise<Document[]> {
    try {
      // First try with the standard chain
      const chainResult = await this.chain.invoke({ query });
      const formatted = this.formatResults(chainResult);

      if (formatted.length > 0) {
        return formatted;
      }

      // Fallback to our enhanced search
      return this.fullGraphSearch(query);
    } catch (error) {
      console.error("Search failed:", error);
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
      session = this.driver.session();

      if (this.fullTextIndexExists) {
        try {
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
          return this.processSearchResults(result);
        } catch (error) {
          console.error("Full-text search failed:", error);
          this.fullTextIndexExists = false;
        }
      }

      // If we get here, either index doesn't exist or full-text search failed
      return await this.keywordSearch(query, session);
    } finally {
      await session?.close();
    }
  }

  private async keywordSearch(
    query: string,
    session: any
  ): Promise<Document[]> {
    const newSession = session || this.driver.session();
    try {
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
      return this.processSearchResults(result);
    } catch (error) {
      console.error("Keyword search failed:", error);
      return [];
    } finally {
      if (!session) {
        await newSession.close();
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
    const context = documents
      .map((doc) => `${doc.type.toUpperCase()}: ${doc.content}`)
      .join("\n\n");

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      temperature: 0.3,
    });

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

    return response.content.toString();
  }

  public async close() {
    await this.neo4jGraph.close();
    await this.driver.close();
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
