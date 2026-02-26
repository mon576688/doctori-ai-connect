

# SEO Content Optimization for All Pages, Buttons & Functions

## Problem

Several pages are missing the `<SEO>` component entirely, many buttons/links lack `aria-label` attributes (hurting accessibility SEO), and the `index.html` is missing structured data (JSON-LD schema) that helps Google understand the site. Links also lack descriptive `title` attributes for better crawlability.

## What Will Be Done

### 1. Add SEO component to pages that are missing it

These pages currently have NO `<SEO>` tag or use raw `<Helmet>` instead of the standardized component:

| Page | Current State |
|---|---|
| `AIAnalysis.tsx` | No SEO at all |
| `BMICalculator.tsx` | Raw `<Helmet>` instead of `<SEO>` component |
| `ChatSummary.tsx` | No SEO |
| `Search.tsx` | No SEO |
| `DoctorProfile.tsx` | No SEO |
| `UserProfile.tsx` | No SEO |

Add the `<SEO>` component with proper title, description, and canonical path to each.

Add new entries to `PAGE_SEO` in `src/lib/seo.ts`:
- `aiAnalysis`: "AI Health Analysis - Prescription & Report Scanner | Doctori AI"
- `search`: "Search Doctors, Medicine & Health Articles | Doctori AI"
- `chatSummary`: "Chat Summary - Your Health Consultation Report | Doctori AI"

### 2. Add `aria-label` to all interactive elements

Currently only 5 elements across the entire app have `aria-label`. Add descriptive labels to:

**Navbar (`Navbar.tsx`)**:
- Search input: `aria-label="Search doctors, medicine, and health articles"`
- Mobile menu button: `aria-label="Open navigation menu"` / `"Close navigation menu"`
- Login button: `aria-label="Log in to your account"`
- Logout button: `aria-label="Sign out"`
- Language selector: already has label from component

**Footer (`Footer.tsx`)**:
- "Start Chat Now" button: `aria-label="Start AI health chat"`
- "Become a Provider" button: `aria-label="Register as a healthcare provider"`
- Social media links: `aria-label="Follow us on Facebook"`, etc.
- Email subscribe input: `aria-label="Enter email for health updates"`

**Homepage (`Index.tsx`)**:
- Hero buttons: `aria-label` matching the action (e.g., "Chat with AI health assistant", "Book a doctor appointment online")
- Feature cards that are links: `aria-label` describing the destination
- Doctor profile cards: `aria-label="View Dr. Sarah Johnson's profile"`

### 3. Add JSON-LD structured data to `index.html`

Add Organization, WebSite, and MedicalOrganization schema markup so Google shows rich results:

```json
{
  "@context": "https://schema.org",
  "@type": ["MedicalOrganization", "WebApplication"],
  "name": "Doctori AI",
  "url": "https://doctoriai.com",
  "description": "AI-powered health assistant...",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0" }
}
```

Also add `WebSite` schema with `SearchAction` so Google can show a search box in results:

```json
{
  "@type": "WebSite",
  "url": "https://doctoriai.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://doctoriai.com/search?q={search_term_string}"
  }
}
```

### 4. Add `title` attributes to key navigation links

Add `title` attributes to links in Navbar and Footer for better SEO signals:
- `title="Chat with AI health assistant"` on the AI Health Assistant link
- `title="Find and book verified doctors near you"` on Find Doctors
- `title="Search medicine information and drug interactions"` on Search Medicine

### 5. Update sitemap with missing pages

Add these missing pages to `public/sitemap.xml`:
- `/ai-analysis` (priority 0.8)
- `/search` (priority 0.7)
- `/doctor-directory` (priority 0.7)
- `/install` (priority 0.5)

## Files to Modify

1. **`src/lib/seo.ts`** -- Add `PAGE_SEO` entries for `aiAnalysis`, `search`, `chatSummary`
2. **`src/pages/AIAnalysis.tsx`** -- Add `<SEO>` component
3. **`src/pages/BMICalculator.tsx`** -- Replace raw `<Helmet>` with `<SEO>` component
4. **`src/pages/ChatSummary.tsx`** -- Add `<SEO>` component
5. **`src/pages/Search.tsx`** -- Add `<SEO>` component
6. **`src/components/Navbar.tsx`** -- Add `aria-label` and `title` to links/buttons
7. **`src/components/Footer.tsx`** -- Add `aria-label` and `title` to links/buttons
8. **`src/pages/Index.tsx`** -- Add `aria-label` to hero buttons and card links
9. **`index.html`** -- Add JSON-LD structured data (Organization + WebSite + SearchAction)
10. **`public/sitemap.xml`** -- Add missing page URLs

## No new dependencies needed

