
# Fix: Chat Stops Accepting Messages After 5-6 Messages

## Root Cause

Two issues prevent users from sending messages after a few exchanges:

### Issue 1: Health Topic Filter Silently Blocks Follow-Up Messages
The `isHealthRelated()` filter in `handleSendMessage` (Chat.tsx line 150) checks EVERY message for health keywords. After the initial symptom description, users naturally type follow-up responses like:
- "thank you, what should I do next?"
- "yes, it started about a week ago and gets worse at night"
- "I have been taking some over the counter stuff"

If these don't contain a recognized health keyword AND are longer than 3 words, the filter **silently blocks them** -- no error message, no feedback. The input field keeps the text but nothing happens, making it look like the app is frozen.

### Issue 2: Stale State Closure in sendMessageWithRetry
Both `useGuestChat` and `useChatSession` have a stale closure problem. The `sendMessageWithRetry` callback captures `sessionState` at creation time. When `sendMessage` adds the user message to state and then calls `sendMessageWithRetry`, it still references the OLD state. This means:
- The AI receives an outdated message history
- Phase transitions (`initial` -> `assessment` -> `summary`) can get out of sync
- After the phase becomes `summary`, subsequent messages still get processed but state transitions break

---

## Fix

### 1. Only Apply Health Filter on First Message (Chat.tsx)
Move the `isHealthRelated` check so it only applies when the chat is in the `initial` phase (before the user has started describing symptoms). Once the conversation is underway, all follow-up messages should be allowed through. Also show a toast notification when a message IS blocked, so the user knows what happened.

### 2. Fix Stale Closure in useGuestChat.tsx
Pass the current state values directly to `sendMessageWithRetry` instead of relying on the closure. This ensures the AI always receives the latest messages and correct phase information.

### 3. Fix Stale Closure in useChatSession.tsx
Same fix as above for authenticated users.

---

## Files to Change

1. **`src/pages/Chat.tsx`** -- Only apply health filter on initial phase; show feedback when blocked
2. **`src/hooks/useGuestChat.tsx`** -- Pass current state to sendMessageWithRetry to fix stale closure
3. **`src/hooks/useChatSession.tsx`** -- Same stale closure fix

---

## Technical Details

### Chat.tsx Change
```typescript
// Before (blocks all non-health messages silently):
if (!isHealthRelated(content)) {
  return; // silent block!
}

// After (only filter first message, show feedback):
if (chat.sessionState.phase === 'initial' && !isHealthRelated(content)) {
  toast({
    title: "Health Topics Only",
    description: "Please describe a health symptom or medical concern to get started.",
    variant: "default"
  });
  return;
}
```

### useGuestChat.tsx Closure Fix
Pass the latest messages array and state directly into `sendMessageWithRetry` as parameters rather than reading from the `sessionState` closure. This ensures the AI endpoint always receives up-to-date conversation context.

### useChatSession.tsx Closure Fix
Same pattern -- pass state values as parameters to avoid stale closures during the async flow.
