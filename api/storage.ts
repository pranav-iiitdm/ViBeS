import {
  type Project,
  type Publication,
  type TeamMember,
  type Student,
  type InsertProject,
  type InsertPublication,
  type InsertTeamMember,
  type InsertStudent
} from "../shared/schema.js";
import { supabase } from './lib/supabase';

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  addProject(project: InsertProject): Promise<Project>;

  // Publications
  getPublications(): Promise<Publication[]>;
  addPublication(publication: InsertPublication): Promise<Publication>;

  // Team
  getTeamMembers(): Promise<TeamMember[]>;
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;

  // Students
  getStudents(): Promise<Student[]>;
  addStudent(student: InsertStudent): Promise<Student>;
}

export class SupabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    return data;
  }

  async addProject(project: InsertProject): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPublications(): Promise<Publication[]> {
    const { data, error } = await supabase
      .from('publications')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async addPublication(publication: InsertPublication): Promise<Publication> {
    const { data, error } = await supabase
      .from('publications')
      .insert([publication])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert([member])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async addStudent(student: InsertStudent): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
} 