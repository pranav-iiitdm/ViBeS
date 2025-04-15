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
import { supabase } from '../shared/supabase.js';

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
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error in getProjects:', error);
      throw error;
    }
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', category);
      
      if (error) {
        console.error('Error fetching projects by category:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error in getProjectsByCategory:', error);
      throw error;
    }
  }

  async addProject(project: InsertProject): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding project:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in addProject:', error);
      throw error;
    }
  }

  async getPublications(): Promise<Publication[]> {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*');
      
      if (error) {
        console.error('Error fetching publications:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error in getPublications:', error);
      throw error;
    }
  }

  async addPublication(publication: InsertPublication): Promise<Publication> {
    try {
      const { data, error } = await supabase
        .from('publications')
        .insert([publication])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding publication:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in addPublication:', error);
      throw error;
    }
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*');
      
      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error in getTeamMembers:', error);
      throw error;
    }
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding team member:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in addTeamMember:', error);
      throw error;
    }
  }

  async getStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error in getStudents:', error);
      throw error;
    }
  }

  async addStudent(student: InsertStudent): Promise<Student> {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding student:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in addStudent:', error);
      throw error;
    }
  }
}