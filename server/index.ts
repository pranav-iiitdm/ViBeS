import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { registerRoutes } from './routes.js';
import { SupabaseStorage } from './storage.js';
import { chatbotServicev5 } from './chatbot_v5.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('  Headers:', JSON.stringify({
    origin: req.headers.origin,
    referer: req.headers.referer,
    host: req.headers.host
  }));
  next();
});

// CORS configuration - allow all Vercel deployments during development
app.use(cors({
  // Either use an allowlist or allow all origins with credentials: false
  // For now, allow all origins since we're troubleshooting
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // When using origin: '*', credentials must be false
  credentials: false
}));

// Initialize storage
try {
  const storage = new SupabaseStorage();
  console.log('Supabase storage initialized successfully');
  
  // Test database connections to all tables
  try {
    console.log('Testing connection to projects table...');
    const projects = await storage.getProjects();
    console.log(`Connection successful: Retrieved ${projects.length} projects`);
  } catch (projectError) {
    console.error('Error connecting to projects table:', projectError);
  }
  
  try {
    console.log('Testing connection to publications table...');
    const publications = await storage.getPublications();
    console.log(`Connection successful: Retrieved ${publications.length} publications`);
  } catch (pubError) {
    console.error('Error connecting to publications table:', pubError);
  }
  
  try {
    console.log('Testing connection to team_members table...');
    const teamMembers = await storage.getTeamMembers();
    console.log(`Connection successful: Retrieved ${teamMembers.length} team members`);
  } catch (teamError) {
    console.error('Error connecting to team_members table:', teamError);
  }
  
  try {
    console.log('Testing connection to students table...');
    const students = await storage.getStudents();
    console.log(`Connection successful: Retrieved ${students.length} students`);
  } catch (studentError) {
    console.error('Error connecting to students table:', studentError);
  }
  
  // Initialize chatbot
  try {
    await chatbotServicev5.processQuery('test'); // Test chatbot initialization
    console.log('Chatbot service initialized successfully');
  } catch (chatbotError) {
    console.error('Chatbot initialization error:', chatbotError);
  }
  
  // Register routes with storage
  registerRoutes(app, storage);
} catch (storageError) {
  console.error('Failed to initialize Supabase storage:', storageError);
  process.exit(1); // Exit if storage fails to initialize
}

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Register API routes before the catch-all route
// This line is redundant as registerRoutes is already called above with storage
// Removing this line to fix the undefined storage reference

// Handle client-side routing - must be after API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Keep the process alive
process.stdin.resume();
