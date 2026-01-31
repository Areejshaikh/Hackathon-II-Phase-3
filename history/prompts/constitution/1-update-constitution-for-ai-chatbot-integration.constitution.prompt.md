---
id: 1
title: Update Constitution For AI Chatbot Integration
stage: constitution
date: 2026-01-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: user
command: sp.constitution
labels: [constitution, ai-chatbot, todo-app, phase-3]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
---

## Prompt

```
text
# AI Chatbot Integration into Todo Full-Stack App Constitution

This constitution is the unbreakable law for Phase III integration.
ALL agents, skills, and implementations MUST follow it strictly.
Violation = immediate rejection. Existing Phase II code (Todo CRUD, auth, UI) ko bilkul nahi todna — sirf extend karna.

## Article 0 – Core Identity & Rules
- Project Base: Existing monorepo (/frontend, /backend, /specs).
  Reuse: FastAPI routes, SQLModel Task model, Better Auth JWT, existing dashboard layout & sky-blue theme.
  Extend only: New /api/{user_id}/chat endpoint, MCP tools, Conversation/Message models, ChatKit UI component.
- Tech Lock: OpenAI Agents SDK, Official MCP SDK, OpenAI ChatKit (frontend UI).
  Keep: JWT isolation, Neon PostgreSQL, sky-blue primary theme (#0ea5e9), responsive Tailwind design.
- No Direct Code: Main Orchestrator delegates to agents, reviews, approves.
- Agents (6): Phase_III_Main_Orchestrator, MCP_Server_Developer, AI_Agent_SDK_Integrator, Database_Extender, Frontend_ChatKit_Integrator, Tester_Chatbot_Auditor.
- Skills (8): MCP Tool Implementation, OpenAI Agents SDK Integration, Stateless Conversation Persistence, ChatKit Frontend Integration, Natural Language Behavior Handling, Database Extension for Chatbot, User Info & Personalization Handling, Testing & Validation for Chatbot.

## Article 1 – Absolute Non-Negotiables (Updated with Frontend)
1. Stateless Everything: NO server memory — sab conversations/messages/tasks DB mein persist. Restart pe resume hona chahiye.
2. User Isolation 100%: Har tool/query mein WHERE user_id = JWT user_id. No cross-user data ever.
3. Endpoint Validation: Chat endpoint mein URL {user_id} ko JWT current_user se match karo (mismatch → 403 Forbidden).
4. MCP Tools Exact Match: 5 tools only — exact JSON format, stateless, user_id mandatory.
5. Agent Behavior: NL parse, confirm actions, greet with "Hi [name] ([email])", graceful errors, multi-tool chaining support.
6. User Info (name/email): JWT se sirf user_id nikalega — name/email Better Auth DB se fetch karo (secure query) ya JWT payload customize karo.
7. **Frontend Integration Rules** (New & Critical):
   - Existing dashboard/login flow extend karo — new /dashboard/chat page ya component add karo.
   - OpenAI ChatKit use karo with NEXT_PUBLIC_OPENAI_DOMAIN_KEY (domain allowlist setup mandatory).
   - Tool_calls render karo (e.g., list_tasks se aayi task list ko cards ya table mein show karo).
   - AI chatbot icon dashboard navbar mein add karo (sky-blue theme, hover scale animation, mobile hamburger menu mein visible).
   - Chat UI responsive rahe (sky-blue accents, glassmorphism optional), existing Tailwind theme follow kare.
   - Chat component 'use client' ho jab interactivity chahiye, server components default rakho.
   - No breakage of existing UI (login, task list, navbar).
8. Security: JWT validation har call pe, no token leak, name/email sirf authenticated user ko show.
9. No Breakage: Phase II Todo (CRUD, list, auth) bilkul same chalna chahiye.
10. Specs Reference: Har output mein @specs/... mention karo.

## Article 2 – Reasoning & Output Process
Har response ke liye internally follow karo (user ko mat dikhao):
1. Query padho + Phase III doc + specs check karo.
2. Relevant agents + skills choose karo.
3. Agent outputs simulate karo.
4. Check: Stateless? Isolated? NL sahi? User info show? user_id match? Frontend icon/UI extend sahi? Existing code safe?
5. Violation fix karo.
6. Final output:
   - Task Summary (1 line)
   - Activated Agents & Skills
   - Code/Plan (clean, existing files mein integrate)
   - Isolation Guarantee
   - Next Action

## Article 3 – Agent & Skill Activation Rules
- MCP tools → MCP_Server_Developer + Skill 1
- Agent logic → AI_Agent_SDK_Integrator + Skills 2/5
- DB models → Database_Extender + Skill 6
- ChatKit UI + tool rendering + chatbot icon → Frontend_ChatKit_Integrator + Skill 4
- Testing → Tester_Chatbot_Auditor + Skill 8
- User name/email fetch → Skill 7
- Har non-trivial step mein kam se kam 1 agent + 1 skill use karo.

##
```

## Response snapshot

Updated the constitution file at .specify/memory/constitution.md with the AI Chatbot Integration specifications. The new constitution includes:

- Core Identity & Rules section defining the project base, technology stack lock, agent-based development, and skill-based execution
- Absolute Non-Negotiables section with 10 specific requirements covering statelessness, user isolation, endpoint validation, MCP tools, agent behavior, user info handling, frontend integration rules, security requirements, no breakage policy, and specifications reference
- Reasoning & Output Process section outlining the internal workflow
- Agent & Skill Activation Rules section mapping responsibilities
- Governance section with amendment procedures and quality assurance requirements

## Outcome

- ✅ Impact: Created comprehensive constitution for AI chatbot integration project
- 🧪 Tests: No tests run for this constitution update
- 📁 Files: Updated .specify/memory/constitution.md with new constitution content
- 🔁 Next prompts: Ready for next development tasks following this constitution
- 🧠 Reflection: Constitution now serves as the authoritative guide for all Phase III development

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - Constitution successfully created with all specified requirements
- Prompt variant (if applicable): Standard constitution update
- Next experiment (smallest change to try): Begin implementing according to the new constitution