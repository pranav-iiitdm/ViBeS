import type { Project, Publication, TeamMember, Student } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API configuration:', {
  API_BASE_URL,
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  console.log(`Fetching data from: ${url}`);
  try {
    const response = await fetch(url);
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      let errorData: {error?: string} = {};
      try {
        errorData = await response.json();
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      console.error('API request failed:', {
        status: response.status,
        url,
        errorData
      });
      
      throw new Error(
        errorData?.error || `HTTP error! status: ${response.status}`
      );
    }
    
    const data = await response.json();
    console.log(`API response data length: ${Array.isArray(data) ? data.length : 'not an array'}`);
    return data;
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