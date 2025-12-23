-- Add consultation fields to appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS consultation_type text DEFAULT 'video',
ADD COLUMN IF NOT EXISTS consultation_platform text DEFAULT 'zoom',
ADD COLUMN IF NOT EXISTS consultation_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS consultation_started_at timestamptz,
ADD COLUMN IF NOT EXISTS consultation_ended_at timestamptz;

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  prescription_type text NOT NULL DEFAULT 'typed',
  diagnosis text,
  doctor_notes text,
  medicines jsonb DEFAULT '[]'::jsonb,
  image_url text,
  shared_via_email boolean DEFAULT false,
  shared_via_whatsapp boolean DEFAULT false,
  shared_on_platform boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on prescriptions
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Doctors can create prescriptions
CREATE POLICY "Doctors can create prescriptions"
ON public.prescriptions
FOR INSERT
WITH CHECK (
  auth.uid() = doctor_id AND
  has_role(auth.uid(), 'provider'::app_role)
);

-- Doctors can view their own prescriptions
CREATE POLICY "Doctors can view their prescriptions"
ON public.prescriptions
FOR SELECT
USING (auth.uid() = doctor_id);

-- Doctors can update their prescriptions
CREATE POLICY "Doctors can update their prescriptions"
ON public.prescriptions
FOR UPDATE
USING (auth.uid() = doctor_id);

-- Patients can view prescriptions shared with them
CREATE POLICY "Patients can view their prescriptions"
ON public.prescriptions
FOR SELECT
USING (auth.uid() = patient_id AND shared_on_platform = true);

-- Admins can view all prescriptions
CREATE POLICY "Admins can view all prescriptions"
ON public.prescriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_prescriptions_updated_at
BEFORE UPDATE ON public.prescriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for prescriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;