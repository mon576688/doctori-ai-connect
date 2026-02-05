
# SEO and Performance Implementation Plan for Doctori AI

## Executive Summary
This plan outlines a comprehensive SEO and performance optimization strategy for the Doctori AI health platform. The implementation will improve search engine visibility, page load speed, social sharing, and Core Web Vitals scores.

---

## Current State Analysis

### What Exists:
- Basic meta tags in `index.html` (title, description, OG tags)
- `react-helmet` already installed and used in BMICalculator.tsx as a pattern
- Basic `robots.txt` allows all crawlers but lacks disallow rules and sitemap reference
- Blog.tsx and HealthTipsBD.tsx use `useEffect` to set document.title and meta description
- Blog images already use `loading="lazy"` attribute
- Suspense/lazy loading used for some routes (HealthTipsBD, UserProfile, Search)

### What Needs Improvement:
- Most pages lack unique meta titles and descriptions
- No comprehensive SEO component/hook for consistent meta management
- robots.txt needs disallow rules for private routes
- No sitemap.xml
- Missing OG/Twitter meta tags on individual pages
- Limited lazy loading of images across the app
- No loading skeletons in many data-fetching components
- Need canonical URLs on all pages

---

## Implementation Plan

### Phase 1: SEO Infrastructure

#### 1.1 Create a Reusable SEO Component
**File:** `src/components/SEO.tsx`

Create a centralized SEO component using `react-helmet` that:
- Sets page-specific title (50-60 chars)
- Sets meta description (150-160 chars)
- Adds canonical URL
- Includes Open Graph meta tags (og:title, og:description, og:image, og:url, og:type)
- Includes Twitter Card meta tags (twitter:card, twitter:title, twitter:description, twitter:image)
- Supports page-specific preview images

```text
Props Interface:
- title: string (required)
- description: string (required)
- canonicalPath?: string
- ogImage?: string (defaults to /og-image.png)
- ogType?: string (defaults to "website")
- noIndex?: boolean (for private pages)
```

#### 1.2 Define SEO Constants
**File:** `src/lib/seo.ts`

Create a centralized SEO configuration file with:
- Site name and base URL
- Default meta values
- Page-specific SEO data for all public pages
- Keywords mapping per page category

---

### Phase 2: Page-Level SEO Implementation

Add the SEO component to each public page with unique, optimized content:

| Page | Route | Meta Title (50-60 chars) | Meta Description (150-160 chars) |
|------|-------|--------------------------|----------------------------------|
| Home | `/` | Doctori AI - AI Health Assistant & Doctor Booking | Chat with Doctori AI for symptom guidance, find trusted doctors near you, and book appointments 24/7. Your virtual health companion. |
| AI Health Assistant | `/chat` | AI Symptom Checker - Free Health Chat | Doctori AI | Describe your symptoms and get instant AI-powered health guidance. Free 24/7 symptom checker with doctor recommendations. |
| Find Doctors | `/doctors` | Find & Book Doctors Near You | Doctori AI | Search verified healthcare professionals, compare ratings, and book appointments online. Find the right doctor for your needs. |
| Booking | `/booking/*` | Book Doctor Appointment Online | Doctori AI | Schedule appointments with verified doctors in your area. Easy online booking with instant confirmation. |
| Health Blog | `/blog` | Health Blog - Expert Medical Articles | Doctori AI | Read expert health articles on nutrition, fitness, symptoms, and wellness. Evidence-based medical information. |
| Health Tips | `/health-tips` | Bangladesh Health Tips - Dengue, Safety & More | Get practical health tips for Bangladesh: dengue prevention, water safety, heatwave precautions, and maternal care. |
| About Us | `/about` | About Doctori AI - Your Trusted Health Companion | Learn about Doctori AI's mission to make healthcare accessible. HIPAA-compliant AI health guidance platform. |
| Contact | `/contact` | Contact Doctori AI - Get Support | Reach Doctori AI support team. 24/7 AI assistance, human support Mon-Fri. Email, phone, and chat options. |
| Privacy Policy | `/privacy` | Privacy Policy - Data Protection | Doctori AI | How Doctori AI protects your health data. HIPAA-compliant, encrypted, and secure. Your privacy matters. |
| Terms & Conditions | `/terms` | Terms & Conditions - Legal | Doctori AI | Read Doctori AI's terms of service. Platform usage rules, limitations, and user responsibilities. |
| Doctor Verification | `/doctor-verification` | Doctor Verification Policy | Doctori AI | How Doctori AI verifies healthcare providers. Our rigorous credentialing process ensures quality care. |
| Medicine Search | `/medicine` | Medicine Information Search | Doctori AI | Search for detailed medicine information including uses, dosage, side effects, and alternatives. |
| BMI Calculator | `/bmi-calculator` | (Already has SEO) | (Already has SEO) |

