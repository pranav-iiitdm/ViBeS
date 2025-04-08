class ViBeSChatbot {
    constructor(containerId, apiUrl = 'http://localhost:8000') {
        this.container = document.getElementById(containerId);
        this.apiUrl = apiUrl;
        this.messages = [];
        this.init();
    }

    init() {
        // Create chat container
        this.container.innerHTML = `
            <div class="vibes-chat-container">
                <div class="vibes-chat-header">
                    <h3>ViBeS Research Lab Assistant</h3>
                    <button class="vibes-chat-toggle">−</button>
                </div>
                <div class="vibes-chat-messages"></div>
                <div class="vibes-chat-input">
                    <input type="text" placeholder="Ask about our research projects...">
                    <button class="vibes-chat-send">Send</button>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .vibes-chat-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                font-family: Arial, sans-serif;
            }

            .vibes-chat-header {
                padding: 15px;
                background: #2c3e50;
                color: white;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .vibes-chat-header h3 {
                margin: 0;
                font-size: 16px;
            }

            .vibes-chat-toggle {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
            }

            .vibes-chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
            }

            .vibes-chat-message {
                margin-bottom: 10px;
                padding: 10px;
                border-radius: 10px;
                max-width: 80%;
            }

            .vibes-chat-message.user {
                background: #e3f2fd;
                margin-left: auto;
            }

            .vibes-chat-message.bot {
                background: #f5f5f5;
                margin-right: auto;
            }

            .vibes-chat-input {
                padding: 15px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }

            .vibes-chat-input input {
                flex: 1;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 5px;
                outline: none;
            }

            .vibes-chat-send {
                padding: 8px 15px;
                background: #2c3e50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            .vibes-chat-send:hover {
                background: #34495e;
            }

            .vibes-chat-loading {
                display: inline-block;
                margin-left: 10px;
            }

            .vibes-chat-loading::after {
                content: '...';
                animation: loading 1s infinite;
            }

            @keyframes loading {
                0% { content: '.'; }
                33% { content: '..'; }
                66% { content: '...'; }
            }
        `;
        document.head.appendChild(styles);

        // Initialize event listeners
        this.messagesContainer = this.container.querySelector('.vibes-chat-messages');
        this.input = this.container.querySelector('.vibes-chat-input input');
        this.sendButton = this.container.querySelector('.vibes-chat-send');
        this.toggleButton = this.container.querySelector('.vibes-chat-toggle');

        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.toggleButton.addEventListener('click', () => this.toggleChat());

        // Add welcome message
        this.addMessage('Hello! I can help you learn about ViBeS Research Lab projects. What would you like to know?', 'bot');
    }

    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        // Add user message
        this.addMessage(text, 'user');
        this.input.value = '';

        // Show loading state
        const loadingMessage = this.addMessage('Thinking', 'bot', true);

        try {
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();
            
            // Remove loading message and add bot response
            loadingMessage.remove();
            this.addMessage(data.response, 'bot');
        } catch (error) {
            loadingMessage.remove();
            this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
            console.error('Chat error:', error);
        }
    }

    addMessage(text, type, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `vibes-chat-message ${type}${isLoading ? ' vibes-chat-loading' : ''}`;
        messageDiv.textContent = text;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        return messageDiv;
    }

    toggleChat() {
        const messagesContainer = this.container.querySelector('.vibes-chat-messages');
        const inputContainer = this.container.querySelector('.vibes-chat-input');
        const isVisible = messagesContainer.style.display !== 'none';
        
        messagesContainer.style.display = isVisible ? 'none' : 'block';
        inputContainer.style.display = isVisible ? 'none' : 'flex';
        this.toggleButton.textContent = isVisible ? '+' : '−';
    }
} 