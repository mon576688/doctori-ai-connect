
# Replace Bot Icon with Colored AI Avatar in Chat

## Overview
Replace the generic `Bot` icon used for AI messages with a visually distinctive, branded avatar showing "AI" text in a gradient circle. This applies to all three places the Bot icon appears: message bubbles, the loading indicator, and the chat header.

## Changes

### `src/pages/Chat.tsx`

**1. Create an inline `AiAvatar` component** (at the top of the file, before the main component):
```tsx
const AiAvatar = ({ size = "sm" }: { size?: "sm" | "md" }) => (
  <div className={`${size === "md" ? "h-6 w-6" : "h-4 w-4"} rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center`}>
    <span className={`font-bold text-white ${size === "md" ? "text-[10px]" : "text-[8px]"}`}>AI</span>
  </div>
);
```

**2. Replace all `<Bot>` usages:**

- **Header** (line ~320): Replace `<Bot className="h-6 w-6" />` with `<AiAvatar size="md" />`
- **Message avatar** (line ~353): Replace `<Bot className="h-4 w-4" />` with `<AiAvatar />`
- **Loading indicator** (line ~379): Replace `<Bot className="h-4 w-4" />` with `<AiAvatar />`

**3. Update the AI avatar container styling** for message bubbles (line ~345-348):
- Change the AI case from `bg-muted text-foreground` to a gradient background: `bg-gradient-to-br from-emerald-500 to-teal-600 text-white` -- this gives the outer circle a matching medical-green color
- Alternatively, since the `AiAvatar` component already has its own gradient circle, simplify the container to `bg-transparent p-1`

**4. Remove `Bot` from the lucide-react import** if no longer used elsewhere.

## Result
- AI messages will show a small green gradient circle with bold white "AI" text instead of the generic robot icon
- Consistent branding across header, messages, and loading state
- User messages remain unchanged (keep the `User` icon with primary color)

## Files to modify
1. `src/pages/Chat.tsx` -- add `AiAvatar` component, replace 3 Bot icon instances
