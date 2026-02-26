
-- Recreate providers_public view WITHOUT security_invoker so anonymous users can browse
DROP VIEW IF EXISTS public.providers_public;
CREATE VIEW public.providers_public AS
  SELECT p.id, p.first_name, p.last_name, p.name, p.bio, p.photo_url,
         p.city, p.provider_type,
         d.specialty, d.experience, d.consultation_fee, d.verified, d.years_experience
  FROM profiles p
  LEFT JOIN doctors d ON d.user_id = p.id
  WHERE p.role = 'provider' AND p.approval_status = 'approved';

-- Create hospitals_public view for booking flow
CREATE VIEW public.hospitals_public AS
  SELECT id, name, address, city, phone, email, description, logo_url, is_active
  FROM hospitals
  WHERE is_active = true;
