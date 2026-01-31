<!-- SYNC IMPACT REPORT:
Version change: 1.0.0 → 1.1.0
Modified principles: None (completely new constitution)
Added sections: Core Identity & Rules, Absolute Non-Negotiables, Reasoning & Output Process, Agent & Skill Activation Rules
Removed sections: Template placeholders
Templates requiring updates: ✅ Updated all references
Follow-up TODOs: None
-->
# AI Chatbot Integration into Todo Full-Stack App Constitution

This constitution is the unbreakable law for Phase III integration.
ALL agents, skills, and implementations MUST follow it strictly.
Violation = immediate rejection. Existing Phase II code (Todo CRUD, auth, UI) ko bilkul nahi todna — sirf extend karna.

## Core Identity & Rules

### Core Project Identity
Project Base: Existing monorepo (/frontend, /backend, /specs).
Reuse: FastAPI routes, SQLModel Task model, Better Auth JWT, existing dashboard layout & sky-blue theme.
Extend only: New /api/{user_id}/chat endpoint, MCP tools, Conversation/Message models, ChatKit UI component.

### Technology Stack Lock
Tech Lock: OpenAI Agents SDK, Official MCP SDK, OpenAI ChatKit (frontend UI).
Keep: JWT isolation, Neon PostgreSQL, sky-blue primary theme (#0ea5e9), responsive Tailwind design.

### Agent-Based Development
No Direct Code: Main Orchestrator delegates to agents, reviews, approves.
Agents (6): Phase_III_Main_Orchestrator, MCP_Server_Developer, AI_Agent_SDK_Integrator, Database_Extender, Frontend_ChatKit_Integrator, Tester_Chatbot_Auditor.

### Skill-Based Execution
Skills (8): MCP Tool Implementation, OpenAI Agents SDK Integration, Stateless Conversation Persistence, ChatKit Frontend Integration, Natural Language Behavior Handling, Database Extension for Chatbot, User Info & Personalization Handling, Testing & Validation for Chatbot.

## Absolute Non-Negotiables (Updated with Frontend)

### Stateless Everything
Stateless Everything: NO server memory — sab conversations/messages/tasks DB mein persist. Restart pe resume hona chahiye.

### User Isolation 100%
User Isolation 100%: Har tool/query mein WHERE user_id = JWT user_id. No cross-user data ever.

### Endpoint Validation
Endpoint Validation: Chat endpoint mein URL {user_id} ko JWT current_user se match karo (mismatch → 403 Forbidden).

### MCP Tools Exact Match
MCP Tools Exact Match: 5 tools only — exact JSON format, stateless, user_id mandatory.

### Agent Behavior Standards
Agent Behavior: NL parse, confirm actions, greet with "Hi [name] ([email])", graceful errors, multi-tool chaining support.

### User Info Handling
User Info (name/email): JWT se sirf user_id nikalega — name/email Better Auth DB se fetch karo (secure query) ya JWT payload customize karo.

### Frontend Integration Rules
Frontend Integration Rules (New & Critical):
- Existing dashboard/login flow extend karo — new /dashboard/chat page ya component add karo.
- OpenAI ChatKit use karo with NEXT_PUBLIC_OPENAI_DOMAIN_KEY (domain allowlist setup mandatory).
- Tool_calls render karo (e.g., list_tasks se aayi task list ko cards ya table mein show karo).
- AI chatbot icon dashboard navbar mein add karo (sky-blue theme, hover scale animation, mobile hamburger menu mein visible).
- Chat UI responsive rahe (sky-blue accents, glassmorphism optional), existing Tailwind theme follow kare.
- Chat component 'use client' ho jab interactivity chahiye, server components default rakho.
- No breakage of existing UI (login, task list, navbar).

### Security Requirements
Security: JWT validation har call pe, no token leak, name/email sirf authenticated user ko show.

### No Breakage Policy
No Breakage: Phase II Todo (CRUD, list, auth) bilkul same chalna chahiye.

### Specifications Reference
Specs Reference: Har output mein @specs/... mention karo.

## Reasoning & Output Process

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

## Agent & Skill Activation Rules

MCP tools → MCP_Server_Developer + Skill 1
Agent logic → AI_Agent_SDK_Integrator + Skills 2/5
DB models → Database_Extender + Skill 6
ChatKit UI + tool rendering + chatbot icon → Frontend_ChatKit_Integrator + Skill 4
Testing → Tester_Chatbot_Auditor + Skill 8
User name/email fetch → Skill 7
Har non-trivial step mein kam se kam 1 agent + 1 skill use karo.

## Governance

All implementations must strictly comply with these constitutional principles. Any deviation requires explicit approval and formal amendment to this constitution. The constitution supersedes all other development practices and takes precedence over any conflicting guidance or templates.

Amendment Procedure: Changes to this constitution require explicit user approval and must be documented with clear justification. Versioning follows semantic versioning rules: MAJOR for breaking changes, MINOR for additions, PATCH for clarifications.

Quality Assurance: All code reviews must verify constitutional compliance. Automated checks should validate adherence to core principles including statelessness, user isolation, and security requirements.

**Version**: 1.1.0 | **Ratified**: 2026-01-24 | **Last Amended**: 2026-01-24