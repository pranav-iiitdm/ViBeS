import type { Express } from "express";
import { createServer } from "http";
import { IStorage } from "./storage";

export function registerRoutes(app: Express, storageInstance?: IStorage) {
  // Use the provided storage instance or the default one
  const storage = storageInstance || require("./storage").storage;
  
  console.log("Registering routes with storage instance:", storage ? "provided" : "default");

  // Projects routes
  app.get("/api/projects", async (_req, res) => {
    console.log("Fetching all projects");
    try {
      const projects = await storage.getProjects();
      console.log(`Found ${projects.length} projects`);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:category", async (req, res) => {
    console.log(`Fetching projects for category: ${req.params.category}`);
    try {
      const projects = await storage.getProjectsByCategory(req.params.category);
      console.log(`Found ${projects.length} projects for category ${req.params.category}`);
      res.json(projects);
    } catch (error) {
      console.error(`Error fetching projects for category ${req.params.category}:`, error);
      res.status(500).json({ error: "Failed to fetch projects by category" });
    }
  });

  // Publications routes
  app.get("/api/publications", async (_req, res) => {
    console.log("Fetching all publications");
    try {
      const publications = await storage.getPublications();
      console.log(`Found ${publications.length} publications`);
      res.json(publications);
    } catch (error) {
      console.error("Error fetching publications:", error);
      res.status(500).json({ error: "Failed to fetch publications" });
    }
  });

  // Team routes
  app.get("/api/team", async (_req, res) => {
    console.log("Fetching all team members");
    try {
      const team = await storage.getTeamMembers();
      console.log(`Found ${team.length} team members`);
      res.json(team);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  // Students routes
  app.get("/api/students", async (_req, res) => {
    console.log("Fetching all students");
    try {
      const students = await storage.getStudents();
      console.log(`Found ${students.length} students`);
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  return createServer(app);
}
