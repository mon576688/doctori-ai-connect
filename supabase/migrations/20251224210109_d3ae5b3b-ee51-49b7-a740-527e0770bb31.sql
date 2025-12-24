-- Add RLS policy to allow anyone to view approved provider profiles
CREATE POLICY "Anyone can view approved provider profiles"
ON public.profiles
FOR SELECT
USING (role = 'provider' AND approval_status = 'approved');