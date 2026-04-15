

# Redesign Admin Dashboard — Premium SaaS Style

## Overview
Transform the current basic admin dashboard into a premium, modern SaaS panel inspired by Stripe/Notion aesthetics. The redesign focuses on the sidebar, overview page, header, and visual polish while preserving all existing functionality (14 tab modules).

## What Changes

### 1. Redesign AdminSidebar (`src/components/admin/AdminSidebar.tsx`)
- Dark sidebar background (slate-900/950) with subtle gradient
- Grouped menu items with collapsible sections: **Overview**, **Management** (Bookings, Providers, Hospitals, Users), **Operations** (Documents, Blood Donors, Bulk Ops, Export), **Insights** (Analytics, Content)
- Active item: subtle left border accent + translucent highlight (not solid primary fill)
- Smooth hover transitions, smaller icon size (16px), better spacing
- Search input at top of sidebar
- User avatar + role badge at bottom
- Animated pulse dot on "Pending Approvals" when count > 0

### 2. Redesign AdminOverview (`src/components/admin/AdminOverview.tsx`)
- **Top header bar**: Greeting with current date, global search input, notification bell with unread count, quick action dropdown
- **KPI cards row**: 5 cards with gradient borders, animated count-up numbers, sparkline mini-charts (using recharts), percentage change badges
- **Two-column layout below KPIs**:
  - Left: Area chart showing user/provider growth over 30 days (already have data from AdminAnalytics)
  - Right: Recent activity feed with timeline-style UI (dot + line connector), color-coded by type
- **Bottom row**:
  - Quick actions as icon cards (not plain buttons)
  - System health/trust widget showing uptime, active sessions, security status
- Smooth fade-in animations on mount using existing `animate-fade-in` class

### 3. Update AdminDashboard page (`src/pages/dashboard/AdminDashboard.tsx`)
- Add a top header bar (visible on all tabs) with: breadcrumb showing current section, search, notification bell, dark mode toggle
- Better content area padding and max-width constraint
- Loading state: skeleton cards instead of plain spinner

### 4. Dark Mode Support
- The app already uses Tailwind dark classes. Add a dark mode toggle button in the admin header that toggles `document.documentElement.classList` between light/dark
- Sidebar uses `dark:bg-slate-950` etc.

### 5. Typography & Spacing
- Use `tracking-tight` on headings, `text-sm` with `text-muted-foreground` for descriptions
- Consistent `gap-6` spacing between sections
- Cards use `rounded-xl border-0 shadow-sm` for modern look

### 6. Animations
- Cards: `animate-fade-in` with staggered delays via inline `style={{ animationDelay }}`
- Stat numbers: CSS counter animation (simple implementation with useEffect + setTimeout)
- Sidebar items: `transition-all duration-200`

## Files Modified
- **`src/components/admin/AdminSidebar.tsx`** — Complete redesign with grouped sections, dark theme, search, user info
- **`src/components/admin/AdminOverview.tsx`** — Premium KPI cards, charts, activity timeline, quick action cards, trust widget
- **`src/pages/dashboard/AdminDashboard.tsx`** — Add top header bar with search/notifications/dark mode toggle, skeleton loading state

## What Stays the Same
- All 14 tab modules and their content components (BookingManagement, UserManagement, etc.)
- Data fetching logic and Supabase queries
- Provider approval workflow
- Mobile responsive sidebar toggle

