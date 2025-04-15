import type { Project, Publication, TeamMember, Student } from "@shared/schema";

// Get API URL from environment, but remove trailing slash if it exists
const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

// Log the API configuration on startup
console.log('[API Config]', {
  API_BASE_URL,
  env: import.meta.env.MODE,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  baseUrl: typeof window !== 'undefined' ? window.location.origin : 'unknown'
});

/**
 * Enhanced fetch with error handling and logging
 */
async function fetchWithErrorHandling<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Make sure endpoint doesn't start with a slash to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  // Construct the full URL - avoid double /api/api issue
  const fullUrl = `${API_BASE_URL}/${cleanEndpoint}`;
  
  console.log(`[API] Fetching: ${fullUrl}`);
  
  try {
    // Add default options
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
    };
    
    // Make the request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
    
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Log response status
    console.log(`[API] Response status: ${response.status} for ${fullUrl}`);
    
    if (!response.ok) {
      // Try to parse error response
      let errorData: {error?: string} = {};
      try {
        errorData = await response.json();
      } catch (e) {
        console.error('[API] Failed to parse error response:', e);
      }
      
      const errorMsg = errorData?.error || `HTTP error! status: ${response.status}`;
      console.error(`[API] Request failed: ${errorMsg}`, {
        url: fullUrl,
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      throw new Error(errorMsg);
    }
    
    // Parse and return data
    const data = await response.json();
    const isArray = Array.isArray(data);
    console.log(`[API] Success: ${fullUrl} - Got ${isArray ? data.length : 'object'}`);
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[API] Request timeout for ${fullUrl}`);
      throw new Error(`Request timeout for ${endpoint}`);
    }
    
    console.error(`[API] Request failed for ${fullUrl}:`, error);
    throw error;
  }
}

export const api = {
  // Projects
  async getProjects(): Promise<Project[]> {
    return fetchWithErrorHandling<Project[]>('projects');
  },

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return fetchWithErrorHandling<Project[]>(`projects/${category}`);
  },

  // Publications
  async getPublications(): Promise<Publication[]> {
    return fetchWithErrorHandling<Publication[]>('publications');
  },

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return fetchWithErrorHandling<TeamMember[]>('team');
  },

  // Students
  async getStudents(): Promise<Student[]> {
    return fetchWithErrorHandling<Student[]>('students');
  }
}; 