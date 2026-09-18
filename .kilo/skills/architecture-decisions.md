# Architecture Decisions (ADR)

## Project Overview
Velociclos PCM - Educational platform for trading/forex automation
- Next.js 15 App Router
- Vercel deployment (frontend + serverless backend)
- TypeScript + Tailwind + Vitest

---

## ADR 001: Next.js App Router over Pages Router
**Date**: 2024-08-30
**Status**: Accepted

**Context**: Next.js 13+ introduced App Router with Server Components.

**Decision**: Use App Router exclusively.

**Consequences**:
- ✅ Server Components by default (better SEO, performance)
- ✅ Streaming & Suspense built-in
- ✅ Nested layouts without layout shift
- ⚠️ Learning curve for team
- ⚠️ Some libraries not yet compatible

---

## ADR 002: Repository Pattern for Data Access
**Date**: 2024-08-30
**Status**: Accepted

**Context**: Need consistent data fetching with fallbacks.

**Decision**: Repository modules in `lib/repositories/`.

```ts
// lib/repositories/articles.ts
export async function getArticles(): Promise<Article[]> {
  // Backend-backed via centralized API client
}
```

**Consequences**:
- ✅ Single source of truth for queries
- ✅ Easy to swap data source
- ✅ Fallback data for resilience
- ✅ Testable with mocks

---

## ADR 003: Client Components Only When Necessary
**Date**: 2024-08-30
**Status**: Accepted

**Context**: Next.js 15 defaults to Server Components.

**Decision**: Add `'use client'` only for:
- `useState`, `useEffect`, `useRef`
- Browser APIs (localStorage, IntersectionObserver)
- Event handlers (onClick, onChange)
- Third-party libraries requiring browser

**Consequences**:
- ✅ Smaller client bundles
- ✅ Better SEO and initial load
- ✅ Clear separation of concerns

---

## ADR 005: Tailwind CSS with Custom Design System
**Date**: 2024-08-30
**Status**: Accepted

**Context**: Need consistent dark theme with gold accents.

**Decision**: Tailwind with custom color palette in config.

**Consequences**:
- ✅ Consistent design tokens
- ✅ No context switching (HTML + CSS in one file)
- ✅ Purged in production
- ⚠️ Long class strings

---

## ADR 006: Vitest + React Testing Library
**Date**: 2024-08-30
**Status**: Accepted

**Context**: Need fast, reliable testing.

**Decision**: Vitest (Vite-native) + RTL.

**Consequences**:
- ✅ Fast execution (no Jest overhead)
- ✅ ESM native support
- ✅ Same config as Vite
- ✅ RTL encourages accessibility

---

## ADR 007: Component Composition over Monoliths
**Date**: 2024-09-14
**Status**: Accepted

**Context**: CertificadosClient.tsx was 296 lines.

**Decision**: Split into focused components:
- `CertificateHero` - 3D scroll effect
- `CertificateGrid` - Grid of certificates
- `CertificateModal` - Full-screen viewer
- `useScrollProgress` - Reusable hook

**Consequences**:
- ✅ Single responsibility
- ✅ Reusable parts
- ✅ Easier testing
- ✅ Better readability

---

## ADR 008: TypeScript Strict Mode
**Date**: 2024-08-30
**Status**: Accepted

**Decision**: Enable all strict flags.

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Consequences**:
- ✅ Catch bugs at compile time
- ✅ Better IDE support
- ✅ Self-documenting code
- ⚠️ More verbose types

---

## ADR 009: Vercel for Deployment
**Date**: 2024-08-30
**Status**: Accepted

**Context**: Need zero-config deployment with preview URLs.

**Decision**: Vercel (native Next.js support).

**Consequences**:
- ✅ Automatic preview deployments
- ✅ Edge functions for middleware
- ✅ Analytics & Speed Insights
- ✅ Git integration
- ⚠️ Cost at scale

---

## ADR 010: Environment Variable Strategy
**Date**: 2024-08-30
**Status**: Accepted

**Decision**: 
- `NEXT_PUBLIC_*` for client-safe vars
- Non-prefixed for server-only
- `.env.local` for local (gitignored)
- Vercel UI for production

---

## Future Considerations

### Potential ADRs
- [ ] Backend separation (Plan 1 from DEPLOY_READY.md)
- [ ] Analytics implementation
- [ ] i18n support
- [ ] Micro-frontend architecture