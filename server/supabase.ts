import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://prvxwtmfhioigdipjuiq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydnh3dG1maGlvaWdkaXBqdWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODU4ODYsImV4cCI6MjA1OTY2MTg4Nn0.p7kkTRgUeJAqlPBKdoctKqSJRMlkONVpMESxPnM2CMw';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}); 