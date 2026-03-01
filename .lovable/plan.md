

# Fix Remaining Chat Issues: Markdown Parsing + Auto-Scroll

## Status Check
- Welcome message asterisks (`**text**`) -- Already fixed in `useGuestChat.tsx` and `useChatSession.tsx`
- Markdown rendering in AI replies -- Still broken (AI responses contain `**bold**` that shows as raw asterisks)
- Auto-scroll to latest message -- Still missing

## Changes

### 1. `src/pages/Chat.tsx` -- Update `formatMessage` (lines 246-253)

Replace the current function that only splits by newlines with one that also converts markdown bold (`**text**`) and italic (`*text*`) into styled HTML elements.

```text
Current:
  content.split('\n').map(line => <span>{line}<br/></span>)

New logic per line:
  1. Split each line by regex: /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  2. For segments matching **text**, render <strong>text</strong>
  3. For segments matching *text*, render <em>text</em>
  4. For plain text segments, render as-is
```

### 2. `src/pages/Chat.tsx` -- Add auto-scroll (around lines 343-398)

- Add `useRef<HTMLDivElement>(null)` for `messagesEndRef`
- Add `useEffect` watching `chat.sessionState.messages` and `chat.sessionState.isLoading` that calls `messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })`
- Place `<div ref={messagesEndRef} />` after the loading indicator (after line 398, inside the scrollable container)

### Files to modify
1. `src/pages/Chat.tsx` only (both fixes are in this file)

