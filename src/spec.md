# Specification

## Summary
**Goal:** Add Internet Identity authentication UI, multi-conversation chat history, and automatic chat persistence (local for anonymous users and backend for signed-in users).

**Planned changes:**
- Add visible Sign in/Sign out actions using the existing Internet Identity provider/hooks and display an authenticated state indicator in English.
- Refactor the chat screen from a single in-memory conversation to support selecting among multiple conversations while keeping Safety & Usage and Developer Safety Note UI intact.
- Implement a chat history UI (tabs/sidebar/list) to create new chats, switch between past chats, and delete a chat with a basic confirmation.
- Add automatic save/restore of conversations: persist to backend when authenticated; otherwise auto-save locally and restore on refresh for the same browser; trigger auto-save on send and on assistant reply.
- Extend the Motoko backend (single-actor, main.mo) with per-user (principal-scoped) chat persistence endpoints: create/list/get/append/delete, with stable storage suitable for upgrades and defined handling for anonymous callers.

**User-visible outcome:** Users can sign in/out with Internet Identity, see whether they’re signed in, manage multiple past chats (create/switch/delete), and have chats automatically restored after refresh (and after logging back in when authenticated).
