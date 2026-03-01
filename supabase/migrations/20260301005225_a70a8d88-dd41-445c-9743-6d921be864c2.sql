
CREATE OR REPLACE FUNCTION public.book_appointment_slot(
  _user_id uuid,
  _provider_id uuid,
  _appointment_date timestamp with time zone,
  _date date,
  _time_slot time without time zone,
  _appointment_type text,
  _duration_minutes integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _appointment_id uuid;
  _is_available boolean;
BEGIN
  IF _user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot book appointment for another user';
  END IF;

  -- Try to find and lock existing availability_dates row
  SELECT (is_available = true AND is_booked = false) INTO _is_available
  FROM availability_dates
  WHERE provider_id = _provider_id
    AND date = _date
    AND time_slot = _time_slot
  FOR UPDATE;

  IF _is_available IS NULL THEN
    -- No availability_dates row; check availability_slots for recurring schedule
    IF EXISTS (
      SELECT 1 FROM availability_slots
      WHERE provider_id = _provider_id
        AND day_of_week = EXTRACT(DOW FROM _date)::integer
        AND is_available = true
        AND start_time <= _time_slot
        AND end_time > _time_slot
    ) THEN
      -- Also check no existing appointment for this slot
      IF EXISTS (
        SELECT 1 FROM appointments
        WHERE doctor_id = _provider_id
          AND appointment_date::date = _date
          AND status = 'scheduled'
          AND appointment_date::time = _time_slot
      ) THEN
        RAISE EXCEPTION 'Time slot is no longer available';
      END IF;
      -- Create the availability_dates row as booked
      INSERT INTO availability_dates (provider_id, date, time_slot, is_available, is_booked)
      VALUES (_provider_id, _date, _time_slot, true, true);
    ELSE
      RAISE EXCEPTION 'Time slot is no longer available';
    END IF;
  ELSIF _is_available = false THEN
    RAISE EXCEPTION 'Time slot is no longer available';
  ELSE
    -- Mark existing row as booked
    UPDATE availability_dates SET is_booked = true, updated_at = now()
    WHERE provider_id = _provider_id
      AND date = _date
      AND time_slot = _time_slot;
  END IF;

  -- Create the appointment
  INSERT INTO appointments (
    user_id, doctor_id, appointment_date,
    appointment_type, status, duration_minutes, is_chat_enabled
  ) VALUES (
    _user_id, _provider_id, _appointment_date,
    _appointment_type, 'scheduled', _duration_minutes, true
  ) RETURNING id INTO _appointment_id;

  RETURN _appointment_id;
END;
$function$;
