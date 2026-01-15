-- Fix: Security Definer View warning
-- Change the view to use SECURITY INVOKER (the default and safer option)
-- This ensures queries on the view respect the caller's permissions

DROP VIEW IF EXISTS public.providers_public;

CREATE VIEW public.providers_public 
WITH (security_invoker = true) AS
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

-- Grant read access to the public view for anonymous and authenticated users
GRANT SELECT ON public.providers_public TO anon, authenticated;

-- Add comment explaining the purpose of this view
COMMENT ON VIEW public.providers_public IS 'Secure public view for approved provider profiles with SECURITY INVOKER. Only exposes non-sensitive fields (name, bio, specialty, photo, city, experience, fees). Does NOT include email, phone, address, medical info, or coordinates.';