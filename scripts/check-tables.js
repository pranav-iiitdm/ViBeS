#!/usr/bin/env node

// Script to verify that all database tables exist and have data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
  try {
    console.log(`Checking table: ${tableName}...`);
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' });

    if (error) {
      console.error(`Error accessing table ${tableName}:`, error);
      return false;
    }

    console.log(`Table ${tableName} exists with ${data.length} rows`);
    if (data.length > 0) {
      console.log('Sample row:', JSON.stringify(data[0], null, 2));
    }
    return true;
  } catch (error) {
    console.error(`Exception checking table ${tableName}:`, error);
    return false;
  }
}

async function main() {
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Supabase Key: ${supabaseKey.substring(0, 10)}...`);
  
  const tables = ['projects', 'publications', 'team_members', 'students'];
  
  for (const table of tables) {
    await checkTable(table);
    console.log('-'.repeat(50));
  }
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 