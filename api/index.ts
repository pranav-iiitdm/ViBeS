import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { MemStorage } from '../server/storage';

// Create a new storage instance for each request
// This ensures the storage is properly initialized in the serverless environment
const storage = new MemStorage();

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.url}`);
  next();
});

// Register routes with the storage instance
registerRoutes(app, storage);

// Create handler for Vercel
export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`Vercel handler called: ${req.method} ${req.url}`);
  
  // Convert Vercel request to Express request
  const expressReq = req as any;
  const expressRes = res as any;
  
  // Forward the request to Express app
  return new Promise((resolve, reject) => {
    app(expressReq, expressRes, (err: any) => {
      if (err) {
        console.error('Error in API handler:', err);
        return reject(err);
      }
      return resolve(undefined);
    });
  });
} 