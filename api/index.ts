import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SupabaseStorage } from './storage';

// Create a storage instance
const storage = new SupabaseStorage();

// Create handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Extract the path from the URL
    const path = req.url || '';
    console.log(`Processing request for path: ${path}`);
    
    // Handle different API routes
    if (path.startsWith('/projects')) {
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
    else if (path === '/publications') {
      console.log('Fetching publications');
      const publications = await storage.getPublications();
      console.log(`Found ${publications.length} publications`);
      return res.status(200).json(publications);
    }
    else if (path === '/team') {
      console.log('Fetching team members');
      const teamMembers = await storage.getTeamMembers();
      console.log(`Found ${teamMembers.length} team members`);
      return res.status(200).json(teamMembers);
    }
    else if (path === '/students') {
      console.log('Fetching students');
      const students = await storage.getStudents();
      console.log(`Found ${students.length} students`);
      return res.status(200).json(students);
    }
    else if (path === '/chatbot' && req.method === 'POST') {
      console.log('Processing chatbot request');
      const { text } = req.body;
      
      // For now, return a simple response
      return res.status(200).json({
        response: "I'm still learning about ViBeS Research Lab. Please check back later for more detailed responses."
      });
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