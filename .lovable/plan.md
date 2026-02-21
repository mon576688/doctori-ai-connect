

# Improve User Dashboard Messages (Inbox)

The current Inbox is functional but basic. Here are the improvements to make it more user-friendly and feature-rich:

## Improvements

### 1. New Conversation Starter
Currently, patients can only message contacts they've already messaged. Add a "New Message" button that lets patients start a conversation with a doctor from their past appointments -- similar to how the medical records sharing works.

### 2. Online/Offline Status Indicators
Add a green/gray dot on contact avatars to show if the doctor is currently online, using the existing `usePresence` hook already in the codebase.

### 3. Message Timestamps with Date Separators
Messages currently only show time (HH:mm). Add date separator dividers ("Today", "Yesterday", "Jan 15") between message groups so long conversations are easier to follow.

### 4. Empty State with Action
Replace the plain "No conversations yet" text with a helpful empty state that includes an illustration and a button to start a new conversation with a doctor.

### 5. Typing Indicator
Show "typing..." when the other person is composing a message, using Supabase realtime presence/broadcast.

### 6. Read Receipts
Add double-check marks on sent messages to show when they've been read by the recipient.

### 7. Loading States
Add skeleton loaders while contacts and messages load instead of showing nothing.

---

## Technical Details

### File to Change

**`src/components/messaging/Inbox.tsx`** -- All improvements are within this single component.

### New Conversation Flow
- Add a "New Message" button at the top of the contacts list
- On click, open a dialog that queries `appointments` table for doctors the patient has seen
- Selecting a doctor creates a new contact entry and opens the chat

### Presence Integration
- Import and use the existing `usePresence` hook from `src/hooks/usePresence.tsx`
- Show a green dot overlay on the avatar for online contacts

### Date Separators
- Group messages by date
- Insert a centered label ("Today", "Yesterday", or formatted date) between groups

### Typing Indicator
- Use Supabase `channel.track()` to broadcast typing state
- Show an animated "..." bubble when the other user is typing

### Read Receipts
- Add a `CheckCheck` icon (from lucide) below sent messages
- Color it blue/primary when `is_read` is true, gray when unread

### Loading Skeletons
- Show 4-5 skeleton rows in the contacts list while loading
- Show skeleton bubbles in the chat area while messages load

### Updated Empty State
```text
+----------------------------------+
|     [Message Icon Illustration]  |
|     No messages yet              |
|     Start a conversation with    |
|     your healthcare provider     |
|     [New Conversation Button]    |
+----------------------------------+
```

