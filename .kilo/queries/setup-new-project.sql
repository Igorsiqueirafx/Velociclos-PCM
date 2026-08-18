-- setup-new-project.sql
-- Execute este SQL no Supabase SQL Editor do projeto iskzakpvxuowkbzovjxw
-- Este arquivo aplica o schema + dados em um único passo

-- ============================================
-- SCHEMA
-- ============================================
create extension if not exists "pgcrypto";

-- COURSES
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  thumbnail text,
  playlist_id text,
  is_published boolean default false,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- MODULES
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- LESSONS
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

-- ARTICLES
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

-- CERTIFICATES
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  issue_date date,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- SUBSCRIBERS
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text default 'website',
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists idx_modules_course_id on public.modules(course_id);
create index if not exists idx_lessons_module_id on public.lessons(module_id);
create index if not exists idx_lessons_course_id on public.lessons(course_id);
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_published on public.articles(is_published, published_at);
create index if not exists idx_courses_published on public.courses(is_published, order_index);
create index if not exists idx_modules_order on public.modules(course_id, order_index);
create index if not exists idx_lessons_order on public.lessons(module_id, order_index);

-- ROW LEVEL SECURITY
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.articles enable row level security;
alter table public.certificates enable row level security;
alter table public.subscribers enable row level security;

-- POLICIES: ANON (público)
create policy "anon_select_published_courses" on public.courses
  for select to anon using (is_published = true);

create policy "anon_select_published_modules" on public.modules
  for select to anon using (
    exists (
      select 1 from public.courses
      where courses.id = modules.course_id and courses.is_published = true
    )
  );

create policy "anon_select_published_lessons" on public.lessons
  for select to anon using (
    is_published = true and
    exists (
      select 1 from public.modules
      join public.courses on courses.id = modules.course_id
      where modules.id = lessons.module_id and courses.is_published = true
    )
  );

create policy "anon_select_published_articles" on public.articles
  for select to anon using (is_published = true);

create policy "anon_select_certificates" on public.certificates
  for select to anon using (true);

create policy "anon_insert_subscribers" on public.subscribers
  for insert to anon with check (true);

-- POLICIES: AUTHENTICATED (admin)
create policy "authenticated_crud_courses" on public.courses
  for all to authenticated using (true) with check (true);

create policy "authenticated_crud_modules" on public.modules
  for all to authenticated using (true) with check (true);

create policy "authenticated_crud_lessons" on public.lessons
  for all to authenticated using (true) with check (true);

create policy "authenticated_crud_articles" on public.articles
  for all to authenticated using (true) with check (true);

create policy "authenticated_crud_certificates" on public.certificates
  for all to authenticated using (true) with check (true);

create policy "authenticated_select_subscribers" on public.subscribers
  for select to authenticated using (true);

-- ============================================
-- DATA MIGRATION
-- ============================================

-- Cursos
INSERT INTO public.courses (title, description, thumbnail, playlist_id, is_published, order_index) VALUES
  ('Método Fimathe', 'Curso completo do Método Fimathe', 'https://img.youtube.com/vi/6xcNZAyftXY/maxresdefault.jpg', 'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD', true, 0)
ON CONFLICT DO NOTHING;

-- Módulos
INSERT INTO public.modules (course_id, title, description, order_index)
SELECT id, 'Aulas', 'Aulas do Método Fimathe', 0
FROM public.courses
WHERE title = 'Método Fimathe'
ON CONFLICT DO NOTHING;

-- Lessons
INSERT INTO public.lessons (module_id, course_id, title, description, video_id, is_published, order_index)
SELECT m.id, c.id, v.title, v.description, v.videoId, true, v.ordem
FROM (
  SELECT title, description, videoId, ROW_NUMBER() OVER (ORDER BY title) - 1 AS ordem
  FROM (VALUES
    ('Aula 01', 'Primeira aula do Método Fimathe', '1jZbpAv2mPx9BadTqUverW0GsJWj860mB'),
    ('Aula 02', 'Segunda aula do Método Fimathe', '1mpoXheY5NtD3IHNthcbPspYvZC6apV-o'),
    ('Aula 03', 'Terceira aula do Método Fimathe', '1OHhr1d89MDph3uNGPZhtcBz2SKW4dYia'),
    ('Aula 04', 'Quarta aula do Método Fimathe', '10TkgRVRnKbBA68AhJ9xN9mFU7H512_Lb'),
    ('Aula 05', 'Quinta aula do Método Fimathe', '1qnvDAEM8YCJ7w7nuBbcdemADf999JGss'),
    ('Aula 06', 'Sexta aula do Método Fimathe', '1kVr4K_9eyBm5Jf_AIeRw14XxHZZ_1_3M')
  ) AS v(title, description, videoId)
) v
JOIN public.courses c ON c.title = 'Método Fimathe'
JOIN public.modules m ON m.course_id = c.id AND m.title = 'Aulas'
ON CONFLICT DO NOTHING;

-- Certificados
INSERT INTO public.certificates (title, description, image_url, order_index) VALUES
  ('Fórmula do Ouro', 'Certificado de conclusão do curso Fórmula do Ouro', '/certificados/Formula do Ouro.webp', 0),
  ('Laboratório Fimathe', 'Certificado do Laboratório Fimathe', '/certificados/Laboratorio Fimathe.webp', 1),
  ('MasterClass Fimathe', 'Certificado de participação na MasterClass', '/certificados/MasterClass Fimathe.webp', 2),
  ('Método Fimathe', 'Certificado de conclusão do Método Fimathe', '/certificados/Metodo Fimathe.webp', 3),
  ('Scalper', 'Certificado de conclusão do curso de Scalper', '/certificados/Scalper.webp', 4)
ON CONFLICT DO NOTHING;
