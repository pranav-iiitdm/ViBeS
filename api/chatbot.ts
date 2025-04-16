import { chatbotServicev5 } from '../server/chatbot_v5';

// Initialize chatbot
const chatbot = chatbotServicev5;

export async function POST(request: Request) {
    try {
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
            const response = await chatbot.processQuery(text.trim());
            
            // Check if response indicates initialization or other known issues
            if (response.includes('still initializing')) {
                return new Response(JSON.stringify({
                    error: 'Service Unavailable',
                    message: response,
                    retryAfter: 5
                }), {
                    status: 503,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Retry-After': '5'
                    },
                });
            }
            
            if (response.includes('not properly initialized')) {
                return new Response(JSON.stringify({
                    error: 'Service Configuration Error',
                    message: response
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            return new Response(JSON.stringify({ response }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Chatbot processing error:', error);
            return new Response(JSON.stringify({ 
                error: 'Chatbot processing error',
                details: error instanceof Error ? error.message : String(error)
            }), {
                status: 503,
                headers: { 
                    'Content-Type': 'application/json',
                    'Retry-After': '5'
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