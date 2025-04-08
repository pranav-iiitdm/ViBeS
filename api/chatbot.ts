import { RAGChatbot } from '../chatbot/rag_chatbot';

// Initialize chatbot
const chatbot = new RAGChatbot();

export async function POST(request: Request) {
    try {
        const { text } = await request.json();
        
        if (!text) {
            return new Response(JSON.stringify({ error: 'No text provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const response = await chatbot.chat(text);
        
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