-- Create blood_donors table
CREATE TABLE public.blood_donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  city TEXT NOT NULL,
  last_donated_date DATE,
  available_for_donation BOOLEAN NOT NULL DEFAULT true,
  mobile_number TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;

-- Anyone can register as a blood donor (public insert)
CREATE POLICY "Anyone can register as blood donor"
ON public.blood_donors
FOR INSERT
WITH CHECK (true);

-- Users can view their own registrations
CREATE POLICY "Users can view their own donor records"
ON public.blood_donors
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own records
CREATE POLICY "Users can update their own donor records"
ON public.blood_donors
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all donors
CREATE POLICY "Admins can view all donors"
ON public.blood_donors
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all donors
CREATE POLICY "Admins can manage all donors"
ON public.blood_donors
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_blood_donors_updated_at
BEFORE UPDATE ON public.blood_donors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();