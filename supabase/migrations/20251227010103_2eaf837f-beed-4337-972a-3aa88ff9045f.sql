-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create provider-hospital assignments table
CREATE TABLE public.provider_hospital_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider_id, hospital_id)
);

-- Enable RLS
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_hospital_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for hospitals
CREATE POLICY "Anyone can view active hospitals"
ON public.hospitals
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all hospitals"
ON public.hospitals
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for provider_hospital_assignments
CREATE POLICY "Anyone can view provider hospital assignments"
ON public.provider_hospital_assignments
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage all provider hospital assignments"
ON public.provider_hospital_assignments
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Providers can manage their own hospital assignments"
ON public.provider_hospital_assignments
FOR ALL
USING (auth.uid() = provider_id AND public.has_role(auth.uid(), 'provider'::app_role));

-- Create trigger for updated_at on hospitals
CREATE TRIGGER update_hospitals_updated_at
BEFORE UPDATE ON public.hospitals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();