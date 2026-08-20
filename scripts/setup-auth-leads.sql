-- setup-auth-leads.sql
-- Sets up profiles table + trigger, leads table, and RLS policies for auth + lead-capture platform.

-- 1. profiles table: stores public user metadata linked to auth.users
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null,
  email text unique,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (id)
);

-- 2. leads table: captures lead info including UTM params from lead-capture form
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  phone text,
  utm_campaign text,
  utm_source text,
  utm_medium text,
  utm_content text,
  ip_address inet,
  user_agent text,
  profile_id uuid references profiles(id) on delete set null,
  source text,
  status text default 'new',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Indexes
create index if not exists leads_email_idx on leads(email);
create index if not exists leads_profile_id_idx on leads(profile_id);
create index if not exists leads_created_at_idx on leads(created_at desc);

-- 4. Enable RLS on profiles
alter table profiles enable row level security;

-- 5. Profiles policies: users can view any profile (for public profiles), update only their own
drop policy if exists "Allow individual read access on profiles" on profiles;
create policy "Allow individual read access on profiles"
  on profiles for select using (true);

drop policy if exists "Allow individual update access on profiles" on profiles;
create policy "Allow individual update access on profiles"
  on profiles for update with check (auth.uid() = id);

drop policy if exists "Allow individual insert access on profiles" on profiles;
create policy "Allow individual insert access on profiles"
  on profiles for insert with check (auth.uid() = id);

-- 6. Enable RLS on leads
alter table leads enable row level security;

-- 7. Leads policies: only users can read their own leads; inserts allowed via API
drop policy if exists "Allow read own leads" on leads;
create policy "Allow read own leads"
  on leads for select using (profile_id = auth.uid() or email = (select email from profiles where id = auth.uid()));

drop policy if exists "Allow insert leads" on leads;
create policy "Allow insert leads"
  on leads for insert with check (true);

-- 8. Trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- 9. Trigger: fires on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 10. Trigger: update updated_at on profiles
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_profiles_updated on profiles;
create trigger on_profiles_updated
  before update on profiles
  for each row
  execute function public.handle_updated_at();

-- 11. Trigger: update updated_at on leads
drop trigger if exists on_leads_updated on leads;
create trigger on_leads_updated
  before update on leads
  for each row
  execute function public.handle_updated_at();
