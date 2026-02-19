

# Fix AI Chat and Doctor Recommendations

## Problems Identified

1. **AI chat is broken** -- The OpenAI API key has exceeded its quota (insufficient_quota error). The edge function calls OpenAI directly instead of using the Lovable AI Gateway which is already available.

2. **AI cannot suggest doctors from the site during conversation** -- The AI only shows doctor recommendations AFTER the conversation reaches the "summary" phase (after 3+ questions). During the conversation itself, the AI has no access to the database and cannot recommend specific doctors from the platform.

3. **Booking flow works but has no providers** -- Only 1 provider exists in the database (in a different city), so most searches show "No doctors found."

---

## Solution

### Phase 1: Migrate AI Chat to Lovable AI Gateway

**File: `supabase/functions/ai-chat-assistant/index.ts`**

Replace the direct OpenAI API call with the Lovable AI Gateway:
- Change the API endpoint from `https://api.openai.com/v1/chat/completions` to `https://ai.gateway.lovable.dev/v1/chat/completions`
- Replace `OPENAI_API_KEY` with `LOVABLE_API_KEY` (already auto-provisioned)
- Change model from `gpt-4o-mini` to `google/gemini-3-flash-preview`
- Handle 429 (rate limit) and 402 (payment required) errors properly

### Phase 2: Add Database-Aware Doctor Suggestions in AI Chat

**File: `supabase/functions/ai-chat-assistant/index.ts`**

After the AI generates its response, check if the response contains a specialty recommendation or if the conversation has gathered enough symptoms. Then:
- Query the `providers_public` view joined with relevant profile data to find matching doctors
- Append a section to the AI response listing actual doctors from the platform with their names, specialties, and booking links
- This happens inline during the conversation, not just at the summary phase

Updated system prompt will instruct the AI:
- When recommending a specialist type, mention that matching doctors from the platform will be shown
- Never fabricate doctor names -- only reference doctors that exist in the database

**New logic flow in the edge function:**
1. AI generates response as usual
2. Parse the response for specialty keywords (e.g., "neurologist", "cardiologist")
3. If a specialty is detected, query the database for matching approved providers
4. Append a formatted list of matching providers to the response with booking links

### Phase 3: Update System Prompt

Update the system prompt to:
- Tell the AI that after analyzing symptoms, matching doctors from the Doctori AI platform will be automatically shown
- Remove the instruction to "suggest doctors from our database" (since the AI doesn't have direct DB access -- the backend handles this)
- Add instruction: "After your assessment, the system will automatically show matching healthcare providers from our platform. Inform the user that they can book directly with these providers."

---

## Technical Details

### Edge Function Changes (`supabase/functions/ai-chat-assistant/index.ts`)

```text
Key changes:
1. API endpoint: api.openai.com -> ai.gateway.lovable.dev
2. API key: OPENAI_API_KEY -> LOVABLE_API_KEY
3. Model: gpt-4o-mini -> google/gemini-3-flash-preview
4. Add provider lookup after AI response generation
5. Query providers_public view for matching specialty
6. Append provider cards data to response JSON
```

The response structure will change from:
```json
{ "response": "AI text...", "usage": {...} }
```
To:
```json
{ 
  "response": "AI text...", 
  "usage": {...},
  "suggestedProviders": [
    { "id": "...", "name": "Dr. ...", "specialty": "...", "city": "..." }
  ]
}
```

### Frontend Changes (`src/pages/Chat.tsx`, `src/hooks/useChatSession.tsx`, `src/hooks/useGuestChat.tsx`)

- Parse `suggestedProviders` from the AI response
- Show inline provider cards within the chat messages (not just at summary phase)
- Keep the existing summary-phase `ProviderRecommendations` component as a comprehensive view
- Show mini provider cards inline when the AI detects a relevant specialty mid-conversation

### Chat Component Updates

- Add a new `InlineProviderCard` component within chat messages
- When `suggestedProviders` is returned in the AI response, render them directly below the AI message
- Each card shows doctor name, specialty, city, and a "Book Now" button linking to `/booking/provider/:id`

---

## Files to Change

1. **`supabase/functions/ai-chat-assistant/index.ts`** -- Migrate to Lovable AI Gateway, add provider lookup
2. **`src/hooks/useChatSession.tsx`** -- Handle suggestedProviders in response
3. **`src/hooks/useGuestChat.tsx`** -- Handle suggestedProviders in response  
4. **`src/pages/Chat.tsx`** -- Render inline provider suggestions within chat messages

---

## Expected Outcome

- AI chat will work again (no more quota errors)
- During conversation, when the AI identifies a likely specialty need, matching doctors from the platform database will be shown inline
- Users can book directly from the chat interface
- The summary-phase comprehensive recommendations still work as before
- All doctor suggestions come exclusively from the site's database

