

# Add "Daily Wellness" Button to Hero Section

## Overview
Add a new button in the hero section that smooth-scrolls down to the Daily Wellness Practice section on the page.

## Changes

### 1. `src/pages/Index.tsx`
- Add an `id="daily-wellness"` attribute to the Daily Wellness Practice section wrapper so it can be targeted by scroll
- Add a new button in the hero's second row of buttons (after Health Reminders) that reads **"Daily Wellness"** with a `Heart` or `Sparkles` icon
- The button uses an `<a href="#daily-wellness">` anchor (or `onClick` with `scrollIntoView`) to smooth-scroll to the section instead of navigating to a new page
- Style: Use `variant="healing"` to give it a distinct green gradient look, matching the wellness theme

### 2. `src/locales/en/home.json`
- Add a new key under `hero`: `"dailyWellness": "Daily Wellness"`

## Technical Details

**Button placement** (line ~304, after the Health Reminders button):
```tsx
<button
  onClick={() => document.getElementById('daily-wellness')?.scrollIntoView({ behavior: 'smooth' })}
>
  <Sparkles /> Daily Wellness
</button>
```

**Section anchor** (on the DailyWellnessPractice wrapper):
```tsx
<div id="daily-wellness">
  <DailyWellnessPractice />
</div>
```

- No new dependencies
- No new routes needed -- it scrolls within the same page
- Uses existing `variant="healing"` button style for visual distinction

