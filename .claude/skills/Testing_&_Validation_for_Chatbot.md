# Testing & Validation for Chatbot

## Purpose
Pura chatbot system test karna — NL commands, statelessness, isolation, resume, errors sab check karna.

## Scope
- End-to-end testing
- Security audit
- Edge cases

## Responsibilities / Key Capabilities
1. Multi-turn NL scenarios test karna (add → list → delete)
2. Server restart ke baad conversation resume verify karna
3. User isolation test (2 users — no data leak)
4. User name/email display confirm karna
5. Error cases test (invalid ID, empty list, ambiguous command)
6. Tool calls aur responses sahi render hone ka check
7. Performance + scalability notes dena
8. Clear pass/fail report + fix suggestions