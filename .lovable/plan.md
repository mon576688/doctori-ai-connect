

# Expand Features Section with New Health Tool Cards

## Overview
Add 5 new feature cards to the existing "Advanced Features" bento grid section, with scroll-into-view animations and enhanced hover effects.

## Changes

### File: `src/pages/Index.tsx`

**1. Add new icon imports:**
Add `Pill`, `Droplets`, `ClipboardCheck`, `Sparkles` to the lucide-react imports, plus `useEffect` and `useRef` from React.

**2. Add scroll-into-view animation logic:**
Inside the `Index` component, add a `useEffect` that sets up an `IntersectionObserver` to animate `.feature-card` elements as they scroll into view (scale 0.9 to 1.0, fade in).

**3. Expand the features array (lines 536-572):**
Append 5 new items after the existing 6:

| Card | Icon | Badge | Grid Size | Link |
|------|------|-------|-----------|------|
| AI Health Analysis Suite | Sparkles | AI-Powered | `md:col-span-3` (full-width hero) | `/ai-analysis` |
| Medicine Intelligence | Pill | New | `md:col-span-2` | `/medicine` |
| BMI Calculator | Activity | -- | `md:col-span-1` | `/bmi-calculator` |
| Health Reminders | Bell | New | `md:col-span-1` | `/reminders` |
| Blood Donation Registration | Droplets | Community | `md:col-span-2` | `/blood-donation` |

**4. Update card rendering (lines 573-585):**
- Add `feature-card` class for intersection observer targeting
- Wrap each card in a `Link` when the feature has a `link` property
- Add initial styles: `opacity-0 translate-y-4 scale-[0.9]` that transition to visible on scroll
- Apply `rounded-2xl border-primary/10 backdrop-blur-sm` styling
- Show badge when feature has a `badge` property
- Use unique gradient backgrounds per icon (primary, healing, accent, warm tones)

**5. Update section title:**
Change from "Advanced AI Features" to "All-in-One Health Hub" to reflect the expanded scope.

### File: `src/index.css`

Add CSS for the scroll animation:

```css
.feature-card {
  opacity: 0;
  transform: translateY(16px) scale(0.9);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.feature-card.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

### File: `src/locales/en/home.json`

Update the features section translations to include the new card titles/descriptions and the updated section title.

## Visual Result
The features section will become a rich bento grid with 11 cards total -- the original 6 existing cards plus 5 new ones. The hero "AI Health Analysis Suite" card spans the full width. Cards animate in smoothly on scroll with a zoom + fade effect. Hover states lift the card and add a soft primary-color border glow.
