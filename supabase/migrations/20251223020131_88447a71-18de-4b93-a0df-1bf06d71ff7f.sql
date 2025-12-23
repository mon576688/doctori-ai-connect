-- Update handle_new_user function to properly handle provider registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
BEGIN
  -- Determine the role from user metadata
  _role := COALESCE(
    (NEW.raw_user_meta_data ->> 'role')::app_role,
    'user'::app_role
  );
  
  -- Insert profile
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    role,
    provider_type,
    approval_status
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    _role,
    CASE WHEN _role = 'provider' THEN NEW.raw_user_meta_data ->> 'specialty' ELSE NULL END,
    CASE WHEN _role = 'provider' THEN 'pending'::approval_status ELSE 'approved'::approval_status END
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  
  -- If provider, create doctor profile
  IF _role = 'provider' THEN
    INSERT INTO public.doctors (
      user_id,
      specialty,
      license_number,
      experience,
      bio
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'specialty', 'General Practice'),
      NEW.raw_user_meta_data ->> 'license_number',
      COALESCE((NEW.raw_user_meta_data ->> 'experience')::integer, 0),
      NEW.raw_user_meta_data ->> 'bio'
    );
  END IF;
  
  RETURN NEW;
END;
$$;