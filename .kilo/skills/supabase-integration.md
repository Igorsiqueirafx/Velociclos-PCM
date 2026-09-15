# Supabase Integration Skill

## Project Context
- Supabase for auth, database, storage
- Next.js 15 with Server Components
- `@supabase/ssr` for cookie-based auth

## Client Creation

### Server Component Client
```tsx
// app/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### Client Component Client
```tsx
// app/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

## Data Fetching Patterns

### Repository Pattern
```tsx
// lib/repositories/articles.ts
export async function getArticles(): Promise<Article[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// With fallback
export async function getArticles(): Promise<Article[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')

  if (error || !data?.length) return FALLBACK_ARTICLES
  return data
}
```

### Server Actions for Mutations
```tsx
// app/articles/actions.ts
'use server'

import { createClient } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createArticle(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('articles').insert({
    title: formData.get('title'),
    content: formData.get('content'),
    author_id: user.id,
  })

  if (error) throw error
  revalidatePath('/articles')
}
```

## Auth Patterns

### Protecting Routes
```tsx
// dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return children
}
```

### Middleware (Alternative)
```tsx
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  return NextResponse.next()
}
```

## Type Safety
```tsx
// types/database.ts (generated with supabase gen types)
export type Tables = {
  articles: {
    Row: Article
    Insert: Omit<Article, 'id' | 'created_at'>
    Update: Partial<Article>
  }
}
```

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Server-only (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```