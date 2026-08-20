-- SQL Schema for: Velociclos PCM Platform
-- Source of truth: Admin → Supabase → Frontend
-- YouTube is only a media provider, not the content source

-- ============================================
-- PROFILES (auth.users → profiles)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text check (role in ('user', 'admin')) default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger on_auth_user_updated before update on auth.users
  for each row execute function public.handle_updated_at();

-- ============================================
-- ROLES
-- ============================================
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  label text not null,
  permissions jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CATEGORIES
-- ============================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- TAGS
-- ============================================
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique not null,
  created_at timestamptz default now()
);

-- ============================================
-- COURSES
-- ============================================
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

-- ============================================
-- MODULES (course_modules)
-- ============================================
create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- LESSONS (course_lessons)
-- ============================================
create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  video_id text,
  video_url text,
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

-- ============================================
-- PAGES (Manual, Termos, Sobre, Método, etc.)
-- ============================================
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

-- ============================================
-- DOWNLOADS (EA - Expert Advisor)
-- ============================================
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
-- SUBSCRIBERS (leads)
-- ============================================
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text default 'website',
  created_at timestamptz default now()
);

-- ============================================
-- LEADS
-- ============================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  phone text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  source text default 'lead-capture',
  landing_page text,
  ip_address text,
  user_agent text,
  profile_id uuid references public.profiles(id) on delete set null,
  converted_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- SETTINGS
-- ============================================
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  type text default 'string',
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- MEDIA
-- ============================================
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

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_courses_slug on public.courses(slug);
create index if not exists idx_courses_published on public.courses(is_published, order_index);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_tags_slug on public.tags(slug);
create index if not exists idx_modules_course_id on public.course_modules(course_id);
create index if not exists idx_lessons_module_id on public.course_lessons(module_id);
create index if not exists idx_lessons_course_id on public.course_lessons(course_id);
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_published on public.articles(is_published, published_at);
create index if not exists idx_pages_slug on public.pages(slug);
create index if not exists idx_pages_published on public.pages(is_published, sort_order);
create index if not exists idx_downloads_published on public.downloads(is_published);
create index if not exists idx_certificates_order on public.certificates(order_index);
create index if not exists idx_leads_email on public.leads(email);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_settings_key on public.settings(key);
create index if not exists idx_media_created_at on public.media(created_at desc);

-- ============================================
-- TRIGGERS: updated_at
-- ============================================
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
create trigger on_settings_updated before update on public.settings for each row execute function public.handle_updated_at();

-- ============================================
-- TRIGGERS: auto-create profile
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.articles enable row level security;
alter table public.pages enable row level security;
alter table public.downloads enable row level security;
alter table public.certificates enable row level security;
alter table public.subscribers enable row level security;
alter table public.leads enable row level security;
alter table public.settings enable row level security;
alter table public.media enable row level security;

-- ============================================
-- POLICIES: ANON (público - leitura de conteúdo publicado)
-- ============================================

-- Cursos publicados
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

-- Leads: insert anônimo
drop policy if exists "anon_insert_leads" on public.leads;
create policy "anon_insert_leads"
  on public.leads for insert to anon
  with check (true);

-- Categories e Tags: leitura pública
drop policy if exists "anon_read_categories" on public.categories;
create policy "anon_read_categories"
  on public.categories for select to anon
  using (true);
drop policy if exists "anon_read_tags" on public.tags;
create policy "anon_read_tags"
  on public.tags for select to anon
  using (true);

-- Pages by slug for public rendering
drop policy if exists "anon_read_pages_slug" on public.pages;
create policy "anon_read_pages_slug"
  on public.pages for select to anon
  using (is_published = true and slug is not null);

-- ============================================
-- POLICIES: AUTHENTICATED (admin - CRUD completo)
-- ============================================

drop policy if exists "auth_crud_courses" on public.courses;
create policy "auth_crud_courses"
  on public.courses for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_crud_modules" on public.course_modules;
create policy "auth_crud_modules"
  on public.course_modules for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_crud_lessons" on public.course_lessons;
create policy "auth_crud_lessons"
  on public.course_lessons for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_crud_articles" on public.articles;
create policy "auth_crud_articles"
  on public.articles for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_crud_pages" on public.pages;
create policy "auth_crud_pages"
  on public.pages for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_crud_downloads" on public.downloads;
create policy "auth_crud_downloads"
  on public.downloads for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_crud_certificates" on public.certificates;
create policy "auth_crud_certificates"
  on public.certificates for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_crud_categories" on public.categories;
create policy "auth_crud_categories"
  on public.categories for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_crud_tags" on public.tags;
create policy "auth_crud_tags"
  on public.tags for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_crud_settings" on public.settings;
create policy "auth_crud_settings"
  on public.settings for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_select_subscribers" on public.subscribers;
create policy "auth_select_subscribers"
  on public.subscribers for select to authenticated
  using (true);

drop policy if exists "auth_select_leads" on public.leads;
create policy "auth_select_leads"
  on public.leads for select to authenticated
  using (true);

drop policy if exists "auth_crud_media" on public.media;
create policy "auth_crud_media"
  on public.media for all to authenticated
  using (true) with check (true);

drop policy if exists "auth_select_profiles" on public.profiles;
create policy "auth_select_profiles"
  on public.profiles for select to authenticated
  using (true);

-- ============================================
-- POLICIES: SERVICE ROLE (backend)
-- ============================================
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
create policy "service_role_all_categories"
  on public.categories for all to service_role
  using (true) with check (true);
create policy "service_role_all_tags"
  on public.tags for all to service_role
  using (true) with check (true);
create policy "service_role_all_settings"
  on public.settings for all to service_role
  using (true) with check (true);
create policy "service_role_all_subscribers"
  on public.subscribers for all to service_role
  using (true) with check (true);
create policy "service_role_all_leads"
  on public.leads for all to service_role
  using (true) with check (true);
create policy "service_role_all_media"
  on public.media for all to service_role
  using (true) with check (true);
create policy "service_role_all_profiles"
  on public.profiles for all to service_role
  using (true) with check (true);
