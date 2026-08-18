# Setup Instructions for New Supabase Project (iskzakpvxuowkbzovjxw)

## Problem
The new project `iskzakpvxuowkbzovjxw` has no tables yet. The schema needs to be applied via the **Supabase SQL Editor** because DDL operations (CREATE TABLE, ALTER TABLE) cannot be executed via the PostgREST REST API with `sb_secret_*` keys.

## Steps to Complete Setup

### 1. Apply Schema and Data Migration

**Option A: SQL Editor (Recomendado)**
1. Acesse: https://supabase.com/dashboard/project/iskzakpvxuowkbzovjxw/sql/new
2. Abra o arquivo `.kilo/queries/setup-new-project.sql`
3. Copie todo o conteúdo e cole no SQL Editor
4. Clique em "Run" (ou F5)

**Option B: Supabase CLI (requer senha do database)**
```bash
supabase link --project-ref iskzakpvxuowkbzovjxw --password <db-password>
supabase db query --file .kilo/queries/setup-new-project.sql --linked
```

### 2. Update Environment Variables

**Frontend (`.env.local`):** ✅ Already updated
```
NEXT_PUBLIC_SUPABASE_URL=https://iskzakpvxuowkbzovjxw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

**Backend (`backend/.env`):** ✅ Already updated
```
NEXT_PUBLIC_SUPABASE_URL=https://iskzakpvxuowkbzovjxw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_URL=https://iskzakpvxuowkbzovjxw.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

### 3. Redeploy

- **Frontend:** Redeploy no Vercel
- **Backend:** Redeploy no Railway

### 4. Verify

Após o deploy, execute:
```bash
node .kilo/scripts/verify-setup.js
```

## What the SQL Does

1. Creates tables: `courses`, `modules`, `lessons`, `articles`, `certificates`, `subscribers`
2. Creates indexes for performance
3. Enables Row Level Security (RLS)
4. Creates policies for `anon` (read published content) and `authenticated` (full CRUD)
5. Inserts migration data:
   - 1 course: "Método Fimathe" (with playlist_id for YouTube)
   - 1 module: "Aulas"
   - 6 lessons: Aula 01-06 (with YouTube video_ids)
   - 5 certificates: Fórmula do Ouro, Laboratório Fimathe, MasterClass, Método Fimathe, Scalper
