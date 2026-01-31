# Feature Specification: Fix Backend Errors and Implement Phase II Specifications

**Feature Branch**: `002-fix-backend-auth`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "# Role: Senior Python & FastAPI Developer # Task: Resolve Backend Errors and Implement Phase II Specifications ## Context Main aik Todo Backend API bana raha hoon jo ke Phase II mein hai. Mujhe `ModuleNotFoundError` aur `ImportError` ka samna hai. Mujhe project ko \"Monorepo\" structure mein convert karna hai aur \"Better Auth\" (JWT) integration lazmi karni hai. ## Current Issues to Fix 1. **ModuleNotFoundError**: Uvicorn `backend` module ko locate nahi kar pa raha. 2. **ImportError**: `main.py` mein `backend.routes.users` missing hai. 3. **Structure Mismatch**: Project current folder structure specifications se match nahi kar raha. ## Implementation Instructions ### 1. Fix Project Structure & Imports - Pure project ko aik root directory (e.g., `hackathon-todo`) mein organize karein. - `backend/` aur `backend/routes/` folders ke andar khali `__init__.py` files create karein taake wo valid packages ban saken. - `main.py` mein tamam imports ko absolute path (`from backend...`) par set karein. ### 2. Database & Config Setup - `config.py` mein Pydantic `BaseSettings` ka use karte hue `BETTER_AUTH_SECRET` aur `DATABASE_URL` add karein. - `db.py` mein `SQLModel` ka use karte hue Neon PostgreSQL engine configure karein. ### 3. Authentication (Better Auth + JWT) - Aik JWT middleware ya dependency inject karein jo `Authorization: Bearer <token>` header ko verify kare. - `BETTER_AUTH_SECRET` ko use karte hue token decode karein aur `user_id` extract karein. ### 4. REST API Endpoints (Task CRUD) - `backend/routes/tasks.py` file create karein aur ye endpoints implement karein: - `GET /api/tasks`: Sirf authenticated user ke tasks return karein. - `POST /api/tasks`: Naya task create karein aur usay `user_id` ke sath link karein. - `PUT` aur `DELETE`: Enforce karein ke user sirf apna data modify kar sakay. ## Verification Jab aap kaam khatam kar lein, to check karein ke server is command se bina kisi error ke start ho: `uvicorn backend.main:app --reload --port 8000`"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticate and Manage Tasks (Priority: P1)

As a user of the Todo application, I want to securely authenticate and manage my tasks so that I can organize my work while ensuring my data is protected.

**Why this priority**: This is the core functionality of the Todo application - users need to be able to log in and manage their tasks securely.

**Independent Test**: Can be fully tested by creating a user account, logging in, creating tasks, and verifying that only the authenticated user can access their own tasks.

**Acceptance Scenarios**:

1. **Given** a user has valid credentials, **When** they make an authenticated request to the API, **Then** they can access their own tasks but not others' tasks
2. **Given** a user has valid credentials, **When** they create a new task, **Then** the task is linked to their user ID and stored securely
3. **Given** a user has valid credentials, **When** they request their task list, **Then** they receive only tasks associated with their user ID

---

### User Story 2 - Secure API Access (Priority: P2)

As a system administrator, I want to ensure that all API endpoints are protected by JWT authentication so that unauthorized users cannot access or modify data.

**Why this priority**: Security is critical for protecting user data and preventing unauthorized access to the system.

**Independent Test**: Can be tested by attempting to access protected endpoints without authentication and verifying that access is denied.

**Acceptance Scenarios**:

1. **Given** an unauthenticated request to a protected endpoint, **When** the request is made, **Then** the system returns a 401 Unauthorized response
2. **Given** a request with an invalid JWT token, **When** the request is made, **Then** the system returns a 401 Unauthorized response
3. **Given** a request with a valid JWT token, **When** the request is made, **Then** the system processes the request appropriately

---

### User Story 3 - Task CRUD Operations (Priority: P3)

As a user, I want to create, read, update, and delete my tasks so that I can effectively manage my to-do list.

**Why this priority**: This provides the core functionality for task management that users expect from a Todo application.

**Independent Test**: Can be tested by performing all CRUD operations on tasks and verifying they work correctly for authenticated users.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they create a new task, **Then** the task is saved and associated with their user ID
2. **Given** an authenticated user with existing tasks, **When** they request their task list, **Then** they receive all tasks associated with their user ID
3. **Given** an authenticated user with existing tasks, **When** they update a task, **Then** only tasks belonging to their user ID can be modified
4. **Given** an authenticated user with existing tasks, **When** they delete a task, **Then** only tasks belonging to their user ID can be deleted

---

### Edge Cases

- What happens when a user tries to access another user's tasks?
- How does the system handle expired JWT tokens?
- What happens when the database is temporarily unavailable?
- How does the system handle malformed JWT tokens?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via JWT tokens in the Authorization header
- **FR-002**: System MUST validate JWT tokens using the `BETTER_AUTH_SECRET` environment variable
- **FR-003**: System MUST associate all tasks with the authenticated user's ID
- **FR-004**: System MUST allow authenticated users to create new tasks
- **FR-005**: System MUST allow authenticated users to retrieve their own tasks
- **FR-006**: System MUST allow authenticated users to update their own tasks
- **FR-007**: System MUST allow authenticated users to delete their own tasks
- **FR-008**: System MUST prevent users from accessing, modifying, or deleting other users' tasks
- **FR-009**: System MUST connect to a Neon PostgreSQL database using the `DATABASE_URL` environment variable
- **FR-010**: System MUST return appropriate error responses (401, 403, 404, etc.) for invalid requests

### Key Entities

- **User**: Represents an authenticated user with a unique ID
- **Task**: Represents a to-do item with a title, description, status, and associated user ID
- **JWT Token**: Authentication token containing user identity information

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully authenticate using JWT tokens and access the API without errors
- **SC-002**: The application starts without ModuleNotFoundError or ImportError when running `uvicorn backend.main:app --reload --port 8000`
- **SC-003**: 100% of authenticated requests to task endpoints return appropriate responses for the user's own data
- **SC-004**: 0% of users can access other users' tasks, demonstrating proper authentication and authorization