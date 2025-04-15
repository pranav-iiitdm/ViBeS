import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://prvxwtmfhioigdipjuiq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydnh3dG1maGlvaWdkaXBqdWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODU4ODYsImV4cCI6MjA1OTY2MTg4Nn0.p7kkTRgUeJAqlPBKdoctKqSJRMlkONVpMESxPnM2CMw';

console.log('Supabase configuration:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Service Key: ${supabaseKey ? '[REDACTED]' : 'NOT PROVIDED'}`);
console.log(`Service Key Length: ${supabaseKey?.length || 0}`);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

let supabaseClient;

try {
  console.log('Initializing Supabase client...');
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  throw error;
}

export const supabase = supabaseClient;