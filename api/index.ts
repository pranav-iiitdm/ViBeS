import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    
    // Handle different API routes with hardcoded data
    if (path.startsWith('/api/projects')) {
      // Return hardcoded projects data
      const projects = [
        {
          id: 1,
          title: "Test Project 1",
          abstract: "This is a test project",
          authors: ["Test Author"],
          datasetLink: "https://example.com",
          githubLink: "https://github.com",
          date: "2024-01-01",
          category: "test"
        },
        {
          id: 2,
          title: "Test Project 2",
          abstract: "This is another test project",
          authors: ["Test Author 2"],
          datasetLink: "https://example.com",
          githubLink: "https://github.com",
          date: "2024-01-02",
          category: "test"
        }
      ];
      return res.status(200).json(projects);
    } 
    else if (path === '/api/publications') {
      // Return hardcoded publications data
      const publications = [
        {
          id: 1,
          title: "Test Publication 1",
          authors: ["Test Author"],
          year: 2024,
          venue: "Test Venue",
          link: "https://example.com",
          abstract: "This is a test publication",
          type: "journal"
        },
        {
          id: 2,
          title: "Test Publication 2",
          authors: ["Test Author 2"],
          year: 2024,
          venue: "Test Venue 2",
          link: "https://example.com",
          abstract: "This is another test publication",
          type: "conference"
        }
      ];
      return res.status(200).json(publications);
    }
    else if (path === '/api/team') {
      // Return hardcoded team members data
      const teamMembers = [
        {
          id: 1,
          name: "Test Team Member 1",
          role: "Test Role",
          bio: "This is a test team member",
          image: "https://example.com/image.jpg",
          googleScholarUrl: "https://scholar.google.com",
          researchGateUrl: "https://researchgate.net",
          linkedinUrl: "https://linkedin.com",
          researchInterests: ["Test Interest 1", "Test Interest 2"],
          additionalInfo: "This is additional info"
        },
        {
          id: 2,
          name: "Test Team Member 2",
          role: "Test Role 2",
          bio: "This is another test team member",
          image: "https://example.com/image2.jpg",
          googleScholarUrl: "https://scholar.google.com",
          researchGateUrl: "https://researchgate.net",
          linkedinUrl: "https://linkedin.com",
          researchInterests: ["Test Interest 3", "Test Interest 4"],
          additionalInfo: "This is more additional info"
        }
      ];
      return res.status(200).json(teamMembers);
    }
    else if (path === '/api/students') {
      // Return hardcoded students data
      const students = [
        {
          id: 1,
          name: "Test Student 1",
          bio: "This is a test student",
          projects: [
            { title: "Test Project 1", description: "This is a test project" },
            { title: "Test Project 2", description: "This is another test project" }
          ],
          researchInterests: ["Test Interest 1", "Test Interest 2"],
          image: "https://example.com/image.jpg",
          category: "test",
          additionalInfo: "This is additional info",
          googleScholarUrl: "https://scholar.google.com",
          researchGateUrl: "https://researchgate.net",
          linkedinUrl: "https://linkedin.com"
        },
        {
          id: 2,
          name: "Test Student 2",
          bio: "This is another test student",
          projects: [
            { title: "Test Project 3", description: "This is a third test project" }
          ],
          researchInterests: ["Test Interest 3", "Test Interest 4"],
          image: "https://example.com/image2.jpg",
          category: "test",
          additionalInfo: "This is more additional info",
          googleScholarUrl: "https://scholar.google.com",
          researchGateUrl: "https://researchgate.net",
          linkedinUrl: "https://linkedin.com"
        }
      ];
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