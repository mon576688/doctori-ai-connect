-- Fix: Patient Medical Records and Contact Information Exposed to Anyone
-- The policy "Anyone can view approved provider profiles" exposes ALL columns including sensitive data
-- Solution: Drop the policy and create a secure view that only exposes non-sensitive provider fields

-- Step 1: Drop the overly permissive policy that exposes all profile columns
DROP POLICY IF EXISTS "Anyone can view approved provider profiles" ON public.profiles;

-- Step 2: Create a secure public view for provider profiles that only includes non-sensitive fields
CREATE OR REPLACE VIEW public.providers_public AS
SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.name,
    p.bio,
    p.photo_url,
    p.city,
    p.provider_type,
    d.specialty,
    d.experience,
    d.consultation_fee,
    d.verified,
    d.years_experience
FROM public.profiles p
LEFT JOIN public.doctors d ON d.user_id = p.id
WHERE p.role = 'provider' 
  AND p.approval_status = 'approved';

-- Step 3: Grant read access to the public view for anonymous and authenticated users
GRANT SELECT ON public.providers_public TO anon, authenticated;

-- Step 4: Add comment explaining the purpose of this view
COMMENT ON VIEW public.providers_public IS 'Secure public view for approved provider profiles. Only exposes non-sensitive fields (name, bio, specialty, photo, city, experience, fees). Does NOT include email, phone, address, medical info, or coordinates.';