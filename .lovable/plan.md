

# Fix AI Chat Flow -- All Identified Errors

## Issues to Fix

1. **Aggressive Urgency Alert**: The red "URGENT MEDICAL ATTENTION" banner shows for both `high` and `emergency` urgency. "Severe headache" triggers `high`, which is too aggressive. Only true emergencies (chest pain, can't breathe, etc.) should show the alert.

2. **Context Loss / AI Repeating Questions**: The `summarizeConversation()` function in the edge function truncates conversation to only the last 4 messages after 5 total. This causes the AI to lose track of what it already asked and repeat questions.

3. **[SUMMARY_READY] Marker Not Firing**: The system prompt needs stronger, more explicit instructions to guarantee the AI outputs the `[SUMMARY_READY]` marker after its final assessment. The current instructions are followed loosely by the model.

4. **search-providers Edge Function Crash**: Logs show `"Could not find a relationship between 'profiles' and 'doctors'"`. The function uses a PostgREST join (`profiles` -> `doctors!inner`) that doesn't work. It should use the `providers_public` view (which already works in the ai-chat-assistant function).

## Changes

### 1. Fix Urgency Alert (Chat.tsx, line 362)

Change the condition from showing the alert for both `high` and `emergency` to only `emergency`:

```tsx
// Before
{(chat.sessionState.urgencyLevel === "high" || chat.sessionState.urgencyLevel === "emergency") && (

// After  
{chat.sessionState.urgencyLevel === "emergency" && (
```

### 2. Fix Context Loss (ai-chat-assistant/index.ts, summarizeConversation)

Increase the conversation window from 4 recent messages to 10, and provide a better summary of older messages so the AI retains context:

```typescript
const summarizeConversation = (messages: any[]) => {
  if (messages.length <= 12) return messages;
  const systemMessage = messages[0];
  const recentMessages = messages.slice(-10);
  const olderMessages = messages.slice(1, -10);
  
  // Extract key info from older messages
  const userMessages = olderMessages
    .filter((m: any) => m.role === 'user')
    .map((m: any) => m.content)
    .join('; ');
  
  const summaryContent = `Previous conversation summary: The patient has provided the following information so far: ${userMessages}. DO NOT ask these questions again. Continue from where you left off.`;
  
  return [
    systemMessage,
    { role: "system", content: summaryContent },
    ...recentMessages
  ];
};
```

### 3. Strengthen [SUMMARY_READY] Instruction (ai-chat-assistant/index.ts)

Add a stronger, repeated instruction at the end of the system prompt to ensure the model outputs the marker. Add a "question counter" instruction:

- Add to the prompt: "After your 8th question answer from the user, you MUST provide the full Phase 2 assessment in your next response. You MUST end that response with [SUMMARY_READY] on its own line. This is mandatory."
- Repeat the marker instruction to increase compliance.

### 4. Fix search-providers Edge Function

Replace the broken `profiles` + `doctors!inner` join with a query to the `providers_public` view (which already exists and works):

```typescript
let providersQuery = supabase
  .from('providers_public')
  .select('id, first_name, last_name, name, photo_url, city, address, phone, latitude, longitude, provider_type, specialty, consultation_fee, experience, bio, verified');
```

Remove the `.eq('role', 'provider')` and `.eq('approval_status', 'approved')` filters since the view already handles that.

### Files to Change

| File | Change |
|------|--------|
| `src/pages/Chat.tsx` (line 362) | Show urgency alert only for `emergency`, not `high` |
| `supabase/functions/ai-chat-assistant/index.ts` | Fix `summarizeConversation` to keep 10 recent messages; strengthen `[SUMMARY_READY]` instructions |
| `supabase/functions/search-providers/index.ts` | Use `providers_public` view instead of broken `profiles`+`doctors` join |

