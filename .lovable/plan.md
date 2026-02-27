

# Reduce White Space in Features Grid with Depth & Motion Effects

## Overview
Apply four visual enhancements to the Features bento grid to eliminate the "empty white space" feel: staggered vertical offsets, background depth blobs, scroll-triggered center-card scaling, and faint vertical connector lines between cards.

## Changes

### File: `src/pages/Index.tsx`

**1. Background Depth Blobs (behind the grid)**
Inside the features `<section>`, add `relative overflow-hidden` to the section wrapper. Insert 3 large gradient blobs (`absolute`, `blur-3xl`, `opacity-5`) positioned behind the grid. Each uses `translate3d` driven by the existing `scrollY` state for a slow parallax drift:
- Blob 1: `w-[500px] h-[500px] bg-primary/5 blur-3xl` at top-left, `scrollY * -0.03`
- Blob 2: `w-[600px] h-[600px] bg-secondary/5 blur-3xl` at center-right, `scrollY * 0.02`
- Blob 3: `w-[400px] h-[400px] bg-accent/5 blur-3xl` at bottom-left, `scrollY * -0.04`

These are `pointer-events-none` and sit behind the grid (`z-0`) while the grid content is `relative z-10`.

**2. Staggered Grid Layout**
On every second card (odd index), apply a vertical offset of `mt-10` (40px) on `md:` screens. This breaks the perfectly aligned horizontal rows and creates an organic, modern feel. Applied via conditional class: `${index % 2 === 1 ? 'md:mt-10' : ''}`.

**3. Scroll-Triggered Center Scaling**
Enhance the existing `IntersectionObserver` logic. Instead of a single `visible` class, use a more granular approach:
- Add a second `IntersectionObserver` with `threshold: [0, 0.5, 1]` and `rootMargin: '-20% 0px -20% 0px'` to detect when a card is near the viewport center.
- When a card is >50% visible in the center zone, add a `feature-card-focus` class (scales to 1.05). Other visible cards remain at their default scale (effectively 0.95 relative to the focused one).
- CSS handles the transition smoothly.

**4. Vertical Connector Lines (SVG)**
Between each row of cards, insert a faint dashed SVG line. Rather than complex per-card SVG connectors (which conflict with the staggered layout), add 2-3 decorative vertical dashed lines that span the full height of the grid container, positioned at ~25%, 50%, and 75% horizontally. These use `stroke-primary/10`, `stroke-dasharray="4 8"`, and are `pointer-events-none`. They create visual continuity through the grid without needing per-card logic.

### File: `src/index.css`

Add new CSS classes:

```css
.feature-card-focus {
  transform: translateY(0) scale(1.05) !important;
  z-index: 2;
  border-color: hsl(217 91% 60% / 0.25);
  box-shadow: 0 12px 40px hsl(217 91% 60% / 0.12);
}

.feature-card.visible:not(.feature-card-focus) {
  transform: translateY(0) scale(0.97);
}
```

## Technical Details

- The staggered offset uses Tailwind's `mt-10` with an `md:` breakpoint so mobile stays uniform.
- The focus observer uses `rootMargin: '-30% 0px -30% 0px'` to define the "center zone" as the middle 40% of the viewport.
- Background blobs reuse the existing `scrollY` state -- no new event listeners needed.
- Vertical connector SVGs are purely decorative with `aria-hidden="true"`.
- All transforms use `translate3d`/`scale3d` for GPU acceleration.

## Visual Result
The features grid will feel layered and dynamic: cards stagger organically, subtle colored depth sits behind them, the centered card gently enlarges to draw focus, and faint dashed lines provide visual continuity through the layout.

