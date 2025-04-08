import streamlit as st
from rag_chatbot import RAGChatbot

# Set page config
st.set_page_config(
    page_title="ViBeS Research Lab Chatbot",
    page_icon="🤖",
    layout="wide"
)

# Initialize session state
if 'chatbot' not in st.session_state:
    st.session_state.chatbot = RAGChatbot()
if 'messages' not in st.session_state:
    st.session_state.messages = []

# Title and description
st.title("🤖 ViBeS Research Lab Assistant")
st.markdown("""
Welcome to the ViBeS Research Lab chatbot! I can help you learn about our research projects,
find specific topics, and suggest relevant research areas. Feel free to ask me anything about:
- Research projects and their details
- Authors and their work
- Research categories and topics
- General information about the lab
""")

# Chat interface
st.markdown("### Chat with the Assistant")

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("What would you like to know about ViBeS Research Lab?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # Display user message
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Get chatbot response
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = st.session_state.chatbot.chat(prompt)
            st.markdown(response)
    
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": response}) 