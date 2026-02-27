

# Replace Section Dividers with Heartbeat/Breathing SVG Lines

## Overview
Replace all 12 simple gradient-line dividers (`section-divider`) with an animated SVG heartbeat (ECG) line that gently "breathes" -- pulsing its opacity and stroke width in a slow, calming rhythm.

## Changes

### File: `src/pages/Index.tsx`

**Extract a reusable `HeartbeatDivider` component** (inline or at the top of the file) that renders a horizontal SVG with an ECG-style polyline path:

```
___/\___/\/\___/\___
```

The SVG path will be a classic heartbeat trace: flat line, small bump, sharp spike up, sharp spike down, small recovery bump, flat line. The viewBox will be wide (e.g., `0 0 600 40`) with `preserveAspectRatio="none"` and `width="100%"` so it stretches across the container.

- Stroke: `hsl(217 91% 60%)` (primary) at low opacity (~0.12)
- Stroke width: 1.5px
- Fill: none
- The SVG has a CSS animation class `animate-heartbeat-breath` that slowly pulses opacity between 0.06 and 0.15 over ~4 seconds

**Replace all 12 `<div className="section-divider my-4" />` instances** with `<HeartbeatDivider />`.

### File: `src/index.css`

**Replace the `.section-divider` rule** with a heartbeat breathing animation:

```css
/* Heartbeat breath animation */
@keyframes heartbeat-breath {
  0%, 100% { opacity: 0.08; }
  50% { opacity: 0.18; }
}

.heartbeat-divider {
  animation: heartbeat-breath 4s ease-in-out infinite;
}
```

### SVG Path

The ECG trace path (inside a `viewBox="0 0 600 40"`, centered at y=20):

```
M 0,20 L 150,20 L 170,20 L 180,12 L 190,20 L 210,20
L 220,20 L 230,4 L 240,36 L 250,16 L 260,20
L 280,20 L 290,14 L 300,20
L 400,20 L 600,20
```

This creates: flat -- small P-wave bump -- sharp QRS spike -- recovery T-wave bump -- flat. A recognizable heartbeat waveform.

The SVG container will have `max-width: 60%`, `margin: 0 auto`, `pointer-events-none`, and `aria-hidden="true"`.

## Technical Details
- The breathing animation is pure CSS (no JS needed)
- SVG uses `preserveAspectRatio="none"` so it scales horizontally to fill width
- `stroke-linecap: round` and `stroke-linejoin: round` for smooth rendering
- All decorative: `pointer-events-none`, `aria-hidden="true"`
- Mobile: same effect, just narrower due to container width

## Visual Result
Instead of a faint static gradient line between sections, users will see a subtle heartbeat trace that gently pulses -- reinforcing the medical theme and adding life to the transitions between sections.

