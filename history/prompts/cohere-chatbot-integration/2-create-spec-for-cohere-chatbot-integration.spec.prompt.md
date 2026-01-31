---
id: 2
title: Create Spec For Cohere Chatbot Integration
stage: spec
date: 2026-01-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: cohere-chatbot-integration
branch: 008-cohere-chatbot-integration
user: user
command: sp.specify
labels: [spec, ai-chatbot, cohere, todo-app, phase-3]
links:
  spec: specs/008-cohere-chatbot-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/008-cohere-chatbot-integration/spec.md
  - specs/008-cohere-chatbot-integration/checklists/requirements.md
tests:
---

## Prompt

```
text
/sp.specify – AI Chatbot Integration (Phase III – Cohere Edition)

Yeh prompt bilkul simple hai – step-by-step samjho:

1. Project Kya Hai?
   - Tumhara purana Todo app (Phase II) already chal raha hai (frontend Next.js + backend FastAPI).
   - Ab usi mein AI chatbot add karna hai jo natural language se tasks manage kare (add, list, complete, delete, update).
   - AI ke liye Cohere API use karo (COHERE_API_KEY se) – OpenAI/Gemini bilkul nahi.

2. Backend Mein Kya Karna Hai?
   - Existing backend folder mein hi extend karo (koi naya project mat banao).
   - New endpoint: POST /api/{user_id}/chat
   - Is endpoint mein Cohere API call karo message process karne ke liye + MCP tools (add_task etc.) call karo.
   - .env mein COHERE_API_KEY add karo (baaki variables same rehne chahiye: BETTER_AUTH_SECRET, DATABASE_URL).
   - Types sahi rakhna: user_id string, conversation_id number, task_id number.
   - Errors handle karo: 401 (token invalid), 403 (user_id mismatch), 404 (task not found), 500 (Cohere fail)  - Chat UI mein: messages list, input box, send button – Cohere backend se response aaye.
   - Greeting: "Hi [name] ([email])" – Better Auth se name/email lo.
   - Tool results show karo (e.g., list_tasks se task list cards mein).

4. Important Rules (Constitution se)
   - Stateless rakhna: Conversation history Neon DB mein save ho (Conversation + Message models).
   - User isolation: Har cheez user_id se filter ho (JWT se current user).
   - No breakage: Purana Todo app (tasks list, add, login) bilkul same chalna chahiye.
   - Types: Frontend TypeScript (interfaces banao), Backend Pydantic (BaseModel use karo).
   - Errors: Backend mein proper HTTPException + print/log, Frontend mein toast errors.

5. Start Kaise Karo?
   - Pehle dashboard mein floating sky-blue chatbot icon add karo (lucide-react se <Bot /> icon).
   - Phir custom chat page banao (/dashboard/chat) jo Cohere backend se connect ho.
   - Backend chat endpoint update karo Cohere API ke saath.
   - Sab existing code mein integrate karo 
```

## Response snapshot

Created a comprehensive specification for the Cohere Chatbot Integration feature in the Todo app. The specification includes:

- User Scenarios & Testing with 3 prioritized user stories covering natural language task management, chat interface integration, and personalized greeting/user isolation
- Functional Requirements with 10 specific requirements covering API endpoints, Cohere integration, user validation, data persistence, task operations, and UI elements
- Key Entities defining Conversation, Message, and Task data structures
- Success Criteria with 5 measurable outcomes focusing on accuracy, response time, data isolation, uptime, and user engagement

Also created a requirements checklist to validate the specification quality.

## Outcome

- ✅ Impact: Created complete specification for Cohere chatbot integration feature
- 🧪 Tests: No automated tests run for specification creation
- 📁 Files: Created spec.md and requirements checklist in specs/008-cohere-chatbot-integration/
- 🔁 Next prompts: Ready for planning phase (/sp.plan)
- 🧠 Reflection: Specification covers all essential aspects of the AI chatbot integration while maintaining existing functionality

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - Specification successfully created with all required sections
- Prompt variant (if applicable): Standard specification creation
- Next experiment (smallest change to try): Proceed to planning phase with the created specification