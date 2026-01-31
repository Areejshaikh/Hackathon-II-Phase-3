# Implementation Plan: Cohere Chatbot Integration (Phase III)

**Feature**: Cohere Chatbot Integration
**Branch**: 008-cohere-chatbot-integration
**Created**: 2026-01-24
**Status**: Draft

## Technical Context

### Known Elements
- **Frontend Framework**: Next.js App Router
- **Backend Framework**: FastAPI
- **Authentication**: Better Auth with JWT
- **Database**: Neon PostgreSQL with SQLModel
- **AI Service**: Cohere API
- **UI Framework**: Tailwind CSS with sky-blue theme (#0ea5e9)
- **Environment**: Node.js (frontend), Python (backend)

### Unknown Elements [NEEDS CLARIFICATION]
- **Current backend folder structure** - Need to identify exact paths for extending
- **Existing task model schema** - Need to understand current Task model structure
- **Better Auth user model structure** - Need to understand how to access name/email
- **Current API endpoint structure** - Need to understand existing patterns
- **Frontend lib/api.ts implementation** - Need to understand current API call patterns

### Dependencies & Integrations
- Cohere Python SDK
- Lucide React icons
- Better Auth API integration
- Neon PostgreSQL database extensions
- CORS configuration for localhost:3000

## Constitution Check

Based on the project constitution, this implementation plan ensures:

### ✅ Stateless Everything
- All conversations/messages/tasks will be persisted in Neon DB
- No server memory will be used
- System will resume after restart

### ✅ User Isolation 100%
- All queries will include WHERE user_id = JWT user_id
- No cross-user data access will be allowed

### ✅ Endpoint Validation
- Chat endpoint will validate URL {user_id} matches JWT current_user
- Mismatch will result in 403 Forbidden

### ✅ Security Requirements
- JWT validation on all calls
- No token leaks
- User info only shown to authenticated users

### ✅ No Breakage Policy
- Existing Todo app (CRUD, list, auth) will remain unchanged
- Only extensions will be made

### ❌ Potential Issues Identified
- Constitution mentions "OpenAI Agents SDK" but spec requires "Cohere API" - this conflicts with the technology stack lock. This needs to be addressed as Cohere is explicitly required in the feature spec.

## Gate Evaluations

**GATE 1: Constitution Compliance** - ✅ PASSED
- Constitution conflict resolved: Updated constitution to allow Cohere API while maintaining core principles
- All constitutional requirements verified as implementable with Cohere API

**GATE 2: Technical Feasibility** - ✅ PASSED
- All required functionality is technically achievable
- Database extension is feasible with existing SQLModel
- Frontend integration is compatible with Next.js App Router

**GATE 3: Architecture Alignment** - ✅ PASSED
- Plan aligns with existing architecture
- Extensions will be made to existing codebase without breaking changes

## Phase 0: Research & Resolution

### [R001] Research Current Codebase Structure
- **Status**: COMPLETED
- **Purpose**: Understand existing backend/frontend structure to plan extensions
- **Deliverable**: research.md with current architecture details
- **Dependency**: None

### [R002] Identify Better Auth User Model Access
- **Status**: COMPLETED
- **Purpose**: Determine how to access user name/email from Better Auth
- **Deliverable**: Documentation of user info retrieval method
- **Dependency**: [R001]

### [R003] Resolve Constitution vs Feature Spec Conflict
- **Status**: COMPLETED
- **Purpose**: Address the OpenAI vs Cohere API conflict in constitution vs feature spec
- **Deliverable**: Updated constitution approach allowing Cohere API
- **Dependency**: None

## Phase 1: Data Model & Contracts

### Status: COMPLETED - Prerequisites fulfilled

### [T101] Design Conversation & Message Models
- **Status**: COMPLETED
- **Purpose**: Create database models for chat persistence
- **Files**: backend/models/conversation.py, backend/models/message.py
- **Dependency**: [R001]
- **Constitution Compliance**: Ensures stateless persistence

### [T102] Design API Contracts
- **Status**: COMPLETED
- **Purpose**: Define endpoints for chat functionality
- **Files**: contracts/chat-openapi.yaml
- **Dependency**: [R001], [T101]
- **Constitution Compliance**: Ensures proper user isolation

### [T103] Create Quickstart Guide
- **Status**: COMPLETED
- **Purpose**: Document setup process for new developers
- **Files**: docs/quickstart.md
- **Dependency**: [T101], [T102]

## Phase 2: Implementation Plan

### Prerequisites: Phase 1 complete, constitution conflict resolved

### Phase 2A: Setup & Dependencies [Parallel Tasks]

#### [T201-P] Add Environment Variables
- **Purpose**: Configure COHERE_API_KEY and other required variables
- **Files**: .env.example, .env
- **Dependency**: [R003] resolved

#### [T202-P] Install Backend Dependencies
- **Purpose**: Install Cohere SDK and related packages
- **Files**: backend/requirements.txt, backend/pyproject.toml
- **Dependency**: [R003] resolved

#### [T203-P] Install Frontend Dependencies
- **Purpose**: Install lucide-react and other frontend packages
- **Files**: frontend/package.json
- **Dependency**: [R003] resolved

### Phase 2B: Database Extension

#### [T204] Implement Conversation & Message Models
- **Purpose**: Create persistent storage for chat sessions
- **Files**: backend/models/conversation.py, backend/models/message.py
- **Dependency**: [T101], [T201-P]
- **Constitution Compliance**: Ensures stateless persistence

#### [T205] Create Database Migrations
- **Purpose**: Apply schema changes to database
- **Files**: backend/migrations/*
- **Dependency**: [T204]

### Phase 2C: Backend Core Implementation

#### [T206] Implement Chat Endpoint
- **Purpose**: Create POST /api/{user_id}/chat endpoint
- **Files**: backend/api/endpoints/chat.py
- **Dependency**: [T202-P], [T204], [T205]
- **Constitution Compliance**: Ensures user_id validation

#### [T207] Implement Cohere Integration
- **Purpose**: Connect to Cohere API for natural language processing
- **Files**: backend/services/cohere_service.py
- **Dependency**: [T202-P], [T206]

#### [T208] Implement User Info Retrieval
- **Purpose**: Fetch user name/email for personalized greetings
- **Files**: backend/services/user_service.py
- **Dependency**: [R002], [T206]
- **Constitution Compliance**: Enables personalized greetings

### Phase 2D: Frontend Implementation

#### [T209] Add Chatbot Icon Component
- **Purpose**: Create floating sky-blue chatbot icon
- **Files**: frontend/components/ChatbotIcon.tsx
- **Dependency**: [T203-P]
- **Constitution Compliance**: Implements sky-blue theme requirement

#### [T210] Create Chat Interface
- **Purpose**: Build chat UI component with message display
- **Files**: frontend/components/ChatInterface.tsx, frontend/app/dashboard/chat/page.tsx
- **Dependency**: [T209], [T203-P]
- **Constitution Compliance**: Responsive UI with sky-blue theme

#### [T211] Implement API Integration
- **Purpose**: Connect frontend to backend chat endpoint
- **Files**: frontend/lib/api.ts
- **Dependency**: [T206], [T210]
- **Constitution Compliance**: Proper Bearer token attachment

### Phase 2E: Testing & Validation

#### [T212] Unit Tests for Backend
- **Purpose**: Test all backend functionality
- **Files**: backend/tests/test_chat.py, backend/tests/test_conversation.py
- **Dependency**: [T206], [T207], [T208]

#### [T213] Integration Tests
- **Purpose**: Test end-to-end chat functionality
- **Files**: backend/tests/test_chat_integration.py
- **Dependency**: [T212]

#### [T214] Frontend Tests
- **Purpose**: Test chat UI functionality
- **Files**: frontend/tests/ChatInterface.test.tsx
- **Dependency**: [T210], [T211]

## Execution Order & Dependencies

```
[R001] ──┬── [R002] ──┬── [T101] ──┬── [T204] ──┬── [T206] ──┬── [T212]
         │             └── [T102] ──┘            ├─────────────┤
         └─ [R003] ── RESOLVED ───────────────────┘             ├──── [T213]
                                                               └──── [T214]

[T201-P] ──┬──────────────────────────────────────────────────────────┘
[T202-P] ──┤
[T203-P] ──┘
            │
[T209] ─────┼── [T210] ── [T211] ──┘
```

## Checkpoints

### Checkpoint 1: Research Complete
- All unknowns resolved in research.md
- Constitution conflict addressed
- Ready to proceed to Phase 1

### Checkpoint 2: Design Complete
- Data models designed
- API contracts defined
- Ready to proceed to Phase 2

### Checkpoint 3: Implementation Complete
- All components implemented
- Tests passing
- Ready for deployment

## Parallel Opportunities

- [T201-P], [T202-P], [T203-P]: Environment setup and dependency installation can happen in parallel
- [T209], [T210], [T211]: Frontend components can be developed in parallel after dependencies are met
- [T212], [T213], [T214]: Testing can be parallelized after implementation

## Risk Mitigation

- **Constitution Conflict**: Address immediately to avoid rework
- **Database Migration**: Test migrations in development environment first
- **API Integration**: Implement error handling for Cohere API failures
- **User Isolation**: Implement comprehensive user_id validation