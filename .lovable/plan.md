

# Fix Bengali (Bangla) Translation Coverage

## Problem Found

The Bengali translation files exist and have good translations, but most pages **don't use them**. They have hardcoded English strings instead of calling `useTranslation()`.

### Current Status

| Page/Component | Uses i18n? | Bengali translations exist? |
|---|---|---|
| Navbar | Yes | Yes |
| Footer | Yes | Yes |
| Chat | Yes | Yes |
| **Index.tsx (Homepage)** | **No -- hardcoded English** | Yes (bn/home.json ready but unused) |
| **AIAnalysis.tsx** | **No -- hardcoded English** | No translations file |
| **Medicine.tsx** | **No -- hardcoded English** | No translations file |
| **Doctors.tsx** | **No -- hardcoded English** | No translations file |
| **HealthTipsBD.tsx** | **No -- hardcoded English** | No translations file |

The homepage (`Index.tsx`) is the biggest issue -- it has ~800 lines of hardcoded English text, but `bn/home.json` already has all the Bengali translations ready and waiting. They're just never loaded.

## Fix Plan

### Step 1: Wire up Index.tsx to use existing Bengali translations

Add `useTranslation('home')` to `Index.tsx` and replace all hardcoded strings with `t()` calls. The `bn/home.json` file already has all the translations -- they just need to be connected.

Missing keys to add to `bn/home.json` and `en/home.json`:
- `hero.aiAnalysis` -- "এআই স্বাস্থ্য বিশ্লেষণ" / "AI Health Analysis"
- `hero.searchMedicine` -- "ওষুধ খুঁজুন" / "Search Medicine"

### Step 2: Add Bengali translations for AIAnalysis.tsx

Add new keys to `bn/common.json` (or a new namespace) for the AI Analysis page:
- Page title, tab labels (Prescription, Medical Report, Symptom Analysis)
- Upload instructions, analyze button, results heading, disclaimer
- ~20 new translation keys

Wire `AIAnalysis.tsx` to use `useTranslation()`.

### Step 3: Add Bengali translations for Medicine.tsx

Add translation keys for the Medicine page:
- Page title, search placeholder, tab labels
- Section headings (Uses, Dosage, Side Effects, Precautions, etc.)
- Disclaimer text, interaction checker labels
- ~30 new translation keys

Wire `Medicine.tsx` to use `useTranslation()`.

### Step 4: Add Bengali translations for Doctors.tsx

Add translation keys for the Find Doctors page:
- Page title, search/filter labels, specialty names
- Card labels (experience, fee, verified, etc.)
- ~15 new translation keys

Wire `Doctors.tsx` to use `useTranslation()`.

## Files to Modify

1. `src/pages/Index.tsx` -- Add `useTranslation('home')`, replace hardcoded strings with `t()` calls
2. `src/pages/AIAnalysis.tsx` -- Add `useTranslation('common')`, replace hardcoded strings
3. `src/pages/Medicine.tsx` -- Add `useTranslation('common')`, replace hardcoded strings
4. `src/pages/Doctors.tsx` -- Add `useTranslation('common')`, replace hardcoded strings
5. `src/locales/en/home.json` -- Add missing keys (aiAnalysis, searchMedicine)
6. `src/locales/bn/home.json` -- Add missing keys
7. `src/locales/en/common.json` -- Add keys for Medicine, AIAnalysis, Doctors pages
8. `src/locales/bn/common.json` -- Add Bengali translations for all new keys

## No new dependencies needed

Uses existing `react-i18next` setup and translation infrastructure.

