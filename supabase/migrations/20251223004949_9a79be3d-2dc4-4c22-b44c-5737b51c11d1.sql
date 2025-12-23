-- Add admin role to user_roles table
INSERT INTO public.user_roles (user_id, role)
VALUES ('94596be8-8cf7-4d4d-bcc7-f4b4f51c4741', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update profile - only change role first (not approval_status which triggers the function)
UPDATE public.profiles
SET role = 'admin'::user_role
WHERE id = '94596be8-8cf7-4d4d-bcc7-f4b4f51c4741';

-- Remove non-admin roles
DELETE FROM public.user_roles 
WHERE user_id = '94596be8-8cf7-4d4d-bcc7-f4b4f51c4741'
AND role != 'admin'::app_role;