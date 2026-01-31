# OpenAI Agents SDK Integration

## Purpose
Enable AI agent to process NL and invoke MCP tools.

## Scope
- Agent + runner in chat endpoint
- NL command parsing

## Responsibilities / Key Capabilities
- Configure agent with MCP tools
- Build message array from DB history
- Run agent on user message
- Parse intents (e.g., "add" → add_task)
- Add greetings with user email/name
- Confirm actions in responses