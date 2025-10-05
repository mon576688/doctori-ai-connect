-- Create availability slots table for provider scheduling
CREATE TABLE public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.doctors(user_id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create index for faster queries
CREATE INDEX idx_availability_provider ON public.availability_slots(provider_id);
CREATE INDEX idx_availability_day ON public.availability_slots(day_of_week);

-- Enable RLS
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for availability_slots
CREATE POLICY "Anyone can view available slots"
  ON public.availability_slots FOR SELECT
  USING (is_available = true);

CREATE POLICY "Providers can manage their availability"
  ON public.availability_slots FOR ALL
  USING (has_role(auth.uid(), 'provider') AND auth.uid() = provider_id);

CREATE POLICY "Admins can manage all availability"
  ON public.availability_slots FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_availability_slots_updated_at
  BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update appointments table to add more fields
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS appointment_type TEXT DEFAULT 'consultation',
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Add RLS policies for doctors to view their appointments
CREATE POLICY "Doctors can view their appointments"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors
      WHERE doctors.user_id = auth.uid()
      AND doctors.user_id = appointments.doctor_id
    )
  );

CREATE POLICY "Doctors can update their appointments"
  ON public.appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors
      WHERE doctors.user_id = auth.uid()
      AND doctors.user_id = appointments.doctor_id
    )
  );

-- Function to notify users of appointment status changes
CREATE OR REPLACE FUNCTION public.notify_appointment_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  doctor_name TEXT;
  patient_name TEXT;
BEGIN
  -- Get doctor name
  SELECT COALESCE(p.first_name || ' ' || p.last_name, p.email)
  INTO doctor_name
  FROM profiles p
  WHERE p.id = NEW.doctor_id;
  
  -- Get patient name
  SELECT COALESCE(p.first_name || ' ' || p.last_name, p.email)
  INTO patient_name
  FROM profiles p
  WHERE p.id = NEW.user_id;

  -- Notify patient on status change
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM send_notification(
      NEW.user_id,
      'Appointment Update',
      'Your appointment with Dr. ' || doctor_name || ' has been ' || NEW.status,
      'info',
      '/dashboard'
    );
    
    -- Notify doctor
    PERFORM send_notification(
      NEW.doctor_id,
      'Appointment Update',
      'Appointment with ' || patient_name || ' has been ' || NEW.status,
      'info',
      '/dashboard/provider'
    );
  END IF;
  
  -- Notify both parties on new booking
  IF TG_OP = 'INSERT' THEN
    PERFORM send_notification(
      NEW.user_id,
      'Appointment Confirmed',
      'Your appointment with Dr. ' || doctor_name || ' on ' || TO_CHAR(NEW.appointment_date, 'YYYY-MM-DD HH24:MI') || ' has been booked',
      'success',
      '/dashboard'
    );
    
    PERFORM send_notification(
      NEW.doctor_id,
      'New Appointment',
      'New appointment booked with ' || patient_name || ' on ' || TO_CHAR(NEW.appointment_date, 'YYYY-MM-DD HH24:MI'),
      'info',
      '/dashboard/provider'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for appointment notifications
CREATE TRIGGER appointment_change_notification
  AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_appointment_change();