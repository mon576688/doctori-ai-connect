

# Improve Notification System for Users, Providers & Admins

## Overview
Enhance the notification system with category-based filtering, type-based icons/colors, individual deletion, notification sounds, and additional admin auto-notifications for system events like document uploads.

## Database Changes (New Migration)

**1. Add `category` column to `notifications` table:**
```sql
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'system';
```
Categories: `appointment`, `message`, `system`, `reminder`, `admin`

**2. Update `send_notification` function** to accept optional `_category` parameter and insert it.

**3. Add admin notification triggers:**
- `notify_admin_document_upload`: When a provider uploads a document to `provider_documents`, notify all admins.
- Update existing triggers to include category values in their `send_notification` calls.

**4. Update TypeScript types** in `src/integrations/supabase/types.ts` to add `category` to the notifications table and `_category` to the `send_notification` RPC args.

## Frontend Changes

### `src/hooks/useNotifications.tsx`
- Add `category` field to the `Notification` interface.
- Add `deleteNotification(id)` function that calls `supabase.from('notifications').delete()`.
- Add `activeFilter` state (`'all' | 'appointment' | 'message' | 'system' | 'reminder'`).
- Add `filteredNotifications` computed from `activeFilter`.
- Add `playNotificationSound()` helper that plays a short audio beep on new INSERT events.

### `src/components/NotificationBell.tsx`
Major UI overhaul:

**Type-based icons & colors:**
- `appointment`: Calendar icon, blue accent
- `message`: MessageSquare icon, green accent
- `system`: Info icon, gray accent
- `reminder`: Clock icon, orange accent
- `error`: AlertTriangle icon, red accent
- `success`: CheckCircle icon, emerald accent

**Filter tabs** at the top of the dropdown:
- Horizontal scrollable chips: All | Appointments | Messages | System | Reminders
- Clicking a chip filters the list

**Delete individual notifications:**
- Add a small X button on hover for each notification item
- Calls `deleteNotification(id)` and removes from state

**Sound on new notification:**
- Use `Audio` API to play a short notification sound (`/notification.mp3`) when a realtime INSERT is received
- Respect a `soundEnabled` preference stored in localStorage

### `src/components/Navbar.tsx`
- No changes needed; `NotificationBell` is already rendered for all authenticated users regardless of role.

### Admin-Specific Notifications (Database Triggers)
The existing `notify_new_provider` trigger already notifies admins on provider registration. Add:
- **Document upload trigger**: Notify admins when `provider_documents` gets a new INSERT with category `'admin'`.
- These use `SELECT id FROM user_roles WHERE role = 'admin'` to find admin user IDs.

## Files to Modify
1. **New migration SQL** -- add `category` column, update `send_notification`, add document upload trigger
2. `src/integrations/supabase/types.ts` -- add `category` to notifications table type and RPC args
3. `src/hooks/useNotifications.tsx` -- add category filter, delete function, sound
4. `src/components/NotificationBell.tsx` -- tabs, icons/colors, delete button, sound toggle
5. `public/notification.mp3` -- add a small notification sound file (we'll use a Web Audio API beep instead to avoid asset dependency)

