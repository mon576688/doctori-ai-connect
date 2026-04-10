

# Set Up Newsletter Email Subscription

## Overview
The footer has a subscribe form but it's currently non-functional — no state, no handler, no backend. We'll wire it up end-to-end.

## Changes

### 1. Create `newsletter_subscribers` table (migration)
```sql
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO public WITH CHECK (true);
```

### 2. Update `src/components/Footer.tsx`
- Add `useState` for the email input
- Add email validation (basic format check)
- On submit, insert into `newsletter_subscribers` via Supabase client
- Show success/error toast
- Disable button while submitting

### Files Modified
- **Migration**: Create `newsletter_subscribers` table
- **`src/components/Footer.tsx`**: Add subscribe handler with state management and toast feedback

