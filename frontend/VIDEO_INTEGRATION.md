# Integração de Vídeos - Velociclos PCM

Este documento explica como configurar a integração com a API de vídeos para alimentar a plataforma.

## Configuração

### 1. Obter API Key

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione um existente
3. Ative a **YouTube Data API v3**
4. Vá em **APIs & Services > Credentials**
5. Clique em **Create Credentials > API Key**
6. Copie a chave gerada

### 2. Configurar variável de ambiente

No arquivo `frontend/.env.local`:

```env
YOUTUBE_API_KEY=sua_chave_aqui
```

No Vercel (produção):
- Vá em **Settings > Environment Variables**
- Adicione `YOUTUBE_API_KEY` com sua chave

## APIs Disponíveis

### Listar Playlists
```
GET /api/youtube/playlists
```
Retorna todas as playlists configuradas (exceto Shorts).

### Itens de uma Playlist
```
GET /api/youtube/playlist/{playlistId}
```
Retorna os vídeos de uma playlist específica.

### Detalhes de Vídeos
```
GET /api/youtube/videos?ids=videoId1,videoId2
```
Retorna detalhes completos (views, likes, duração, tags).

### Momentos-Chave
```
GET /api/youtube/momentos?category=exaustao
```
Busca vídeos por categoria:
- `exaustao` - Sinais de exaustão (80-100%)
- `canal` - Canal de referência/ponto-a/ponto-b
- `erro` - Erros comuns de iniciantes
- `rotina` - Rotina do trader
- `setup` - Setup de entrada

## Páginas

### `/cursos`
- Lista playlists com vídeos organizados
- Filtro por categoria
- Reprodução de vídeo incorporada na plataforma

### `/cursos/momentos`
- Trechos selecionados por tema
- 5 categorias de momentos-chave
- Reprodução direta na plataforma

## Cache

Todas as APIs usem cache em memória com TTL de 1 hora para otimizar performance.

## Reprodução de Vídeos

Os vídeos são reproduzidos diretamente na plataforma via player incorporado. O usuário não é redirecionado para plataformas externas.
