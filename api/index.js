import express from 'express';
import { SupabaseStorage } from '../server/storage.js';
import { registerRoutes } from '../server/routes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const storage = new SupabaseStorage();
registerRoutes(app, storage);

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});

export default app;