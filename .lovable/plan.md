

# Fix Sitemap "Couldn't Fetch" in Google Search Console

## Root Cause

The PWA service worker's `navigateFallback` intercepts requests to `/sitemap.xml` and `/robots.txt`, returning `index.html` instead of the actual static files. The `navigateFallbackDenylist` only excludes `/~oauth`, so Googlebot gets an HTML page instead of valid XML.

## Changes

### 1. `vite.config.ts` — Expand `navigateFallbackDenylist`

Add patterns for `.xml`, `.txt`, and `.json` files so the service worker doesn't intercept them:

```ts
navigateFallbackDenylist: [/^\/~oauth/, /\.xml$/, /\.txt$/, /\.json$/],
```

### 2. `public/sitemap.xml` — Add `lastmod` dates and missing `<?xml?>` encoding

Add `lastmod` fields with today's date to all entries for better crawl signaling. The file is already valid XML but adding `lastmod` improves SEO.

### 3. Verification

After deploying, confirm `https://doctoriai.lovable.app/sitemap.xml` returns XML (not HTML). If using custom domain `doctoriai.com`, the DNS/proxy must also be configured to serve this correctly — that's outside code scope.

## Files to modify
1. `vite.config.ts` — line 51, expand denylist
2. `public/sitemap.xml` — add `lastmod` to all entries

