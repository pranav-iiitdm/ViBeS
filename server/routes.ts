import express from "express";
import { type Request, Response } from "express";
import { createServer } from "http";
import { IStorage, SupabaseStorage } from "./storage.js";
// import { chatbotServiceV3 } from "./chatbot_v3.js";
import { chatbotServicev5 } from "./chatbot_v5.js";

export function registerRoutes(app: express.Express, storageService: SupabaseStorage) {
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

  return createServer(app);
}
