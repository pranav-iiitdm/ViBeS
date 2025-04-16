import { chatbotServicev5 } from '../../server/chatbot_v5';

let isInitialized = false;

export async function GET() {
    try {
        // Prevent multiple initialization requests
        if (!isInitialized) {
            console.log("API: Starting chatbot warm-up");
            
            // Fire and forget - don't wait for completion
            chatbotServicev5.initializeForClient()
                .then(() => {
                    console.log("API: Chatbot warm-up complete");
                    isInitialized = true;
                })
                .catch((err) => {
                    console.error("API: Chatbot warm-up failed:", err);
                    // Reset flag so future requests can try again
                    isInitialized = false;
                });
        } else {
            console.log("API: Chatbot already being initialized");
        }
        
        // Return success immediately to not block the client
        return new Response(JSON.stringify({ status: "Chatbot warm-up initiated" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('API chatbot init error:', error);
        return new Response(JSON.stringify({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 