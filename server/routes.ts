import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express) {
  // Projects routes
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:category", async (req, res) => {
    const projects = await storage.getProjectsByCategory(req.params.category);
    res.json(projects);
  });

  // Publications routes
  app.get("/api/publications", async (_req, res) => {
    const publications = await storage.getPublications();
    res.json(publications);
  });

  // Team routes
  app.get("/api/team", async (_req, res) => {
    const team = await storage.getTeamMembers();
    res.json(team);
  });

  // Students routes
  app.get("/api/students", async (_req, res) => {
    const students = await storage.getStudents();
    res.json(students);
  });

  return createServer(app);
}
