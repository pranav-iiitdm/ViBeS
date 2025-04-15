import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://prvxwtmfhioigdipjuiq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydnh3dG1maGlvaWdkaXBqdWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODU4ODYsImV4cCI6MjA1OTY2MTg4Nn0.p7kkTRgUeJAqlPBKdoctKqSJRMlkONVpMESxPnM2CMw"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 