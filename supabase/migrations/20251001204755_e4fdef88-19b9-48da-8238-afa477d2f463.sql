-- Create service categories table
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert common medical specialties
INSERT INTO public.service_categories (name, description, icon) VALUES
  ('General Practice', 'Primary care and general health', 'stethoscope'),
  ('Cardiology', 'Heart and cardiovascular system', 'heart'),
  ('Dermatology', 'Skin, hair, and nails', 'droplet'),
  ('Pediatrics', 'Children''s health', 'baby'),
  ('Orthopedics', 'Bones and joints', 'bone'),
  ('Neurology', 'Brain and nervous system', 'brain'),
  ('Psychiatry', 'Mental health', 'brain-circuit'),
  ('Gynecology', 'Women''s health', 'user-check'),
  ('Ophthalmology', 'Eye care', 'eye'),
  ('Dentistry', 'Dental care', 'teeth')
ON CONFLICT (name) DO NOTHING;

-- Create provider services table
CREATE TABLE IF NOT EXISTS public.provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(provider_id, service_name)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_provider_services_provider ON public.provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_category ON public.provider_services(category_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_categories (public read)
CREATE POLICY "Anyone can view service categories"
  ON public.service_categories FOR SELECT
  USING (true);

-- RLS Policies for provider_services
CREATE POLICY "Providers can manage their services"
  ON public.provider_services FOR ALL
  USING (auth.uid() = provider_id);

CREATE POLICY "Anyone can view active services"
  ON public.provider_services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all services"
  ON public.provider_services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Create function to send notification
CREATE OR REPLACE FUNCTION public.send_notification(
  _user_id UUID,
  _title TEXT,
  _message TEXT,
  _type TEXT DEFAULT 'info',
  _link TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (_user_id, _title, _message, _type, _link)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create trigger to notify new providers
CREATE OR REPLACE FUNCTION public.notify_new_provider()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'provider' THEN
    PERFORM public.send_notification(
      NEW.id,
      'Welcome to Doctori AI',
      'Your provider account has been created. An admin will review your application shortly.',
      'success',
      '/dashboard/provider/pending'
    );
    
    -- Notify admins
    INSERT INTO public.notifications (user_id, title, message, type, link)
    SELECT 
      id,
      'New Provider Registration',
      'A new healthcare provider has registered: ' || COALESCE(NEW.first_name || ' ' || NEW.last_name, NEW.email),
      'info',
      '/dashboard/admin'
    FROM public.profiles
    WHERE role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_provider_registered
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_provider();

-- Create trigger to notify provider approval
CREATE OR REPLACE FUNCTION public.notify_provider_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.approval_status IS DISTINCT FROM NEW.approval_status AND NEW.role = 'provider' THEN
    IF NEW.approval_status = 'approved' THEN
      PERFORM public.send_notification(
        NEW.id,
        'Application Approved!',
        'Congratulations! Your provider application has been approved. You can now access your dashboard.',
        'success',
        '/dashboard/provider'
      );
    ELSIF NEW.approval_status = 'rejected' THEN
      PERFORM public.send_notification(
        NEW.id,
        'Application Status Update',
        'We regret to inform you that your provider application was not approved at this time. Please contact support for more information.',
        'warning',
        '/contact'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_provider_approval_changed
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_provider_approval();