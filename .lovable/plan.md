

# Single "AI Analysis" Button with 3 Tools

## Overview
Instead of 3 separate buttons on the homepage, add **one button** ("AI Health Analysis") that navigates to a single page with tabs/cards for all three analysis tools: Prescription Analysis, Medical Report Analysis, and Symptom Analysis.

## Homepage Change

**File: `src/pages/Index.tsx`** (lines 76-92)

Add one new button between "Start Free Chat" and "Book Appointment":

```text
[Start Free Chat] [AI Health Analysis] [Book Appointment] [Blood Donation]
```

The button uses a medical/healing variant with a `FileText` or `Stethoscope` icon and links to `/ai-analysis`.

## New Page: AI Analysis Hub

**File: `src/pages/AIAnalysis.tsx`**

A single page with three tab panels (using existing Tabs UI component):

- **Tab 1 -- Prescription Analysis**: Upload a prescription photo. AI extracts medicine names, identifies drug class, explains uses, rewrites clearly.
- **Tab 2 -- Medical Report Analysis**: Upload a medical report photo/file. AI highlights key values, explains medical terms, summarizes findings.
- **Tab 3 -- Symptom Analysis**: Upload an image of visible symptoms or type a description. AI analyzes and provides condition insights, precautions, and when to see a doctor.

Each tab contains:
- Image upload area (drag-and-drop + file picker, jpg/png, max 10MB)
- Text input area (optional for prescription/report, primary for symptom text input)
- "Analyze" button
- Results display area (structured markdown-style output)
- Medical disclaimer

## New Edge Function

**File: `supabase/functions/analyze-medical/index.ts`**

Single edge function handling all 3 types via a `type` parameter:

- **Input**: `{ type: 'prescription' | 'report' | 'symptom', text?: string, imageBase64?: string }`
- Uses Lovable AI Gateway (Gemini model with vision) with type-specific system prompts
- Returns structured analysis text
- `verify_jwt = false` for guest access

System prompts:
- **Prescription**: Extract medicine names, drug class/group, uses, rewrite clearly
- **Report**: Highlight abnormal values, explain terms simply, summarize findings
- **Symptom**: Analyze symptoms, suggest possible conditions, recommend when to see a doctor

All responses end with: "This is for informational purposes only and does not replace professional medical advice."

## Route Registration

**File: `src/App.tsx`** -- Add one route:
```
/ai-analysis -> AIAnalysis
```

## Config

**File: `supabase/config.toml`** -- Add:
```toml
[functions.analyze-medical]
verify_jwt = false
```

## Files to Create
1. `supabase/functions/analyze-medical/index.ts`
2. `src/pages/AIAnalysis.tsx`

## Files to Modify
1. `src/pages/Index.tsx` -- Add 1 new button
2. `src/App.tsx` -- Add 1 new route
3. `supabase/config.toml` -- Add function config

## Dependencies
None new. Uses existing UI components (Tabs, Card, Button), Lovable AI Gateway, and base64 encoding.

