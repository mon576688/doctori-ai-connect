-- Create admin function to add a service provider directly
CREATE OR REPLACE FUNCTION public.admin_create_provider(
  _email text,
  _first_name text,
  _last_name text,
  _phone text DEFAULT NULL,
  _specialty text DEFAULT 'General Practice',
  _provider_type text DEFAULT 'Doctor',
  _license_number text DEFAULT NULL,
  _experience integer DEFAULT 0,
  _bio text DEFAULT NULL,
  _city text DEFAULT NULL,
  _address text DEFAULT NULL,
  _auto_approve boolean DEFAULT true,
  _hospital_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _provider_id uuid;
BEGIN
  -- Verify admin access first
  PERFORM public.verify_admin_access();
  
  -- Generate provider ID
  _provider_id := gen_random_uuid();
  
  -- Create profile
  INSERT INTO public.profiles (
    id, email, first_name, last_name, phone, role, provider_type,
    city, address, bio, approval_status
  ) VALUES (
    _provider_id, _email, _first_name, _last_name, _phone, 'provider',
    _provider_type, _city, _address, _bio,
    CASE WHEN _auto_approve THEN 'approved' ELSE 'pending' END
  );
  
  -- Create user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_provider_id, 'provider');
  
  -- Create doctor entry
  INSERT INTO public.doctors (user_id, specialty, license_number, experience, bio, approved)
  VALUES (_provider_id, _specialty, _license_number, _experience, _bio, _auto_approve);
  
  -- Assign to hospital if specified
  IF _hospital_id IS NOT NULL THEN
    INSERT INTO public.provider_hospital_assignments (provider_id, hospital_id, is_primary)
    VALUES (_provider_id, _hospital_id, true);
  END IF;
  
  -- Log activity
  PERFORM public.log_activity_safe(
    'admin_create_provider',
    jsonb_build_object(
      'provider_id', _provider_id,
      'email', _email,
      'name', _first_name || ' ' || _last_name
    )
  );
  
  RETURN _provider_id;
END;
$$;