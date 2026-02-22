
-- ============================================
-- Step 2: Create blog_posts and health_tips tables
-- ============================================

-- Blog Posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  category text,
  status text NOT NULL DEFAULT 'draft',
  author_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admins can manage all blog posts"
  ON public.blog_posts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can read published posts
CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Health Tips table
CREATE TABLE public.health_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  category text,
  icon text,
  priority integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.health_tips ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admins can manage all health tips"
  ON public.health_tips FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can read active tips
CREATE POLICY "Anyone can view active health tips"
  ON public.health_tips FOR SELECT
  USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_health_tips_updated_at
  BEFORE UPDATE ON public.health_tips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
