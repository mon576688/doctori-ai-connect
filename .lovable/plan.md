

# Expand Doctori AI to 300–500 SEO-Optimized Pages

## Architecture Overview

Create three large static data modules (symptoms, conditions, expanded blogs) with rich medical content, two new page templates with structured data, listing/index pages, and a comprehensive static sitemap covering all URLs.

```text
src/data/
  symptoms.ts        ← 150 symptom entries with full content
  conditions.ts      ← 150 condition entries with full content
  blogs.ts           ← expanded to ~100 blog posts

src/pages/
  SymptomPage.tsx    ← /symptoms/:slug template
  ConditionPage.tsx  ← /conditions/:slug template
  SymptomsIndex.tsx  ← /symptoms listing
  ConditionsIndex.tsx← /conditions listing

public/
  sitemap.xml        ← auto-includes all 400+ URLs
```

## Data Structure

### Symptoms (`src/data/symptoms.ts`)
Each of the 150 entries contains:
- `slug`, `name`, `metaTitle`, `metaDescription`
- `overview` (2-3 paragraphs)
- `causes` (list of causes with descriptions)
- `whenToSeeDoctor` (red flags list)
- `homeRemedies` (practical tips)
- `relatedSymptoms` (slugs for internal linking)
- `relatedConditions` (slugs for cross-linking to /conditions/)
- `relatedBlogs` (blog slugs)
- `specialtyRecommendation` (e.g., "Neurology")
- `faq` (3-5 Q&A pairs for FAQ structured data)

Categories: Pain, Respiratory, Digestive, Neurological, Skin, Cardiovascular, Musculoskeletal, General, Mental Health, Women's Health, Children's, ENT, Eye, Urological

### Conditions (`src/data/conditions.ts`)
Each of the 150 entries contains:
- `slug`, `name`, `metaTitle`, `metaDescription`
- `overview`, `symptoms` list, `causes`, `riskFactors`
- `diagnosis`, `treatment`, `prevention`
- `whenToSeeDoctor`
- `relatedSymptoms`, `relatedConditions`, `relatedBlogs`
- `faq` (for structured data)

Categories: Cardiovascular, Respiratory, Endocrine, Neurological, Digestive, Musculoskeletal, Infectious, Mental Health, Skin, Autoimmune, Cancer, Women's Health, Children's, Kidney/Urinary

### Blogs (`src/data/blogs.ts`)
Expand from 61 to ~100 posts. Add a `content` field to each entry with full markdown body (rather than generating generic content in BlogPost.tsx). New posts cover topics that interlink with symptoms/conditions.

## Page Templates

### SymptomPage (`/symptoms/:slug`)
Sections: H1 title → Overview → Common Causes → When to See a Doctor → Home Remedies → Related Symptoms (internal links) → Related Conditions (internal links) → FAQ accordion → CTA card ("Check your symptoms with AI" → /chat)

SEO: `<SEO>` component with unique title/description/canonical. FAQ structured data via JSON-LD script tag. MedicalWebPage schema.

### ConditionPage (`/conditions/:slug`)
Sections: H1 title → Overview → Symptoms → Causes & Risk Factors → Diagnosis → Treatment → Prevention → When to See a Doctor → Related links → FAQ → CTA to /chat

SEO: Same pattern. MedicalCondition structured data.

### Index Pages
- `/symptoms` — grid of all 150 symptoms, searchable/filterable by category
- `/conditions` — grid of all 150 conditions, searchable/filterable by category

Both include SEO metadata and link to individual pages.

### BlogPost.tsx Update
Replace `generateFullContent()` generic fallback with actual `content` field from data. Add CTA section and related symptoms/conditions links at bottom.

## Routes (App.tsx)
Add four new lazy-loaded routes:
```
/symptoms          → SymptomsIndex
/symptoms/:slug    → SymptomPage
/conditions        → ConditionsIndex
/conditions/:slug  → ConditionPage
```

## Sitemap (`public/sitemap.xml`)
Static file listing all ~450 URLs:
- Homepage + existing pages (~20)
- 150 `/symptoms/[slug]` entries
- 150 `/conditions/[slug]` entries
- ~100 `/blog/[slug]` entries
- Index pages `/symptoms`, `/conditions`

All with `lastmod`, `changefreq`, and `priority` values.

## robots.txt
Add `Allow: /symptoms/` and `Allow: /conditions/` explicitly.

## Internal Linking Strategy
- Each symptom page links to 3-5 related symptoms, 2-3 related conditions, and 1-2 blog posts
- Each condition page links to its symptoms, related conditions, and blog posts
- Every content page has a CTA linking to `/chat` (AI symptom checker)
- Blog posts link to relevant symptom/condition pages

## SEO & Structured Data
Each symptom/condition page outputs:
- `<SEO>` with unique title, description, canonical, keywords, og tags
- JSON-LD `FAQPage` schema from the faq array
- JSON-LD `MedicalWebPage` / `MedicalCondition` schema

## SSR Limitation
Lovable runs as a client-side SPA (Vite + React). True SSR is not available. However:
- Google renders JavaScript pages and will index them
- `react-helmet` sets meta tags dynamically
- The service worker denylist already excludes `.xml`, `.txt`, `.json`
- All content is in static data files (no API calls needed to render)

## Implementation Scope
Due to the volume (300+ pages of medical content), this will be split across multiple implementation steps:

**Step 1**: Data files + page templates + routes + sitemap (symptoms data: 150 entries, conditions data: 150 entries)
**Step 2**: Expand blogs to 100 entries with full content
**Step 3**: Cross-linking, structured data, index pages

## Files to Create/Modify
1. **Create** `src/data/symptoms.ts` — 150 symptom entries
2. **Create** `src/data/conditions.ts` — 150 condition entries
3. **Create** `src/pages/SymptomPage.tsx` — symptom template
4. **Create** `src/pages/ConditionPage.tsx` — condition template
5. **Create** `src/pages/SymptomsIndex.tsx` — listing page
6. **Create** `src/pages/ConditionsIndex.tsx` — listing page
7. **Modify** `src/data/blogs.ts` — expand to ~100 posts with content
8. **Modify** `src/pages/BlogPost.tsx` — use content field, add cross-links
9. **Modify** `src/App.tsx` — add new routes
10. **Modify** `src/lib/seo.ts` — add SEO configs for new page types
11. **Rewrite** `public/sitemap.xml` — all 450+ URLs
12. **Modify** `public/robots.txt` — allow new paths