**Pages to Update:**
- `src/pages/Index.tsx`
- `src/pages/Chat.tsx`
- `src/pages/Doctors.tsx`
- `src/pages/Blog.tsx`
- `src/pages/BlogPost.tsx` (dynamic)
- `src/pages/HealthTipsBD.tsx`
- `src/pages/About.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Medicine.tsx`
- `src/pages/legal/PrivacyPolicy.tsx`
- `src/pages/legal/TermsAndConditions.tsx`
- `src/pages/legal/DoctorVerificationPolicy.tsx`
- `src/pages/booking/LocationSelect.tsx`
- `src/pages/Reminders.tsx`
- `src/pages/BloodDonation.tsx`

---

### Phase 3: Technical SEO Files

#### 3.1 Update robots.txt
**File:** `public/robots.txt`

```text
User-agent: *
Allow: /

# Disallow private/auth pages
Disallow: /dashboard
Disallow: /dashboard/*
Disallow: /admin
Disallow: /login
Disallow: /register
Disallow: /auth/*
Disallow: /profile
Disallow: /my-prescriptions
Disallow: /provider/*
Disallow: /chat-summary

# Sitemap location
Sitemap: https://doctoriai.com/sitemap.xml
```

#### 3.2 Create Static sitemap.xml
**File:** `public/sitemap.xml`

Generate a static sitemap including:
- All public pages with priority and changefreq
- Blog posts (can be updated manually or via build script)

```text
Priority mapping:
- Homepage: 1.0, daily
- Chat, Doctors, Booking: 0.9, daily
- Blog index: 0.8, daily
- Blog posts: 0.7, weekly
- About, Contact: 0.6, monthly
- Legal pages: 0.4, monthly
```

---

### Phase 4: Performance Optimization

#### 4.1 Lazy Loading Images
Add `loading="lazy"` attribute to all `<img>` tags across:
- `src/pages/Index.tsx` (hero image, doctor images)
- `src/pages/Doctors.tsx` (provider images)
- `src/pages/BlogPost.tsx` (article images, related posts)
- `src/components/DoctorMap.tsx`
- `src/pages/booking/ProviderList.tsx`
- `src/pages/booking/ProviderProfile.tsx`
- Any other image-heavy components

#### 4.2 Add Loading Skeletons
**File:** Create skeleton variants or use existing Skeleton component

Add loading states to:
- `src/pages/Doctors.tsx` - Already has Loader2, add skeleton cards
- `src/pages/booking/ProviderList.tsx` - Add provider card skeletons
- `src/pages/Blog.tsx` - Add blog card skeletons
- `src/pages/Medicine.tsx` - Already has loading state

#### 4.3 Code Splitting Optimization
The app already uses lazy loading for some routes. Extend to:
- Blog.tsx
- BlogPost.tsx  
- Medicine.tsx
- Doctors.tsx
- Legal pages

Update `src/App.tsx` to lazy load more heavy pages.

---

### Phase 5: Semantic HTML Improvements

#### 5.1 Heading Structure Audit
Review and fix heading hierarchy (H1 -> H2 -> H3) on:
- All pages should have exactly one `<h1>`
- Sections should use `<h2>` for main headings
- Sub-sections should use `<h3>`

#### 5.2 Semantic Elements
Ensure proper use of:
- `<header>` for page headers
- `<main>` for primary content
- `<section>` for distinct sections
- `<article>` for blog posts
- `<footer>` for page footers
- `<nav>` for navigation

