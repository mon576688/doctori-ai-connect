

# Save and Access Chat History for Follow-Up

## Problem
Currently, every time a user visits `/chat`, a brand new conversation starts. Even though authenticated users' messages ARE saved to the database (`chat_sessions` and `chat_messages` tables), there is no way to:
- View past chat sessions
- Continue or revisit a previous conversation
- Reference old symptom discussions for follow-up

Guest users' messages are stored in localStorage but sanitized and auto-deleted after 24 hours.

---

## Solution

Add a **Chat History panel** to the chat page that lets authenticated users browse, load, and continue past conversations. Guest users will be prompted to log in to access history.

---

## Changes

### 1. Create Chat History Sidebar Component
**New file: `src/components/chat/ChatHistory.tsx`**

A sidebar/panel component that:
- Fetches all past `chat_sessions` for the logged-in user (ordered by most recent)
- Shows each session with: title, date, symptom badges, urgency level
- Highlights the currently active session
- Has a "New Chat" button to start a fresh conversation
- Clicking a session loads its messages from `chat_messages` table
- For guests, shows a "Log in to save chat history" prompt

### 2. Update `useChatSession.tsx` Hook
- Add a `loadSession(sessionId)` function that fetches messages from `chat_messages` for a given session and restores the session state (phase, symptoms, urgency from `chat_sessions`)
- Add a `resetSession()` function to start a new conversation (clears current state, sets sessionId to null)
- Fetch existing sessions list using the `chat_sessions` table
- On `initializeChat`, check if there's a recent active session to resume instead of always creating a new one

### 3. Update `Chat.tsx` Page Layout
- Add the ChatHistory panel as a collapsible sidebar on the left (desktop) or a dropdown/sheet (mobile)
- Pass session selection handler to ChatHistory
- When a session is selected, call `loadSession(sessionId)` to restore that conversation
- Update `initializeChat` to not overwrite if a session is already loaded
- Add a "New Chat" button in the header

### 4. Update `useGuestChat.tsx` Hook
- Save full message content to localStorage (not sanitized) so guests can at least see their current session if they refresh
- Extend retention from 24 hours to 7 days
- Add a prompt suggesting login to save history permanently

---

## Technical Details

### ChatHistory Component
```text
Props:
- sessions: ChatSession[] (from chat_sessions table)
- activeSessionId: string | null
- onSelectSession: (sessionId: string) => void
- onNewChat: () => void
- isAuthenticated: boolean
- loading: boolean
```

### loadSession function (in useChatSession)
```typescript
const loadSession = async (sessionId: string) => {
  // 1. Fetch session metadata from chat_sessions
  // 2. Fetch all messages from chat_messages where session_id = sessionId
  // 3. Restore sessionState with messages, phase, symptoms, urgency
  // 4. Set sessionId in state
};
```

### Database Query for History
```sql
-- Already supported by existing RLS policies:
SELECT * FROM chat_sessions 
WHERE user_id = auth.uid() 
ORDER BY updated_at DESC;

SELECT * FROM chat_messages 
WHERE session_id = ? 
ORDER BY created_at ASC;
```

No database migrations needed -- the existing `chat_sessions` and `chat_messages` tables with their RLS policies already support this.

### Chat Page Layout (Desktop)
```text
+------------------+--------------------------------+
| Chat History     | Active Conversation            |
| [New Chat]       |                                |
| - Session 1 (*)  | [Messages area]                |
| - Session 2      |                                |
| - Session 3      | [Input area]                   |
+------------------+--------------------------------+
```

On mobile, the history panel becomes a Sheet (slide-out drawer) triggered by a history icon button.

---

## Files to Change

1. **`src/components/chat/ChatHistory.tsx`** -- New component for session list
2. **`src/hooks/useChatSession.tsx`** -- Add loadSession, resetSession, sessions list
3. **`src/hooks/useGuestChat.tsx`** -- Improve localStorage persistence
4. **`src/pages/Chat.tsx`** -- Add history sidebar, session switching UI

## No Database Changes Required
The existing `chat_sessions` and `chat_messages` tables with their RLS policies already support reading past sessions and messages for the authenticated user.

