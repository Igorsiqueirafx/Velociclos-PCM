-- SQL Schema for: subscribers
-- Project: Velociclos PCM
-- Description: Tabela para captura de leads (newsletter/lead magnet) via formulário /entrar
-- Execute manualmente no Supabase SQL Editor.

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text default 'website',
  created_at timestamp with time zone default now()
);

-- Habilitar Row Level Security
alter table public.subscribers enable row level security;

-- Política: permitir insert anônimo (para o formulário /entrar)
create policy "Allow anonymous insert on subscribers"
  on public.subscribers
  for insert
  to anon
  with check (true);

-- Política: permitir select autenticado (para /dashboard/subscribers)
create policy "Allow authenticated select on subscribers"
  on public.subscribers
  for select
  to authenticated
  using (true);
