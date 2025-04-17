import { chatbotServicev5, chatbotServicev5Ready } from '../server/chatbot_v5';

// Initialize chatbot
const chatbot = chatbotServicev5;

export async function POST(request: Request) {
    try {
        // Ensure chatbot is fully initialized before handling any requests
        await chatbotServicev5Ready;
        const { text } = await request.json();
        
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return new Response(JSON.stringify({ 
                error: 'Text is required and must be a non-empty string' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            console.log("[API] Calling chatbot.ensureInitialized()...");
            await chatbot.ensureInitialized(); // Wait for initialization
            console.log("[API] chatbot.ensureInitialized() complete.");
            const response = await chatbot.processQuery(text.trim());
            
            // Check if response indicates initialization or other known issues
            if (typeof response !== 'string') {
                console.error('Chatbot service returned unexpected response type:', typeof response, response);
                return new Response(JSON.stringify({
                    error: 'Internal Server Error',
                    message: 'Received unexpected response format from chatbot service.'
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            if (response.includes('still initializing')) {
                console.warn('Chatbot service reported: still initializing');
                return new Response(JSON.stringify({
                    error: 'Service Unavailable',
                    message: response, // Keep original message
                    retryAfter: 5
                }), {
                    status: 503,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Retry-After': '5'
                    },
                });
            }
            
            // Add more specific checks if chatbotServicev5 provides them
            if (response.includes('not properly initialized') || response.includes('Neo4j not available')) {
                 console.error('Chatbot service reported initialization or connection error:', response);
                return new Response(JSON.stringify({
                    error: 'Service Configuration Error',
                    message: 'Chatbot service is not properly configured or connected.' // More generic message to client
                }), {
                    status: 500, // Internal error, not just unavailable
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Success case
            return new Response(JSON.stringify({ response }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } catch (error) {
            // Log the specific error from processQuery
            console.error('Error during chatbot.processQuery:', error);
            
            // Determine the status code based on the error if possible
            // For now, stick to 503 as it indicates a backend service issue
            let statusCode = 503;
            let errorMessage = 'Chatbot processing error';
            let retryAfter = '5'; // Default retry

            // Customize based on potential error types if needed in the future
            // if (error instanceof Neo4jError) { ... }

            return new Response(JSON.stringify({ 
                error: errorMessage,
                details: error instanceof Error ? error.message : String(error) // Provide error details for server logs
            }), {
                status: statusCode,
                headers: { 
                    'Content-Type': 'application/json',
                    'Retry-After': retryAfter
                },
            });
        }
    } catch (error) {
        console.error('API endpoint error:', error);
        return new Response(JSON.stringify({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}