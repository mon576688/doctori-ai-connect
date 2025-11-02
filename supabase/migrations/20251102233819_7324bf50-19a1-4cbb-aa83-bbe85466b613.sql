-- Add location and provider type fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS provider_type text CHECK (provider_type IN ('doctor', 'hospital', 'nurse'));

-- Create availability_dates table for specific date/time availability
CREATE TABLE IF NOT EXISTS public.availability_dates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  time_slot time NOT NULL,
  is_available boolean DEFAULT true,
  is_booked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on availability_dates
ALTER TABLE public.availability_dates ENABLE ROW LEVEL SECURITY;

-- Anyone can view available slots
CREATE POLICY "Anyone can view available slots"
ON public.availability_dates
FOR SELECT
USING (is_available = true);

-- Providers can manage their availability
CREATE POLICY "Providers can manage their availability dates"
ON public.availability_dates
FOR ALL
USING (has_role(auth.uid(), 'provider'::app_role) AND auth.uid() = provider_id);

-- Admins can manage all availability
CREATE POLICY "Admins can manage all availability dates"
ON public.availability_dates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_availability_dates_provider_date 
ON public.availability_dates(provider_id, date);

-- Create trigger for updating updated_at
CREATE TRIGGER update_availability_dates_updated_at
BEFORE UPDATE ON public.availability_dates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();