import express from 'express';
import { SupabaseStorage } from './storage.ts';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize storage with error handling
try {
  const storage = new SupabaseStorage();
  console.log('Supabase storage initialized successfully in API server');
  
  // Define routes directly in this file
  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/projects/:category", async (req, res) => {
    try {
      const category = req.params.category;
      console.log(`Fetching projects for category: ${category}`);
      const projects = await storage.getProjectsByCategory(category);
      console.log(`Found ${projects.length} projects for category ${category}`);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects by category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Publications routes
  app.get("/api/publications", async (req, res) => {
    try {
      console.log("Fetching all publications");
      const publications = await storage.getPublications();
      console.log(`Found ${publications.length} publications`);
      res.json(publications);
    } catch (error) {
      console.error("Error fetching publications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Team routes
  app.get("/api/team", async (req, res) => {
    try {
      console.log("Fetching all team members");
      const teamMembers = await storage.getTeamMembers();
      console.log(`Found ${teamMembers.length} team members`);
      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Students routes
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
} catch (storageError) {
  console.error('Failed to initialize Supabase storage in API server:', storageError);
  process.exit(1); // Exit if storage fails to initialize
}

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});

export default app;