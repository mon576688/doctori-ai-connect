
-- Add columns to appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS is_chat_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS session_start_time timestamptz,
ADD COLUMN IF NOT EXISTS session_end_time timestamptz;

-- Backfill existing scheduled appointments
UPDATE public.appointments SET is_chat_enabled = true WHERE status = 'scheduled';

-- Update book_appointment_slot to enable chat on booking
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
  
  SELECT (is_available = true AND is_booked = false) INTO _is_available
  FROM availability_dates
  WHERE provider_id = _provider_id
    AND date = _date
    AND time_slot = _time_slot
  FOR UPDATE;
  
  IF _is_available IS NULL OR _is_available = false THEN
    RAISE EXCEPTION 'Time slot is no longer available';
  END IF;
  
  INSERT INTO appointments (
    user_id, doctor_id, appointment_date,
    appointment_type, status, duration_minutes, is_chat_enabled
  ) VALUES (
    _user_id, _provider_id, _appointment_date,
    _appointment_type, 'scheduled', _duration_minutes, true
  ) RETURNING id INTO _appointment_id;
  
  UPDATE availability_dates
  SET is_booked = true, updated_at = now()
  WHERE provider_id = _provider_id
    AND date = _date
    AND time_slot = _time_slot;
  
  RETURN _appointment_id;
END;
$function$;

-- Drop the old open INSERT policy on direct_messages
DROP POLICY IF EXISTS "Users can send messages" ON public.direct_messages;

-- Create appointment-gated INSERT policy with 24h grace period
CREATE POLICY "Users can send messages to appointment contacts" 
ON public.direct_messages FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.appointments
    WHERE is_chat_enabled = true
    AND (
      (user_id = sender_id AND doctor_id = receiver_id)
      OR (doctor_id = sender_id AND user_id = receiver_id)
    )
    AND (
      session_end_time IS NULL 
      OR session_end_time > now() - interval '24 hours'
    )
  )
);
