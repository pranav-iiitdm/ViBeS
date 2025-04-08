import fs from 'fs';
import path from 'path';

interface Publication {
    page: string;
    title: string;
    abstract: string | null;
    authors: string | string[];
    Dataset?: string | null;
    GitHub?: string | null;
    date?: string | null;
    category?: string | null;
    year?: number | null;
    venue?: string | null;
    link?: string | null;
    type?: string | null;
}

interface TeamMember {
    page: string;
    name: string;
    role?: string;
    bio: string;
    projects?: Array<{
        title: string;
        description: string;
    }>;
    researchInterests: string[];
    category?: string;
    googleScholarUrl: string;
    researchGateUrl: string;
    linkedinUrl: string;
    additionalInfo: string;
}

function normalizeString(value: string | null | undefined): string | null {
    if (value === undefined || value === null || value === '') return null;
    return value.trim().replace(/\s+/g, ' ');
}

function normalizeAuthors(authors: string | string[]): string[] {
    if (Array.isArray(authors)) {
        return authors.map(author => author.trim());
    }
    return [authors.trim()];
}

function normalizeEntry(entry: any): Publication | TeamMember {
    const normalized: any = {};
    
    // Convert all empty strings and "null" strings to null
    for (const [key, value] of Object.entries(entry)) {
        if (key === 'authors') {
            normalized[key] = normalizeAuthors(value as string | string[]);
            continue;
        }
        
        if (typeof value === 'string') {
            normalized[key] = normalizeString(value);
        } else if (Array.isArray(value)) {
            normalized[key] = value.map(item => {
                if (typeof item === 'string') {
                    return normalizeString(item);
                }
                return item;
            }).filter(Boolean);
        } else {
            normalized[key] = value;
        }
    }

    // Ensure consistent field names
    if ('Dataset' in normalized) {
        normalized.dataset = normalized.Dataset;
        delete normalized.Dataset;
    }
    if ('GitHub' in normalized) {
        normalized.github = normalized.GitHub;
        delete normalized.GitHub;
    }

    return normalized;
}

function cleanJsonString(str: string): string {
  // Remove any BOM characters
  str = str.replace(/^\uFEFF/, '');
  
  // Replace smart quotes with regular quotes
  str = str.replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
  
  // Remove any non-printable characters except newlines and tabs
  str = str.replace(/[^\x20-\x7E\n\t]/g, '');
  
  // Remove any trailing commas in arrays and objects
  str = str.replace(/,\s*([\]}])/g, '$1');
  
  return str;
}

function tryParseJson(str: string): any {
  try {
    return JSON.parse(str);
  } catch (e) {
    // Try removing any trailing characters after the last closing brace
    const match = str.match(/^(\{.*\})/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {
        throw e; // If that didn't work, throw the original error
      }
    }
    throw e;
  }
}

function fixJsonl() {
  try {
    const inputPath = 'structured_website_data.jsonl';
    const outputPath = 'structured_website_data_fixed.jsonl';
    
    // Read file as buffer and decode with UTF-8
    const buffer = fs.readFileSync(inputPath);
    const data = buffer.toString('utf8');
    
    const lines = data.split('\n').filter(line => line.trim());
    let fixedLines: string[] = [];
    let processedCount = 0;
    let fixedCount = 0;
    
    lines.forEach((line, index) => {
      try {
        processedCount++;
        const cleanedLine = cleanJsonString(line);
        
        // Try to parse and fix the JSON
        const parsed = tryParseJson(cleanedLine);
        
        // Clean up the data
        const cleaned = {
          ...parsed,
          // Remove any undefined or null values
          ...Object.fromEntries(
            Object.entries(parsed).filter(([_, v]) => v != null && v !== '')
          ),
          // Ensure arrays are properly formatted
          ...(parsed.authors && { authors: Array.isArray(parsed.authors) ? parsed.authors : [parsed.authors] }),
          ...(parsed.researchInterests && { researchInterests: Array.isArray(parsed.researchInterests) ? parsed.researchInterests : [parsed.researchInterests] }),
          ...(parsed.projects && { projects: Array.isArray(parsed.projects) ? parsed.projects : [parsed.projects] })
        };
        
        const fixed = JSON.stringify(cleaned);
        fixedLines.push(fixed);
        fixedCount++;
      } catch (err) {
        console.error(`Error processing line ${index + 1}: ${err}`);
        // Log the problematic line for debugging
        console.error(`Problematic line: ${line}`);
      }
    });
    
    if (fixedLines.length > 0) {
      fs.writeFileSync(outputPath, fixedLines.join('\n') + '\n');
      console.log(`Successfully fixed JSONL file. Output saved to: ${outputPath}`);
    } else {
      console.error('No valid lines were processed. Output file not created.');
    }
    
    console.log(`Processed ${processedCount} lines, fixed ${fixedCount} lines`);
  } catch (err) {
    console.error('Failed to process JSONL file:', err);
  }
}

fixJsonl(); 