import { createClient } from '@supabase/supabase-js';
import { initialProjects, initialPublications, initialTeamMembers, initialStudents } from '../server/storage';

// Initialize Supabase client with hardcoded values
const supabaseUrl = 'https://prvxwtmfhioigdipjuiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydnh3dG1maGlvaWdkaXBqdWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODU4ODYsImV4cCI6MjA1OTY2MTg4Nn0.p7kkTRgUeJAqlPBKdoctKqSJRMlkONVpMESxPnM2CMw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to transform data to match database column names
function transformData(table: string, data: any[]): any[] {
  console.log(`Transforming ${table} data...`);
  
  switch (table) {
    case 'projects':
      return data.map(item => ({
        id: item.id,
        title: item.title,
        abstract: item.abstract,
        authors: item.authors,
        dataset_link: item.datasetLink,
        github_link: item.githubLink,
        date: item.date,
        category: item.category
      }));
    
    case 'publications':
      return data.map(item => ({
        id: item.id,
        title: item.title,
        authors: item.authors,
        year: item.year,
        venue: item.venue,
        link: item.link,
        abstract: item.abstract,
        type: item.type
      }));
    
    case 'team_members':
      return data.map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        bio: item.bio,
        image: item.image,
        google_scholar_url: item.googleScholarUrl,
        research_gate_url: item.researchGateUrl,
        research_interests: item.researchInterests,
        linkedin_url: item.linkedinUrl,
        additional_info: item.additionalInfo
      }));
    
    case 'students':
      return data.map(item => ({
        id: item.id,
        name: item.name,
        bio: item.bio,
        projects: item.projects,
        research_interests: item.researchInterests,
        image: item.image,
        category: item.category,
        additional_info: item.additionalInfo,
        google_scholar_url: item.googleScholarUrl,
        research_gate_url: item.researchGateUrl,
        linkedin_url: item.linkedinUrl
      }));
    
    default:
      return data;
  }
}

// Function to validate data before insertion
function validateData(table: string, data: any[]): boolean {
  console.log(`Validating ${table} data...`);
  for (const item of data) {
    if (!item.id) {
      console.error(`Missing id in ${table} item:`, item);
      return false;
    }
    // Add more specific validation based on table
    switch (table) {
      case 'projects':
        if (!item.title || !item.authors) {
          console.error(`Missing required fields in project:`, item);
          return false;
        }
        break;
      case 'publications':
        if (!item.title || !item.authors || !item.year) {
          console.error(`Missing required fields in publication:`, item);
          return false;
        }
        break;
      case 'team_members':
        if (!item.name || !item.role) {
          console.error(`Missing required fields in team member:`, item);
          return false;
        }
        break;
      case 'students':
        if (!item.name || !item.bio) {
          console.error(`Missing required fields in student:`, item);
          return false;
        }
        break;
    }
  }
  return true;
}

// Function to check if tables exist
async function checkTables() {
  console.log('Checking table structure...');
  const tables = ['projects', 'publications', 'team_members', 'students'] as const;
  const missingTables: string[] = [];

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error) {
        console.error(`Error checking ${table} table:`, error);
        missingTables.push(table);
      }
    } catch (error) {
      console.error(`Error checking ${table} table:`, error);
      missingTables.push(table);
    }
  }

  if (missingTables.length > 0) {
    console.error('Missing tables:', missingTables);
    console.log('\nPlease create the following tables in your Supabase database:');
    console.log(`
-- Create projects table
CREATE TABLE public.projects (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT[] NOT NULL,
  dataset_link TEXT,
  github_link TEXT,
  date TEXT,
  category TEXT
);

-- Create publications table
CREATE TABLE public.publications (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  year INTEGER NOT NULL,
  venue TEXT,
  link TEXT,
  abstract TEXT,
  type TEXT
);

-- Create team_members table
CREATE TABLE public.team_members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  google_scholar_url TEXT,
  research_gate_url TEXT,
  research_interests TEXT[],
  linkedin_url TEXT,
  additional_info TEXT
);

-- Create students table
CREATE TABLE public.students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  projects JSONB,
  research_interests TEXT[],
  image TEXT,
  category TEXT,
  additional_info TEXT,
  google_scholar_url TEXT,
  research_gate_url TEXT,
  linkedin_url TEXT
);
    `);
    return false;
  }
  return true;
}

// Function to migrate data without transaction support
async function migrateData() {
  console.log('Starting data migration...');

  // First check if tables exist
  const tablesExist = await checkTables();
  if (!tablesExist) {
    console.log('Please create the tables first and run the migration again.');
    return;
  }

  try {
    // Migrate projects
    console.log('\nMigrating projects...');
    if (validateData('projects', initialProjects)) {
      const transformedProjects = transformData('projects', initialProjects);
      const { error: projectsError } = await supabase
        .from('projects')
        .upsert(transformedProjects, { onConflict: 'id' });
      
      if (projectsError) {
        console.error('Error inserting projects:', projectsError);
      } else {
        console.log(`Successfully inserted ${initialProjects.length} projects`);
      }
    }

    // Migrate publications
    console.log('\nMigrating publications...');
    if (validateData('publications', initialPublications)) {
      const transformedPublications = transformData('publications', initialPublications);
      const { error: publicationsError } = await supabase
        .from('publications')
        .upsert(transformedPublications, { onConflict: 'id' });
      
      if (publicationsError) {
        console.error('Error inserting publications:', publicationsError);
      } else {
        console.log(`Successfully inserted ${initialPublications.length} publications`);
      }
    }

    // Migrate team members
    console.log('\nMigrating team members...');
    if (validateData('team_members', initialTeamMembers)) {
      const transformedTeamMembers = transformData('team_members', initialTeamMembers);
      const { error: teamError } = await supabase
        .from('team_members')
        .upsert(transformedTeamMembers, { onConflict: 'id' });
      
      if (teamError) {
        console.error('Error inserting team members:', teamError);
      } else {
        console.log(`Successfully inserted ${initialTeamMembers.length} team members`);
      }
    }

    // Migrate students
    console.log('\nMigrating students...');
    if (validateData('students', initialStudents)) {
      const transformedStudents = transformData('students', initialStudents);
      const { error: studentsError } = await supabase
        .from('students')
        .upsert(transformedStudents, { onConflict: 'id' });
      
      if (studentsError) {
        console.error('Error inserting students:', studentsError);
      } else {
        console.log(`Successfully inserted ${initialStudents.length} students`);
      }
    }

    console.log('\nMigration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateData().catch(console.error); 