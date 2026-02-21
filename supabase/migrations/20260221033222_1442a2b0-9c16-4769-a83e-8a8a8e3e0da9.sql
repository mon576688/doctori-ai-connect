
-- Create storage bucket for medical records
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-records', 'medical-records', false);

-- Patients can upload to their own folder
CREATE POLICY "Patients can upload their records"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'medical-records' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Patients can view their own files
CREATE POLICY "Patients can view their records"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'medical-records' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Patients can delete their own files
CREATE POLICY "Patients can delete their records"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'medical-records' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create medical_records table
CREATE TABLE public.medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL DEFAULT 'other',
  title text NOT NULL,
  description text,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  file_type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their records" ON public.medical_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their records" ON public.medical_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their records" ON public.medical_records
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their records" ON public.medical_records
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all medical records" ON public.medical_records
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Create shared_medical_records table
CREATE TABLE public.shared_medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id uuid NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL,
  doctor_id uuid NOT NULL,
  shared_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(record_id, doctor_id)
);

ALTER TABLE public.shared_medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can share their records" ON public.shared_medical_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can view their shares" ON public.shared_medical_records
  FOR SELECT TO authenticated USING (auth.uid() = patient_id);

CREATE POLICY "Patients can revoke shares" ON public.shared_medical_records
  FOR DELETE TO authenticated USING (auth.uid() = patient_id);

CREATE POLICY "Providers can view shared record links" ON public.shared_medical_records
  FOR SELECT TO authenticated USING (auth.uid() = doctor_id);

CREATE POLICY "Providers can view shared medical records" ON public.medical_records
  FOR SELECT TO authenticated USING (
    has_role(auth.uid(), 'provider'::app_role) AND EXISTS (
      SELECT 1 FROM public.shared_medical_records
      WHERE record_id = medical_records.id AND doctor_id = auth.uid()
    )
  );

-- Providers can view shared files in storage
CREATE POLICY "Providers can view shared record files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'medical-records' AND EXISTS (
  SELECT 1 FROM public.shared_medical_records smr
  JOIN public.medical_records mr ON mr.id = smr.record_id
  WHERE mr.file_path = name AND smr.doctor_id = auth.uid()
));

-- Trigger for updated_at
CREATE TRIGGER update_medical_records_updated_at
BEFORE UPDATE ON public.medical_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
