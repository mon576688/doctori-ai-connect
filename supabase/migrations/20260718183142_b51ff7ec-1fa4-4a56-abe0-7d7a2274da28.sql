
-- Fix RLS policy always true on newsletter_subscribers INSERT: add proper email check
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 3 AND 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- Restrict EXECUTE on internal SECURITY DEFINER helpers so signed-in users cannot call them directly.
-- These are only invoked from other SECURITY DEFINER functions (via PERFORM), which run as the function owner,
-- so revoking public EXECUTE does not break internal callers.
REVOKE EXECUTE ON FUNCTION public.verify_admin_access() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_activity_safe(text, jsonb) FROM PUBLIC, anon, authenticated;
