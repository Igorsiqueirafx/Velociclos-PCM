# Velociclos Backend API

Backend API para o site Velociclos PCM.

## Tecnologias

- **Node.js + Express** (server.js) — API REST para gerenciamento de conteúdo

## Deploy

- **Vercel**: `vercel.json` configura a API como serverless function (`api/index.js`)
- **CLI**: `vercel --prod --project velociclos-api`
- **Frontend rewrite**: use `NEXT_PUBLIC_BACKEND_URL=https://velociclos-api.vercel.app`

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
