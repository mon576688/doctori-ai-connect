

# Translate Health Tips Page to Bengali

## Problem

The `/health-tips` page has all content hardcoded in English -- both the page header text in `HealthTipsBD.tsx` and the entire health tips dataset in `src/data/healthTipsBD.ts` (20+ sections, ~500 lines of English content).

## Approach

Since the health tips data is extensive (~20 sections with categories, titles, headings, and bullet points), we will create a **Bengali version of the dataset** and switch between them based on the active language. This is cleaner than creating 300+ individual translation keys.

### Step 1: Add page-level translation keys

Add keys to `en/common.json` and `bn/common.json`:

- `healthTips.title`: "Health Tips" / "স্বাস্থ্য পরামর্শ"
- `healthTips.subtitle`: "Practical, locally-relevant guidance..." / "স্বাস্থ্যকর জীবনযাপনের জন্য ব্যবহারিক, স্থানীয়ভাবে প্রাসঙ্গিক নির্দেশনা"

### Step 2: Create Bengali health tips dataset

**New file: `src/data/healthTipsBD_bn.ts`**

Full Bengali translation of all 20+ sections. Each section translated:
- Categories (e.g., "Dengue Prevention" -> "ডেঙ্গু প্রতিরোধ")
- Titles (e.g., "Dengue Awareness during Monsoon" -> "বর্ষায় ডেঙ্গু সচেতনতা")
- Headings and all bullet points translated to natural Bengali

### Step 3: Update HealthTipsBD.tsx

- Add `useTranslation('common')` hook
- Import both English and Bengali datasets
- Select dataset based on `i18n.language`: if `bn`, use Bengali data; otherwise English
- Use `t()` for page header strings

### Files to Create

1. `src/data/healthTipsBD_bn.ts` -- Full Bengali translation of health tips data

### Files to Modify

1. `src/pages/HealthTipsBD.tsx` -- Add i18n hook, language-based data selection
2. `src/locales/en/common.json` -- Add `healthTips.title` and `healthTips.subtitle`
3. `src/locales/bn/common.json` -- Add Bengali translations for those keys

