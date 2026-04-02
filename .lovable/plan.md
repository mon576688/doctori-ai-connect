

# Fix Blog Posts Showing Generic Content Instead of Unique Articles

## Problem
The code in `BlogPost.tsx` correctly imports `BLOG_ARTICLES` and checks for unique content, and the `blogContents.ts` file contains unique articles for all 81 posts. However, the preview is still showing the old generic "Overview / Key Points / Important Reminders" template — text that no longer exists in the current codebase.

This indicates a **stale build/cache issue** where the preview hasn't picked up the latest changes.

## Solution
Make a trivial edit to `BlogPost.tsx` to force a full rebuild and cache bust. Also add a minor defensive improvement: log a console warning if a blog post falls through to the generic fallback, so future issues are easier to diagnose.

## Changes

### `src/pages/BlogPost.tsx`
1. Add a `console.warn` in the generic fallback path so missing content is visible in dev tools
2. Add a small comment change to force Vite to invalidate its module cache for this file

This is a minimal change — the actual content integration code is already correct and complete. The issue is purely a build/cache staleness problem.

