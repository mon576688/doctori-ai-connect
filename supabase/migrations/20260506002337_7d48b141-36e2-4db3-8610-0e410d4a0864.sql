-- 1. Tighten activity_logs INSERT policy (prevent log poisoning)
DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;
CREATE POLICY "No direct activity log inserts"
ON public.activity_logs
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

-- 2. Tighten notifications INSERT policy (force use of send_notification SECURITY DEFINER)
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "No direct notification inserts"
ON public.notifications
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

-- 3. Fix blood_donors SELECT policy: remove the public exposure of guest registrations
DROP POLICY IF EXISTS "Users can view their own donor records" ON public.blood_donors;
CREATE POLICY "Users can view their own donor records"
ON public.blood_donors
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);