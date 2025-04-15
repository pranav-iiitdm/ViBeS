import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Setup global error monitoring for fetch requests
const originalFetch = window.fetch;
window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
  const inputUrl = typeof input === 'string' ? input : 
                   input instanceof URL ? input.toString() : 
                   'Request' in window && input instanceof Request ? input.url : String(input);
  
  console.log(`[Network] Fetch request to: ${inputUrl}`);
  try {
    const response = await originalFetch(input, init);
    if (!response.ok) {
      console.error(`[Network Error] Request failed: ${response.status} ${response.statusText}`, {
        url: inputUrl,
        method: init?.method || 'GET',
        status: response.status,
        statusText: response.statusText
      });
    }
    return response;
  } catch (error) {
    console.error('[Network Error] Request exception:', error, {
      url: inputUrl,
      method: init?.method || 'GET'
    });
    throw error;
  }
};

// Log environment information
console.log('[Environment]', {
  apiUrl: import.meta.env.VITE_API_URL,
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  baseUrl: document.location.origin
});

createRoot(document.getElementById("root")!).render(<App />);
