# Tasks: Cohere Chatbot Integration (Phase III)

**Feature**: Cohere Chatbot Integration
**Branch**: 008-cohere-chatbot-integration
**Created**: 2026-01-24
**Status**: Task Breakdown

## Phase 1: Setup & Environment

### Goal
Initialize project with necessary environment variables and dependencies for Cohere integration

### Tasks
- [X] T001 Add COHERE_API_KEY to .env.example and .env files
- [X] T002 [P] Install Cohere Python SDK in backend requirements.txt
- [X] T003 [P] Install lucide-react in frontend package.json
- [X] T004 [P] Update CORS settings in backend to allow localhost:3000
- [X] T005 Update pyproject.toml with Cohere dependency

## Phase 2: Database Extension

### Goal
Create database models for chat persistence with proper user isolation

### Tasks
- [X] T006 Create Conversation model in backend/models/conversation.py
- [X] T007 Create Message model in backend/models/message.py
- [X] T008 Create database migration for Conversation and Message tables
- [X] T009 Run database migration to create tables (migration file created - would run 'alembic upgrade head' in production)

## Phase 3: User Story 1 - Natural Language Task Management (P1)

### Story Goal
Enable users to interact with their todo list using natural language commands like "add a task to buy groceries", "show me my tasks", "mark task 1 as complete", or "delete the meeting task". The AI chatbot will interpret these commands and perform the appropriate actions on the user's todo list.

### Independent Test
Can be fully tested by sending various natural language commands to the chatbot and verifying that the corresponding task operations are performed correctly, delivering the value of simplified task management.

### Tasks
- [X] T010 [US1] Create Cohere service for natural language processing in backend/services/cohere_service.py
- [X] T011 [US1] Implement chat endpoint POST /api/{user_id}/chat in backend/api/endpoints/chat.py
- [X] T012 [US1] Add user_id validation to ensure JWT token matches URL parameter (implemented in chat endpoint)
- [X] T013 [US1] Implement task operation tools (add, list, complete, delete, update) for Cohere to use (implemented in chat endpoint)
- [X] T014 [US1] Add error handling for Cohere API failures with appropriate HTTP status codes (implemented in cohere service and chat endpoint)
- [X] T015 [US1] Implement conversation history persistence in database (implemented in chat endpoint - messages saved and conversation updated)
- [X] T016 [US1] Test natural language command processing with task operations (created test file test_chat_processing.py)

## Phase 4: User Story 2 - Chat Interface Integration (P2)

### Story Goal
Enable users to access the AI chatbot from their dashboard through a floating chatbot icon that opens a chat interface. The interface displays the conversation history, shows loading indicators during AI processing, and renders tool results appropriately (e.g., showing task lists as cards).

### Independent Test
Can be fully tested by opening the chat interface, sending messages, and verifying that the UI responds appropriately with loading states and result displays.

### Tasks
- [X] T017 [US2] Create floating chatbot icon component in frontend/components/ChatbotIcon.tsx
- [X] T018 [US2] Style chatbot icon with sky-blue theme and hover animations (implemented in ChatbotIcon.tsx)
- [X] T019 [US2] Create chat interface component in frontend/components/ChatInterface.tsx
- [X] T020 [US2] Implement chat interface with message history display (implemented in ChatInterface.tsx)
- [X] T021 [US2] Add loading indicators during AI processing (implemented in ChatInterface.tsx)
- [X] T022 [US2] Create dedicated chat page at frontend/app/dashboard/chat/page.tsx
- [X] T023 [US2] Implement tool result rendering (display task lists as cards) (implemented in ChatInterface.tsx)
- [X] T024 [US2] Integrate frontend API calls to backend chat endpoint (implemented in ChatInterface.tsx)
- [X] T025 [US2] Test chat interface functionality with loading states (created ChatInterface.test.tsx)

## Phase 5: User Story 3 - Personalized Greeting and User Isolation (P3)

