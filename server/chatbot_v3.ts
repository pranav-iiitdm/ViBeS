import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { Document as LangchainDocument } from 'langchain/document';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import GraphDatabase from 'neo4j-driver';

// Load environment variables
dotenv.config();

// Document interface
interface Document {
  id: string;
  content: string;
  type: string;
  metadata: Record<string, any>;
  score?: number;
}

class ChatbotServiceV3 {
  private openaiClient: ChatGoogleGenerativeAI;
  private neo4jDriver: any;
  private isReady: boolean = false;
  private isInitializing: boolean = false;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable not found');
    }

    const neo4jUri = process.env.NEO4J_URI || 'neo4j+s://69acfba4.databases.neo4j.io';
    const neo4jUser = process.env.NEO4J_USER || 'neo4j';
    const neo4jPassword = process.env.NEO4J_PASSWORD || 'ZZciq7iG-3yfEby0pqoz6Hq6jbeUNcx_iciP-nzpZJA';

    this.openaiClient = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
    });

    this.neo4jDriver = GraphDatabase.driver(
      neo4jUri,
      GraphDatabase.auth.basic(neo4jUser, neo4jPassword)
    );

    this.initialize();
  }

  private async initialize() {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      console.log('Initializing chatbot v3 with Neo4j...');
      // Verify Neo4j connection
      const session = this.neo4jDriver.session();
      await session.run('RETURN 1');
      await session.close();
      
      this.isReady = true;
      console.log('Chatbot v3 is ready with Neo4j backend');
    } catch (error) {
      console.error('Error initializing chatbot v3:', error);
      this.isReady = false;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

//   private async findRelevantDocuments(query: string, k: number = 20): Promise<Document[]> {
//     if (!this.neo4jDriver) {
//       return [];
//     }

//     try {
//       const session = this.neo4jDriver.session();
      
//       // Enhanced query that searches across multiple node types and relationships
//       const result = await session.run(`
//         CALL db.index.fulltext.queryNodes("combinedSearch", $query) 
//         YIELD node, score
//         WITH node, score
//         ORDER BY score DESC
//         LIMIT $limit
        
//         OPTIONAL MATCH (node)-[r]->(related)
//         WHERE NOT (related:Category)
//         WITH node, score, COLLECT(DISTINCT {type: TYPE(r), node: related}) AS relationships
        
//         RETURN {
//           id: COALESCE(node.id, ID(node)),
//           content: 
//             CASE 
//               WHEN node:Research THEN 
//                 "Title: " + COALESCE(node.title, "") + "\n" +
//                 "Abstract: " + COALESCE(node.abstract, "") + "\n" +
//                 "Authors: " + COALESCE(node.authors, "") + "\n" +
//                 "Category: " + COALESCE(node.category, "") + "\n" +
//                 "Date: " + COALESCE(node.date, "") + "\n" +
//                 "GitHub: " + COALESCE(node.github, "") + "\n" +
//                 "Dataset: " + COALESCE(node.dataset, "")
//               WHEN node:Publication THEN
//                 "Title: " + COALESCE(node.title, "") + "\n" +
//                 "Abstract: " + COALESCE(node.abstract, "") + "\n" +
//                 "Authors: " + COALESCE(node.authors, "") + "\n" +
//                 "Year: " + COALESCE(node.year, "") + "\n" +
//                 "Venue: " + COALESCE(node.venue, "") + "\n" +
//                 "Link: " + COALESCE(node.link, "") + "\n" +
//                 "Type: " + COALESCE(node.type, "")
//               WHEN node:TeamMember THEN
//                 "Name: " + COALESCE(node.name, "") + "\n" +
//                 "Role: " + COALESCE(node.role, "") + "\n" +
//                 "Bio: " + COALESCE(node.bio, "") + "\n" +
//                 "Research Interests: " + COALESCE(node.researchInterests, "") + "\n" +
//                 "Google Scholar: " + COALESCE(node.googleScholarUrl, "") + "\n" +
//                 "ResearchGate: " + COALESCE(node.researchGateUrl, "") + "\n" +
//                 "LinkedIn: " + COALESCE(node.linkedinUrl, "")
//               WHEN node:Student THEN
//                 "Name: " + COALESCE(node.name, "") + "\n" +
//                 "Role: " + COALESCE(node.role, "") + "\n" +
//                 "Bio: " + COALESCE(node.bio, "") + "\n" +
//                 "Research Interests: " + COALESCE(node.researchInterests, "") + "\n" +
//                 "Projects: " + COALESCE(node.projects, "")
//               ELSE 
//                 "Content: " + COALESCE(node.title, node.name, "")
//             END AS content,
//           type: 
//             CASE 
//               WHEN node:Research THEN "research"
//               WHEN node:Publication THEN "publication"
//               WHEN node:TeamMember THEN "team_member"
//               WHEN node:Student THEN "student"
//               WHEN node:Project THEN "project"
//               WHEN node:ResearchInterest THEN "research_interest"
//               ELSE "unknown"
//             END,
//           metadata: properties(node),
//           score: score
//         } AS document
//       `, {
//         query: query,
//         limit: k
//       });

//       await session.close();

//       return result.records.map((record: any) => record.get('document'));
//     } catch (error) {
//       console.error('Error finding relevant documents in Neo4j:', error);
//       return [];
//     }
//   }

// private async findRelevantDocuments(query: string, k: number = 20): Promise<Document[]> {
//     if (!this.neo4jDriver) {
//       return [];
//     }

//     try {
//       const session = this.neo4jDriver.session();
      
//       // First check if this is a specific count query
//       if (query.toLowerCase().includes('how many students')) {
//         const result = await session.run(`
//           MATCH (s:Student)
//           RETURN {
//             id: 'student-count',
//             content: 'Total Students: ' + COUNT(s),
//             type: 'count',
//             metadata: {},
//             score: 1.0
//           } AS document
//         `);
        
//         await session.close();
//         return result.records.map((record: any) => record.get('document'));
//       }

//       // General full-text search query
//       const result = await session.run(`
//         CALL db.index.fulltext.queryNodes("combinedSearch", $query) 
//         YIELD node, score
//         WITH node, score
//         ORDER BY score DESC
//         LIMIT $limit
        
//         OPTIONAL MATCH (node)-[r]->(related)
//         WHERE NOT (related:Category)
//         WITH node, score, COLLECT(DISTINCT {type: TYPE(r), node: related}) AS relationships
        
//         RETURN {
//           id: COALESCE(node.id, toString(ID(node))),
//           content: 
//             CASE 
//               WHEN node:Research THEN 
//                 "Title: " + COALESCE(node.title, "") + "\n" +
//                 "Abstract: " + COALESCE(node.abstract, "") + "\n" +
//                 "Authors: " + COALESCE(node.authors, "") + "\n" +
//                 "Category: " + COALESCE(node.category, "") + "\n" +
//                 "Date: " + COALESCE(node.date, "") + "\n" +
//                 "GitHub: " + COALESCE(node.github, "") + "\n" +
//                 "Dataset: " + COALESCE(node.dataset, "")
//               WHEN node:Publication THEN
//                 "Title: " + COALESCE(node.title, "") + "\n" +
//                 "Abstract: " + COALESCE(node.abstract, "") + "\n" +
//                 "Authors: " + COALESCE(node.authors, "") + "\n" +
//                 "Year: " + COALESCE(toString(node.year), "") + "\n" +
//                 "Venue: " + COALESCE(node.venue, "") + "\n" +
//                 "Link: " + COALESCE(node.link, "") + "\n" +
//                 "Type: " + COALESCE(node.type, "")
//               WHEN node:TeamMember THEN
//                 "Name: " + COALESCE(node.name, "") + "\n" +
//                 "Role: " + COALESCE(node.role, "") + "\n" +
//                 "Bio: " + COALESCE(node.bio, "") + "\n" +
//                 "Research Interests: " + COALESCE(node.researchInterests, "") + "\n" +
//                 "Google Scholar: " + COALESCE(node.googleScholarUrl, "") + "\n" +
//                 "ResearchGate: " + COALESCE(node.researchGateUrl, "") + "\n" +
//                 "LinkedIn: " + COALESCE(node.linkedinUrl, "")
//               WHEN node:Student THEN
//                 "Name: " + COALESCE(node.name, "") + "\n" +
//                 "Role: " + COALESCE(node.role, "") + "\n" +
//                 "Bio: " + COALESCE(node.bio, "") + "\n" +
//                 "Research Interests: " + COALESCE(node.researchInterests, "") + "\n" +
//                 "Projects: " + COALESCE(node.projects, "")
//               ELSE 
//                 "Content: " + COALESCE(node.title, node.name, "")
//             END AS content,
//           type: 
//             CASE 
//               WHEN node:Research THEN "research"
//               WHEN node:Publication THEN "publication"
//               WHEN node:TeamMember THEN "team_member"
//               WHEN node:Student THEN "student"
//               WHEN node:Project THEN "project"
//               WHEN node:ResearchInterest THEN "research_interest"
//               ELSE "unknown"
//             END,
//           metadata: properties(node),
//           score: score
//         } AS document
//       `, {
//         query: query,
//         limit: k
//       });

//       await session.close();
//       return result.records.map((record: any) => record.get('document'));
//     } catch (error) {
//       console.error('Error finding relevant documents in Neo4j:', error);
//       return [];
//     }
//   }

  private async findRelevantDocuments(query: string, k: number = 5): Promise<Document[]> {
    if (!this.neo4jDriver) return [];

    const session = this.neo4jDriver.session();
    try {
        // Ensure limit is an integer
        const limit = Math.floor(k);
        
        const result = await session.run(`
            CALL db.index.fulltext.queryNodes("entitySearch", $query) 
            YIELD node, score
            WITH node, score, labels(node)[0] AS nodeType
            ORDER BY score DESC
            LIMIT toInteger($limit)
            
            RETURN {
                id: elementId(node),
                content: 
                    CASE nodeType
                        WHEN 'Publication' THEN
                            "Title: " + coalesce(node.title, '') + "\n" +
                            "Authors: " + coalesce(node.authors, '') + "\n" +
                            "Year: " + coalesce(node.year, '') + "\n" +
                            "Venue: " + coalesce(node.venue, '') + "\n" +
                            "Link: " + coalesce(node.link, '') + "\n" +
                            "Abstract: " + coalesce(node.abstract, '')
                        WHEN 'Student' THEN
                            "Name: " + coalesce(node.name, '') + "\n" +
                            "Role: " + coalesce(node.role, '') + "\n" +
                            "Bio: " + coalesce(node.bio, '') + "\n" +
                            "Research Interests: " + coalesce(
                                CASE 
                                    WHEN node.researchInterests IS NOT NULL AND size(node.researchInterests) > 0 
                                    THEN apoc.text.join(node.researchInterests, ', ')
                                    ELSE ''
                                END, '')
                        ELSE
                            coalesce(node.title, node.name, '') + "\n" +
                            coalesce(node.abstract, node.bio, '')
                    END,
                type: toLower(nodeType),
                metadata: properties(node),
                score: score
            } AS document
        `, { 
            query: query, 
            limit: limit 
        });

        return result.records.map((record: any) => record.get('document'));
    } catch (error) {
        console.error('Query failed:', {
            error: (error as Error).message,
            query: query,
            stack: (error as Error).stack
        });
        return [];
    } finally {
        await session.close();
    }
  }
  private async generateResponse(query: string, context: string): Promise<string> {
    try {
      const result = await this.openaiClient.invoke([
        {
          role: 'system',
          content: `You are Research Info Navigator GPT, a specialized AI assistant trained to guide users through a research-focused website. Your responses should incorporate information from our knowledge graph when available.

            When responding:
            1. First identify if the query can be answered from the context
            2. For research-related queries, mention relevant projects, publications, or team members
            3. For people queries, include their research interests and projects
            4. Always try to show relationships between entities when relevant
            5. If no direct match, offer to help refine the query

            Context:
            ${context}`
        },
        {
            role: 'user',
            content: query
        }
    ]);

        return result.text || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  public async processQuery(query: string): Promise<string> {
    if (!this.isReady) {
      if (!this.isInitializing) {
        await this.initialize();
      }
      return 'The chatbot is still initializing. Please try again in a moment.';
    }

    try {
      const relevantDocs = await this.findRelevantDocuments(query);
      
      if (relevantDocs.length === 0) {
        return 'I couldn\'t find relevant information in our knowledge base. Could you try rephrasing your question or ask about our research areas, team members, or publications?';
      }

      const context = relevantDocs
        .map(doc => doc.content)
        .join('\n\n');

      return await this.generateResponse(query, context);
    } catch (error) {
      console.error('Error processing query:', error);
      return 'I encountered an error while processing your query. Please try again later.';
    }
  }

  public async close() {
    if (this.neo4jDriver) {
      await this.neo4jDriver.close();
    }
  }
}

// Export a singleton instance
export const chatbotServiceV3 = new ChatbotServiceV3();