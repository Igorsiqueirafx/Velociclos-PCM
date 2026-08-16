# Velociclos Backend API

Backend API para o site Velociclos PCM.

## Tecnologias

- **Node.js + Express** (server.js) — API REST para gerenciamento de vídeos e playlists
- **Python HTTP Server** (server.py) — alternativa standalone para Railway sem Node

## Deploy

- **Railway**: `railway.json` configurado para `node backend/server.js`
- **CORS**: Configurável via `CORS_ORIGIN` (default: `*`)

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
