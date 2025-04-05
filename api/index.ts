import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MemStorage } from '../server/storage';

// Create a new storage instance
const storage = new MemStorage();

// Create handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`Vercel handler called: ${req.method} ${req.url}`);
  
  try {
    // Extract the path from the URL
    const path = req.url || '';
    
    // Handle different API routes
    if (path.startsWith('/api/projects')) {
      // Check if it's a category request
      const categoryMatch = path.match(/\/api\/projects\/([^\/]+)/);
      if (categoryMatch) {
        const category = categoryMatch[1];
        console.log(`Fetching projects for category: ${category}`);
        const projects = await storage.getProjectsByCategory(category);
        console.log(`Found ${projects.length} projects for category ${category}`);
        return res.status(200).json(projects);
      } else {
        // Return all projects
        console.log('Fetching all projects');
        const projects = await storage.getProjects();
        console.log(`Found ${projects.length} projects`);
        return res.status(200).json(projects);
      }
    } 
    else if (path === '/api/publications') {
      console.log('Fetching all publications');
      try {
        const publications = await storage.getPublications();
        console.log(`Found ${publications.length} publications`);
        return res.status(200).json(publications);
      } catch (error) {
        console.error('Error fetching publications:', error);
        return res.status(500).json({ error: 'Failed to fetch publications' });
      }
    }
    else if (path === '/api/team') {
      console.log('Fetching all team members');
      try {
        const team = await storage.getTeamMembers();
        console.log(`Found ${team.length} team members`);
        return res.status(200).json(team);
      } catch (error) {
        console.error('Error fetching team members:', error);
        return res.status(500).json({ error: 'Failed to fetch team members' });
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
        return res.status(500).json({ error: 'Failed to fetch students' });
      }
    }
    else {
      // Handle unknown routes
      console.log(`Unknown route: ${path}`);
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 