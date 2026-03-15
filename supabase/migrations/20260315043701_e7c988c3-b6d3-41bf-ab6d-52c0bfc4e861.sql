
-- 1. Add category column to notifications
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'system';

-- 2. Update send_notification to accept _category
CREATE OR REPLACE FUNCTION public.send_notification(
  _user_id uuid,
  _title text,
  _message text,
  _type text DEFAULT 'info'::text,
  _link text DEFAULT NULL::text,
  _category text DEFAULT 'system'::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link, category)
  VALUES (_user_id, _title, _message, _type, _link, _category)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- 3. Update notify_appointment_change to use category
CREATE OR REPLACE FUNCTION public.notify_appointment_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  doctor_name TEXT;
  patient_name TEXT;
BEGIN
  SELECT COALESCE(p.first_name || ' ' || p.last_name, p.email)
  INTO doctor_name
  FROM profiles p WHERE p.id = NEW.doctor_id;
  
  SELECT COALESCE(p.first_name || ' ' || p.last_name, p.email)
  INTO patient_name
  FROM profiles p WHERE p.id = NEW.user_id;

  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM send_notification(
      NEW.user_id,
      'Appointment Update',
      'Your appointment with Dr. ' || doctor_name || ' has been ' || NEW.status,
      'info',
      '/dashboard',
      'appointment'
    );
    PERFORM send_notification(
      NEW.doctor_id,
      'Appointment Update',
      'Appointment with ' || patient_name || ' has been ' || NEW.status,
      'info',
      '/dashboard/provider',
      'appointment'
    );
  END IF;
  
  IF TG_OP = 'INSERT' THEN
    PERFORM send_notification(
      NEW.user_id,
      'Appointment Confirmed',
      'Your appointment with Dr. ' || doctor_name || ' on ' || TO_CHAR(NEW.appointment_date, 'YYYY-MM-DD HH24:MI') || ' has been booked',
      'success',
      '/dashboard',
      'appointment'
    );
    PERFORM send_notification(
      NEW.doctor_id,
      'New Appointment',
      'New appointment booked with ' || patient_name || ' on ' || TO_CHAR(NEW.appointment_date, 'YYYY-MM-DD HH24:MI'),
      'info',
      '/dashboard/provider',
      'appointment'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- 4. Update notify_new_provider to use category
CREATE OR REPLACE FUNCTION public.notify_new_provider()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.role = 'provider' THEN
    PERFORM public.send_notification(
      NEW.id,
      'Welcome to Doctori AI',
      'Your provider account has been created. An admin will review your application shortly.',
      'success',
      '/dashboard/provider/pending',
      'system'
    );
    
    INSERT INTO public.notifications (user_id, title, message, type, link, category)
    SELECT 
      ur.user_id,
      'New Provider Registration',
      'A new healthcare provider has registered: ' || COALESCE(NEW.first_name || ' ' || NEW.last_name, NEW.email),
      'info',
      '/dashboard/admin',
      'admin'
    FROM public.user_roles ur
    WHERE ur.role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$;

-- 5. Update notify_provider_approval to use category
CREATE OR REPLACE FUNCTION public.notify_provider_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.approval_status IS DISTINCT FROM NEW.approval_status AND NEW.role = 'provider' THEN
    IF NEW.approval_status = 'approved' THEN
      PERFORM public.send_notification(
        NEW.id,
        'Application Approved!',
        'Congratulations! Your provider application has been approved. You can now access your dashboard.',
        'success',
        '/dashboard/provider',
        'system'
      );
    ELSIF NEW.approval_status = 'rejected' THEN
      PERFORM public.send_notification(
        NEW.id,
        'Application Status Update',
        'We regret to inform you that your provider application was not approved at this time. Please contact support for more information.',
        'warning',
        '/contact',
        'system'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 6. Add trigger to notify admins on document upload
CREATE OR REPLACE FUNCTION public.notify_admin_document_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  provider_name TEXT;
BEGIN
  SELECT COALESCE(p.first_name || ' ' || p.last_name, p.email)
  INTO provider_name
  FROM profiles p WHERE p.id = NEW.provider_id;

  INSERT INTO public.notifications (user_id, title, message, type, link, category)
  SELECT 
    ur.user_id,
    'New Document Uploaded',
    'Provider ' || COALESCE(provider_name, 'Unknown') || ' uploaded a ' || NEW.document_type || ' document for review.',
    'info',
    '/dashboard/admin',
    'admin'
  FROM public.user_roles ur
  WHERE ur.role = 'admin';

  RETURN NEW;
END;
$$;

-- Create trigger for document uploads
DROP TRIGGER IF EXISTS on_document_upload_notify_admin ON public.provider_documents;
CREATE TRIGGER on_document_upload_notify_admin
  AFTER INSERT ON public.provider_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_document_upload();
