# Database Extension for Chatbot

## Purpose
Phase II ke existing DB mein Conversation aur Message models add karna taake chat history persist ho sake.

## Scope
- SQLModel models
- Migrations + indexes
- Neon PostgreSQL

## Responsibilities / Key Capabilities
1. Conversation model: id, user_id (str), created_at, updated_at
2. Message model: id, user_id, conversation_id (FK), role, content, created_at
3. Indexes add karna (user_id, conversation_id)
4. Migration scripts ya init code dena
5. Existing Task model ke saath compatible rakhna
6. Har query mein user_id filter mandatory
7. Async support FastAPI ke liye