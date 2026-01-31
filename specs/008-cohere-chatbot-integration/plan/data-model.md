# Data Model: Cohere Chatbot Integration

**Feature**: Cohere Chatbot Integration
**Date**: 2026-01-24
**Status**: Final

## Entities

### Conversation
**Description**: Represents a user's chat session with the AI assistant

**Fields**:
- `id` (int, auto-increment, primary key)
- `user_id` (str, foreign key to user, required) - Links to the user who owns this conversation
- `title` (str, optional) - Auto-generated title based on first message or topic
- `created_at` (datetime, required) - Timestamp when conversation started
- `updated_at` (datetime, required) - Timestamp when last message was added
- `is_active` (bool, default: true) - Whether the conversation is currently active

**Validation Rules**:
- `user_id` must match authenticated user's ID
- `created_at` is set automatically on creation
- `updated_at` is updated automatically on any changes

**State Transitions**:
- Active (default) → Archived (when user explicitly archives or system cleanup)

### Message
**Description**: Represents individual messages within a conversation

**Fields**:
- `id` (int, auto-increment, primary key)
- `conversation_id` (int, foreign key to Conversation, required)
- `role` (str, required) - Either "user" or "assistant" or "tool"
- `content` (str, required) - The actual message content
- `timestamp` (datetime, required) - When the message was created
- `tool_call` (dict, optional) - Contains tool name and parameters if this was a tool call
- `tool_response` (dict, optional) - Contains tool response if this is a tool result

**Validation Rules**:
- `conversation_id` must exist in Conversations table
- `role` must be one of: "user", "assistant", "tool"
- `content` must not be empty
- `timestamp` is set automatically on creation

**State Transitions**:
- Immutable once created (messages are append-only)

### Relationship Diagram
```
User (user_id) 1 ←→ * Conversation (user_id)
Conversation (id) 1 ←→ * Message (conversation_id)
```

## Indexes

### Required Indexes
- `conversations.user_id` - For efficient user-based queries
- `conversations.updated_at` - For ordering conversations by recency
- `messages.conversation_id` - For retrieving conversation history
- `messages.timestamp` - For ordering messages chronologically

## Constraints

### Foreign Key Constraints
- `conversations.user_id` → `users.id` (on delete CASCADE)
- `messages.conversation_id` → `conversations.id` (on delete CASCADE)

### Data Integrity
- All timestamps are stored in UTC
- Content fields are limited to 10,000 characters maximum
- Conversation titles are limited to 200 characters maximum

## Access Patterns

### Primary Queries
1. **Get user's active conversations**: `SELECT * FROM conversations WHERE user_id = ? AND is_active = true ORDER BY updated_at DESC`
2. **Get conversation history**: `SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC`
3. **Add new message**: `INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)`
4. **Create conversation**: `INSERT INTO conversations (user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?)`

### Security Checks
- Every query must validate that `user_id` matches the authenticated user
- No cross-user access allowed without explicit permission system