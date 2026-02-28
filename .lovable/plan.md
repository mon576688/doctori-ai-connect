

# Enhance Guided Breathing & Vision Guard Cards

## Overview
Improve the Guided Breathing overlay with a session timer, cycle counter, and breathing technique selector. Enhance the Vision Guard card with practical eye care tips.

## Changes (all in `src/components/DailyWellnessPractice.tsx`)

### 1. Guided Breathing -- Add Timer & Session Controls

**Current**: Simple inhale/exhale circle with no timer or session tracking.

**Enhanced overlay will include**:
- **Session timer** showing total elapsed time (mm:ss) at the top of the overlay
- **Cycle counter** tracking how many inhale-exhale cycles completed
- **Breathing technique selector** (before starting) with 3 presets:
  - Box Breathing (4s inhale, 4s hold, 4s exhale, 4s hold)
  - 4-7-8 Relaxation (4s inhale, 7s hold, 8s exhale)
  - Simple Deep Breath (4s inhale, 4s exhale -- current behavior)
- **4-phase support**: Update the phase state from `"inhale" | "exhale"` to `"inhale" | "hold-in" | "exhale" | "hold-out"` to support box breathing and 4-7-8
- **Phase label** showing the current phase name and a countdown for each phase (e.g., "Inhale... 3s")
- **Session summary** when user closes: show total time and cycles completed briefly via a toast or inline text

**Layout of enhanced overlay**:
```text
                        [X close]
        
        Technique: [Box] [4-7-8] [Simple]

            (animated breathing circle)
        
             Inhale... 3s
         
        Cycle: 4    |    Time: 2:30
```

### 2. Vision Guard -- Add Practice Tips

**Current**: Just a countdown timer with start/stop and a "look away" alert.

**Enhanced card will include**:
- **Tips section** below the timer showing rotating eye care tips, such as:
  - "Blink 15-20 times per minute to keep eyes moist"
  - "Adjust screen brightness to match surroundings"
  - "Keep screen at arm's length (20-26 inches)"
  - "Position screen slightly below eye level"
  - "Use the 20-20-20 rule: every 20 min, look 20 feet away for 20 sec"
- Tips rotate every 8 seconds automatically when the timer is running
- A small `Info` icon with a tooltip explaining the 20-20-20 rule in detail
- **Session count** showing how many breaks completed today (persisted in localStorage)

## Technical Details

- **New imports**: `Timer`, `Info`, `ChevronLeft`, `ChevronRight` from lucide-react
- **Breathing phases**: New type `"inhale" | "hold-in" | "exhale" | "hold-out"` with configurable durations per technique
- **Technique config** stored as a constant array of objects: `{ name, phases: [{ label, duration }] }`
- **localStorage** key `vision-guard-sessions-YYYY-MM-DD` for daily session count
- No new files or dependencies needed -- everything stays within `DailyWellnessPractice.tsx`

