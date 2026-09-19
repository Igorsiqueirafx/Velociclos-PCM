# Velociclos Backend API

Backend API para o site Velociclos PCM.

## Tecnologias

- **Node.js + Express** (server.js) — API REST para gerenciamento de conteúdo
- **Supabase** — banco de dados PostgreSQL para produção
- **Vercel** — deploy serverless do backend

## Deploy

- **Vercel**: `vercel.json` configura a API como serverless function (`api/index.js`)
- **CLI**: `vercel --prod --project velociclos-api`
- **Frontend rewrite**: use `NEXT_PUBLIC_BACKEND_URL=https://velociclos-api.vercel.app`

### Variáveis de ambiente no Vercel

Configure no projeto `velociclos-api` no Vercel Dashboard:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
SUPABASE_SECRET_KEY=sua-chave-secreta-opcional
FRONTEND_URL=https://velociclos.vercel.app
CORS_ORIGIN=https://velociclos.vercel.app
YOUTUBE_API_KEY=sua-chave-youtube
PLAYLIST_IDS=lista-de-playlists
USE_IN_MEMORY=false
BACKEND_URL=https://velociclos-api.vercel.app
```

## Banco de Dados

### Local
- `USE_IN_MEMORY=true`: dados em memória, sem banco externo

### Produção
- `USE_IN_MEMORY=false`: usa Supabase
- Configure `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/videos` | No | Lista todos os vídeos |
| POST | `/api/videos` | Bearer | Cria novo vídeo |
| PUT | `/api/videos/:id` | Bearer | Atualiza vídeo |
| DELETE | `/api/videos/:id` | Bearer | Remove vídeo |
| GET | `/api/playlists` | No | Lista playlists salvas |
| POST | `/api/playlists/sync` | Bearer | Sincroniza do YouTube API |
| GET | `/api/playlist/:id/items` | No | Itens de uma playlist |
| GET | `/api/health` | No | Health check |

## Setup Local

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your keys
node server.js
```

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/videos` | No | Lista todos os vídeos |
| POST | `/api/videos` | Bearer | Cria novo vídeo |
| PUT | `/api/videos/:id` | Bearer | Atualiza vídeo |
| DELETE | `/api/videos/:id` | Bearer | Remove vídeo |
| GET | `/api/playlists` | No | Lista playlists salvas |
| POST | `/api/playlists/sync` | Bearer | Sincroniza do YouTube API |
| GET | `/api/playlist/:id/items` | No | Itens de uma playlist |
| GET | `/api/health` | No | Health check |

## Setup Local

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your keys
node server.js
```
