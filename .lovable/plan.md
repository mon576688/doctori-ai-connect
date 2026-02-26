

# Fix: Allow Unauthenticated Users to View Doctor Profiles

## Problem

The doctor list page (`/doctors`) works without login because it reads from the `providers_public` view (no RLS restrictions). But clicking "View Profile" navigates to `/booking/provider/:id`, which queries the `profiles` table directly. The `profiles` table has RLS policies that only allow:
- Users to view their **own** profile
- Admins to view all profiles
- Providers to view patients with appointments

Anonymous (unauthenticated) users are completely blocked, so the profile page fails to load.

## Solution

Update `ProviderProfile.tsx` to fetch data from the `providers_public` view instead of the `profiles` table for the basic provider info. This view is already designed for public access and contains all the fields needed (name, bio, photo, specialty, city, etc.).

For additional data like services, we query `provider_services` which already has a public SELECT policy for active services.

### Changes

**File: `src/pages/booking/ProviderProfile.tsx`**

Change the main data fetch query from:
```typescript
// CURRENT - blocked by RLS for anonymous users
const { data, error } = await supabase
  .from('profiles')
  .select(`id, name, first_name, last_name, bio, photo_url, ...
    provider_services (...)
  `)
  .eq('id', id)
  .single();
```

To:
```typescript
// NEW - uses publicly accessible view
const { data, error } = await supabase
  .from('providers_public')
  .select('*')
  .eq('id', id)
  .single();

// Fetch services separately (also publicly accessible)
const { data: servicesData } = await supabase
  .from('provider_services')
  .select('service_name, price, description, duration_minutes')
  .eq('provider_id', id)
  .eq('is_active', true);
```

The `providers_public` view has these fields available: `id`, `first_name`, `last_name`, `name`, `bio`, `photo_url`, `city`, `provider_type`, `specialty`, `years_experience`, `verified`, `consultation_fee`, `experience`.

For the profile photo upload feature (only shown when viewing own profile), we keep the existing logic since that requires authentication anyway.

### Files to Modify

1. **`src/pages/booking/ProviderProfile.tsx`** -- Switch from `profiles` table to `providers_public` view for the main query, fetch `provider_services` separately

### No database changes needed

The `providers_public` view and `provider_services` public SELECT policy already exist and work for anonymous users.

