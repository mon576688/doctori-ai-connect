
-- 1. Fix views with security definer behavior (set security_invoker)
ALTER VIEW public.hospitals_public SET (security_invoker = true);
ALTER VIEW public.providers_public SET (security_invoker = true);

-- 2. Fix blood_donors RLS - require authenticated + ownership on insert
DROP POLICY IF EXISTS "Anyone can register as blood donor" ON public.blood_donors;
CREATE POLICY "Authenticated users can register themselves as donors"
  ON public.blood_donors FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. reviews - restrict SELECT to authenticated to avoid exposing patient_id to anonymous users
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
CREATE POLICY "Authenticated users can view approved reviews"
  ON public.reviews FOR SELECT TO authenticated
  USING (is_approved = true);

-- 4. user_roles - explicit deny for non-admin INSERT (defense in depth)
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. medical_assessments - add direct user_id ownership column
ALTER TABLE public.medical_assessments
  ADD COLUMN IF NOT EXISTS user_id uuid;

UPDATE public.medical_assessments ma
SET user_id = cs.user_id
FROM public.chat_sessions cs
WHERE cs.id = ma.session_id AND ma.user_id IS NULL;

DROP POLICY IF EXISTS "Users can create their own assessments" ON public.medical_assessments;
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.medical_assessments;

CREATE POLICY "Users can view their own assessments"
  ON public.medical_assessments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments"
  ON public.medical_assessments FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = session_id AND cs.user_id = auth.uid()
    )
  );

-- 6. chat-pdfs storage: add owner DELETE/UPDATE policies
CREATE POLICY "Users can update their own chat PDFs"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'chat-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'chat-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own chat PDFs"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'chat-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 7. Avatars bucket: remove broad listing policy (public URLs still work for direct object access)
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;

-- 8. Lock down SECURITY DEFINER function EXECUTE privileges
-- Revoke from PUBLIC/anon for all sensitive definer functions; only grant what's needed.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_provider() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_provider_approval() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admin_document_upload() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_appointment_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_privileged_profile_columns() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.send_notification(uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.send_notification(uuid, text, text, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(inet, text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_activity_safe(text, jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.verify_admin_access() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_update_user_status(uuid, approval_status) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_update_user_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_get_all_users() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_create_provider(text, text, text, text, text, text, text, integer, text, text, text, boolean, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.book_appointment_slot(uuid, uuid, timestamptz, date, time, text, integer) FROM PUBLIC, anon;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_primary_role(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_approval_status() FROM PUBLIC, anon;

-- Grant EXECUTE only to authenticated where needed by RLS / client RPCs
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_primary_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_approval_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_activity_safe(text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_status(uuid, approval_status) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_provider(text, text, text, text, text, text, text, integer, text, text, text, boolean, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.book_appointment_slot(uuid, uuid, timestamptz, date, time, text, integer) TO authenticated;

-- 9. Realtime authorization: restrict broadcast/presence subscriptions to authenticated users
-- (replaces unrestricted access to realtime.messages)
DROP POLICY IF EXISTS "Authenticated users can receive own realtime messages" ON realtime.messages;
CREATE POLICY "Authenticated users can receive own realtime messages"
  ON realtime.messages FOR SELECT TO authenticated
  USING (
    -- Allow subscriptions to topics scoped by the user's id
    (realtime.topic() LIKE 'user:' || auth.uid()::text || ':%')
    OR (realtime.topic() = 'user:' || auth.uid()::text)
  );
