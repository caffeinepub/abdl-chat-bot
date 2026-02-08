# Specification

## Summary
**Goal:** Make the chatbot UI fully usable on mobile and tablets with responsive layout and touch-friendly interactions.

**Planned changes:**
- Update the main layout to be responsive on small screens, preventing horizontal scrolling and adapting padding/max-width for the chat column.
- Change the authenticated chat history panel behavior on mobile so it no longer permanently consumes width (e.g., collapses or is accessed via a toggle/drawer), while still allowing create/select/delete actions.
- Adjust header actions (Safety & Usage, Clear Chat when present, Sign in/out) so they remain reachable on mobile without overlap or clipping (wrapping or overflow behavior).
- Improve mobile ergonomics across the chat UI: ensure key tap targets meet touch-friendly sizing, keep the composer accessible at the bottom, and ensure textarea/send controls remain visible and usable with the on-screen keyboard.
- Ensure dialogs render within the mobile viewport with scrollable content when needed (e.g., Safety & Usage, delete confirmation), with no cut-off content.
- Scale message bubbles, avatars, and text appropriately for small screens; remove/avoid fixed widths that break narrow layouts.

**User-visible outcome:** On phones and tablets, the chat app fits the screen, the chat history is accessible via a mobile-friendly toggle, header controls remain usable, messages and the composer work smoothly (including with the keyboard), and dialogs display correctly without clipped content.
