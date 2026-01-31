---
id: 001
title: update-main-orchestrator
stage: constitution
date: 2026-01-09
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: /sp.constitution
labels: ["constitution", "main-orchestrator", "security"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - E:\New folder\.specify\memory\constitution.md
tests:
 - null
---

## Prompt

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

Follow this execution flow:

1. Load the existing constitution template at `.specify/memory/constitution.md`.
   - Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`.
   **IMPORTANT**: The user might require less or more principles than the ones used in the template. If a number is specified, respect that - follow the general template. You will update the doc accordingly.

2. Collect/derive values for placeholders:
   - If user input (conversation) supplies a value, use it.
   - Otherwise infer from existing repo context (README, docs, prior constitution versions if embedded).
   - For governance dates: `RATIFICATION_DATE` is the original adoption date (if unknown ask or mark TODO), `LAST_AMENDED_DATE` is today if changes are made, otherwise keep previous.
   - `CONSTITUTION_VERSION` must increment according to semantic versioning rules:
     - MAJOR: Backward incompatible governance/principle removals or redefinitions.
     - MINOR: New principle/section added or materially expanded guidance.
     - PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
   - If version bump type ambiguous, propose reasoning before finalizing.

3. Draft the updated constitution content:
   - Replace every placeholder with concrete text (no bracketed tokens left except intentionally retained template slots that the project has chosen not to define yet—explicitly justify any left).
   - Preserve heading hierarchy and comments can be removed once replaced unless they still add clarifying guidance.
   - Ensure each Principle section: succinct name line, paragraph (or bullet list) capturing non‑negotiable rules, explicit rationale if not obvious.
   - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.

4. Consistency propagation checklist (convert prior checklist into active validations):
   - Read `.specify/templates/plan-template.md` and ensure any "Constitution Check" or rules align with updated principles.
   - Read `.specify/templates/spec-template.md` for scope/requirements alignment—update if constitution adds/removes mandatory sections or constraints.
   - Read `.specify/templates/tasks-template.md` and ensure task categorization reflects new or removed principle-driven task types (e.g., observability, versioning, testing discipline).
   - Read each command file in `.specify/templates/commands/*.md` (including this one) to verify no outdated references (agent-specific names like CLAUDE only) remain when generic guidance is required.
   - Read any runtime guidance docs (e.g., `README.md`, `docs/quickstart.md`, or agent-specific guidance files if present). Update references to principles changed.

5. Produce a Sync Impact Report (prepend as an HTML comment at top of the constitution file after update):
   - Version change: old → new
   - List of modified principles (old title → new title if renamed)
   - Added sections
   - Removed sections
   - Templates requiring updates (✅ updated / ⚠ pending) with file paths
   - Follow-up TODOs if any placeholders intentionally deferred.

6. Validation before final output:
   - No remaining unexplained bracket tokens.
   - Version line matches report.
   - Dates ISO format YYYY-MM-DD.
   - Principles are declarative, testable, and free of vague language ("should" → replace with MUST/SHOULD rationale where appropriate).

7. Write the completed constitution back to `.specify/memory/constitution.md` (overwrite).

8. Output a final summary to the user with:
   - New version and bump rationale.
   - Any files flagged for manual follow-up.
   - Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z (principle additions + governance update)`).

Formatting & Style Requirements:

- Use Markdown headings exactly as in the template (do not demote/promote levels).
- Wrap long rationale lines to keep readability (<100 chars ideally) but do not hard enforce with awkward breaks.
- Keep a single blank line between sections.
- Avoid trailing whitespace.

If the user supplies partial updates (e.g., only one principle revision), still perform validation and version decision steps.

If critical info missing (e.g., ratification date truly unknown), insert `TODO(<FIELD_NAME>): explanation` and include in the Sync Impact Report under deferred items.

Do not create a new template; always operate on the existing `.specify/memory/constitution.md` file.

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.


/sp.constitution # 🧭 Main-Orchestrator Constitution  
**Project:** Phase II – Todo Full-Stack Web Application  
**Agent:** `main-orchestrator`  
**Applies To:** All sub-agents and skills  

---

## 1. Purpose

This constitution defines the **rules, priorities, security model, and workflow**
for the Phase II Todo Full-Stack Web Application.

Its goal is to ensure:
- Spec-driven development using Spec-Kit
- Secure, multi-user behavior using JWT authentication
- Clean coordination between frontend, backend, database, and specs
- Consistent, testable, and scalable implementation

---

## 2. Agent Hierarchy

001 main-orchestrator
├─ frontend-agent
├─ backend-agent
├─ auth-agent
├─ database-agent
├─ spec-manager
├─ constitution-keeper
└─ todo-app-agent


- **main-orchestrator** is the single authority.
- Sub-agents must not act independently without delegation.

---

## 3. Core Rules (Mandatory)

1. Always read the relevant spec before implementing any feature  
2. No code may be written without a spec reference  
3. All backend endpoints must require JWT authentication  
4. JWT must be verified **before** any database operation  
5. Backend must always filter data by authenticated user  
6. Frontend must communicate with backend **only** via API client  
7. No cross-user data access is allowed  
8. Specs must be updated if requirements change  
9. Each task must be tested before being marked complete  
10. All sub-agents must report status to `main-orchestrator`

---

## 4. Security Constitution

### Authentication
- Better Auth runs on frontend
- JWT tokens issued on login
- Token sent in header:

```
Authorization: Bearer <token>
```

### Backend Enforcement
- Every request must include valid JWT
- Requests without token return **401 Unauthorized**
- User identity extracted from JWT
- Token user ID must match request scope

### Secrets
- `BETTER_AUTH_SECRET` shared between frontend and backend
- Secrets stored in environment variables only
- Secrets must never be committed

---

## 5. Data Ownership & Isolation

- Each task belongs to exactly one user
- Users can only access their own tasks
- Cross-user access is strictly forbidden

---

## 6. Spec-Driven Development

### Spec Sources
- `@specs/overview.md`
- `@specs/features/*`
- `@specs/api/*`
- `@specs/database/*`
- `@specs/ui/*`

### Rules
- Specs define **what** to build
- Constitution defines **how** to build
- Code must exactly match spec behavior
- Spec changes must be documented

---

## 7. Workflow Enforcement

1. Spec Manager reviews the spec  
2. Main-Orchestrator assigns task  
3. Sub-agent implements feature  
4. Constitution Keeper validates rules  
5. QA checks performed  
6. Sub-agent reports completion  
7. Main-Orchestrator approves next task  

---

## 8. Frontend Rules

- Next.js App Router required
- Server Components by default
- Client Components only when needed
- Tailwind CSS only
- Backend calls via `/lib/api.ts`

---

## 9. Backend Rules

- All routes under `/api`
- FastAPI + SQLModel only
- Pydantic models required
- Proper HTTP status codes
- Errors handled with `HTTPException`

---

## 10. Database Governance

- Neon PostgreSQL only
- SQLModel for all queries
- Foreign keys enforced
- Index `user_id` on tasks
- Schema changes must update specs

---

## 11. Quality Assurance

A feature is complete only if:
- JWT enforced
- User isolation verified
- API matches spec
- UI matches UI spec
- No spec violations

---

## 12. Communication Protocol

```json
{
"agent": "backend-agent",
"feature": "task-crud",
"status": "completed",
"spec": "@specs/features/task-crud.md",
"notes": "JWT filtering enforced"
}
```

---

**Version**: 1.1.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09

## Response snapshot

I've successfully updated the project constitution file. Here's a summary of what was done:

## Summary

- **New Version**: 1.1.0 (updated from 1.0.0)
- **Bump Rationale**: Updated to specific main-orchestrator constitution for Todo application with detailed security and workflow rules
- **Files Updated**: `.specify/memory/constitution.md`
- **Suggested Commit Message**: `docs: update constitution to v1.1.0 with main-orchestrator rules`

## Key Changes Made

1. Replaced general principles with specific constitution for main-orchestrator and sub-agents
2. Added detailed security constitution with JWT authentication requirements
3. Defined data ownership and isolation rules
4. Established spec-driven development workflow
5. Specified frontend, backend, and database governance rules
6. Included quality assurance requirements
7. Added communication protocol for agents

The constitution now properly reflects the specific requirements for the Todo application with proper security measures, agent hierarchy, and workflow enforcement.

## Outcome

- ✅ Impact: Updated constitution with specific main-orchestrator rules and security requirements
- 🧪 Tests: null
- 📁 Files: .specify/memory/constitution.md updated
- 🔁 Next prompts: Build feature specifications based on updated constitution
- 🧠 Reflection: The detailed constitution provides clear guidance for all sub-agents working on the Todo application

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): Standard constitution update
- Next experiment (smallest change to try): Begin implementing feature specifications based on this constitution