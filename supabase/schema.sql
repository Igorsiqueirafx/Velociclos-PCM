-- =============================================
-- VELOCICLOS PCM - SUPABASE SCHEMA
-- Execute no Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- CERTIFICATES
-- =============================================
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image TEXT, -- legacy compatibility
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.certificates
  FOR SELECT USING (true);

CREATE POLICY "Admin write access" ON public.certificates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- ARTICLES
-- =============================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[],
  featured_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  author_name TEXT,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles(slug);
CREATE INDEX IF NOT EXISTS articles_category_idx ON public.articles(category);
CREATE INDEX IF NOT EXISTS articles_published_idx ON public.articles(published, published_at DESC);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published articles" ON public.articles
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Admin full access" ON public.articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- COURSES
-- =============================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  youtube_playlist_id TEXT,
  order_index INT DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  level TEXT CHECK (level IN ('iniciante', 'intermediario', 'avancado', 'especializacao', 'intensivo', 'completo')),
  duration_hours INT,
  lessons_count INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS courses_slug_idx ON public.courses(slug);
CREATE INDEX IF NOT EXISTS courses_published_idx ON public.courses(published, order_index);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published courses" ON public.courses
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Admin full access" ON public.courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- COURSE MODULES
-- =============================================
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read modules of published courses" ON public.course_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND published = TRUE
    )
  );

CREATE POLICY "Admin full access" ON public.course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- LESSONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  youtube_video_id TEXT,
  duration_seconds INT,
  order_index INT DEFAULT 0,
  free_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read lessons of published courses" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_modules cm
      JOIN public.courses c ON c.id = cm.course_id
      WHERE cm.id = module_id AND c.published = TRUE
    )
  );

CREATE POLICY "Admin full access" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- SUBSCRIBERS (Newsletter/Leads)
-- =============================================
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'newsletter', -- newsletter, lead-capture, cadastro-lead, curso
  tags TEXT[],
  confirmed BOOLEAN DEFAULT FALSE,
  confirmed_at TIMESTAMPTZ,
  unsubscribed BOOLEAN DEFAULT FALSE,
  unsubscribed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscribers_email_idx ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS subscribers_source_idx ON public.subscribers(source);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access" ON public.subscribers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow insert for newsletter signup (no auth required)
CREATE POLICY "Allow newsletter signup" ON public.subscribers
  FOR INSERT WITH CHECK (true);

-- =============================================
-- DOWNLOADS (EA, Materials)
-- =============================================
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_type TEXT,
  thumbnail_url TEXT,
  version TEXT,
  requires_auth BOOLEAN DEFAULT TRUE,
  requires_admin BOOLEAN DEFAULT FALSE,
  download_count INT DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published downloads" ON public.downloads
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Authenticated users read auth downloads" ON public.downloads
  FOR SELECT USING (
    requires_auth = FALSE OR auth.uid() IS NOT NULL
  );

CREATE POLICY "Admin full access" ON public.downloads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- PAGES (Static content management)
-- =============================================
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published pages" ON public.pages
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Admin full access" ON public.pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- VIDEOS (YouTube sync tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration_seconds INT,
  published_at TIMESTAMPTZ,
  playlist_id TEXT,
  channel_id TEXT,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  tags TEXT[],
  category TEXT, -- momento: exaustao, canal, erro, rotina, setup
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS videos_playlist_idx ON public.videos(playlist_id);
CREATE INDEX IF NOT EXISTS videos_category_idx ON public.videos(category);
CREATE INDEX IF NOT EXISTS videos_published_idx ON public.videos(published_at DESC);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read all videos" ON public.videos
  FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON public.videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- ANALYTICS EVENTS (Optional - for tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  page_url TEXT,
  user_agent TEXT,
  ip_hash TEXT, -- hashed for privacy
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_event_name_idx ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS analytics_created_idx ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_user_idx ON public.analytics_events(user_id);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow event insert" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- =============================================
-- STORAGE BUCKETS (run in Storage settings or via API)
-- =============================================
-- Bucket: certificates (public)
-- Bucket: course-thumbnails (public)
-- Bucket: article-images (public)
-- Bucket: downloads (private, signed URLs)
-- Bucket: avatars (public)

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'certificates', 'articles', 'courses', 'course_modules', 'lessons', 'subscribers', 'downloads', 'pages')
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END $$;

-- =============================================
-- HELPFUL VIEWS
-- =============================================

-- Published content summary for admin dashboard
CREATE OR REPLACE VIEW public.admin_content_summary AS
SELECT
  'certificates' AS type,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE image_url IS NOT NULL) AS with_images
FROM public.certificates
UNION ALL
SELECT
  'articles',
  COUNT(*),
  COUNT(*) FILTER (WHERE published = TRUE)
FROM public.articles
UNION ALL
SELECT
  'courses',
  COUNT(*),
  COUNT(*) FILTER (WHERE published = TRUE)
FROM public.courses
UNION ALL
SELECT
  'subscribers',
  COUNT(*),
  COUNT(*) FILTER (WHERE confirmed = TRUE)
FROM public.subscribers
UNION ALL
SELECT
  'downloads',
  COUNT(*),
  COUNT(*) FILTER (WHERE published = TRUE)
FROM public.downloads;

-- =============================================
-- SAMPLE DATA (Optional - run after seed script)
-- =============================================
-- INSERT INTO public.certificates (id, title, description, image_url, order_index) VALUES
-- ('formula-ouro', 'Fórmula do Ouro', 'Certificado de conclusão...', '/certificados/Formula do Ouro.webp', 1),
-- ... (seed script handles this)