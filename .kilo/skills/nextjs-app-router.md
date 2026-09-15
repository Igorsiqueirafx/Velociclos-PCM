# Next.js 15 App Router Skill

## Project Context
- Next.js 15.5.x with App Router
- React 19
- TypeScript 5.8
- Tailwind CSS 3.4
- Vercel deployment

## Key Patterns

### Server Components First
```tsx
// app/page.tsx - Server Component by default
export default async function Page() {
  const data = await fetchData() // Runs on server
  return <ClientComponent data={data} />
}
```

### Client Components Only When Needed
```tsx
'use client'
// Only for: useState, useEffect, browser APIs, event handlers
```

### Data Fetching
```tsx
// Parallel fetching with Promise.all
const [users, posts] = await Promise.all([
  getUsers(),
  getPosts()
])

// Cache control
fetch(url, { next: { revalidate: 3600 } }) // ISR
fetch(url, { cache: 'no-store' }) // Dynamic
```

### Streaming & Suspense
```tsx
// app/page.tsx
import { Suspense } from 'react'
import { PostList } from './PostList'
import { PostSkeleton } from './PostSkeleton'

export default function Page() {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostList />
    </Suspense>
  )
}
```

### Route Groups & Layouts
```
app/
├── (marketing)/     # Public pages
│   ├── layout.tsx
│   └── page.tsx
├── (auth)/          # Auth pages
│   ├── layout.tsx
│   └── login/page.tsx
└── dashboard/       # Protected
    ├── layout.tsx   # Auth check here
    └── page.tsx
```

### Image Optimization
```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  priority          # Above fold
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

## Commands
- `npm run dev` - Development
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run typecheck` - TypeScript check