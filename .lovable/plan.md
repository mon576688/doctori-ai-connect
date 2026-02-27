

# Make Heartbeat Dividers Visible + Hover Animation

## Overview
The heartbeat lines are currently nearly invisible (opacity 0.08-0.18, stroke 1.5px). This plan increases their visibility significantly and adds an interactive hover animation where the line "draws" itself and glows when the cursor hovers over it.

## Changes

### 1. `src/pages/Index.tsx` (HeartbeatDivider component, lines 49-69)

- Remove `pointer-events-none` so hover works
- Add `group` and `cursor-pointer` classes to wrapper
- Increase base `opacity` from `0.12` to `0.4`
- Increase `strokeWidth` from `1.5` to `2`
- Add `className="heartbeat-path"` to the path element
- Add a `<defs>` block with a glow `<filter>` using `feGaussianBlur` (unique ID via `useId()`)

### 2. `src/index.css` (lines 293-301)

Update the breathing animation and add hover effects:

```css
@keyframes heartbeat-breath {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.heartbeat-divider {
  animation: heartbeat-breath 4s ease-in-out infinite;
}

.heartbeat-path {
  transition: opacity 0.4s ease, stroke-width 0.4s ease;
}

@keyframes heartbeat-draw {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

.group:hover .heartbeat-divider {
  animation: none;
}

.group:hover .heartbeat-path {
  opacity: 0.8;
  stroke-width: 3;
  stroke-dasharray: 1000;
  animation: heartbeat-draw 1.5s ease-out forwards;
}
```

## Result
- At rest: clearly visible heartbeat lines gently pulsing between 30%-60% opacity
- On hover: line brightens to 80% opacity, thickens, and animates a "drawing" effect tracing the ECG waveform

