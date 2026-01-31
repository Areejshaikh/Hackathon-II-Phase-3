# User Info & Personalization Handling

## Purpose
Logged-in user ka name aur email chatbot mein show karna taake personalized feel aaye.

## Scope
- Better Auth JWT parsing
- Greeting + header display
- Security (only authenticated user ka data)

## Responsibilities / Key Capabilities
1. JWT se user_id, name, email extract karna
2. Har conversation start pe greet karna ("Hi [name] ([email])")
3. Chat UI mein user info display karna (header ya profile section)
4. Data leak prevent karna (sirf current user ka info)
5. Session check karna (unauth → login redirect)
6. Name/email update hone pe reflect karna
7. Privacy rules follow karna (no unnecessary exposure)