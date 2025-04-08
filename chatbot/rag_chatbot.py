import json
import os
import sys
import traceback
from typing import List, Dict, Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from groq import Groq
from dotenv import load_dotenv
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import urllib.parse

print("Starting script...")
print(f"Python version: {sys.version}")
print(f"NumPy version: {np.__version__}")
print(f"Current working directory: {os.getcwd()}")
print(f"Script directory: {os.path.dirname(os.path.abspath(__file__))}")

# Load environment variables
load_dotenv()
print("Environment variables loaded")

class RAGChatbot:
    def __init__(self):
        print("Initializing RAGChatbot...")
        try:
            print("Initializing Groq client...")
            api_key = os.getenv('GROQ_API_KEY')
            if not api_key:
                raise ValueError("GROQ_API_KEY environment variable not found")
            self.client = Groq(api_key=api_key)
            print("Groq client initialized successfully")
            
            print("Initializing TF-IDF vectorizer...")
            self.vectorizer = TfidfVectorizer(stop_words='english')
            print("TF-IDF vectorizer initialized")
            
            # Load and index documents
            print("Loading documents...")
            self.documents = []
            self.load_documents()
            print("Documents loaded and indexed")
            
        except Exception as e:
            print(f"Error during initialization: {str(e)}")
            print("Traceback:")
            traceback.print_exc()
            raise

    def load_documents(self):
        """Load documents from JSONL file and create embeddings."""
        print("Loading documents...")
        self.documents = []
        
        try:
            jsonl_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'structured_website_data.jsonl')
            print(f"Looking for JSONL file at: {jsonl_path}")
            
            if not os.path.exists(jsonl_path):
                print(f"Error: JSONL file not found at {jsonl_path}")
                return
                
            with open(jsonl_path, 'r', encoding='utf-8') as file:
                for line_num, line in enumerate(file, 1):
                    try:
                        data = json.loads(line.strip())
                        
                        # Extract content based on document type
                        content_parts = []
                        
                        # Add title if present
                        if 'title' in data and data['title']:
                            content_parts.append(f"Title: {data['title']}")
                        
                        # Add abstract if present
                        if 'abstract' in data and data['abstract'] and data['abstract'] != 'null':
                            content_parts.append(f"Abstract: {data['abstract']}")
                        
                        # Add authors if present
                        if 'authors' in data and data['authors']:
                            authors = data['authors']
                            if isinstance(authors, list):
                                authors_str = ', '.join(authors)
                            else:
                                authors_str = str(authors)
                            content_parts.append(f"Authors: {authors_str}")
                        
                        # Add category if present
                        if 'category' in data and data['category']:
                            content_parts.append(f"Category: {data['category']}")
                        
                        # Add venue if present
                        if 'venue' in data and data['venue']:
                            content_parts.append(f"Venue: {data['venue']}")
                        
                        # Add year if present
                        if 'year' in data and data['year']:
                            content_parts.append(f"Year: {data['year']}")
                        
                        # Add link if present
                        if 'link' in data and data['link']:
                            content_parts.append(f"Link: {data['link']}")
                        
                        # Add bio if present
                        if 'bio' in data and data['bio']:
                            content_parts.append(f"Bio: {data['bio']}")
                        
                        # Add research interests if present
                        if 'research_interests' in data and data['research_interests']:
                            interests = data['research_interests']
                            if isinstance(interests, list):
                                interests_str = ', '.join(interests)
                            else:
                                interests_str = str(interests)
                            content_parts.append(f"Research Interests: {interests_str}")
                        
                        # Combine all parts into a single content string
                        content = '\n'.join(content_parts)
                        
                        # Only add if we have actual content
                        if content.strip():
                            self.documents.append(content)
                            print(f"Loaded document {line_num}")
                            
                    except json.JSONDecodeError as e:
                        print(f"Error parsing JSON at line {line_num}: {str(e)}")
                        continue
                    except Exception as e:
                        print(f"Error processing line {line_num}: {str(e)}")
                        continue
                        
            print(f"Successfully loaded {len(self.documents)} documents")
            
            # Create TF-IDF matrix for all documents
            if self.documents:
                print("Creating TF-IDF matrix for documents...")
                self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)
                print(f"Created TF-IDF matrix with shape: {self.tfidf_matrix.shape}")
            else:
                print("No documents loaded, skipping TF-IDF matrix creation")
                
        except Exception as e:
            print(f"Error loading documents: {str(e)}")
            print("Traceback:")
            traceback.print_exc()
            raise

    def find_relevant_documents(self, query: str, k: int = 3) -> List[str]:
        """Find the most relevant documents for a query."""
        try:
            if not self.documents:
                return []
                
            # Create query vector
            query_vector = self.vectorizer.transform([query])
            
            # Calculate cosine similarity
            similarities = cosine_similarity(query_vector, self.tfidf_matrix).flatten()
            
            # Get top k indices
            top_indices = similarities.argsort()[-k:][::-1]
            
            # Return relevant documents
            return [self.documents[i] for i in top_indices]
        except Exception as e:
            print(f"Error finding relevant documents: {str(e)}")
            return []

    def generate_response(self, query: str, context: List[str]) -> str:
        """Generate a response using the Groq API."""
        try:
            # Prepare the prompt
            context_text = "\n\n".join(context)
            prompt = f"""You are a helpful research assistant for the ViBeS (Visual Biometrics and Surveillance) lab.
            
Context information:
{context_text}

User question: {query}

Please provide a helpful response based on the context information above. If the context doesn't contain relevant information to answer the question, please say so."""
            
            # Generate response using Groq
            completion = self.client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[
                    {"role": "system", "content": "You are a helpful research assistant for the ViBeS lab."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            return completion.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return "I apologize, but I encountered an error while generating a response. Please try again."

    def process_query(self, query: str) -> str:
        """Process a user query and return a response."""
        try:
            # Find relevant documents
            relevant_docs = self.find_relevant_documents(query)
            
            # Generate response
            response = self.generate_response(query, relevant_docs)
            
            return response
            
        except Exception as e:
            print(f"Error processing query: {str(e)}")
            return "I apologize, but I encountered an error while processing your query. Please try again."

# Create chatbot instance
print("Creating chatbot instance...")
chatbot = RAGChatbot()

# HTTP server handler
class ChatbotHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            # Parse the request data
            data = json.loads(post_data.decode('utf-8'))
            query = data.get('text', '')
            
            if not query:
                self.send_error(400, "No text provided")
                return
                
            # Process the query
            print(f"Processing query: {query}")
            response = chatbot.process_query(query)
            
            # Send the response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'response': response}).encode('utf-8'))
            
        except Exception as e:
            print(f"Error handling request: {str(e)}")
            print("Traceback:")
            traceback.print_exc()
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Internal server error'}).encode('utf-8'))
    
    def do_GET(self):
        # Simple health check endpoint
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'status': 'ok'}).encode('utf-8'))

# Start the HTTP server
def run_server():
    server_address = ('', 5000)  # Listen on all interfaces, port 5000
    httpd = HTTPServer(server_address, ChatbotHandler)
    print("Starting HTTP server on port 5000...")
    httpd.serve_forever()

# Run the server in a separate thread
server_thread = threading.Thread(target=run_server)
server_thread.daemon = True
server_thread.start()

print("READY")  # Signal to the TypeScript wrapper that we're ready

# Keep the main thread alive
try:
    while True:
        # Just sleep to keep the main thread alive
        import time
        time.sleep(1)
except KeyboardInterrupt:
    print("Shutting down...") 