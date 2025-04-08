import React, { useEffect, useRef, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Message {
    text: string;
    type: 'user' | 'bot';
    isLoading?: boolean;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Hello! I can help you learn about ViBeS Research Lab projects. What would you like to know?', type: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { text: userMessage, type: 'user' }]);

        // Add loading message
        setMessages(prev => [...prev, { text: 'Thinking...', type: 'bot', isLoading: true }]);

        try {
            const response = await fetch(`${API_BASE_URL}/chatbot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: userMessage }),
            });

            const data = await response.json();
            
            // Remove loading message and add bot response
            setMessages(prev => {
                const filtered = prev.filter(msg => !msg.isLoading);
                return [...filtered, { text: data.response, type: 'bot' }];
            });
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => {
                const filtered = prev.filter(msg => !msg.isLoading);
                return [...filtered, { text: 'Sorry, I encountered an error. Please try again later.', type: 'bot' }];
            });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
            <div className="bg-[#2c3e50] text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">ViBeS Research Lab Assistant</h3>
                <button 
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white text-xl hover:text-gray-200"
                >
                    {isMinimized ? '+' : '−'}
                </button>
            </div>
            
            {!isMinimized && (
                <>
                    <div className="h-96 overflow-y-auto p-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                                    message.type === 'user'
                                        ? 'bg-blue-100 ml-auto'
                                        : 'bg-gray-100'
                                } ${message.isLoading ? 'animate-pulse' : ''}`}
                            >
                                {message.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about our research projects..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-[#2c3e50] text-white px-4 py-2 rounded-lg hover:bg-[#34495e] transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chatbot; 