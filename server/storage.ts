import {
  type Project,
  type Publication,
  type TeamMember,
  type Student,
  type InsertProject,
  type InsertPublication,
  type InsertTeamMember,
  type InsertStudent
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  
  // Publications
  getPublications(): Promise<Publication[]>;
  
  // Team
  getTeamMembers(): Promise<TeamMember[]>;
  
  // Students
  getStudents(): Promise<Student[]>;
}

export class MemStorage implements IStorage {
  private projects: Project[] = [];
  private publications: Publication[] = [];
  private teamMembers: TeamMember[] = [];
  private students: Student[] = [];

  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return this.projects.filter(p => p.category === category);
  }

  async getPublications(): Promise<Publication[]> {
    return this.publications;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return this.teamMembers;
  }

  async getStudents(): Promise<Student[]> {
    return this.students;
  }
}

export const storage = new MemStorage();
