import { chatbotServiceV2 } from '../server/chatbot_v2';

// Initialize chatbot
const chatbot = chatbotServiceV2;

export async function POST(request: Request) {
    try {
        const { text } = await request.json();
        
        if (!text) {
            return new Response(JSON.stringify({ error: 'No text provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const response = await chatbot.processQuery(text);
        
        return new Response(JSON.stringify({ response }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Chatbot error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 