import { useState, useEffect } from "react";
import DiagnosticTool from "@/components/DiagnosticTool";

export default function Debug() {
  const [apiResults, setApiResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      const results: Record<string, any> = {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
      
      const endpoints = [
        'projects',
        'publications',
        'team',
        'students'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Directly fetching from ${apiBaseUrl}/${endpoint}`);
          const response = await fetch(`${apiBaseUrl}/${endpoint}`);
          
          if (!response.ok) {
            results[endpoint] = { 
              success: false, 
              status: response.status,
              error: `HTTP error: ${response.status} ${response.statusText}`
            };
            continue;
          }
          
          const data = await response.json();
          results[endpoint] = { 
            success: true,
            count: Array.isArray(data) ? data.length : '(not an array)',
            data: Array.isArray(data) ? data.slice(0, 1) : data // Just show first item
          };
        } catch (error) {
          results[endpoint] = { 
            success: false, 
            error: error instanceof Error ? error.message : String(error)
          };
        }
      }
      
      setApiResults(results);
      setLoading(false);
    }
    
    fetchAllData();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Debug Panel</h1>
      
      <h2 className="text-xl font-semibold mb-4">Direct API Results</h2>
      {loading ? (
        <p>Loading API data...</p>
      ) : (
        <div className="grid gap-4">
          {Object.entries(apiResults).map(([endpoint, result]) => (
            <div key={endpoint} className="border p-4 rounded">
              <h3 className="font-medium text-lg">{endpoint}</h3>
              <div className={`text-sm mt-1 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? 'Success' : 'Failed'}
              </div>
              <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto h-40">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Diagnostic Tool</h2>
        <DiagnosticTool />
      </div>
    </div>
  );
} 