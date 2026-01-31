# Tasks: Fix Backend Errors and Implement Phase II Specifications

**Input**: Design documents from `/specs/002-fix-backend-auth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan in backend/
- [x] T002 [P] Create __init__.py files in backend/, backend/routes/, backend/models/, backend/utils/
- [x] T003 [P] Install required dependencies (FastAPI, SQLModel, PyJWT, python-multipart)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [x] T004 Setup database connection in backend/db.py using SQLModel and Neon PostgreSQL
- [x] T005 [P] Implement JWT authentication framework in backend/utils/auth.py
- [x] T006 [P] Setup configuration management with Pydantic BaseSettings in backend/config.py
- [x] T007 Create base models (User, Task) that all stories depend on in backend/models/
- [x] T008 Configure error handling and logging infrastructure in backend/main.py
- [x] T009 Setup environment configuration management with .env file handling

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Authenticate and Manage Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to securely authenticate and manage their tasks

**Independent Test**: Can create a user account, log in, create tasks, and verify that only the authenticated user can access their own tasks

### Implementation for User Story 1

- [x] T010 [P] [US1] Create User model in backend/models/user.py
- [x] T011 [P] [US1] Create Task model in backend/models/task.py
- [x] T012 [US1] Implement JWT utility functions in backend/utils/auth.py
- [x] T013 [US1] Implement authentication dependency in backend/utils/auth.py
- [x] T014 [US1] Create authentication routes in backend/routes/auth.py
- [x] T015 [US1] Create task CRUD routes in backend/routes/tasks.py
- [x] T016 [US1] Implement user authentication in main FastAPI app in backend/main.py
- [x] T017 [US1] Add database migrations or initialization logic

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Secure API Access (Priority: P2)

**Goal**: Ensure all API endpoints are protected by JWT authentication

**Independent Test**: Attempting to access protected endpoints without authentication returns 401 Unauthorized

### Implementation for User Story 2

- [ ] T018 [US2] Implement JWT token validation middleware in backend/utils/auth.py
- [ ] T019 [US2] Apply authentication dependency to all task endpoints in backend/routes/tasks.py
- [ ] T020 [US2] Add proper error responses (401, 403) for invalid requests in backend/main.py
- [ ] T021 [US2] Test authentication enforcement with invalid/expired tokens

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Task CRUD Operations (Priority: P3)

**Goal**: Allow users to create, read, update, and delete their tasks

**Independent Test**: Perform all CRUD operations on tasks and verify they work correctly for authenticated users

### Implementation for User Story 3

- [ ] T022 [US3] Implement task creation logic with user association in backend/routes/tasks.py
- [ ] T023 [US3] Implement task retrieval with user filtering in backend/routes/tasks.py
- [ ] T024 [US3] Implement task update logic with user verification in backend/routes/tasks.py
- [ ] T025 [US3] Implement task deletion logic with user verification in backend/routes/tasks.py
- [ ] T026 [US3] Add comprehensive validation for task operations in backend/models/task.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T027 [P] Update documentation in README.md and quickstart.md
- [ ] T028 Code cleanup and refactoring across all modules
- [ ] T029 Performance optimization for database queries
- [ ] T030 Security hardening of authentication and authorization
- [ ] T031 Run quickstart.md validation to ensure everything works end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all models for User Story 1 together:
Task: "Create User model in backend/models/user.py"
Task: "Create Task model in backend/models/task.py"

# Launch all utilities for User Story 1 together:
Task: "Implement JWT utility functions in backend/utils/auth.py"
Task: "Implement authentication dependency in backend/utils/auth.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence