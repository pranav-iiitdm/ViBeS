import type { Project, Publication, TeamMember, Student } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const api = {
  // Projects
  async getProjects(): Promise<Project[]> {
    return fetchWithErrorHandling<Project[]>(`${API_BASE_URL}/projects`);
  },

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return fetchWithErrorHandling<Project[]>(`${API_BASE_URL}/projects/${category}`);
  },

  // Publications
  async getPublications(): Promise<Publication[]> {
    return fetchWithErrorHandling<Publication[]>(`${API_BASE_URL}/publications`);
  },

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return fetchWithErrorHandling<TeamMember[]>(`${API_BASE_URL}/team`);
  },

  // Students
  async getStudents(): Promise<Student[]> {
    return fetchWithErrorHandling<Student[]>(`${API_BASE_URL}/students`);
  }
}; 