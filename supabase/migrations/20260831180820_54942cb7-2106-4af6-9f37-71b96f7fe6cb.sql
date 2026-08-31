
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE public.medicines (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name text NOT NULL,
  generic_name text NOT NULL,
  strength text,
  dosage_form text,
  manufacturer text,
  indications text,
  adult_dose text,
  side_effects text,
  warnings text,
  requires_prescription boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.medicines TO anon;
GRANT SELECT ON public.medicines TO authenticated;
GRANT ALL ON public.medicines TO service_role;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active medicines" ON public.medicines
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage medicines" ON public.medicines
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX medicines_brand_trgm ON public.medicines USING gin (brand_name gin_trgm_ops);
CREATE INDEX medicines_generic_trgm ON public.medicines USING gin (generic_name gin_trgm_ops);
CREATE INDEX medicines_generic_lower ON public.medicines (lower(generic_name));
CREATE UNIQUE INDEX medicines_brand_strength_uniq ON public.medicines (lower(brand_name), coalesce(lower(strength), ''));

CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.medicine_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  generic_a text NOT NULL,
  generic_b text NOT NULL,
  severity text NOT NULL DEFAULT 'moderate',
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.medicine_interactions TO anon;
GRANT SELECT ON public.medicine_interactions TO authenticated;
GRANT ALL ON public.medicine_interactions TO service_role;
ALTER TABLE public.medicine_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view interactions" ON public.medicine_interactions
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage interactions" ON public.medicine_interactions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE UNIQUE INDEX medicine_interactions_pair_uniq
  ON public.medicine_interactions (lower(generic_a), lower(generic_b));

CREATE TABLE public.prescription_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id uuid NOT NULL,
  name text NOT NULL,
  specialty_label text,
  diagnosis text,
  doctor_notes text,
  medicines jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prescription_templates TO authenticated;
GRANT ALL ON public.prescription_templates TO service_role;
ALTER TABLE public.prescription_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors manage their own templates" ON public.prescription_templates
  FOR ALL TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE TRIGGER update_prescription_templates_updated_at BEFORE UPDATE ON public.prescription_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.prescriptions
  ADD COLUMN IF NOT EXISTS interaction_ack jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS template_id uuid;

CREATE OR REPLACE FUNCTION public.search_medicines(_q text)
RETURNS TABLE(
  id uuid, brand_name text, generic_name text, strength text,
  dosage_form text, manufacturer text, adult_dose text,
  indications text, side_effects text, warnings text
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT m.id, m.brand_name, m.generic_name, m.strength, m.dosage_form,
         m.manufacturer, m.adult_dose, m.indications, m.side_effects, m.warnings
  FROM public.medicines m
  WHERE m.is_active = true
    AND (m.brand_name ILIKE '%' || _q || '%' OR m.generic_name ILIKE '%' || _q || '%')
  ORDER BY
    CASE WHEN m.brand_name ILIKE _q || '%' THEN 0
         WHEN m.generic_name ILIKE _q || '%' THEN 1
         ELSE 2 END,
    m.brand_name
  LIMIT 20;
$$;

GRANT EXECUTE ON FUNCTION public.search_medicines(text) TO anon, authenticated;
