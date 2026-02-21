

# Improve AI Chat Flow -- Full Doctor-Style Consultation

## Problem

The current chat triggers a report/summary after only 3 user replies, interrupting the AI's medical interview. The system prompt also doesn't instruct the AI to provide home remedies or precautions before recommending a doctor.

## Desired Flow

```text
1. User describes symptoms
2. AI asks doctor-style questions ONE BY ONE (6-8 questions minimum)
3. AI provides home remedies for temporary relief
4. AI tells user what NOT to do (precautions)
5. AI recommends a doctor specialty/category
6. System finds and displays matching doctors from the database
7. AI generates a structured chat summary for showing to a doctor
8. "View Summary" button appears
```

## Changes

### 1. Update System Prompt (`supabase/functions/ai-chat-assistant/index.ts`)

Enhance the system prompt to include explicit phases the AI must follow:

- After gathering enough info (at least 6-8 questions), provide:
  - **Home Remedies**: Safe, temporary relief suggestions
  - **What NOT to Do**: Precautions and things to avoid
  - **Doctor Recommendation**: Specialty type to consult
  - **Structured Summary**: Formatted summary suitable for showing to a doctor

Add a special marker (e.g., `[SUMMARY_READY]`) at the end of the AI's final summary message so the client can detect when the full consultation is complete.

### 2. Fix Phase Logic (`src/hooks/useChatSession.tsx`)

- Remove the hard-coded `currentQuestionIndex >= 3` trigger that forces early summary generation
- Instead, let the AI drive the conversation naturally through all its steps
- Detect the `[SUMMARY_READY]` marker in the AI response to transition to the summary phase
- Only then trigger `generateAssessment()` and show the "View Summary" button
- Increase from 3 to 8+ exchanges before allowing summary

### 3. Fix Guest Chat Phase Logic (`src/hooks/useGuestChat.tsx`)

- Same fix: remove the `currentQuestionIndex >= 3` early cutoff
- Detect `[SUMMARY_READY]` marker to transition to summary phase
- Allow the full consultation flow for guest users too

### 4. Update Summary Generation

- When `[SUMMARY_READY]` is detected, strip the marker from the displayed message
- Transition to summary phase which triggers provider recommendations
- The summary message from AI will already contain the structured format for the doctor

## Technical Details

### System Prompt Additions

The prompt will instruct the AI to follow this exact sequence after gathering symptoms:

1. Ask 6-8 medical questions (one at a time)
2. Provide "Home Remedies" section with safe temporary relief
3. Provide "What to Avoid" section with precautions
4. Recommend specialist type
5. Output a "Doctor Visit Summary" with all collected info formatted for a doctor
6. End with `[SUMMARY_READY]` marker

### Phase Detection Logic

```text
Instead of counting messages:
- Keep phase as "assessment" throughout the Q&A
- When AI response contains [SUMMARY_READY]:
  - Strip marker from display
  - Set phase to "summary"
  - Trigger generateAssessment()
  - Show provider recommendations
  - Show "View Summary" button
```

### Files to Change

1. **`supabase/functions/ai-chat-assistant/index.ts`** -- Enhanced system prompt with home remedies, precautions, and summary marker
2. **`src/hooks/useChatSession.tsx`** -- Remove early cutoff, add marker detection
3. **`src/hooks/useGuestChat.tsx`** -- Same marker detection logic

