# ViBeS Research Lab Chatbot

This is a RAG (Retrieval Augmented Generation) based chatbot for the ViBeS Research Lab website. The chatbot uses the Groq API for generation and FAISS for vector storage and retrieval.

## Features

- Semantic search across research projects
- Context-aware responses using RAG
- Beautiful chat interface
- Real-time chat interaction
- Suggestion of relevant research projects
- Easy website integration

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the chatbot directory with your Groq API key:
```
GROQ_API_KEY=your_api_key_here
```

## Running the Backend

1. Make sure you're in the chatbot directory:
```bash
cd ViBeS/chatbot
```

2. Start the FastAPI backend:
```bash
python api.py
```

The backend will run on http://localhost:8000

## Website Integration

1. Copy the `static/chatbot.js` file to your website's static files directory.

2. Add the following HTML to your website where you want the chatbot to appear:
```html
<!-- Chatbot container -->
<div id="vibes-chatbot"></div>

<!-- Load the chatbot script -->
<script src="path/to/chatbot.js"></script>
<script>
    // Initialize the chatbot with your backend URL
    const chatbot = new ViBeSChatbot('vibes-chatbot', 'http://your-backend-url:8000');
</script>
```

3. Make sure to replace `'http://your-backend-url:8000'` with your actual backend URL in production.

## Usage

- The chatbot will appear as a floating widget in the bottom-right corner of your website
- Users can click the minimize button (−) to collapse the chat window
- The chatbot will help users:
  - Find specific research projects
  - Learn about authors and their work
  - Explore research categories
  - Get general information about the lab

## Technical Details

- Uses `sentence-transformers` for text embeddings
- FAISS for efficient vector similarity search
- Groq API for text generation
- FastAPI backend for serving the chatbot
- Vanilla JavaScript frontend for easy integration

## Data Structure

The chatbot uses the `structured_website_data.jsonl` file which contains information about research projects in the following format:
```json
{
    "title": "Project Title",
    "abstract": "Project Abstract",
    "authors": "Author Names",
    "category": "Research Category",
    "Dataset": "Dataset URL",
    "GitHub": "GitHub URL",
    "date": "Publication Date"
}
```

## Production Deployment

For production deployment:

1. Update the CORS settings in `api.py` to only allow requests from your website's domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-website.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. Use a production-grade ASGI server like Gunicorn with Uvicorn workers:
```bash
gunicorn api:app -w 4 -k uvicorn.workers.UvicornWorker
```

3. Set up a reverse proxy (e.g., Nginx) to handle HTTPS and serve the static files. 