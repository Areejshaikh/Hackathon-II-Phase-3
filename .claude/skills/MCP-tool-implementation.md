# MCP Tool Implementation

## Purpose
Expose stateless tools for AI agent to manage tasks via MCP SDK.

## Scope
- MCP server in backend
- Task CRUD operations

## Responsibilities / Key Capabilities
- Set up MCP SDK in FastAPI
- Define tool schemas (params, returns) as per specs
- Implement each tool (add_task, list_tasks, etc.) with DB calls
- Enforce user_id filtering in every tool
- Return exact JSON formats (e.g., {task_id, status})
- Handle no-state (query DB each time)