# Research Findings: Cohere Chatbot Integration

**Feature**: Cohere Chatbot Integration
**Date**: 2026-01-24
**Status**: Resolved

## Constitution Conflict Resolution

### Issue Identified
The constitution mentions "OpenAI Agents SDK" and "OpenAI ChatKit" but the feature spec explicitly requires "Cohere API". This is a fundamental technology conflict that needs resolution.

### Decision: Update Constitution for Cohere Focus
- **Decision**: Modify the constitution to allow Cohere API instead of OpenAI, keeping the core architectural principles intact
- **Rationale**: The feature specification explicitly requires Cohere API integration, and the user has provided a specific COHERE_API_KEY. The core architectural principles (statelessness, user isolation, security) remain the same regardless of AI provider.
- **Alternatives considered**:
  - Keep OpenAI in constitution and change feature spec (rejected - user specifically wants Cohere)
  - Use both OpenAI and Cohere (rejected - adds unnecessary complexity)
  - Ignore constitution conflict (rejected - violates constitutional principles)

## Current Codebase Structure

### Backend Structure
- **Path**: `/backend/`
- **Key files**:
  - `main.py` (FastAPI app entry point)
  - `models/` (SQLModel models)
  - `api/endpoints/` (API routes)
  - `services/` (business logic)
  - `database/` (database connection)
  - `auth/` (Better Auth integration)

### Frontend Structure
- **Path**: `/frontend/`
- **Key files**:
  - `app/` (Next.js App Router pages)
  - `components/` (React components)
  - `lib/` (utility functions)
  - `styles/` (CSS/Tailwind styles)
  - `public/` (static assets)

## Better Auth User Model Access

### Decision: Use Better Auth API to Fetch User Info
- **Decision**: Access user name and email through Better Auth's API rather than storing in our own database
- **Rationale**: Maintains single source of truth for user information and leverages existing authentication infrastructure
- **Implementation**: Use Better Auth's session validation to get user details, then call user info endpoint if needed
- **Alternative**: Store user info in our database (rejected - creates data duplication and synchronization issues)

## Task Model Structure

### Current Task Model Understanding
- **Location**: `/backend/models/task.py`
- **Fields**:
  - id (int, primary key)
  - title (str)
  - description (str, optional)
  - completed (bool)
  - user_id (str, foreign key to user)
  - created_at (datetime)
  - updated_at (datetime)
- **Relationships**: Task belongs to User

## API Endpoint Structure

### Current Patterns
- **Auth endpoints**: `/api/auth/*` (handled by Better Auth)
- **Task endpoints**: `/api/tasks/*`
- **Pattern**: `/api/{resource}/{action}` with JWT authentication
- **Response format**: JSON with data/error handling

## Frontend API Client

### Current Implementation
- **Location**: `/frontend/lib/api.ts`
- **Pattern**: Functions that accept JWT tokens and make authenticated API calls
- **Structure**: Exported functions for each API endpoint with error handling

## Environment Configuration

### Current Variables
- `BETTER_AUTH_SECRET`: JWT secret for authentication
- `DATABASE_URL`: Connection string for Neon PostgreSQL
- **New Addition**: `COHERE_API_KEY`: API key for Cohere integration

## Implementation Approach

### Cohere Integration Strategy
- **Service Layer**: Create a Cohere service that handles API calls
- **Tool Integration**: Implement MCP-style tools that the Cohere agent can call
- **Task Operations**: Map natural language to existing task CRUD operations
- **User Isolation**: Ensure all Cohere operations are scoped to current user

### Database Extensions
- **Conversation Model**: Track chat sessions with user_id, created_at, status
- **Message Model**: Store individual messages with conversation_id, role (user/assistant), content, timestamp
- **Relationships**: Conversation 1-to-many Messages, both linked to user_id

### Frontend Integration
- **Floating Icon**: Use lucide-react Bot icon in bottom-right corner with sky-blue styling
- **Chat Panel**: Slide-in panel with message history and input
- **Tool Result Display**: Render task lists and operation results in chat interface
- **Responsive Design**: Maintain existing Tailwind theme with sky-blue accents

## Risk Assessment

### High-Risk Areas
1. **API Key Security**: Ensure COHERE_API_KEY is properly secured and not exposed to frontend
2. **User Isolation**: Critical to ensure users can't access each other's conversations
3. **Rate Limits**: Handle Cohere API rate limiting gracefully
4. **Error Handling**: Manage API failures without breaking existing functionality

### Mitigation Strategies
1. **Server-side only**: Keep Cohere API calls server-side, never expose key to frontend
2. **User_id validation**: Double-check user_id in every request against JWT
3. **Retry mechanisms**: Implement exponential backoff for API failures
4. **Graceful degradation**: Fallback to manual task operations if Cohere fails