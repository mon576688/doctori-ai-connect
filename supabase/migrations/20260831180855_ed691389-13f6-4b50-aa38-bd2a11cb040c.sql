
DROP INDEX IF EXISTS public.medicines_brand_trgm;
DROP INDEX IF EXISTS public.medicines_generic_trgm;
DROP EXTENSION IF EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS medicines_brand_lower ON public.medicines (lower(brand_name));
