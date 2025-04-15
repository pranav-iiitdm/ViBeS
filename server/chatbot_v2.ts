import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Document as LangchainDocument } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { JSONLinesLoader } from "langchain/document_loaders/fs/json";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { JSONLoader } from "langchain/document_loaders/fs/json";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Document interface
interface Document {
  id: string;
  content: string;
  type: string;
  metadata: Record<string, any>;
  score?: number;
}

class ChatbotServiceV2 {
  private openaiClient: ChatGoogleGenerativeAI;
  private vectorStore: FaissStore | null = null;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private textSplitter: RecursiveCharacterTextSplitter;
  private isReady: boolean = false;
  private isInitializing: boolean = false;
  private supabaseClient: any;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable not found');
    }

    this.openaiClient = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-pro",});
    this.embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004"});
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    this.vectorStore = new FaissStore(this.embeddings, {});

    this.initialize();
  }

  private async initialize() {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      console.log('Initializing chatbot v2...');
      await this.loadDocuments();
      this.isReady = true;
      console.log('Chatbot v2 is ready');
    } catch (error) {
      console.error('Error initializing chatbot v2:', error);
      this.isReady = false;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

//   private async loadDocuments() {
//     try {
//       console.log('Loading documents...');
//       const filePath = path.join(__dirname, '..', 'structured_website_data.jsonl');
      
//       if (!fs.existsSync(filePath)) {
//         console.error(`JSONL file not found at ${filePath}`);
//         return;
//       }

//       const fileContent = fs.readFileSync(filePath, 'utf-8');
//       const lines = fileContent
//         .split('\n')
//         .filter(line => line.trim())
//         .map(line => line.trim());
      
//       const documents: LangchainDocument[] = [];
      
//       for (const [i, line] of lines.entries()) {
//         try {
//           const cleanLine = line.replace(/\u2019/g, "'")  // Replace smart quotes
//                                .replace(/\u201C|\u201D/g, '"')  // Replace smart double quotes
//                                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');  // Remove control characters
          
//           const doc = JSON.parse(cleanLine);
//           let content = '';
          
//           // Build content from various fields
//           if (doc.title) content += `Title: ${doc.title}\n`;
//           if (doc.abstract) content += `Abstract: ${doc.abstract}\n`;
//           if (doc.authors) {
//             const authors = Array.isArray(doc.authors) ? doc.authors.join(', ') : doc.authors;
//             content += `Authors: ${authors}\n`;
//           }
//           if (doc.bio) content += `Bio: ${doc.bio}\n`;
//           if (doc.researchInterests) {
//             const interests = Array.isArray(doc.researchInterests) ? doc.researchInterests.join(', ') : doc.researchInterests;
//             content += `Research Interests: ${interests}\n`;
//           }
//           if (doc.projects) {
//             content += 'Projects:\n';
//             doc.projects.forEach((project: any) => {
//               content += `- ${project.title}: ${project.description}\n`;
//             });
//           }
//           if (doc.additionalInfo) content += `Additional Info: ${doc.additionalInfo}\n`;

//           if (content.trim()) {
//             // Create chunks using the text splitter
//             const chunks = await this.textSplitter.createDocuments(
//               [content.trim()],
//               [{
//                 id: `doc-${i}`,
//                 type: doc.type || doc.category || 'unknown',
//                 ...doc
//               }]
//             );
//             documents.push(...chunks);
//           }
//         } catch (error) {
//           console.error(`Error processing document at line ${i + 1}:`, error);
//           console.error('Problematic line:', line);
//         }
//       }
      
//       if (documents.length > 0) {
//         this.vectorStore = await MemoryVectorStore.fromDocuments(
//           documents,
//           this.embeddings
//         );
//         console.log(`Loaded ${documents.length} document chunks into vector store`);
//       } else {
//         console.log('No documents loaded');
//       }
//     } catch (error) {
//       console.error('Error loading documents:', error);
//     }
//   }

  private async loadDocuments() {
    try {
      const filePath = path.join(__dirname, '..', 'website_data.json');
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`JSON file not found at ${filePath}`);
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      const documents: LangchainDocument[] = [];

      for (const item of jsonData) {
        let content = '';
        
        // Add title and abstract if available
        if (item.title) content += `Title: ${item.title}\n`;
        if (item.abstract) content += `Abstract: ${item.abstract}\n`;
        
        // Add authors
        if (item.authors) content += `Authors: ${item.authors}\n`;
        
        // Add links if available
        if (item.Dataset) content += `Dataset: ${item.Dataset}\n`;
        if (item.GitHub) content += `GitHub: ${item.GitHub}\n`;
        
        // Add date if available
        if (item.date) content += `Research Start Date: ${item.date}\n`;
        
        // Add page/category information
        if (item.page) content += `Page: ${item.page}\n`;
        if (item.category) content += `Research Category: ${item.category}\n`;

        if(item.year) content += `Publication Year: ${item.year}\n`;
        if(item.link) content += `Publication Link: ${item.link}\n`;
        if(item.type) content += `Publication Type: ${item.type}\n`;
        if(item.venue) content += `Publication Venue: ${item.venue}\n`;

        if(item.name) content += `Name: ${item.name}\n`;
        if(item.role) content += `Role: ${item.role}\n`;
        if(item.bio) content += `Bio: ${item.bio}\n`;
        if(item.researchInterests) content += `Research Interests: ${item.researchInterests}\n`;
        if(item.projects) content += `Projects: ${item.projects}\n`;
        if(item.additionalInfo) content += `Additional Info: ${item.additionalInfo}\n`;
        if(item.googleScholarUrl) content += `Google Scholar URL: ${item.googleScholarUrl}\n`;
        if(item.researchGateUrl) content += `ResearchGate URL: ${item.researchGateUrl}\n`;
        if(item.linkedinUrl) content += `LinkedIn URL: ${item.linkedinUrl}\n`;

        if (content.trim()) {
          documents.push(
            new LangchainDocument({
              pageContent: content.trim(),
              metadata: {
                title: item.title || '',
                authors: item.authors || '',
                category: item.category || '',
                page: item.page || '',
                date: item.date || '',
                Dataset: item.Dataset || '',
                GitHub: item.GitHub || '',
                year: item.year || '',
                link: item.link || '',
                venue: item.venue || '',
                name: item.name || '',
                role: item.role || '',
                googleScholarUrl: item.googleScholarUrl || '',
                researchGateUrl: item.researchGateUrl || '',
                linkedinUrl: item.linkedinUrl || '',
                type: item.type || 'research_project',
                ...item // Include all remaining fields as metadata
              }
            })
          );
        }
      }

      console.log(`Loaded ${documents.length} documents`);

      const allSplits = await this.textSplitter.splitDocuments(documents);
      console.log(`Created ${allSplits.length} document chunks`);

      this.vectorStore = await FaissStore.fromDocuments(
        allSplits,
        this.embeddings
      );
      console.log('Documents loaded into vector store successfully');
    } catch (error) {
      console.error('Error loading documents:', error);
      throw error;
    }
  }

  private async findRelevantDocuments(query: string, k: number = 20): Promise<Document[]> {
    if (!this.vectorStore) {
      return [];
    }

    try {
      const results = await this.vectorStore.similaritySearch(query, k);
      console.log('Relevant documents found:', results);
      
      return results.map((doc, index) => ({
        id: doc.metadata.id || `result-${index}`,
        content: doc.pageContent,
        type: doc.metadata.type || 'unknown',
        metadata: doc.metadata,
        score: doc.metadata.score
      }));
    } catch (error) {
      console.error('Error finding relevant documents:', error);
      return [];
    }
  }

  private async generateResponse(query: string, context: string): Promise<string> {
    try {
      const result = await this.openaiClient.invoke([
        {
          role: 'system',
          content: `You are Research Info Navigator GPT, a specialized AI assistant trained to guide users through a research-focused website. Your mission is to quickly identify user intent, match it to relevant content, and provide dense, valuable, and clear responses — all while keeping it snappy and structured.
🔧 You Will Receive:

    Website Overview: A concise summary of what the research site is about.

    Sub-Pages: A list of core pages (e.g., Publications, Research Areas, Labs, People, Events), each with 1–2 lines explaining what’s inside.

    User Intents: Common user questions/needs (e.g., “What are your research strengths?”, “Where can I see the team?”, “Can I attend a seminar?”).

    Tone: Desired voice (e.g., academic, formal, friendly).

    Call-to-Action Style: Examples: “Visit the Publications page”, “Explore our Labs”, “See upcoming Events”.

    Response Medium: Chatbot, app, voice assistant, etc.

    Special Features (Optional): Multilingual support, embedded links, keyword tagging, etc.

🧠 Instructions:

    Understand User Intent: Use provided intent types to quickly determine what the user wants.

    Match and Inform:

        Start with a strong, informative statement that gives the user immediate value (what they’re looking for + key detail).

        Mention the relevant sub-page and summarize what they’ll find there in one helpful line.

        Include a call-to-action using the preferred style.

    Tone + Medium Aware:

        Adjust tone to match the website’s brand.

        Optimize for the medium (text for bots, clarity for voice, visuals for app).

    Enhance with Features:

        Add links if allowed ([Labs](#)), suggest related pages, or auto-detect keywords.

        If multilingual, translate or adapt responses accordingly.

    Be Brief and Dense:

        Avoid fluff — answer fast, guide smart.

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

    if (!this.vectorStore) {
      return 'I apologize, but the chatbot is not properly initialized with any documents. Please contact the administrator.';
    }

    try {
      const relevantDocs = await this.findRelevantDocuments(query);
      
      if (relevantDocs.length === 0) {
        return 'I apologize, but I could not find any relevant information to answer your question.';
      }

      const context = relevantDocs
        .map(doc => doc.content)
        .join('\n\n');

      return await this.generateResponse(query, context);
    } catch (error) {
      console.error('Error processing query:', error);
      return 'I apologize, but I encountered an error while processing your query. Please try again later.';
    }
  }
}

// Export a singleton instance
export const chatbotServiceV2 = new ChatbotServiceV2();