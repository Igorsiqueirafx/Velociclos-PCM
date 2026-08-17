-- SQL Schema for: Velociclos PCM Platform
-- Source of truth: Admin → Supabase → Frontend
-- YouTube is only a media provider, not the content source

-- ============================================
-- COURSES
-- ============================================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  thumbnail text,
  is_published boolean default false,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- MODULES
-- ============================================
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- LESSONS
-- ============================================
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  video_id text,
  thumbnail text,
  duration integer,
  order_index integer default 0,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ARTICLES
-- ============================================
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  cover_image text,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CERTIFICATES
-- ============================================
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  issue_date date,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- ============================================
-- SUBSCRIBERS (já existe, garantindo aqui)
-- ============================================
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text default 'website',
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_modules_course_id on public.modules(course_id);
create index if not exists idx_lessons_module_id on public.lessons(module_id);
create index if not exists idx_lessons_course_id on public.lessons(course_id);
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_published on public.articles(is_published, published_at);
create index if not exists idx_courses_published on public.courses(is_published, order_index);
create index if not exists idx_modules_order on public.modules(course_id, order_index);
create index if not exists idx_lessons_order on public.lessons(module_id, order_index);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.articles enable row level security;
alter table public.certificates enable row level security;
alter table public.subscribers enable row level security;

-- ============================================
-- POLICIES: ANON (público)
-- ============================================

-- Cursos publicados
create policy "anon_select_published_courses"
  on public.courses for select to anon
  using (is_published = true);

-- Módulos de cursos publicados
create policy "anon_select_published_modules"
  on public.modules for select to anon
  using (
    exists (
      select 1 from public.courses
      where courses.id = modules.course_id and courses.is_published = true
    )
  );

-- Aulas de módulos publicados
create policy "anon_select_published_lessons"
  on public.lessons for select to anon
  using (
    is_published = true and
    exists (
      select 1 from public.modules
      join public.courses on courses.id = modules.course_id
      where modules.id = lessons.module_id and courses.is_published = true
    )
  );

-- Artigos publicados
create policy "anon_select_published_articles"
  on public.articles for select to anon
  using (is_published = true);

-- Certificados públicos
create policy "anon_select_certificates"
  on public.certificates for select to anon
  using (true);

-- Subscribers: insert anônimo
create policy "anon_insert_subscribers"
  on public.subscribers for insert to anon
  with check (true);

-- ============================================
-- POLICIES: AUTHENTICATED (admin)
-- ============================================

-- Cursos: CRUD
create policy "authenticated_crud_courses"
  on public.courses for all to authenticated
  using (true) with check (true);

-- Módulos: CRUD
create policy "authenticated_crud_modules"
  on public.modules for all to authenticated
  using (true) with check (true);

-- Aulas: CRUD
create policy "authenticated_crud_lessons"
  on public.lessons for all to authenticated
  using (true) with check (true);

-- Artigos: CRUD
create policy "authenticated_crud_articles"
  on public.articles for all to authenticated
  using (true) with check (true);

-- Certificados: CRUD
create policy "authenticated_crud_certificates"
  on public.certificates for all to authenticated
  using (true) with check (true);

-- Subscribers: SELECT
create policy "authenticated_select_subscribers"
  on public.subscribers for select to authenticated
  using (true);
