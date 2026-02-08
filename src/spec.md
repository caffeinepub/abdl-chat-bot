# Specification

## Summary
**Goal:** Create a safe, general-purpose chatbot website branded as “Abdl Chat Bot” that supports PG-13 conversations without any external LLM integrations.

**Planned changes:**
- Build a chat UI with scrollable message history, user/assistant message styling, text input, send button, loading indicator, and a friendly error state that preserves the user’s message.
- Implement a single backend chat reply endpoint that accepts a user message and returns an assistant message, with rule-based safe replies.
- Add safety handling: refuse/redirect explicit sexual, fetish (including ABDL/diaper/urination/defecation), or non-consensual requests with a clear English refusal and safer alternatives.
- Add a “Safety & Usage” disclosure in the UI and a visible “Clear chat” action to reset the current conversation without refresh.
- Add a developer-facing warning in-app (or visible repo note page/screen) stating the posted API key is compromised and must be revoked/rotated, and that secrets must never be pasted or committed; do not store/use any API keys.
- Apply a coherent visual theme (non-blue/purple primary palette) consistently across the chat screen and ensure it looks intentional on mobile and desktop.
- Add generated static brand images (logo + assistant avatar) under `frontend/public/assets/generated` and render them in the UI (logo in header/landing, avatar next to assistant messages or in chat header).

**User-visible outcome:** Users can chat with “Abdl Chat Bot” in a clean, themed interface, receive safe PG-13 responses, see clear refusals for explicit/fetish requests, view safety guidance, clear the chat, and see app branding (logo + assistant avatar).
