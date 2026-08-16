# Plano: Unificar plataforma em Next.js e aposentar site estático

## Contexto
- Repo: `Velociclos-PCM`, branch `main`
- Legacy site estático (raiz) totalmente removido
- Frontend Next.js admin migrado como produto principal em `frontend/`
- Backend Express mantido em `backend/`, deploy Railway

## Passos Executados

### Sprint 1: Fundamentos
- Versionar frontend/ no git (remover do .gitignore)
- Configurar Vercel monorepo (vercel.json na raiz → builds para frontend/)
- Corrigir backend (railway.json: node backend/server.js, não python)
- Backend versionado com server.js + config.js + package.json + .env.example

### Sprint 2: Migrar Home
- index.html → frontend/app/page.tsx (hero, benefits, CTA)
- Header.tsx e Footer.tsx componentizados
- globals.css migrado de style.css (4130 linhas → Tailwind)
- Layout com SEO metadata, OpenGraph, favicon

### Sprint 3: Migrar Cursos
- cursos.html + cursos.js → frontend/app/cursos/page.tsx
- YouTube API client em lib/youtube.ts
- Modal de vídeo com playlist interativa
- Dados estáticos + API YouTube como fallback

### Sprint 4: Migrar todas as páginas restantes
- ea.html → components/EaPage.tsx + app/ea/page.tsx
- artigos.html → components/ArtigosPage.tsx + app/artigos/page.tsx
- certificados.html → components/CertificadosPage.tsx + app/certificados/page.tsx
- metodo-fimathe.html → components/MetodoFimathePage.tsx + app/metodo-fimathe/page.tsx
- manual.html → components/ManualPage.tsx + app/manual/page.tsx
- relogio.html → components/ClockPage.tsx + app/relogio/page.tsx

### Final: Aposentar site estático
- Removidos: index.html, cursos.html, style.css, js.js, cursos.js, vercel-analytics.js, inject-env.js + todos os assets estáticos
- Assets migrados para frontend/public/ (favicon, screenshots, certificados, vídeos)
- Root package.json → workspace monorepo com scripts: dev, build, lint, typecheck

## Arquitetura Final

```
Velociclos-PCM/
├── frontend/           # Next.js 15 (produção)
│   ├── app/            # Routes (pages + dashboard admin)
│   ├── components/     # Componentes públicos (Header, Footer, etc.)
│   ├── lib/            # YouTube API client
│   ├── public/         # Assets estáticos
│   └── package.json    # Next, React 19, Tailwind, Supabase SSR
├── backend/            # Express API (Railway)
│   ├── server.js       # API REST (videos, playlists, youtube sync)
│   ├── config.js       # Configurações
│   └── package.json    # express, cors, dotenv
├── railway.json        # Deploy Railway → node backend/server.js
├── vercel.json         # Deploy Vercel → frontend/ (monorepo)
└── package.json        # Workspace root (scripts agregados)
```

## Deploy

| Serviço | Diretório | Config |
|---------|-----------|--------|
| **Vercel** | `frontend/` | Next.js build, `@vercel/static` no root |
| **Railway** | `backend/` | `node backend/server.js` |

## Rotas Públicas (Next.js)
- `/` — Home (hero + benefits + CTA)
- `/ea` — Expert Advisor (download + manual)
- `/cursos` — Playlists YouTube com player modal
- `/artigos` — Blog com cards e filtros
- `/certificados` — Galeria de certificados
- `/metodo-fimathe` — Aulas com vídeo intro + grid
- `/manual` — Guia de instalação e modos
- `/relogio` — Relógio de sessões Forex

## Rotas Admin (Next.js + Supabase Auth)
- `/auth/login` — Login com Supabase
- `/dashboard` — Dashboard principal
- `/dashboard/cursos` — Gestão de cursos
- `/dashboard/artigos` — Gestão de artigos
- `/dashboard/monitoramento` — Monitoramento
- `/logout` — Logout

## Status
- Todas as páginas migradas: ✅
- Build Next.js passando (17 routes): ✅
- Backend versionado e corrigido: ✅
- Site estático legado removido: ✅
