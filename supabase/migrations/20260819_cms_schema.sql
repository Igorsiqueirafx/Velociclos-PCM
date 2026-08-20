-- =====================================================================
-- VEL001: CMS Schema for Content Management (courses, modules, lessons, articles, pages, downloads, certificates)
-- Version: 1.0
-- =====================================================================

-- 1. Courses - Curso completo
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  thumbnail text,
  category text,
  is_published boolean default false,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Modules - Módulos dentro de cursos
create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Lessons - Aulas dentro de módulos (YouTube URL = video_id)
create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  video_id text, -- YouTube video ID only
  video_url text, -- Full YouTube URL for convenience
  duration integer,
  order_index integer default 0,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Articles - Blog/artigos com Rich Text + SEO
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  content text,
  excerpt text,
  cover_image text,
  category text,
  tags text[],
  author text,
  is_published boolean default false,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Pages - Páginas estáticas (Manual, Termos, Sobre, Método, EA)
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  cover_image text,
  is_published boolean default false,
  sort_order integer default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Downloads - Arquivos do EA (Expert Advisor)
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  version text,
  file_url text not null,
  file_size text,
  changelog text,
  is_published boolean default false,
  download_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Certificates - Certificados
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  issue_date date,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 8. Subscribers (já existente - preservado)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text default 'website',
  created_at timestamptz default now()
);

-- 9. Media - Arquivos de mídia (imagens, documentos)
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  file_path text not null,
  file_size integer,
  mime_type text,
  alt_text text,
  uploaded_by text,
  created_at timestamptz default now()
);

-- Indexes para performance
create index if not exists idx_courses_published on public.courses(is_published, order_index);
create index if not exists idx_courses_slug on public.courses(slug);
create index if not exists idx_modules_course_id on public.course_modules(course_id);
create index if not exists idx_lessons_module_id on public.course_lessons(module_id);
create index if not exists idx_lessons_course_id on public.course_lessons(course_id);
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_published on public.articles(is_published, published_at);
create index if not exists idx_pages_slug on public.pages(slug);
create index if not exists idx_downloads_published on public.downloads(is_published);

-- Triggers para updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_courses_updated before update on public.courses for each row execute function public.handle_updated_at();
create trigger on_modules_updated before update on public.course_modules for each row execute function public.handle_updated_at();
create trigger on_lessons_updated before update on public.course_lessons for each row execute function public.handle_updated_at();
create trigger on_articles_updated before update on public.articles for each row execute function public.handle_updated_at();
create trigger on_pages_updated before update on public.pages for each row execute function public.handle_updated_at();
create trigger on_downloads_updated before update on public.downloads for each row execute function public.handle_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- 10. Enable RLS
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.articles enable row level security;
alter table public.pages enable row level security;
alter table public.downloads enable row level security;
alter table public.certificates enable row level security;
alter table public.subscribers enable row level security;
alter table public.media enable row level security;

-- =====================================================================
-- POLICIES: ANON (público - leitura de conteúdo publicado)
-- =====================================================================

-- Cursos publicados - read para anônimo
drop policy if exists "anon_read_courses" on public.courses;
create policy "anon_read_courses"
  on public.courses for select to anon
  using (is_published = true);
create policy "anon_read_courses_by_slug"
  on public.courses for select to anon
  using (is_published = true and slug is not null);

-- Módulos de cursos publicados
drop policy if exists "anon_read_modules" on public.course_modules;
create policy "anon_read_modules"
  on public.course_modules for select to anon
  using (
    exists (
      select 1 from public.courses
      where courses.id = course_modules.course_id and courses.is_published = true
    )
  );

-- Aulas publicadas
drop policy if exists "anon_read_lessons" on public.course_lessons;
create policy "anon_read_lessons"
  on public.course_lessons for select to anon
  using (
    is_published = true
    and exists (
      select 1 from public.course_modules
      join public.courses on courses.id = course_modules.course_id
      where course_modules.id = course_lessons.module_id and courses.is_published = true
    )
  );