Note: Layout.tsx already uses `<main>` wrapper with `<Outlet>`. Pages should use `<section>` and `<article>` appropriately.

#### 5.3 Image Alt Text
Audit and improve alt text for all images:
- Hero image: "Doctori AI virtual health assistant interface"
- Doctor images: "[Doctor Name] - [Specialty] at Doctori AI"
- Blog images: Descriptive alt matching article title
- Icons: Use `aria-hidden="true"` for decorative icons

---

## File Changes Summary

### New Files:
1. `src/components/SEO.tsx` - Reusable SEO component
2. `src/lib/seo.ts` - SEO configuration and constants
3. `public/sitemap.xml` - Static sitemap

### Modified Files:
1. `public/robots.txt` - Add disallow rules and sitemap reference
2. `src/pages/Index.tsx` - Add SEO component, lazy load images
3. `src/pages/Chat.tsx` - Add SEO component
4. `src/pages/Doctors.tsx` - Add SEO component, lazy load, skeletons
5. `src/pages/Blog.tsx` - Add SEO component
6. `src/pages/BlogPost.tsx` - Enhance dynamic SEO, add lazy loading
7. `src/pages/HealthTipsBD.tsx` - Convert to SEO component
8. `src/pages/About.tsx` - Add SEO component
9. `src/pages/Contact.tsx` - Add SEO component
10. `src/pages/Medicine.tsx` - Add SEO component
11. `src/pages/Reminders.tsx` - Add SEO component
12. `src/pages/BloodDonation.tsx` - Add SEO component
13. `src/pages/legal/PrivacyPolicy.tsx` - Add SEO component
14. `src/pages/legal/TermsAndConditions.tsx` - Add SEO component
15. `src/pages/legal/DoctorVerificationPolicy.tsx` - Add SEO component
16. `src/pages/booking/LocationSelect.tsx` - Add SEO component
17. `src/pages/booking/ProviderList.tsx` - Add lazy loading, skeletons
18. `src/App.tsx` - Add more lazy imports for code splitting

---

## Technical Details

### SEO Component Implementation

```typescript
// src/components/SEO.tsx
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  article?: {
    publishedTime?: string;
    section?: string;
  };
}

export const SEO = ({
  title,
  description,
  canonicalPath,
  ogImage = '/og-image.png',
  ogType = 'website',
  noIndex = false,
  article
}: SEOProps) => {
  const siteUrl = 'https://doctoriai.com';
  const fullTitle = `${title} | Doctori AI`;
  const canonicalUrl = canonicalPath 
    ? `${siteUrl}${canonicalPath}` 
    : undefined;
  const imageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imageUrl} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@DoctoriAI" />
      
      {/* Article specific */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.section && (
        <meta property="article:section" content={article.section} />
      )}
    </Helmet>
  );
};
```

### Skeleton Card Component Example

```typescript
// For Doctors page
const DoctorCardSkeleton = () => (
  <Card className="shadow-card">
    <CardContent className="p-6">
      <div className="flex gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </CardContent>
  </Card>
);
```

---

## Expected Outcomes

### SEO Improvements:
- Unique, keyword-rich meta titles for all 15+ public pages
- Descriptive meta descriptions optimized for click-through rates
- Proper Open Graph and Twitter Card support for social sharing
- Clean URL structure with canonical tags
- Search engine accessible sitemap
- Private routes protected from indexing

### Performance Improvements:
- Reduced initial bundle size via code splitting
- Faster image loading with lazy loading
- Better perceived performance with loading skeletons
- Improved Core Web Vitals (LCP, CLS, FCP)

### User Experience:
- Attractive link previews on WhatsApp, Facebook, Twitter, LinkedIn
- Faster page loads and better responsiveness
- Professional appearance in search results

---

## Notes

- The `react-helmet` package is already installed, so no new dependencies are needed
- The BMICalculator.tsx serves as a reference implementation for the SEO pattern
- The existing og-image.png (1200x630) can be reused as the default social preview image
- Page-specific images for blog posts can use the article's featured image
- The sitemap will be static initially; consider a build-time generator for dynamic blog content in the future
