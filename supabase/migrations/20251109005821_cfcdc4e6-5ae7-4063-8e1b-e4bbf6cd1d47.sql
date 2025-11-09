-- Create atomic booking function to prevent race conditions and handle RLS properly
CREATE OR REPLACE FUNCTION public.book_appointment_slot(
  _user_id uuid,
  _provider_id uuid,
  _appointment_date timestamptz,
  _date date,
  _time_slot time,
  _appointment_type text,
  _duration_minutes int
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _appointment_id uuid;
  _is_available boolean;
BEGIN
  -- Verify user is authenticated and matches the requesting user
  IF _user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot book appointment for another user';
  END IF;
  
  -- Check and lock the slot (prevents race conditions)
  SELECT (is_available = true AND is_booked = false) INTO _is_available
  FROM availability_dates
  WHERE provider_id = _provider_id
    AND date = _date
    AND time_slot = _time_slot
  FOR UPDATE;  -- Row-level lock
  
  -- If slot not found or not available, reject
  IF _is_available IS NULL OR _is_available = false THEN
    RAISE EXCEPTION 'Time slot is no longer available';
  END IF;
  
  -- Insert appointment
  INSERT INTO appointments (
    user_id, doctor_id, appointment_date,
    appointment_type, status, duration_minutes
  ) VALUES (
    _user_id, _provider_id, _appointment_date,
    _appointment_type, 'scheduled', _duration_minutes
  ) RETURNING id INTO _appointment_id;
  
  -- Mark slot as booked (runs with SECURITY DEFINER privileges)
  UPDATE availability_dates
  SET is_booked = true, updated_at = now()
  WHERE provider_id = _provider_id
    AND date = _date
    AND time_slot = _time_slot;
  
  -- Return the new appointment ID
  RETURN _appointment_id;
END;
$$;