-- Artigos publicados
drop policy if exists "anon_read_articles" on public.articles;
create policy "anon_read_articles"
  on public.articles for select to anon
  using (is_published = true);
create policy "anon_read_articles_by_slug"
  on public.articles for select to anon
  using (is_published = true and slug is not null);

-- Páginas publicadas
drop policy if exists "anon_read_pages" on public.pages;
create policy "anon_read_pages"
  on public.pages for select to anon
  using (is_published = true);
create policy "anon_read_pages_by_slug"
  on public.pages for select to anon
  using (is_published = true and slug is not null);

-- Downloads publicados
drop policy if exists "anon_read_downloads" on public.downloads;
create policy "anon_read_downloads"
  on public.downloads for select to anon
  using (is_published = true);

-- Certificados - todos públicos
drop policy if exists "anon_read_certificates" on public.certificates;
create policy "anon_read_certificates"
  on public.certificates for select to anon
  using (true);

-- Subscribers: insert anônimo (lead capture)
drop policy if exists "anon_insert_subscribers" on public.subscribers;
create policy "anon_insert_subscribers"
  on public.subscribers for insert to anon
  with check (true);

-- =====================================================================
-- POLICIES: AUTHENTICATED (admin - CRUD completo)
-- =====================================================================

-- Cursos: CRUD para autenticados
drop policy if exists "auth_crud_courses" on public.courses;
create policy "auth_crud_courses"
  on public.courses for all to authenticated
  using (true) with check (true);

-- Módulos: CRUD
drop policy if exists "auth_crud_modules" on public.course_modules;
create policy "auth_crud_modules"
  on public.course_modules for all to authenticated
  using (true) with check (true);

-- Aulas: CRUD
drop policy if exists "auth_crud_lessons" on public.course_lessons;
create policy "auth_crud_lessons"
  on public.course_lessons for all to authenticated
  using (true) with check (true);

-- Artigos: CRUD
drop policy if exists "auth_crud_articles" on public.articles;
create policy "auth_crud_articles"
  on public.articles for all to authenticated
  using (true) with check (true);

-- Páginas: CRUD
drop policy if exists "auth_crud_pages" on public.pages;
create policy "auth_crud_pages"
  on public.pages for all to authenticated
  using (true) with check (true);

-- Downloads: CRUD
drop policy if exists "auth_crud_downloads" on public.downloads;
create policy "auth_crud_downloads"
  on public.downloads for all to authenticated
  using (true) with check (true);

-- Certificados: CRUD
drop policy if exists "auth_crud_certificates" on public.certificates;
create policy "auth_crud_certificates"
  on public.certificates for all to authenticated
  using (true) with check (true);

-- Subscribers: SELECT
drop policy if exists "auth_select_subscribers" on public.subscribers;
create policy "auth_select_subscribers"
  on public.subscribers for select to authenticated
  using (true);

-- =====================================================================
-- POLICIES: SERVICE ROLE (backend)
-- =====================================================================

create policy "service_role_all_courses"
  on public.courses for all to service_role
  using (true) with check (true);
create policy "service_role_all_modules"
  on public.course_modules for all to service_role
  using (true) with check (true);
create policy "service_role_all_lessons"
  on public.course_lessons for all to service_role
  using (true) with check (true);
create policy "service_role_all_articles"
  on public.articles for all to service_role
  using (true) with check (true);
create policy "service_role_all_pages"
  on public.pages for all to service_role
  using (true) with check (true);
create policy "service_role_all_downloads"
  on public.downloads for all to service_role
  using (true) with check (true);
create policy "service_role_all_certificates"
  on public.certificates for all to service_role
  using (true) with check (true);
create policy "service_role_all_subscribers"
  on public.subscribers for all to service_role
  using (true) with check (true);
create policy "service_role_all_media"
  on public.media for all to service_role
  using (true) with check (true);
