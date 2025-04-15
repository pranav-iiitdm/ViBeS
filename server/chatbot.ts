import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from '@xenova/transformers';
import { JSONLinesLoader } from "langchain/document_loaders/fs/json";


// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple in-memory document store
interface Document {
  id: string;
  content: string;
  type: string;
  metadata: Record<string, any>;
  embedding?: number[];
  score?: number;
}

class ChatbotService {
  private groqClient: any;
  private embeddingModel: any;
  private documents: Document[] = [];
  private isReady: boolean = false;
  private isInitializing: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      console.log('Initializing chatbot...');
      
      // Initialize Groq client
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('GROQ_API_KEY environment variable not found');
      }
      this.groqClient = new Groq({ apiKey });
      console.log('Groq client initialized');
      
      // Initialize embedding model
      console.log('Loading embedding model...');
      this.embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('Embedding model loaded');
      
      // Initialize in-memory storage
      console.log('Initializing in-memory storage...');
      
      // Load documents
      await this.loadDocuments();
      
      this.isReady = true;
      console.log('Chatbot is ready');
    } catch (error) {
      console.error('Error initializing chatbot:', error);
      this.isReady = false;
      throw error; // Propagate the error instead of marking as ready
    } finally {
      this.isInitializing = false;
    }
  }

  private async loadDocuments() {
    try {
      console.log('Loading documents...');
      const filePath = path.join(__dirname, '..', 'structured_website_data.jsonl');
      
      if (!fs.existsSync(filePath)) {
        console.error(`JSONL file not found at ${filePath}`);
        return;
      }

      // Read and parse JSONL file manually
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim());
      
      for (const [i, line] of lines.entries()) {
        try {
          // Clean up the line to ensure valid JSON
          const cleanLine = line.replace(/\u2019/g, "'")  // Replace smart quotes
                               .replace(/\u201C|\u201D/g, '"')  // Replace smart double quotes
                               .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');  // Remove control characters
          
          const doc = JSON.parse(cleanLine);
          let content = '';
          
          // Build content from various fields
          if (doc.title) content += `Title: ${doc.title}\n`;
          if (doc.abstract) content += `Abstract: ${doc.abstract}\n`;
          if (doc.authors) {
            const authors = Array.isArray(doc.authors) ? doc.authors.join(', ') : doc.authors;
            content += `Authors: ${authors}\n`;
          }
          if (doc.bio) content += `Bio: ${doc.bio}\n`;
          if (doc.researchInterests) {
            const interests = Array.isArray(doc.researchInterests) ? doc.researchInterests.join(', ') : doc.researchInterests;
            content += `Research Interests: ${interests}\n`;
          }
          if (doc.projects) {
            content += 'Projects:\n';
            doc.projects.forEach((project: any) => {
              content += `- ${project.title}: ${project.description}\n`;
            });
          }
          if (doc.additionalInfo) content += `Additional Info: ${doc.additionalInfo}\n`;

          if (content.trim()) {
            const document: Document = {
              id: `doc-${i}`,
              content: content.trim(),
              type: doc.type || doc.category || 'unknown',
              metadata: {
                type: doc.type || doc.category || 'unknown',
                ...doc
              }
            };
            this.documents.push(document);
          }
        } catch (error) {
          console.error(`Error processing document at line ${i + 1}:`, error);
          console.error('Problematic line:', line);
        }
      }
      
      console.log(`Loaded ${this.documents.length} documents into memory`);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private async findRelevantDocuments(query: string, k: number = 5): Promise<Document[]> {
    try {
      // Get embedding for the query
      const queryEmbedding = await this.embeddingModel(query, { pooling: 'mean', normalize: true });
      const queryVector = Array.from(queryEmbedding.data);

      // Calculate similarity scores for all documents
      const scoredDocs = await Promise.all(this.documents.map(async (doc) => {
        if (!doc.embedding) {
          // Generate embedding if not already present
          const output = await this.embeddingModel(doc.content, { pooling: 'mean', normalize: true });
          doc.embedding = Array.from(output.data);
        }
        
        // Calculate cosine similarity
        const similarity = this.cosineSimilarity(queryVector, doc.embedding);
        return { ...doc, score: similarity };
      }));

      // Sort by similarity score and return top k
      return scoredDocs
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, k);
    } catch (error) {
      console.error('Error finding relevant documents:', error);
      return [];
    }
  }

  private async generateResponse(query: string, context: string): Promise<string> {
    try {
      const completion = await this.groqClient.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful research assistant for the ViBeS Research Lab. Use the following context to provide comprehensive and accurate answers to questions. When discussing any topic:

1. Provide detailed and relevant information from the available context
2. Organize information in a clear, structured manner
3. Include specific details, facts, and data points when available
4. Maintain a professional and informative tone
5. If information is not available in the context, acknowledge this clearly

Context:
${context}`
          },
          {
            role: 'user',
            content: query
          }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  public async processQuery(query: string): Promise<string> {
    if (!this.isReady) {
      if (!this.isInitializing) {
        // Try to initialize if not already trying
        await this.initialize();
      }
      return 'The chatbot is still initializing. Please try again in a moment.';
    }

    if (this.documents.length === 0) {
      return 'I apologize, but the chatbot is not properly initialized with any documents. Please contact the administrator.';
    }

    try {
      // Find relevant documents using vector similarity
      const relevantDocs = await this.findRelevantDocuments(query);
      
      if (relevantDocs.length === 0) {
        return 'I apologize, but I could not find any relevant information to answer your question.';
      }

      // Combine relevant documents into context
      const context = relevantDocs
        .map(doc => doc.content)
        .join('\n\n');

      // Generate response using the context
      return await this.generateResponse(query, context);
    } catch (error) {
      console.error('Error processing query:', error);
      return 'I apologize, but I encountered an error while processing your query. Please try again later.';
    }
  }
}

// Export a singleton instance
export const chatbotService = new ChatbotService();