import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MemStorage } from '../server/storage';

// Create a new storage instance
const storage = new MemStorage();

// Helper function to set CORS headers
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

// Helper function to handle OPTIONS requests
function handleOptions(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  res.status(200).end();
}

// Create handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  setCorsHeaders(res);
  
  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
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
      // Check if it's a category request
      const categoryMatch = path.match(/\/api\/projects\/([^\/]+)/);
      if (categoryMatch) {
        const category = categoryMatch[1];
        console.log(`Fetching projects for category: ${category}`);
        try {
          const projects = await storage.getProjectsByCategory(category);
          console.log(`Found ${projects.length} projects for category ${category}`);
          return res.status(200).json(projects);
        } catch (error) {
          console.error(`Error fetching projects for category ${category}:`, error);
          return res.status(500).json({ error: `Failed to fetch projects for category ${category}` });
        }
      } else {
        // Return all projects
        console.log('Fetching all projects');
        try {
          const projects = await storage.getProjects();
          console.log(`Found ${projects.length} projects`);
          return res.status(200).json(projects);
        } catch (error) {
          console.error('Error fetching all projects:', error);
          return res.status(500).json({ error: 'Failed to fetch all projects' });
        }
      }
    } 
    else if (path === '/api/publications') {
      console.log('Fetching all publications');
      try {
        // Get a small subset of publications first to test
        const allPublications = await storage.getPublications();
        console.log(`Found ${allPublications.length} publications`);
        
        // Try to serialize a small subset to identify any serialization issues
        const testData = allPublications.slice(0, 2);
        console.log('Test data:', JSON.stringify(testData));
        
        // If we get here, serialization worked, so return all publications
        return res.status(200).json(allPublications);
      } catch (error) {
        console.error('Error fetching publications:', error);
        if (error instanceof Error) {
          console.error('Error stack:', error.stack);
        }
        return res.status(500).json({ 
          error: 'Failed to fetch publications',
          message: error instanceof Error ? error.message : String(error)
        });
      }
    }
    else if (path === '/api/team') {
      console.log('Fetching all team members');
      try {
        // Get a small subset of team members first to test
        const allTeamMembers = await storage.getTeamMembers();
        console.log(`Found ${allTeamMembers.length} team members`);
        
        // Try to serialize a small subset to identify any serialization issues
        const testData = allTeamMembers.slice(0, 2);
        console.log('Test data:', JSON.stringify(testData));
        
        // If we get here, serialization worked, so return all team members
        return res.status(200).json(allTeamMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
        if (error instanceof Error) {
          console.error('Error stack:', error.stack);
        }
        return res.status(500).json({ 
          error: 'Failed to fetch team members',
          message: error instanceof Error ? error.message : String(error)
        });
      }
    }
    else if (path === '/api/students') {
      console.log('Fetching all students');
      try {
        const students = await storage.getStudents();
        console.log(`Found ${students.length} students`);
        return res.status(200).json(students);
      } catch (error) {
        console.error('Error fetching students:', error);
        if (error instanceof Error) {
          console.error('Error stack:', error.stack);
        }
        return res.status(500).json({ 
          error: 'Failed to fetch students',
          message: error instanceof Error ? error.message : String(error)
        });
      }
    }
    else {
      // Handle unknown routes
      console.log(`Unknown route: ${path}`);
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
} 