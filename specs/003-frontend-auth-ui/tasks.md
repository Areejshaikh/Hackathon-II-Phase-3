# Tasks: Todo Web UI with Better Auth Integration

**Input**: Design documents from `/specs/003-frontend-auth-ui/`
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

- [x] T001 Create Next.js project structure with App Router in frontend/
- [ ] T002 [P] Install required dependencies (Next.js, React, TypeScript, Tailwind CSS, Better Auth)
- [x] T003 [P] Configure TypeScript and Tailwind CSS in frontend/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup Better Auth client configuration in frontend/
- [x] T005 [P] Implement central API client with JWT token handling in frontend/lib/api.ts
- [ ] T006 [P] Setup environment configuration with NEXT_PUBLIC_BETTER_AUTH_URL in frontend/.env.local
- [x] T007 Create shared type definitions for User, Task, and AuthState in frontend/types/index.ts
- [ ] T008 Configure Next.js middleware for authentication protection in frontend/middleware.ts
- [x] T009 Setup root layout and global styles in frontend/app/layout.tsx and frontend/app/globals.css

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Login and Task Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to securely log in and manage their tasks through an intuitive web interface

**Independent Test**: Can be fully tested by creating an account, logging in, creating tasks, and verifying that only the authenticated user can access their own tasks

### Implementation for User Story 1

- [x] T010 [P] [US1] Create AuthProvider component in frontend/components/AuthProvider.tsx
- [x] T011 [P] [US1] Create login page in frontend/app/login/page.tsx
- [x] T012 [P] [US1] Create signup page in frontend/app/signup/page.tsx
- [x] T013 [US1] Implement dashboard page with task list in frontend/app/dashboard/page.tsx
- [x] T014 [US1] Create TaskItem component to display individual tasks in frontend/components/TaskItem.tsx
- [x] T015 [US1] Create TaskForm component for creating/updating tasks in frontend/components/TaskForm.tsx
- [ ] T016 [US1] Integrate API client to fetch user's tasks in frontend/app/dashboard/page.tsx
- [ ] T017 [US1] Add navigation between auth pages and dashboard

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Responsive and Accessible UI (Priority: P2)

**Goal**: Provide access to the Todo application on different devices with a responsive and accessible interface

**Independent Test**: Can be tested by accessing the application on different screen sizes and verifying the UI adapts appropriately

### Implementation for User Story 2

- [ ] T018 [US2] Enhance TaskItem component with responsive design in frontend/components/TaskItem.tsx
- [ ] T019 [US2] Enhance TaskForm component with responsive design in frontend/components/TaskForm.tsx
- [ ] T020 [US2] Add responsive layout to dashboard page in frontend/app/dashboard/page.tsx
- [ ] T021 [US2] Add responsive design to login/signup pages in frontend/app/login/page.tsx and frontend/app/signup/page.tsx
- [ ] T022 [US2] Implement accessibility features (aria labels, semantic HTML) across all components
- [ ] T023 [US2] Add loading and error states with visual feedback in UI components

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Secure Task Isolation (Priority: P3)

**Goal**: Ensure that users can only access their own tasks to maintain data privacy and security

**Independent Test**: Can be tested by logging in with different user accounts and verifying that each user only sees their own tasks

### Implementation for User Story 3

- [ ] T024 [US3] Verify JWT token is properly attached to all API requests in frontend/lib/api.ts
- [ ] T025 [US3] Implement server-side validation to ensure users can only access their own tasks in frontend/app/dashboard/page.tsx
- [ ] T026 [US3] Add error handling for unauthorized access attempts
- [ ] T027 [US3] Test task isolation by verifying users can't access other users' tasks

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T028 [P] Add animations and transitions to UI components
- [ ] T029 Update documentation in README.md and quickstart.md
- [ ] T030 Code cleanup and refactoring across all components
- [ ] T031 Performance optimization for API calls and UI rendering
- [ ] T032 Run quickstart.md validation to ensure everything works end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- [ ] T010 [P] [US1] Create AuthProvider component in frontend/components/AuthProvider.tsx
- [ ] T011 [P] [US1] Create login page in frontend/app/login/page.tsx
- [ ] T012 [P] [US1] Create signup page in frontend/app/signup/page.tsx
- [ ] T013 [US1] Implement dashboard page with task list in frontend/app/dashboard/page.tsx
- [ ] T014 [US1] Create TaskItem component to display individual tasks in frontend/components/TaskItem.tsx
- [ ] T015 [US1] Create TaskForm component for creating/updating tasks in frontend/components/TaskForm.tsx
- [ ] T016 [US1] Integrate API client to fetch user's tasks in frontend/app/dashboard/page.tsx
- [ ] T017 [US1] Add navigation between auth pages and dashboard

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Responsive and Accessible UI (Priority: P2)

**Goal**: Provide access to the Todo application on different devices with a responsive and accessible interface

**Independent Test**: Can be tested by accessing the application on different screen sizes and verifying the UI adapts appropriately

### Implementation for User Story 2

- [ ] T018 [US2] Enhance TaskItem component with responsive design in frontend/components/TaskItem.tsx
- [ ] T019 [US2] Enhance TaskForm component with responsive design in frontend/components/TaskForm.tsx
- [ ] T020 [US2] Add responsive layout to dashboard page in frontend/app/dashboard/page.tsx
- [ ] T021 [US2] Add responsive design to login/signup pages in frontend/app/login/page.tsx and frontend/app/signup/page.tsx
- [ ] T022 [US2] Implement accessibility features (aria labels, semantic HTML) across all components
- [ ] T023 [US2] Add loading and error states with visual feedback in UI components

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Secure Task Isolation (Priority: P3)

**Goal**: Ensure that users can only access their own tasks to maintain data privacy and security

**Independent Test**: Can be tested by logging in with different user accounts and verifying that each user only sees their own tasks

### Implementation for User Story 3

- [ ] T024 [US3] Verify JWT token is properly attached to all API requests in frontend/lib/api.ts
- [ ] T025 [US3] Implement server-side validation to ensure users can only access their own tasks in frontend/app/dashboard/page.tsx
- [ ] T026 [US3] Add error handling for unauthorized access attempts
- [ ] T027 [US3] Test task isolation by verifying users can't access other users' tasks

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T028 [P] Add animations and transitions to UI components
- [ ] T029 Update documentation in README.md and quickstart.md
- [ ] T030 Code cleanup and refactoring across all components
- [ ] T031 Performance optimization for API calls and UI rendering
- [ ] T032 Run quickstart.md validation to ensure everything works end-to-end

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
# Launch all auth pages for User Story 1 together:
Task: "Create login page in frontend/app/login/page.tsx"
Task: "Create signup page in frontend/app/signup/page.tsx"

# Launch all components for User Story 1 together:
Task: "Create TaskItem component in frontend/components/TaskItem.tsx"
Task: "Create TaskForm component in frontend/components/TaskForm.tsx"
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