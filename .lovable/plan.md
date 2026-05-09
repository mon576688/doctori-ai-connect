## Context

The project already has a working `SEO` component (`src/components/SEO.tsx`) using `react-helmet`, and a centralized `PAGE_SEO` map in `src/lib/seo.ts`. Almost every page already imports `<SEO />` with values from `PAGE_SEO`. So the duplicate-meta problem is **not** "no SEO component exists" — it's that:

1. Some titles/descriptions don't match the new copy you provided.
2. `og:url` falls back to a static `canonicalUrl` (and on pages without `canonicalPath`, no `og:url` is emitted at all), so it doesn't always reflect the current page.
3. Routes in your spec (`/blood-bank`, `/medicines`, `/ai-chat`) don't match the actual routes in `App.tsx` (`/blood-donation`, `/medicine`, `/chat`). I'll apply the new copy to the existing routes — no route renames.

No need to install `react-helmet-async`; `react-helmet` is already wired and working.

## Changes

### 1. `src/lib/seo.ts` — update copy for the 6 pages

| Key | New title | New description |
|---|---|---|
| `home` | `Doctori AI - Your AI Health Assistant \| Find Doctors 24/7` | `Chat with AI to check symptoms, find verified doctors near you, locate blood banks, and book appointments online. Free & available 24/7.` |
| `doctors` | `Find Verified Doctors Near You \| Doctori AI` | `Browse and book appointments with verified healthcare professionals near you. Filter by specialty, location, and availability.` |
| `blog` | `Health Blog, Tips & Medical Advice \| Doctori AI` | `Expert health articles, wellness tips, and medical guidance to help you live healthier.` |
| `bloodDonation` | `Find Blood Banks & Donate Blood Near You \| Doctori AI` | `Locate blood banks near you, register as a blood donor, and help save lives in your community.` |
| `medicine` | `Medicine Search & Drug Interaction Checker \| Doctori AI` | `Search medications, understand dosages, and check for drug-to-drug interactions in our comprehensive medicine database.` |
| `chat` | `Free AI Health Chat - Talk to AI Doctor 24/7 \| Doctori AI` | `Describe your symptoms and get instant AI-powered health guidance. Free, private, and available 24/7.` |

### 2. `src/components/SEO.tsx` — make `og:url` dynamic

- Always emit `og:url` and `<link rel="canonical">` based on the current page URL.
- Resolution order:
  1. If `canonicalPath` is provided → `https://doctoriai.com{canonicalPath}` (preferred, normalized).
  2. Else, fall back to `window.location.origin + window.location.pathname` (no query string, no hash) so dynamic routes (e.g. `/doctor/:id`, `/blog/:slug`) get a per-page URL instead of inheriting the home URL from `index.html`.
- Guard `window` access for SSR safety.

### 3. `index.html` — neutralize stale defaults

The static `<title>`, `<meta name="description">`, `og:title`, `og:description`, and `og:url` in `index.html` are what crawlers see before React hydrates and what shows up if a page forgets to render `<SEO />`. I'll keep them generic (home-page values) so they're at least correct as a fallback, and leave per-page overrides to `<SEO />`. No structural change beyond updating those 5 tags to match the new home copy.

## Out of scope

- No route renames (`/blood-donation`, `/medicine`, `/chat` stay as-is — they're linked from the navbar, footer, sitemap, and many internal links).
- No switch to `react-helmet-async` (current `react-helmet` works; switching would require wrapping `App` in a provider and adds risk for zero benefit here).
- No changes to pages that already have correct, page-specific SEO (About, Contact, Blog posts, etc.).
