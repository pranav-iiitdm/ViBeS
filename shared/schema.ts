import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  abstract: text("abstract").notNull(),
  authors: text("authors").array().notNull(),
  datasetLink: text("dataset_link"),
  githubLink: text("github_link"),
  date: text("date").notNull(),
  category: text("category").notNull(), // visual_surveillance, edge_computing, generative_models, biometrics
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: text("authors").array().notNull(),
  year: integer("year").notNull(),
  venue: text("venue").notNull(),
  link: text("link"),
  abstract: text("abstract"),
  type: text("type").notNull(), // journal, conference, workshop
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  image: text("image"),
  googleScholarUrl: text("google_scholar_url"),
  researchGateUrl: text("research_gate_url"),
  researchInterests: text("research_interests").array(),
  linkedinUrl: text("linkedin_url"),
  additionalInfo: text("additional_info")
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("degree").notNull(),
  projects: json("projects").$type<{title: string, description: string}[]>(),
  researchInterests: text("research_interests").array(),
  image: text("image"),
  category: text("category"),
  additionalInfo: text("additional_info"),
  googleScholarUrl: text("google_scholar_url"),
  researchGateUrl: text("research_gate_url"),
  linkedinUrl: text("linkedin_url")
});

export const insertProjectSchema = createInsertSchema(projects);
export const insertPublicationSchema = createInsertSchema(publications);
export const insertTeamMemberSchema = createInsertSchema(teamMembers);
export const insertStudentSchema = createInsertSchema(students);

export type Project = typeof projects.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Student = typeof students.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;