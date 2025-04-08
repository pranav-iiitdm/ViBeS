import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SupabaseStorage } from './storage';

// Create a storage instance
const storage = new SupabaseStorage();

// Create handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract the path from the URL
    const path = req.url || '';
    console.log(`Processing request for path: ${path}`);
    
    // Handle different API routes
    if (path.startsWith('/api/projects')) {
      // Check if a category is specified
      const url = new URL(path, 'http://localhost');
      const category = url.searchParams.get('category');
      
      let projects;
      if (category) {
        console.log(`Fetching projects for category: ${category}`);
        projects = await storage.getProjectsByCategory(category);
      } else {
        console.log('Fetching all projects');
        projects = await storage.getProjects();
      }
      
      console.log(`Found ${projects.length} projects`);
      return res.status(200).json(projects);
    } 
    else if (path === '/api/publications') {
      console.log('Fetching publications');
      const publications = await storage.getPublications();
      console.log(`Found ${publications.length} publications`);
      return res.status(200).json(publications);
    }
    else if (path === '/api/team') {
      console.log('Fetching team members');
      const teamMembers = await storage.getTeamMembers();
      console.log(`Found ${teamMembers.length} team members`);
      return res.status(200).json(teamMembers);
    }
    else if (path === '/api/students') {
      console.log('Fetching students');
      const students = await storage.getStudents();
      console.log(`Found ${students.length} students`);
      return res.status(200).json(students);
    }
    else {
      // Handle unknown routes
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 