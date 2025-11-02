-- Fix Notifications RLS Policies
-- Drop existing policies if any
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view their notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- System can insert notifications (allow from triggers/functions)
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create admin-only RPC functions for server-side verification
-- Function to verify admin access
CREATE OR REPLACE FUNCTION public.verify_admin_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the current user has admin role
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  RETURN true;
END;
$$;

-- Admin function to update user approval status
CREATE OR REPLACE FUNCTION public.admin_update_user_status(
  _user_id uuid,
  _approval_status approval_status
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify admin access first
  PERFORM public.verify_admin_access();
  
  -- Update the user's approval status
  UPDATE public.profiles
  SET approval_status = _approval_status,
      updated_at = now()
  WHERE id = _user_id;
  
  -- Log the activity
  PERFORM public.log_activity_safe(
    'admin_update_user_status',
    jsonb_build_object(
      'target_user_id', _user_id,
      'new_status', _approval_status
    )
  );
END;
$$;

-- Admin function to update user role
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  _user_id uuid,
  _role app_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify admin access first
  PERFORM public.verify_admin_access();
  
  -- Update or insert the user's role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- If changing to a different role, remove old roles
  DELETE FROM public.user_roles
  WHERE user_id = _user_id AND role != _role;
  
  -- Log the activity
  PERFORM public.log_activity_safe(
    'admin_update_user_role',
    jsonb_build_object(
      'target_user_id', _user_id,
      'new_role', _role
    )
  );
END;
$$;

-- Admin function to delete user
CREATE OR REPLACE FUNCTION public.admin_delete_user(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify admin access first
  PERFORM public.verify_admin_access();
  
  -- Prevent self-deletion
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;
  
  -- Log the activity before deletion
  PERFORM public.log_activity_safe(
    'admin_delete_user',
    jsonb_build_object('target_user_id', _user_id)
  );
  
  -- Delete the user profile (cascades to other tables)
  DELETE FROM public.profiles WHERE id = _user_id;
  
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = _user_id;
END;
$$;

-- Admin function to get all users (with proper verification)
CREATE OR REPLACE FUNCTION public.admin_get_all_users()
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  role app_role,
  approval_status approval_status,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify admin access first
  PERFORM public.verify_admin_access();
  
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    COALESCE(ur.role, 'user'::app_role) as role,
    p.approval_status,
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON ur.user_id = p.id
  ORDER BY p.created_at DESC;
END;
$$;