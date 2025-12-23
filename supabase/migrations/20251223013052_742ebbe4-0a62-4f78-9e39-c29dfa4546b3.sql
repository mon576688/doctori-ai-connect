-- Add policy for admins to delete blood donors
CREATE POLICY "Admins can delete blood donors"
ON public.blood_donors
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));