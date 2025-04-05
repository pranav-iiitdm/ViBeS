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

// Helper function to safely serialize data
function safeJsonResponse(res: VercelResponse, status: number, data: any) {
  setCorsHeaders(res);
  try {
    return res.status(status).json(data);
  } catch (error) {
    console.error('Error serializing response:', error);
    return res.status(500).json({ error: 'Error serializing response' });
  }
}

// Create handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return safeJsonResponse(res, 405, { error: 'Method not allowed' });
  }

  try {
    // Extract the path from the URL
    const path = req.url || '';
    
    // Handle different API routes
    if (path.startsWith('/api/projects')) {
      // Check if it's a category request
      const categoryMatch = path.match(/\/api\/projects\/([^\/]+)/);
      if (categoryMatch) {
        const category = categoryMatch[1];
        const projects = await storage.getProjectsByCategory(category);
        return safeJsonResponse(res, 200, projects);
      } else {
        // Return all projects
        const projects = await storage.getProjects();
        return safeJsonResponse(res, 200, projects);
      }
    } 
    else if (path === '/api/publications') {
      try {
        const publications = await storage.getPublications();
        return safeJsonResponse(res, 200, publications);
      } catch (error) {
        console.error('Error fetching publications:', error);
        return safeJsonResponse(res, 500, { error: 'Failed to fetch publications' });
      }
    }
    else if (path === '/api/team') {
      try {
        const team = await storage.getTeamMembers();
        return safeJsonResponse(res, 200, team);
      } catch (error) {
        console.error('Error fetching team members:', error);
        return safeJsonResponse(res, 500, { error: 'Failed to fetch team members' });
      }
    }
    else if (path === '/api/students') {
      try {
        const students = await storage.getStudents();
        return safeJsonResponse(res, 200, students);
      } catch (error) {
        console.error('Error fetching students:', error);
        return safeJsonResponse(res, 500, { error: 'Failed to fetch students' });
      }
    }
    else {
      // Handle unknown routes
      return safeJsonResponse(res, 404, { error: 'Not found' });
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    return safeJsonResponse(res, 500, { error: 'Internal server error' });
  }
} 