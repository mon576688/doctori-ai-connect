

# Fix: Providers & Hospitals Not Showing (RLS + Missing View)

## Root Cause

Two issues are preventing data from appearing:

1. **`providers_public` view has `security_invoker=true`** -- This means the view runs with the calling user's RLS permissions. Since the `profiles` table only lets users see their own profile, and the `doctors` table only lets doctors see their own record, anonymous/unauthenticated users get zero results from this view.

2. **`hospitals_public` view does not exist** -- The booking code references `hospitals_public` but this view was never created, causing 404 errors.

Additionally, the **Find Doctors page (`Doctors.tsx`)** queries `profiles` directly with `role=provider`, which also returns empty due to profiles RLS.

## Fix Plan

### Step 1: Database Migration

**Recreate `providers_public` view without `security_invoker`** so anonymous users can browse providers:

```sql
DROP VIEW IF EXISTS public.providers_public;
CREATE VIEW public.providers_public AS
  SELECT p.id, p.first_name, p.last_name, p.name, p.bio, p.photo_url,
         p.city, p.provider_type,
         d.specialty, d.experience, d.consultation_fee, d.verified, d.years_experience
  FROM profiles p
  LEFT JOIN doctors d ON d.user_id = p.id
  WHERE p.role = 'provider' AND p.approval_status = 'approved';
-- No security_invoker -- runs as view owner, bypassing RLS
```

**Create `hospitals_public` view** so the booking flow can query hospitals without needing direct table access (matching the code's expectations):

```sql
CREATE VIEW public.hospitals_public AS
  SELECT id, name, address, city, phone, email, description, logo_url, is_active
  FROM hospitals
  WHERE is_active = true;
-- No security_invoker -- public browsing
```

### Step 2: Fix `Doctors.tsx` (Find Doctors Page)

Change the data source from querying `profiles` directly (blocked by RLS) to using `providers_public` view instead. This will also fetch provider services separately using the provider IDs from the view, matching the pattern already used in `ProviderList.tsx`.

### Step 3: Fix `ProviderList.tsx` Fallback

The fallback logic already exists (fetch all providers if none in selected city), but it shows "No providers found in your area" when there are truly zero results from the view. Since the view fix will make data visible, this should resolve itself. No code change needed here.

## Files to Modify

1. **Database migration** -- Recreate `providers_public` view (remove `security_invoker`), create `hospitals_public` view
2. **`src/pages/Doctors.tsx`** -- Switch from querying `profiles` to `providers_public` view, fetch services separately

## Impact

- Anonymous and logged-in users will see all approved providers on Find Doctors page
- Booking flow will show providers and hospitals correctly
- Fallback to "all locations" will work when no providers exist in selected city
- No sensitive data exposed (view excludes email, phone, address from profiles)

