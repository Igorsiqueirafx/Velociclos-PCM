-- =====================================================================
-- PAGES, DOWNLOADS, MEDIA Tables - For Supabase SQL Editor
-- Run this in: https://supabase.com/dashboard/project/iskzakpvxuowkbzovjxw/sql/new
-- =====================================================================

-- PAGES: Static pages (Manual, Terms, About, etc.)
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

-- DOWNLOADS: File downloads (Expert Advisor files)
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

-- MEDIA: Media files (images, documents)
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

-- Indexes
create index if not exists idx_pages_slug on public.pages(slug);
create index if not exists idx_pages_published on public.pages(is_published, sort_order);
create index if not exists idx_downloads_published on public.downloads(is_published);

-- Updated-at trigger
create trigger on_pages_updated before update on public.pages for each row execute function public.handle_updated_at();
create trigger on_downloads_updated before update on public.downloads for each row execute function public.handle_updated_at();

-- RLS
alter table public.pages enable row level security;
alter table public.downloads enable row level security;
alter table public.media enable row level security;

-- Policies: ANON (read published)
drop policy if exists "anon_read_pages" on public.pages;
create policy "anon_read_pages" on public.pages for select to anon using (is_published = true);
drop policy if exists "anon_read_pages_by_slug" on public.pages;
create policy "anon_read_pages_by_slug" on public.pages for select to anon using (is_published = true and slug is not null);

drop policy if exists "anon_read_downloads" on public.downloads;
create policy "anon_read_downloads" on public.downloads for select to anon using (is_published = true);

-- Policies: AUTHENTICATED (admin CRUD)
drop policy if exists "auth_crud_pages" on public.pages;
create policy "auth_crud_pages" on public.pages for all to authenticated using (true) with check (true);

drop policy if exists "auth_crud_downloads" on public.downloads;
create policy "auth_crud_downloads" on public.downloads for all to authenticated using (true) with check (true);

-- Policies: SERVICE ROLE (backend)
create policy "service_role_all_pages" on public.pages for all to service_role using (true) with check (true);
create policy "service_role_all_downloads" on public.downloads for all to service_role using (true) with check (true);
create policy "service_role_all_media" on public.media for all to service_role using (true) with check (true);
