# Stateless Conversation Persistence

## Purpose
Backend ko completely stateless banana taake server restart hone pe bhi chats resume ho sakein.

## Scope
- Conversation + Message models
- Chat endpoint logic
- DB read/write

## Responsibilities / Key Capabilities
1. Conversation ID create/load karna (new ya existing)
2. User message + assistant response + tool_calls ko DB mein store karna
3. Har request pe history fetch kar ke agent ko dena
4. user_id filtering har message/conversation pe
5. Server restart test kar ke confirm karna (data loss nahi)
6. Conversation resume seamlessly (context intact)
7. Scalable design (horizontal scaling ready)