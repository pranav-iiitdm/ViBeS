import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
import GraphDatabase from 'neo4j-driver';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { GraphCypherQAChain } from "@langchain/community/chains/graph_qa/cypher";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";

// Load environment variables
dotenv.config();

// Document interface
interface Document {
  id: string;
  content: string;
  type: string;
  metadata: Record<string, any>;
}

class ChatbotServiceV4 {
  private neo4jGraph: Neo4jGraph;
  private llm: ChatGoogleGenerativeAI;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private isReady: boolean = false;
  private chain: GraphCypherQAChain
  private isInitializing: boolean = false;

  constructor() {
    const neo4jUri = process.env.NEO4J_URI || 'neo4j+s://69acfba4.databases.neo4j.io';
    const neo4jUser = process.env.NEO4J_USER || 'neo4j';
    const neo4jPassword = process.env.NEO4J_PASSWORD || 'ZZciq7iG-3yfEby0pqoz6Hq6jbeUNcx_iciP-nzpZJA';
    // Initialize Neo4j connection

    this.neo4jGraph = new Neo4jGraph({
        url: neo4jUri,
        username: neo4jUser,
        password: neo4jPassword,
    });
    
    // Initialize LLM with caching
    this.embeddings = new GoogleGenerativeAIEmbeddings({
        model: "models/embedding-001",
    });
    
    this.llm = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-pro",
        temperature: 0,
    });
    
    this.chain = GraphCypherQAChain.fromLLM({
        llm: this.llm,
        graph: this.neo4jGraph,
        returnDirect: true, // Return raw database results
    });
    this.initialize();
  }

  private async initialize() {
    try {
      console.log("Initializing chatbot with Neo4j...");
      await this.neo4jGraph.verifyConnectivity();
      await this.neo4jGraph.refreshSchema();
      this.isReady = true;
      console.log("Chatbot ready with Neo4j backend");
    } catch (error) {
      console.error("Initialization failed:", error);
      throw error;
    }
  }

  public async queryGraph(question: string): Promise<Document[]> {
    if (!this.isReady) {
      throw new Error("Chatbot not initialized");
    }

    try {
      const result = await this.chain.invoke({
        query: question,
      });

      console.log("Raw result:", result.result); // Log the raw result here for debugging

      // Format the raw database results
      return this.formatResults(result.result);
    } catch (error) {
      console.error("Query failed:", error);
      return this.fallbackQuery(question);
    }
  }

//   private formatResults(result: any): Document[] {
//     if (!result || !result.rows) return [];
    
//     return result.rows.map((row: any) => {
//       const node = row.node || row;
//       return {
//         id: node.elementId,
//         content: this.formatNodeContent(node),
//         type: node.labels?.[0] || "unknown",
//         metadata: node.properties || {},
//       };
//     });
//   }

private formatResults(result: any): Document[] {
    // Handle different possible result formats
    if (!result) return [];
    
    // Format when returnDirect: true (direct Neo4j result)
    if (Array.isArray(result)) {
      return result.map((node: any) => ({
        id: node.elementId,
        content: this.formatNodeContent(node),
        type: node.labels?.[0] || "unknown",
        metadata: node.properties || {},
      }));
    }
    
    // Format when returnDirect: false (LLM processed result)
    if (result.result) {
      return [{
        id: 'llm-response',
        content: result.result,
        type: 'llm_response',
        metadata: {}
      }];
    }
    
    // Fallback for other formats
    return [];
}

private formatNodeContent(node: any): string {
    // Handle cases where properties might be directly on the node
    const props = node.properties || node || {};
    let content = "";

    // Common fields
    if (props.title) content += `Title: ${props.title}\n`;
    if (props.name) content += `Name: ${props.name}\n`;
    if (props.authors) content += `Authors: ${props.authors}\n`;
    if (props.abstract) content += `Abstract: ${props.abstract}\n`;

    // Type-specific fields (check labels array or __typename)
    const nodeType = node.labels?.[0] || node.__typename;
    
    if (nodeType === "Publication") {
      if (props.venue) content += `Venue: ${props.venue}\n`;
      if (props.year) content += `Year: ${props.year}\n`;
      if (props.link) content += `Link: ${props.link}\n`;
    }

    if (nodeType === "Student") {
      if (props.projects) {
        content += "Projects:\n";
        const projects = Array.isArray(props.projects) ? props.projects : [props.projects];
        projects.forEach((p: any) => {
          if (p && p.title) {
            content += `- ${p.title}: ${p.description || ''}\n`;
          }
        });
      }
    }

    // Handle case where node is a relationship
    if (nodeType === "Relationship") {
      if (props.type) content += `Relationship Type: ${props.type}\n`;
      if (node.start && node.end) {
        content += `Between: ${node.start.properties?.name || node.start.id} and ${node.end.properties?.name || node.end.id}\n`;
      }
    }

    return content.trim() || JSON.stringify(props);
}

  private async fallbackQuery(question: string): Promise<Document[]> {
    try {
      const keywords = question.toLowerCase().split(/\s+/).join(" ");
      const result = await this.neo4jGraph.query(`
        CALL db.index.fulltext.queryNodes("fallbackIndex", $keywords)
        YIELD node
        RETURN node
        LIMIT 10
      `, { keywords });

      return this.formatResults({ rows: result });
    } catch (error) {
      console.error("Fallback query failed:", error);
      return [];
    }
  }

  private async generateResponse(query: string, documents: Document[]): Promise<string> {
    const context = documents.map(doc => doc.content).join("\n\n");
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      temperature: 0.3, // Slightly more creative for responses
    });

    const response = await llm.invoke([
      {
        role: "system",
        content: `You are a research assistant. Use the provided context to answer questions.
        
        Guidelines:
        1. Be concise but informative
        2. Cite sources when possible
        3. Group similar information together
        4. If unsure, say so
        5. Just give the answers in breif if not asked in detail and also mention in which page they can find more details about the question, give the link of the related page as {page: link}
        
        Context:
        ${context}`
      },
      {
        role: "user",
        content: query
      }
    ]);

    return response.content.toString();
  }

  public async processQuery(query: string): Promise<string> {
    if (!this.isReady) {
      if (!this.isInitializing) {
        await this.initialize();
      }
      return "The chatbot is still initializing. Please try again in a moment.";
    }

    try {
      // First try to get structured results
      const documents = await this.queryGraph(query);

      console.log("Documents:", documents); // Log the documents her
      
      if (documents.length === 0) {
        return "I couldn't find relevant information. Could you try rephrasing your question?";
      }

      // Format the response using the LLM
      return this.generateResponse(query, documents);
    } catch (error) {
      console.error("Error processing query:", error);
      return "I encountered an error while processing your query. Please try again later.";
    }
  }

  public async close() {
    await this.neo4jGraph.close();
  }
}

export const chatbotServicev4 = new ChatbotServiceV4();