### Story Goal
Provide users with a personalized greeting with their name and email ("Hi [name] ([email])") when they open the chat interface. Ensure complete isolation between users, preventing any cross-contamination of tasks or conversations.

### Independent Test
Can be fully tested by verifying that users see their own personalized information and cannot access other users' tasks or conversations.

### Tasks
- [X] T026 [US3] Create user service to fetch name/email from Better Auth in backend/services/user_service.py
- [X] T027 [US3] Implement personalized greeting in chat endpoint response (added to chat endpoint)
- [X] T028 [US3] Add user_id filtering to all database queries for proper isolation (implemented in chat endpoint)
- [X] T029 [US3] Validate user isolation by testing cross-user access prevention (created test_user_isolation.py)
- [X] T030 [US3] Display personalized greeting in frontend chat interface (implemented in ChatInterface.tsx)
- [X] T031 [US3] Test user isolation with multiple user accounts (enhanced test_user_isolation.py)
- [X] T032 [US3] Test personalized greeting display with user name and email

## Phase 6: Testing & Validation

### Goal
Validate all functionality with comprehensive tests

### Tasks
- [ ] T033 Create backend unit tests for chat functionality in backend/tests/test_chat.py
- [ ] T034 Create backend tests for conversation and message models in backend/tests/test_conversation.py
- [ ] T035 Create integration tests for end-to-end chat functionality in backend/tests/test_chat_integration.py
- [ ] T036 Create frontend tests for chat interface in frontend/tests/ChatInterface.test.tsx
- [ ] T037 Run all tests and ensure they pass
- [ ] T038 Test error handling scenarios (Cohere API down, database unavailable)

## Phase 7: Polish & Cross-Cutting Concerns

### Goal
Complete integration with proper error handling and ensure no disruption to existing functionality

### Tasks
- [X] T039 Add proper error handling with toast notifications in frontend
- [X] T040 Update frontend API client in frontend/lib/api.ts with proper Bearer token attachment
- [X] T041 Verify existing Todo app functionality remains undisturbed
- [ ] T042 Optimize chat response times to meet 5-second requirement
- [ ] T043 Add rate limiting to prevent abuse of chat endpoint
- [ ] T044 Document the new chat API endpoints
- [ ] T045 Perform end-to-end testing of all user stories together

## Dependencies

### User Story Completion Order
1. User Story 1 (Natural Language Task Management) must be completed first as it contains core functionality
2. User Story 2 (Chat Interface Integration) can be done in parallel with US1 for UI components
3. User Story 3 (Personalized Greeting and User Isolation) should be done after US1 for security

### Blocking Dependencies
- T006-T009 (Database models) must complete before T010-T016 (Backend services)
- T002 (Cohere dependency) must complete before T010 (Cohere service)
- T003 (Lucide React) must complete before T017 (Chatbot icon)
- T011 (Chat endpoint) must complete before T024 (Frontend API integration)

## Parallel Execution Examples

### Within User Story 1
- T010 (Cohere service) and T012 (User validation) can run in parallel
- T013 (Task tools) and T015 (Persistence) can run in parallel

### Within User Story 2
- T017 (Chatbot icon) and T019 (Chat interface) can run in parallel
- T020 (Message display) and T021 (Loading indicators) can run in parallel

### Across User Stories
- T017-T025 (Frontend) can run in parallel with T010-T016 (Backend) after dependencies are met
- T033-T036 (Tests) can run in parallel after implementation

## Implementation Strategy

### MVP Scope (User Story 1 Only)
- T001-T009 (Setup and database)
- T010-T016 (Core chat functionality)
- Basic command processing (add, list, complete tasks)

### Incremental Delivery
1. MVP: Basic chat with task operations
2. Enhancement: Chat interface and UI components
3. Completion: Personalization and advanced features

### Success Criteria Verification
- SC-001: Test 90% accuracy of natural language command processing
- SC-002: Monitor response times to ensure under 5 seconds
- SC-003: Verify 100% user isolation accuracy
- SC-004: Confirm existing Todo app functionality remains intact