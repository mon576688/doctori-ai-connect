

# Add Parallax Floating Medical Divider Between Features and Testimonials

## Overview
Insert a decorative section between the Features grid and the Testimonials section (after line 687, before line 689 in `Index.tsx`). It will contain gradient blobs and floating medical icons (heartbeat line, pill, stethoscope) that move at a different speed than the scroll via a CSS parallax transform, eliminating the empty white-space feel.

## Changes

### File: `src/pages/Index.tsx`

**1. Add imports:**
- Add `HeartPulse`, `Stethoscope` from `lucide-react` (Pill is already imported).

**2. Add scroll-based parallax state:**
- Add a `scrollY` state tracked via a `useEffect` with a throttled `scroll` event listener (using `requestAnimationFrame` for performance).

**3. Insert decorative divider section (between lines 687 and 689):**
A `relative overflow-hidden` section (~`py-16`) containing:

- **Two gradient blobs**: Absolutely positioned, large (`w-72 h-72` and `w-96 h-96`), blurred (`blur-3xl`), with primary and secondary colors at low opacity (~0.15). Each blob gets a `translateY` transform driven by `scrollY * -0.08` and `scrollY * 0.06` respectively, creating a subtle parallax drift.
- **Three floating medical icons**: `HeartPulse`, `Pill`, `Stethoscope` -- absolutely positioned at different spots, low opacity (~0.12), sizes around 40-64px, each with a different parallax multiplier (`scrollY * -0.05`, `scrollY * 0.04`, `scrollY * -0.03`) and a gentle CSS float animation (reusing the existing `floating-shape` keyframes or inline animation).
- **A subtle SVG heartbeat line**: A horizontal `<svg>` path resembling an ECG trace, centered, very faint (`stroke-primary/10`, `stroke-width: 1.5`), spanning most of the width. This also gets a slight parallax offset.

The section has `pointer-events-none` so it doesn't interfere with interaction, and `aria-hidden="true"` for accessibility.

### File: `src/index.css`

No new CSS needed -- reuse existing `.floating-shape` keyframes and `float` animation. The parallax is handled inline via `transform: translateY(...)` driven by React state.

## Performance Notes
- The scroll listener uses `requestAnimationFrame` to avoid layout thrashing.
- All parallax transforms use `translate3d` for GPU acceleration.
- The section is purely decorative with `pointer-events-none`.

## Visual Result
A soft, layered divider with drifting gradient blobs and faintly visible medical icons that move at a slightly different rate than the page scroll, creating depth and removing the flat white-space gap between Features and Testimonials.

