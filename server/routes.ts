import express from "express";
import { type Request, Response } from "express";
import { createServer } from "http";
import { IStorage, SupabaseStorage } from "./storage.js";
// import { chatbotServiceV3 } from "./chatbot_v3.js";
import { chatbotServicev5 } from "./chatbot_v5.js";
import { supabase } from "./supabase.js";

// Define interfaces for type safety
interface TableStatus {
  status: 'success' | 'error';
  count?: number;
  sample?: number | null;
  message?: string;
}

interface DiagnosticResult {
  serverTime: string;
  environment: string;
  tables: Record<string, TableStatus>;
}

export function registerRoutes(app: express.Express, storageService: SupabaseStorage) {
  // Debug endpoint that directly accesses database tables
  app.get("/api/debug/tables", async (req, res) => {
    try {
      const results: Record<string, any> = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        tables: {}
      };
      
      // Try to fetch from each table directly
      try {
        const response = await supabase.from('projects').select('id').limit(3);
        results.tables.projects = {
          success: !response.error,
          count: response.data?.length || 0,
          error: response.error?.message,
          sample: response.data?.map(d => d.id) || []
        };
      } catch (error: any) {
        results.tables.projects = {
          success: false, 
          error: error?.message || String(error)
        };
      }
      
      try {
        const response = await supabase.from('publications').select('id').limit(3);
        results.tables.publications = {
          success: !response.error,
          count: response.data?.length || 0,
          error: response.error?.message,
          sample: response.data?.map(d => d.id) || []
        };
      } catch (error: any) {
        results.tables.publications = {
          success: false, 
          error: error?.message || String(error)
        };
      }
      
      try {
        const response = await supabase.from('team_members').select('id').limit(3);
        results.tables.team_members = {
          success: !response.error,
          count: response.data?.length || 0,
          error: response.error?.message,
          sample: response.data?.map(d => d.id) || []
        };
      } catch (error: any) {
        results.tables.team_members = {
          success: false, 
          error: error?.message || String(error)
        };
      }
      
      try {
        const response = await supabase.from('students').select('id').limit(3);
        results.tables.students = {
          success: !response.error,
          count: response.data?.length || 0,
          error: response.error?.message,
          sample: response.data?.map(d => d.id) || []
        };
      } catch (error: any) {
        results.tables.students = {
          success: false, 
          error: error?.message || String(error)
        };
      }
      
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Internal server error",
        message: error?.message || String(error)
      });
    }
  });

  // Add diagnostic endpoint
  app.get("/api/status", async (req, res) => {
    try {
      const results: DiagnosticResult = {
        serverTime: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        tables: {}
      };
      
      // Test connections to all tables
      try {
        const projects = await storageService.getProjects();
        results.tables['projects'] = {
          status: 'success',
          count: projects.length,
          sample: projects.length > 0 ? projects[0].id : null
        };
      } catch (error: any) {
        results.tables['projects'] = {
          status: 'error',
          message: error?.message || 'Unknown error'
        };
      }
      
      try {
        const publications = await storageService.getPublications();
        results.tables['publications'] = {
          status: 'success',
          count: publications.length,
          sample: publications.length > 0 ? publications[0].id : null
        };
      } catch (error: any) {
        results.tables['publications'] = {
          status: 'error',
          message: error?.message || 'Unknown error'
        };
      }
      
      try {
        const teamMembers = await storageService.getTeamMembers();
        results.tables['team_members'] = {
          status: 'success',
          count: teamMembers.length,
          sample: teamMembers.length > 0 ? teamMembers[0].id : null
        };
      } catch (error: any) {
        results.tables['team_members'] = {
          status: 'error',
          message: error?.message || 'Unknown error'
        };
      }
      
      try {
        const students = await storageService.getStudents();
        results.tables['students'] = {
          status: 'success',
          count: students.length,
          sample: students.length > 0 ? students[0].id : null
        };
      } catch (error: any) {
        results.tables['students'] = {
          status: 'error',
          message: error?.message || 'Unknown error'
        };
      }
      
      res.json(results);
    } catch (error: any) {
      console.error("Diagnostic endpoint error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storageService.getProjects();
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
      const projects = await storageService.getProjectsByCategory(category);
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
      const publications = await storageService.getPublications();
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
      const teamMembers = await storageService.getTeamMembers();
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
      const students = await storageService.getStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Chatbot route
  app.post("/api/chatbot", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Text is required and must be a non-empty string' 
        });
      }

      const response = await chatbotServicev5.processQuery(text.trim());
      
      // Check if response indicates initialization or other known issues
      if (response.includes('still initializing')) {
        return res.status(503).json({ 
          error: 'Service Unavailable',
          message: response,
          retryAfter: 5 // Suggest retry after 5 seconds
        });
      }
      
      if (response.includes('not properly initialized')) {
        return res.status(500).json({ 
          error: 'Service Configuration Error',
          message: response
        });
      }

      res.json({ response });
    } catch (error) {
      console.error('Error processing chatbot request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ 
        error: 'Internal server error',
        message: errorMessage
      });
    }
  });

  // Add a new route for chatbot initialization/warmup that will be called when the homepage loads
  app.get("/api/chatbot/init", async (req, res) => {
    try {
      // This route is just to trigger the chatbot to start warming up
      console.log("Received chatbot warm-up request");
      
      // Start the initialization process in the background
      chatbotServicev5.initializeForClient().catch(err => 
        console.error("Background initialization error:", err)
      );
      
      // Return immediately to not block the client
      res.json({ status: "Chatbot warm-up initiated" });
    } catch (error) {
      console.error('Error initiating chatbot warm-up:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return createServer(app);
}
