

# Update AI Chat Assistant System Prompt

## What Changes

Replace the current system prompt in `supabase/functions/ai-chat-assistant/index.ts` with the new comprehensive prompt the user provided. The new prompt adds:

- **Automatic language detection** (Bangla/English) instead of relying on session context
- **Stricter medical safety rules** (no diagnoses, no prescriptions, no dosages)
- **Structured 5-step flow**: Symptom Collection, Health Guidance, Home Care, Doctor Recommendation, Booking CTA
- **Emergency handling** with country-specific numbers
- **Platform-focused ending** that always encourages booking on Doctori AI
- **Bangla example responses** built into the prompt

## File to Change

| File | Change |
|------|--------|
| `supabase/functions/ai-chat-assistant/index.ts` | Replace `getSystemPrompt()` function with the new comprehensive prompt |

## Technical Details

### Updated `getSystemPrompt()` function

- Incorporate the full prompt text provided by the user as the system prompt
- Keep the existing user context injection (registered user info) -- append it after the new prompt
- Keep the `[SUMMARY_READY]` marker instruction at the end (already in the new prompt's Step 4/5 flow -- will adapt to trigger after the doctor recommendation step)
- Keep the language parameter but enhance it: the new prompt handles language detection automatically, so the explicit language instruction becomes a fallback
- Emergency number: use `999` for Bangladesh context (matching the Bangla locale) and `911` as default

### What stays the same

- Specialty detection logic (`detectSpecialties`, `SPECIALTY_KEYWORDS`)
- Provider matching logic (`findMatchingProviders`)
- Conversation summarization (`summarizeConversation`)
- Rate limiting, CORS, error handling
- The `[SUMMARY_READY]` marker system (integrated into the new Step 4)

### Key adaptations from the user's prompt

The raw prompt will be adapted slightly to work within the existing technical flow:
- The `[SUMMARY_READY]` marker instruction will be added at the end of Step 4 (Doctor Recommendation) since the frontend depends on it
- The "View Doctors Near Me" / "Book Appointment" buttons mentioned in Step 5 are already handled by the frontend when it detects `[SUMMARY_READY]` and suggested providers
- The "Data & Reporting" section maps to the existing chat summary/PDF features

