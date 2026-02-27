

# UI/UX Modernization: Notification Bar, Chat Glassmorphism, Global Styling & Hover Effects

## 1. Top Notification Bar (Navbar.tsx)

Add a slim, dismissible beta announcement bar above the sticky nav.

**Changes to `src/components/Navbar.tsx`:**
- Add state: `showBetaBanner` initialized from `localStorage.getItem('beta-banner-dismissed')`
- Render a bar above the `<nav>` element:
  - `bg-primary text-white text-sm py-2 text-center` with flex layout
  - Text: "Doctori AI is currently in Private Beta -- Experience the future of AI Healthcare."
  - "Join Waitlist" button linking to `/login` (small, `bg-white/20 hover:bg-white/30 text-white` rounded pill)
  - X dismiss button that sets localStorage and hides the bar
- Adjust the sticky nav: when banner is visible, the banner sits above it (both inside the fragment)

---

## 2. Premium Chat Interface with Glassmorphism (Chat.tsx)

Transform the chat page into a premium SaaS-quality interface.

**Changes to `src/pages/Chat.tsx`:**

- **Outer container**: Change `bg-gradient-to-br from-blue-50 to-white` to `bg-background/60 backdrop-blur-xl`
- **Main chat card**: `bg-white/70 backdrop-blur-md border border-white/20 shadow-2xl` (replace `bg-white/90`)
- **Header gradient**: Change `from-blue-600 to-purple-600` to `from-primary/90 to-primary` (both main card and sidebar)
- **AI avatar area**: Add a verified badge (CheckCircle icon with "Verified" text) next to "Doctori AI" in the header
- **Message bubbles**:
  - User: `bg-primary text-white rounded-2xl rounded-br-sm` (replace `bg-blue-600`)
  - AI: `bg-muted/50 backdrop-blur-sm border border-border/30 rounded-2xl rounded-bl-sm` (replace `bg-white border border-gray-200`)
  - User avatar: `bg-primary` (replace `bg-blue-600`)
  - AI avatar: `bg-muted` (replace `bg-gray-100`)
  - Timestamps: User `text-primary-foreground/70`, AI `text-muted-foreground`
- **Loading indicator**: `bg-muted/50 backdrop-blur-sm border border-border/30` with smoother `animate-pulse` dots instead of `animate-bounce`
- **Input area**: Wrap input in a `relative` container with `rounded-full bg-muted/30 border-border/50 focus:border-primary/50` styling, send button as a circle (`rounded-full w-10 h-10`) positioned inside the input field on the right
- **Disclaimer box**: Change `bg-blue-50 border-blue-200` to `bg-muted/30 border-border/30` with matching text colors

---

## 3. Global Styling & Spacing (index.css, index.html, Index.tsx)

**Changes to `index.html`:**
- Add Google Fonts link: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`

**Changes to `src/index.css`:**
- Add `font-family: 'Inter', system-ui, -apple-system, sans-serif;` to the `body` rule
- Update `.card-hover-lift` class:
  ```css
  .card-hover-lift {
    @apply transition-all duration-300 ease-out border border-transparent;
  }
  .card-hover-lift:hover {
    @apply -translate-y-2;
    border-color: hsl(217 91% 60% / 0.2);
    box-shadow: 0 12px 40px hsl(217 91% 60% / 0.15);
  }
  ```
- Add new `.card-hover-glow` utility:
  ```css
  .card-hover-glow {
    @apply transition-all duration-300 ease-out;
  }
  .card-hover-glow:hover {
    border-color: hsl(217 91% 60% / 0.3);
    box-shadow: 0 0 20px hsl(217 91% 60% / 0.1);
  }
  ```
- Add `@keyframes marquee` for the trust bar (future use):
  ```css
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 30s linear infinite;
  }
  ```

**Changes to `src/pages/Index.tsx`:**
- Change all section `py-20` to `py-24`
- Ensure `max-w-6xl` is used consistently (the Trust section uses `max-w-5xl` and Emergency/FAQ use `max-w-4xl` -- keep those as they're intentionally narrower)

---

## 4. Enhanced Hover Effects (already covered above)

The `.card-hover-lift` update in `index.css` handles the global hover enhancement. The `button.tsx` already has `transition-all duration-300` in its base class -- no changes needed there.

---

## Files to Modify

1. **`index.html`** -- Add Inter font import link
2. **`src/index.css`** -- Inter font-family, updated card-hover-lift, new card-hover-glow, marquee keyframes
3. **`src/components/Navbar.tsx`** -- Beta notification bar with dismiss + Join Waitlist button
4. **`src/pages/Index.tsx`** -- Update section padding from py-20 to py-24
5. **`src/pages/Chat.tsx`** -- Glassmorphism container, premium message bubbles, verified badge, rounded input with embedded send button

