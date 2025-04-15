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
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://vibes-pp4bjpx0b-vi-be-s.vercel.app',
    'https://vibes-new.vercel.app',
    'https://vibes-3vyr7mr85-vi-be-s.vercel.app',
    'https://vibes-79bldi0fm-vi-be-s.vercel.app',
    'https://vibes-pprfx22pi-vi-be-s.vercel.app',
    'https://vibes-12chm60hc-vi-be-s.vercel.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
