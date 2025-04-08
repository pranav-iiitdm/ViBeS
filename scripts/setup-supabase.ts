import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://prvxwtmfhioigdipjuiq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydnh3dG1maGlvaWdkaXBqdWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODU4ODYsImV4cCI6MjA1OTY2MTg4Nn0.p7kkTRgUeJAqlPBKdoctKqSJRMlkONVpMESxPnM2CMw";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');

    // Create projects table
    const { error: projectsError } = await supabase.rpc('create_projects_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          abstract TEXT NOT NULL,
          authors TEXT[] NOT NULL,
          dataset_link TEXT,
          github_link TEXT,
          date TEXT NOT NULL,
          category TEXT NOT NULL
        );
      `
    });
    if (projectsError) {
      console.error('Error creating projects table:', projectsError);
      return;
    }
    console.log('Projects table created successfully');

    // Create publications table
    const { error: publicationsError } = await supabase.rpc('create_publications_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS publications (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          authors TEXT[] NOT NULL,
          year INTEGER NOT NULL,
          venue TEXT NOT NULL,
          link TEXT,
          abstract TEXT,
          type TEXT NOT NULL
        );
      `
    });
    if (publicationsError) {
      console.error('Error creating publications table:', publicationsError);
      return;
    }
    console.log('Publications table created successfully');

    // Create team_members table
    const { error: teamMembersError } = await supabase.rpc('create_team_members_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS team_members (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          bio TEXT NOT NULL,
          image TEXT,
          google_scholar_url TEXT,
          research_gate_url TEXT,
          research_interests TEXT[],
          linkedin_url TEXT,
          additional_info TEXT
        );
      `
    });
    if (teamMembersError) {
      console.error('Error creating team_members table:', teamMembersError);
      return;
    }
    console.log('Team members table created successfully');

    // Create students table
    const { error: studentsError } = await supabase.rpc('create_students_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS students (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          degree TEXT NOT NULL,
          projects JSONB,
          research_interests TEXT[],
          image TEXT,
          category TEXT,
          additional_info TEXT,
          google_scholar_url TEXT,
          research_gate_url TEXT,
          linkedin_url TEXT
        );
      `
    });
    if (studentsError) {
      console.error('Error creating students table:', studentsError);
      return;
    }
    console.log('Students table created successfully');

    console.log('Database schema setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database schema:', error);
  }
}

setupDatabase(); 