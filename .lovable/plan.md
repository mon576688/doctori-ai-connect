

# Fix: Scope Auto-Scroll to Messages Container Only

## Problem
`scrollIntoView({ behavior: 'smooth' })` scrolls the **entire page**, not just the messages `div` with `overflow-y-auto`. This causes the whole page to jump when new messages arrive.

## Solution
Instead of using `scrollIntoView` on a bottom marker div, directly set the `scrollTop` of the messages container to its `scrollHeight`. This keeps the scroll scoped to the overflow container.

## Changes in `src/pages/Chat.tsx`

**1. Change the ref target** from `messagesEndRef` to `messagesContainerRef` pointing to the scrollable `div` (line 359):
```tsx
// Change ref type
const messagesContainerRef = useRef<HTMLDivElement>(null);
```

**2. Update the useEffect** to scroll the container itself:
```tsx
useEffect(() => {
  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }
}, [chat.sessionState.messages, chat.sessionState.isLoading]);
```

**3. Move the ref** from the bottom `<div ref={messagesEndRef} />` (line 415, remove this div) to the scrollable container div (line 359):
```tsx
<div ref={messagesContainerRef} className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 space-y-4">
```

This ensures only the messages area scrolls, not the full page.

## Files to modify
- `src/pages/Chat.tsx`

