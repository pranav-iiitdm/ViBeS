import { useState, useEffect } from "react";

interface EndpointResult {
  status?: number;
  success: boolean;
  contentType?: string | null;
  dataType?: string | null;
  isArray?: boolean;
  length?: number | null;
  error?: string | null;
}

interface DiagnosticResult {
  config: {
    clientTime: string;
    environment: string;
    apiBaseUrl: string;
    origin: string;
    userAgent: string;
  };
  endpoints: Record<string, EndpointResult>;
}

export default function DiagnosticTool() {
  const [results, setResults] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

  const runTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test configuration
      const config = {
        clientTime: new Date().toISOString(),
        environment: import.meta.env.MODE,
        apiBaseUrl,
        origin: window.location.origin,
        userAgent: navigator.userAgent
      };
      
      // Test API endpoints
      const endpoints = [
        'status',
        'projects',
        'publications',
        'team',
        'students'
      ];
      
      const endpointResults: Record<string, EndpointResult> = {};
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing endpoint: ${apiBaseUrl}/${endpoint}`);
          const response = await fetch(`${apiBaseUrl}/${endpoint}`);
          const status = response.status;
          
          let data = null;
          let parseError = null;
          
          try {
            data = await response.json();
          } catch (e: unknown) {
            parseError = e instanceof Error ? e.message : String(e);
          }
          
          endpointResults[endpoint] = {
            status,
            success: response.ok,
            contentType: response.headers.get('content-type'),
            dataType: data ? typeof data : null,
            isArray: Array.isArray(data),
            length: Array.isArray(data) ? data.length : null,
            error: parseError
          };
        } catch (e: unknown) {
          endpointResults[endpoint] = {
            success: false,
            error: e instanceof Error ? e.message : String(e)
          };
        }
      }
      
      // Assemble all results
      setResults({
        config,
        endpoints: endpointResults
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    runTest();
  }, []);
  
  if (loading) {
    return <div className="p-4 text-center">Running diagnostic tests...</div>;
  }
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg max-w-4xl mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">API Diagnostic Results</h2>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Configuration</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
          {results?.config ? JSON.stringify(results.config, null, 2) : 'No data'}
        </pre>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">API Endpoints</h3>
        {results?.endpoints && Object.entries(results.endpoints).map(([endpoint, data]) => (
          <div key={endpoint} className="mb-4">
            <h4 className="font-medium">{endpoint}</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
      
      <button
        onClick={runTest}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Run Tests Again
      </button>
    </div>
  );
} 