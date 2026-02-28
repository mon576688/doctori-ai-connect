

# Improve SEO Meta Tags & Fix Blog Markdown Rendering

## Overview
Two changes: (1) Enhance the main page and key pages with richer meta keywords so people searching for "doctor", "doctor AI", "nearby doctor", "health analysis", "blood bank", "health blogs" etc. can find the site. (2) Fix the blog post page so raw markdown symbols (like `**stars**`, `#` headers, `•` bullets) render as proper formatted text instead of showing as plain text with asterisks.

---

## Part 1: Enhanced SEO Meta Tags

### `index.html`
- Add a `<meta name="keywords">` tag with high-value search terms: "doctor, doctor AI, AI doctor, find doctor near me, nearby doctor, health analysis, blood bank, blood donation, health blogs, symptom checker, online doctor appointment, medical AI, health assistant"
- Update the `<title>` to be more keyword-rich: "Doctori AI - Find Doctors Near You | AI Health Assistant & Blood Bank"
- Update `<meta name="description">` to include more target keywords naturally
- Add full absolute URLs for `og:image` (use `https://doctoriai.com/og-image.png` instead of relative `/og-image.png`)
- Add `og:url` meta tag pointing to `https://doctoriai.com/`

### `src/lib/seo.ts`
- Update `PAGE_SEO.home` title and description to include target keywords (doctor, nearby doctor, health analysis, blood bank, health blogs)
- Update descriptions for `doctors`, `bloodDonation`, `blog`, `aiAnalysis` pages to be more keyword-rich for discoverability

### `src/components/SEO.tsx`
- Add support for a `keywords` prop to pass page-specific keywords
- Render `<meta name="keywords" content="...">` when provided

---

## Part 2: Fix Blog Stars/Markdown Rendering

### `src/pages/BlogPost.tsx`
The blog content is generated as markdown (with `**bold**`, `# headers`, `- lists`) but rendered using `whitespace-pre-line` which shows raw markdown characters (the "stars" the user sees are `**` asterisks).

**Fix approach**: Parse the markdown into proper HTML before rendering.
- Create a simple markdown-to-HTML converter function (no new dependency needed) that handles:
  - `# H1`, `## H2`, `### H3` headings
  - `**bold**` text
  - `- ` and `• ` list items
  - `---` horizontal rules
  - Line breaks and paragraphs
- Replace the `<div className="whitespace-pre-line">` with a `<div dangerouslySetInnerHTML>` using the parsed HTML
- Add proper prose styling so headings, lists, and bold text look correct

---

## Technical Details

### Keywords meta tag (index.html):
```html
<meta name="keywords" content="doctor, doctor AI, find doctor near me, nearby doctor, health analysis, blood bank, blood donation, health blogs, symptom checker, AI health assistant, online doctor appointment, medical consultation">
```

### Markdown parser (BlogPost.tsx):
A lightweight function that converts markdown syntax to HTML using regex replacements -- handles headings, bold, lists, horizontal rules, and paragraphs. No external library needed.

### Files changed:
- `index.html` -- add keywords meta, update title/description, use absolute og:image URL
- `src/lib/seo.ts` -- update PAGE_SEO entries with richer keyword descriptions
- `src/components/SEO.tsx` -- add optional `keywords` prop
- `src/pages/BlogPost.tsx` -- replace raw text rendering with parsed markdown HTML

