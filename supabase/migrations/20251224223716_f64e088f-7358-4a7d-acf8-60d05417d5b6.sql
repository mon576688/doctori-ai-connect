-- Add consultation_link column to appointments table
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS consultation_link TEXT;

-- Add RLS policy for providers to view their patients' profiles
CREATE POLICY "Providers can view their patients profiles"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'provider'::app_role) AND
  EXISTS (
    SELECT 1 FROM appointments
    WHERE appointments.doctor_id = auth.uid()
    AND appointments.user_id = profiles.id
  )
);