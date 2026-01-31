# Quickstart Guide: Cohere Chatbot Integration

## Overview
This guide provides setup instructions for the Cohere Chatbot Integration feature that enables natural language task management in the Todo app.

## Prerequisites
- Node.js 18+ for frontend
- Python 3.9+ for backend
- Access to Neon PostgreSQL database
- Better Auth configured
- Cohere API key

## Environment Setup

### Backend (.env)
```bash
# Existing variables
BETTER_AUTH_SECRET=your_secret_here
DATABASE_URL=your_neon_db_url_here

# New variable for Cohere integration
COHERE_API_KEY=your_cohere_api_key_here
```

### Frontend (.env.local)
```bash
# Existing variables
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# New variable for Cohere domain (if needed)
NEXT_PUBLIC_COHERE_DOMAIN=https://api.cohere.ai
```

## Installation

### Backend Dependencies
```bash
cd backend
pip install cohere-sdk
# Add to requirements.txt if not already added
```

### Frontend Dependencies
```bash
cd frontend
npm install lucide-react
# Add to package.json if not already added
```

## Running the Application

### Backend
```bash
cd backend
# Apply database migrations
python -m alembic upgrade head
# Start the server
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

## Key Components

### Backend Endpoints
- `POST /api/{user_id}/chat` - Main chat endpoint for AI interactions
- `GET /api/{user_id}/conversations` - Get user's chat history
- `GET /api/{user_id}/conversations/{conversation_id}` - Get specific conversation

### Frontend Components
- `ChatbotIcon.tsx` - Floating chatbot icon in dashboard
- `ChatInterface.tsx` - Main chat UI component
- `/dashboard/chat` - Dedicated chat page

## Testing the Feature

1. Start both frontend and backend servers
2. Log in to the application
3. Click the sky-blue chatbot icon in the dashboard
4. Try natural language commands like:
   - "Add a task to buy groceries"
   - "Show me my tasks"
   - "Mark task 1 as complete"
   - "Delete the meeting task"

## Troubleshooting

### Common Issues
- **403 Forbidden**: Verify that the user_id in the URL matches the authenticated user
- **Cohere API errors**: Check that COHERE_API_KEY is properly set in backend .env
- **Database errors**: Run migrations to ensure Conversation/Message tables exist

### Logs
- Backend: Check server logs for API errors
- Frontend: Check browser console for client-side errors