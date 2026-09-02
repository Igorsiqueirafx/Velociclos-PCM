# Integração YouTube - Velociclos PCM

Este documento explica como configurar e usar a integração com a API do YouTube para o canal do Marcelo Ferreira (Fimathe).

## Configuração

### 1. Obter API Key do YouTube

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
Retorna todas as playlists do canal (exceto Shorts).

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
- Exibe thumbnail, título e data

### `/cursos/momentos`
- Trechos selecionados por tema
- 5 categorias de momentos-chave
- Links diretos para os vídeos no YouTube

## Cache

Todas as APIs usam cache em memória com TTL de 1 hora para evitar exceder a quota da API do YouTube.

## Quota da API

A YouTube Data API v3 tem limite de **10.000 unidades/dia**:
- `playlists.list`: 1 unidade
- `playlistItems.list`: 1 unidade
- `videos.list`: 1 unidade
- `search.list`: 100 unidades

Com o cache de 1 hora, o uso fica bem abaixo do limite.

## Canal Configurado

- **Channel ID**: `UCwk7RuafgXHRqSmS3qO8qQQ`
- **Nome**: Marcelo Ferreira - Fimathe
- **URL**: https://www.youtube.com/@MARCELOFERREIRAFIMATHE
