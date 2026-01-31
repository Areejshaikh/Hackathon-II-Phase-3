---
id: 3
title: Create Implementation Plan For Cohere Chatbot
stage: plan
date: 2026-01-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: cohere-chatbot-integration
branch: 008-cohere-chatbot-integration
user: user
command: sp.plan
labels: [plan, ai-chatbot, cohere, todo-app, phase-3]
links:
  spec: specs/008-cohere-chatbot-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/008-cohere-chatbot-integration/plan/impl.md
  - specs/008-cohere-chatbot-integration/plan/research.md
  - specs/008-cohere-chatbot-integration/plan/data-model.md
  - specs/008-cohere-chatbot-integration/plan/contracts/chat-openapi.yaml
  - specs/008-cohere-chatbot-integration/plan/quickstart.md
tests:
---

## Prompt

```
text
/sp.plan – AI Chatbot Integration (Phase III – Cohere Edition)

Constitution: # AI Chatbot Integration into Todo Full-Stack App Constitution (Version 3.0.0) ko strictly follow karo — unbreakable law.

Previous Spec (/sp.specify) successful run ho chuki hai — ab uske hisaab se full execution plan banao.

Goal: Existing Todo app (Phase II) mein Cohere API se AI chatbot add karna — natural language se tasks manage (add/list/complete/delete/update), user name/email show, stateless DB persistence, frontend mein sky-blue chatbot icon + custom chat UI.

.env Variables (Existing + New – same names rakho):
- BETTER_AUTH_SECRET (JWT secret)
- DATABASE_URL (Neon PostgreSQL)
- COHERE_API_KEY (Cohere API key – new add karo)

Plan Rules:
- Existing frontend (Next.js App Router) aur backend (FastAPI) mein hi extend karo.
- No new repo/folder — sab existing structure mein add karo.
- Types sahi rakho: user_id string, conversation_id number/int, task_id number/int.
- Errors handle karo: Backend mein HTTPException (401, 403, 404, 500), frontend mein toast errors.
- Integration: Frontend /lib/api.ts se calls (Bearer token attach), Backend CORS allow localhost:3000.
- Frontend Icon: Dashboard bottom-right ya navbar mein sky-blue round icon (hover scale), click pe chat open.
- Plan Structure: Phases + Tasks + Dependencies + Parallel Opportunities + Checkpoints.

Output Format (strictly follow karo):
- Phase-wise breakdown
- Each phase ka purpose
- Tasks list: [Txxx] [P?] [Story] Description (file paths include karo)
- [P] for parallel tasks
- Dependencies & Execution Order
- Checkpoints (jab tak phase complete na ho, agla start na karo)
- Estimated order: Setup → Database → Backend → Frontend → Testing

Plan Content (high-level guide):
1. Phase 1: Setup & Dependencies
   - .env mein COHERE_API_KEY add
   - Backend + frontend dependencies install (cohere, lucide-react etc.)

2. Phase 2: Database Extension
   - Conversation & Message models add (user_id filter)
   - Migrations run

3. Phase 3: Backend Core
   -
```

## Response snapshot

Created a comprehensive implementation plan for the Cohere Chatbot Integration feature. The plan includes:

- Technical Context with known and unknown elements
- Constitution Check ensuring all constitutional requirements are met
- Resolved the conflict between constitution (mentioning OpenAI) and feature spec (requiring Cohere)
- Phase 0: Research & Resolution - all research tasks marked as completed
- Phase 1: Data Model & Contracts - completed with data models, API contracts, and quickstart guide
- Phase 2: Detailed implementation plan with setup, database, backend, frontend, and testing phases
- Clear dependencies, execution order, and checkpoints
- Parallel opportunities identified for efficient development

Generated supporting documents:
- research.md: Resolved all unknowns and constitution conflicts
- data-model.md: Defined Conversation and Message entity structures
- contracts/chat-openapi.yaml: Complete API specification for chat functionality
- quickstart.md: Setup and usage guide for developers

## Outcome

- ✅ Impact: Created complete implementation plan for Cohere chatbot integration
- 🧪 Tests: No automated tests run for planning phase
- 📁 Files: Created plan artifacts in specs/008-cohere-chatbot-integration/plan/
- 🔁 Next prompts: Ready for task breakdown (/sp.tasks)
- 🧠 Reflection: Plan addresses all constitutional requirements while enabling Cohere API integration

## Evaluation notes (flywheel)

- Failure modes observed: Constitution vs feature spec conflict initially identified
- Graders run and results (PASS/FAIL): PASS - Plan successfully resolves all conflicts and meets requirements
- Prompt variant (if applicable): Standard planning workflow with conflict resolution
- Next experiment (smallest change to try): Proceed to task breakdown phase with the completed plan