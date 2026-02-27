

# Add "Daily Wellness Practice" Interactive Section

## Overview
Add a new interactive section with 4 wellness cards below the "All-in-One Health Hub" (Advanced Features Section), featuring guided breathing, hydration tracking, vision guard timer, and posture reset -- all with glassmorphism styling, scroll-center scaling, and floating animations.

## New Component File: `src/components/DailyWellnessPractice.tsx`

A standalone component containing all 4 interactive cards with local state management:

### Card 1: Guided Breathing (Box Breathing)
- Central circle that expands/contracts using CSS keyframes (4s inhale, 4s exhale cycle)
- Click triggers a full-screen overlay with a glowing circle that changes color: blue during "Inhale", green during "Exhale"
- Phase text displayed below the circle
- Close button to dismiss overlay

### Card 2: Smart Hydration Tracker
- Water drop icon (Droplets from lucide) with a "+" button
- Local state tracking glasses of water (goal: 8)
- Blue progress bar filling the card bottom as intake increases
- Reset button to clear for new day
- Stored in localStorage to persist across page visits

### Card 3: Vision Guard (20-20-20 Rule)
- Timer card with Eye icon
- Start/Stop button that counts down from 20 minutes (1200 seconds)
- When timer hits 0, shows an alert-style notification: "Look 20 feet away for 20 seconds"
- Auto-restarts after acknowledgment

### Card 4: Posture Reset
- Card with a "Check Posture" button
- When clicked, shows a 30-second countdown with 3 stretch phases (10s each):
  1. "Roll shoulders back" 
  2. "Stretch neck left and right"
  3. "Stand and reach up"
- Progress bar showing time remaining

### AI Insight Tooltips
- Small "AI Insight" sparkle button on Breathing and Hydration cards
- Uses Radix Tooltip to show static text: "AI can analyze your breathing patterns to optimize recovery and focus" / "AI can track hydration trends to suggest optimal intake timing"
- No backend call needed -- purely informational tooltip

## Changes to `src/pages/Index.tsx`

- Import the new `DailyWellnessPractice` component
- Insert it between the Advanced Features Section (line ~873) and the Parallax Medical Divider (line ~875)
- Wrap in a `section-animate` container with a `HeartbeatDivider` above and below
- Apply the existing `feature-card` class + `focusObserver` logic so cards get scroll-center scaling (1.05x)
- Update the `useEffect` observer to also target `.wellness-card` elements

## Changes to `src/index.css`

Add new utility classes:

```css
/* Breathing circle animation */
@keyframes breathe-expand {
  0%, 100% { transform: scale(0.6); }
  50% { transform: scale(1); }
}

.breathing-circle {
  animation: breathe-expand 8s ease-in-out infinite;
}

/* Wellness card float effect */
.wellness-card {
  opacity: 0;
  transform: translateY(16px) scale(0.9);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.wellness-card.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

## UI/Animation Details

- **Glassmorphism**: Each card uses `backdrop-blur-xl bg-background/70 border border-white/20 rounded-2xl`
- **Scroll-center scaling**: Reuses existing `feature-card-focus` class (scales to 1.05x when centered)
- **Float effect**: Cards use existing `float` keyframe with staggered `animation-delay`
- **Dot-grid background**: Section sits on the existing `dot-grid-bg` from the parent container
- **No framer-motion**: All animations use pure CSS (keyframes + transitions + IntersectionObserver) to avoid adding a new dependency
- **Z-index layering**: Cards use `relative z-10` to sit above background gradient mesh

## Technical Notes
- Hydration state persists via `localStorage` with a date key so it resets daily
- Breathing overlay uses a React portal-style fixed div with `z-50`
- Timer uses `useEffect` + `setInterval` cleanup pattern
- All state is local to the component (no global state needed)
- No new dependencies required

