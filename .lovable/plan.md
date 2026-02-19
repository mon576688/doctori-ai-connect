

# Drug Interaction Checker

## What We're Building

A new "Check Interactions" tab on the Medicine page where users can enter 2-6 medicines and get a safety report showing which drugs may interact with each other, how severe the interaction is, and what to do about it.

We'll also fix the existing medicine lookup which currently uses OpenAI directly (likely hitting quota errors) by migrating it to the Lovable AI Gateway.

---

## Changes Overview

### 1. New Edge Function: Drug Interaction Checker

**New file: `supabase/functions/drug-interaction-checker/index.ts`**

- Uses the Lovable AI Gateway (`ai.gateway.lovable.dev`) with `google/gemini-3-flash-preview`
- Accepts 2-6 medicine names
- Returns structured JSON with:
  - Pairwise interactions (drug1, drug2, severity, description, recommendation)
  - General warnings
  - Overall safety summary (safe/not safe to combine)
- Severity levels: none, mild, moderate, severe, contraindicated

### 2. Migrate Medicine Lookup to Lovable AI Gateway

**File: `supabase/functions/medicine-lookup/index.ts`**

- Switch from `api.openai.com` to `ai.gateway.lovable.dev`
- Replace `OPENAI_API_KEY` with `LOVABLE_API_KEY` (from `Deno.env.get`)
- Change model to `google/gemini-3-flash-preview`
- Fixes potential quota errors with the current OpenAI setup

### 3. Add Tabbed UI to Medicine Page

**File: `src/pages/Medicine.tsx`**

Add two tabs using the existing Tabs component:

- **Tab 1: "Medicine Lookup"** -- current search functionality, unchanged
- **Tab 2: "Interaction Checker"** -- new multi-medicine input with results

The Interaction Checker tab includes:
- Dynamic list of medicine input fields (starts with 2, add up to 6)
- Add/remove buttons for each field
- "Check Interactions" submit button
- Color-coded result cards by severity:
  - Green (none): No known interaction
  - Yellow (mild): Minor interaction, usually safe
  - Orange (moderate): Use with caution
  - Red (severe): Significant risk
  - Dark red (contraindicated): Do not combine
- Medical disclaimer

### 4. Register New Function

**File: `supabase/config.toml`**

Add `drug-interaction-checker` with `verify_jwt = false` (same as medicine-lookup).

---

## Technical Details

### Interaction Checker Response Format

```text
{
  "interactions": [
    {
      "drug1": "Aspirin",
      "drug2": "Warfarin",
      "severity": "severe",
      "description": "Both thin the blood, increasing bleeding risk",
      "recommendation": "Do not combine without doctor supervision"
    }
  ],
  "generalWarnings": ["Always inform your doctor about all medications"],
  "safeToTakeTogether": false
}
```

### UI Layout

```text
+------------------------------------------+
| [Medicine Lookup]  [Interaction Checker]  |
+------------------------------------------+
| Enter medicines to check interactions:    |
|                                           |
| Medicine 1: [Aspirin         ] [X]        |
| Medicine 2: [Warfarin        ] [X]        |
|                                           |
| [+ Add Medicine]  [Check Interactions]    |
+------------------------------------------+
| RESULTS                                   |
| [RED] Aspirin + Warfarin                  |
| Severity: Severe                          |
| Both drugs thin the blood...              |
| Recommendation: Do not combine...         |
|                                           |
| Overall: NOT safe to take together        |
+------------------------------------------+
```

### Severity Color Mapping

| Severity        | Color         | Badge Style   |
|----------------|---------------|---------------|
| none           | Green         | outline       |
| mild           | Yellow/Amber  | secondary     |
| moderate       | Orange        | default       |
| severe         | Red           | destructive   |
| contraindicated| Dark red/bold | destructive   |

---

## Files to Change

1. **`supabase/functions/drug-interaction-checker/index.ts`** -- New edge function
2. **`supabase/functions/medicine-lookup/index.ts`** -- Migrate to Lovable AI Gateway
3. **`supabase/config.toml`** -- Register new function
4. **`src/pages/Medicine.tsx`** -- Add tabs and interaction checker UI

## No Database Changes Required

Interaction results are computed on-the-fly (too many possible combinations to cache). The existing `medicine_cache` table continues to work for individual lookups.

