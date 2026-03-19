

# Fix Blog Cover Photos to Match Article Content

## Problem
All blog images use `https://picsum.photos/seed/health-${id}/400/250` — random placeholder photos with no relation to the article topic.

## Solution
Replace the generic `make()` function's random image with topic-specific Unsplash images using their source API. Each blog post gets a curated search-term-based image URL that matches its content.

**How it works**: Unsplash provides a free URL format:
`https://images.unsplash.com/photo-XXXX` or using their source redirect:
`https://source.unsplash.com/featured/800x500/?keyword`

However, the source API is deprecated. The better approach is to **hardcode curated Unsplash photo IDs** for each blog post, matched to topic.

## Implementation

### Modify `src/data/blogs.ts`
1. Change the `make()` helper to accept an optional `image` parameter
2. Assign a relevant Unsplash image URL to each of the ~81 blog entries based on topic:
   - Heart/cardio posts → heart/medical imagery
   - Diabetes posts → blood sugar/health imagery  
   - Mental health posts → calm/mindfulness imagery
   - Nutrition posts → food/healthy eating imagery
   - Exercise posts → fitness imagery
   - Flu/cold posts → sick/recovery imagery
   - etc.

Example mapping:
```
"headache" → unsplash photo of person with headache
"diabetes" → unsplash photo of blood glucose monitor
"yoga" → unsplash photo of yoga practice
"nutrition" → unsplash photo of healthy food
```

3. Use high-quality, free-to-use Unsplash URLs in format: `https://images.unsplash.com/photo-{ID}?w=800&h=500&fit=crop`

### File changes
- **`src/data/blogs.ts`** — Update `make()` to accept image param, add ~80 curated image URLs matched to each post's topic

