import { chatbotServicev5 } from '../server/chatbot_v5';

// Initialize chatbot
const chatbot = chatbotServicev5;

export async function POST(request: Request) {
    try {
        const { text } = await request.json();
        
        if (!text) {
            return new Response(JSON.stringify({ error: 'No text provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            const response = await chatbot.processQuery(text);
            
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
                headers: { 'Content-Type': 'application/json' },
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