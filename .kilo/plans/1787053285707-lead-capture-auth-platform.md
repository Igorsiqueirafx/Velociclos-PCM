# Plan: Lead Capture Platform — Auth + Leads Dashboard

## Goal
Transform `velociclos.vercel.app` into a lead capture platform where:
- Users sign up via Google OAuth or email (magic link)
- Anonymous visitors can capture leads via `/lead-capture` landing page
- Authenticated admins access `/dashboard` to manage leads
- Backend Railway stays as-is (no API route migration)

## Architecture Decisions (Finalized)

| Decision | Choice | Rationale |
|---|---|---|
| Auth Providers | Google OAuth + Email (magic link) | Reduce complexity; no other providers needed |
| Users table | New `profiles` table | Decouple auth data from business data |
| Leads table | Separate `leads` table | Preserve `subscribers` in production |
| Admin access | `ADMIN_EMAILS` env var | Simpler than roles; sufficient for current scope |
| Backend | Railway stays | Already integrated; separation of concerns |
| API Routes | Minimal use only | Not migrating existing endpoints |

## Sprint Breakdown

### Sprint A: Authentication
1. Enable Google OAuth in Supabase (only provider)
2. Create `profiles` table + trigger (auth.users → profiles)
3. Add Google sign-in to `/auth/login`
4. Add Google sign-up to `/auth/register`
5. Create `/auth/callback` (OAuth redirect handler)
6. Add email magic link option to login
7. Update middleware: protect `/dashboard`, redirect unauth → `/auth/login`

### Sprint B: Leads Management
1. Create `leads` table (email, source, UTM params, ip, user_agent, profile_id, converted_at)
2. Create `/lead-capture` landing page (email form, no login required)
3. Create `/api/lead` API route (insert to leads table with metadata)
4. Create `/leads` page (post-login landing after Google auth)
5. Update `/dashboard/subscribers` → `/dashboard/leads`
   - List leads with email, source, UTM, conversion date
   - Search by email
   - Filter by source
   - Export CSV button

## Database Schema

### New: profiles table
```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text check (role in ('user', 'admin')) default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on new user
create function public.handle_new_user()
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

-- RLS
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Service role can manage all profiles" on public.profiles
  for all using (auth.jwt() ->> 'role') = 'service_role';
```

### New: leads table
```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'lead-capture',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  ip_address text,
  user_agent text,
  profile_id uuid references public.profiles(id) on delete set null,
  converted_at timestamptz,
  created_at timestamptz default now()
);

create index idx_leads_email on public.leads(email);
create index idx_leads_created_at on public.leads(created_at desc);

alter table public.leads enable row level security;
create policy "Service role can manage all leads" on public.leads
  for all using (auth.jwt() ->> 'role') = 'service_role';
create policy "Public can insert leads" on public.leads
  for insert with check (true);
```

## Environment Variables Required

### Production Vercel (both projects: velociclos + velociclosadm)
```
NEXT_PUBLIC_SUPABASE_URL=https://iskzakpvxuowkbzovjxw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
ADMIN_EMAILS=igor@email.com,contato@velociclos.com.br
NEXT_PUBLIC_BACKEND_URL=https://velociclos-api.up.railway.app
```

## Files to Create/Modify

### New Files
1. `frontend/app/auth/callback/page.tsx` — OAuth redirect handler
2. `frontend/app/lead-capture/page.tsx` — Landing page with email form
3. `frontend/app/leads/page.tsx` — Post-login landing page for users
4. `frontend/app/api/lead/route.ts` — API route for lead capture
5. `frontend/app/dashboard/leads/page.tsx` — Admin leads management table
6. `.kilo/queries/create-profiles-leads.sql` — Database schema

### Modified Files
1. `frontend/app/auth/login/page.tsx` — Add Google button + magic link
2. `frontend/app/auth/register/page.tsx` — Add Google sign-up
3. `frontend/middleware.ts` — Add admin email check + protect `/leads`

## Middleware Logic (Updated)
```typescript
// Existing: protect /dashboard for authenticated users
// New additions:
// 1. Redirect /dashboard to /auth/login if not logged in
// 2. If logged in but email NOT in ADMIN_EMAILS and trying /dashboard → redirect to /leads
// 3. Protect /leads for any authenticated user
```

## API Route: /api/lead
- **Method:** POST
- **Body:** `{ email: string, utm?: object, source?: string }`
- **Logic:**
  - Check if subscriber exists in `subscribers` → return
  - Insert into `leads` with IP, user-agent, UTM params
  - Return JSON response
- **No auth required** (anonymous capture)

## Validation Steps
1. Run `create-profiles-leads.sql` in Supabase SQL editor
2. Enable Google OAuth in Supabase → add redirect URL
3. Deploy with `npx vercel --prod --yes` for both projects
4. Visit `/lead-capture` → submit email → verify in `/dashboard/leads`
5. Login with Google → redirected to `/leads` (or `/dashboard` if admin)
6. Admin login → `/dashboard/leads` → CSV export → verify data
7. `npx tsc --noEmit` passes
8. `npm run build` succeeds

## Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Google OAuth redirect mismatch | Use exact URL `https://velociclos.vercel.app/auth/callback` |
| Trigger not firing for existing users | Manual INSERT for backfill |
| Admin email misconfiguration | Default to empty → no access until set |
| Backend Railway offline | Dashboard shows "Offline" — non-critical since auth is via Supabase |
