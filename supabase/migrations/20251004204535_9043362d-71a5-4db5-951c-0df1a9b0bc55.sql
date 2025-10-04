-- Phase 1: Secure Role-Based Access Control Migration
-- This migration moves roles from profiles table to a dedicated user_roles table

-- Step 1: Create role enum
CREATE TYPE public.app_role AS ENUM ('user', 'provider', 'admin');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create security definer functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_primary_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'provider' THEN 2 WHEN 'user' THEN 3 END
  LIMIT 1;
$$;

-- Step 4: Migrate existing roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::text::app_role FROM public.profiles WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 5: RLS policies on user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Step 6: Update storage policies
DROP POLICY IF EXISTS "Admins can view all chat PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all chat PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all provider docs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage provider docs" ON storage.objects;

CREATE POLICY "Admins can view all chat PDFs" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'chat-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all chat PDFs" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'chat-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all provider docs" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'provider-docs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage provider docs" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'provider-docs' AND public.has_role(auth.uid(), 'admin'));

-- Step 7: Update table RLS policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all chats" ON public.chats;
DROP POLICY IF EXISTS "Admins can view all doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view all reminders" ON public.reminders;
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins can manage all assignments" ON public.provider_patient_assignments;
DROP POLICY IF EXISTS "Providers can view their assignments" ON public.provider_patient_assignments;
DROP POLICY IF EXISTS "Admins can manage all services" ON public.provider_services;

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all chats" ON public.chats
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all doctors" ON public.doctors
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all reminders" ON public.reminders
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view activity logs" ON public.activity_logs
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all assignments" ON public.provider_patient_assignments
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can view their assignments" ON public.provider_patient_assignments
FOR SELECT TO authenticated
USING (auth.uid() = provider_id AND public.has_role(auth.uid(), 'provider') 
  AND (SELECT approval_status FROM public.profiles WHERE id = auth.uid()) = 'approved');

CREATE POLICY "Admins can manage all services" ON public.provider_services
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Step 8: Update trigger functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, approval_status)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name', 'pending');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_privileged_profile_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF OLD.approval_status IS DISTINCT FROM NEW.approval_status THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can modify approval status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Step 9: Drop old functions and recreate get_user_role
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.get_user_role();

CREATE FUNCTION public.get_user_role()
RETURNS app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.get_user_primary_role(auth.uid());
$$;