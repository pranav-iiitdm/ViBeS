import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MemStorage } from '../server/storage';

// Create a new storage instance
const storage = new MemStorage();

// Create handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Basic request logging
  console.log(`Request: ${req.method} ${req.url}`);
  
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
        return res.status(200).json(projects);
      } else {
        // Return all projects
        const projects = await storage.getProjects();
        return res.status(200).json(projects);
      }
    } 
    else if (path === '/api/publications') {
      try {
        const publications = await storage.getPublications();
        return res.status(200).json(publications);
      } catch (error) {
        console.error('Error fetching publications:', error);
        return res.status(500).json({ error: 'Failed to fetch publications' });
      }
    }
    else if (path === '/api/team') {
      try {
        const team = await storage.getTeamMembers();
        return res.status(200).json(team);
      } catch (error) {
        console.error('Error fetching team members:', error);
        return res.status(500).json({ error: 'Failed to fetch team members' });
      }
    }
    else if (path === '/api/students') {
      try {
        const students = await storage.getStudents();
        return res.status(200).json(students);
      } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ error: 'Failed to fetch students' });
      }
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