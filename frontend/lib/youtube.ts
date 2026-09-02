export interface YouTubePlaylist {
  id: string
  title: string
  description: string
  thumbnail: string
  videoCount: number
  category?: string
}

export interface YouTubeVideo {
  videoId: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  duration?: string
  viewCount?: string
  likeCount?: string
  category?: string
  tags?: string[]
}

export interface VideoMoment {
  id: string
  videoId: string
  title: string
  description: string
  startTime: number
  endTime: number
  category: 'exhaustion' | 'channel' | 'mistake' | 'routine' | 'setup'
  thumbnail: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api-backend.vercel.app'
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
const YOUTUBE_CHANNEL_ID = 'UCwk7RuafgXHRqSmS3qO8qQQ'
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

// Categorias de playlists por tema
const PLAYLIST_CATEGORIES: Record<string, string> = {
  'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I': 'checkpoint',
  'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9': 'fundamentos',
  'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh': 'analise-mercado',
  'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK': 'xauusd',
  'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ': 'scalping',
  'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD': 'imersao',
  'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5': 'eurusd',
  'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV': 'ouro',
}

// Palavras-chave para categorizar vídeos automaticamente
const VIDEO_CATEGORIES: Record<string, string[]> = {
  'exaustao': ['exaustão', 'exhaustion', '80%', '100%', 'máxima', 'correção', 'reversão'],
  'canal': ['canal', 'channel', 'ponto-a', 'ponto-b', 'referência', 'zona neutra', 'abertura'],
  'erro': ['erro', 'mistake', 'cuidado', 'atenção', 'não faça', 'evite', 'armadilha'],
  'rotina': ['rotina', 'rotina do trader', 'hábito', 'disciplina', 'gestão emocional', 'psicologia'],
  'setup': ['setup', 'entrada', 'operação', 'compra', 'venda', 'take profit', 'stop loss', 'execução'],
}

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

function getThumbnail(snippet: any): string {
  return (
    snippet?.thumbnails?.maxres?.url ||
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.medium?.url ||
    snippet?.thumbnails?.standard?.url ||
    snippet?.thumbnails?.default?.url ||
    ''
  )
}

function categorizeVideo(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()
  
  for (const [category, keywords] of Object.entries(VIDEO_CATEGORIES)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category
    }
  }
  return 'geral'
}

function shouldExcludePlaylist(title: string, id: string): boolean {
  const upper = title.toUpperCase()
  return upper.includes('SHORTS')
}

export async function fetchPlaylists(): Promise<YouTubePlaylist[]> {
  try {
    return await api<YouTubePlaylist[]>('/api/playlists')
  } catch (error) {
    console.warn('Backend /api/playlists unavailable, falling back to direct YouTube API:', error)
  }

  if (!YOUTUBE_API_KEY) {
    console.warn('No YouTube API key available for fallback. Returning static playlists.')
    return STATIC_PLAYLISTS
  }

  try {
    return await fetchPlaylistsFromYouTube()
  } catch (error) {
    console.error('Failed to fetch playlists from YouTube API:', error)
    return STATIC_PLAYLISTS
  }
}

async function fetchPlaylistsFromYouTube(): Promise<YouTubePlaylist[]> {
  const playlists: YouTubePlaylist[] = []
  let nextPageToken: string | null = null

  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      channelId: YOUTUBE_CHANNEL_ID,
      maxResults: '50',
      key: YOUTUBE_API_KEY,
    })
    if (nextPageToken) {
      params.set('pageToken', nextPageToken)
    }

    const url = `${YOUTUBE_API_BASE}/playlists?${params.toString()}`
    const res: Response = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`YouTube API error ${res.status}: ${text}`)
    }

    const json: any = await res.json()

    if (json.error) {
      throw new Error(`YouTube API error: ${json.error.message}`)
    }

    for (const item of json.items || []) {
      const title = item.snippet?.title || 'Sem título'

      if (shouldExcludePlaylist(title, item.id)) {
        continue
      }

      playlists.push({
        id: item.id,
        title,
        description: item.snippet?.description || '',
        thumbnail: getThumbnail(item.snippet),
        videoCount: item.contentDetails?.itemCount || 0,
        category: PLAYLIST_CATEGORIES[item.id] || 'geral',
      })
    }

    nextPageToken = json.nextPageToken
  } while (nextPageToken)

  return playlists
}

export async function fetchPlaylistItems(playlistId: string): Promise<YouTubeVideo[]> {
  try {
    return await api<YouTubeVideo[]>(`/api/playlist/${playlistId}/items`)
  } catch (error) {
    console.warn(`Backend unavailable for playlist ${playlistId}, falling back to direct YouTube API:`, error)
  }

  if (!YOUTUBE_API_KEY) {
    console.error('No YouTube API key available for fallback')
    return []
  }

  const videos: YouTubeVideo[] = []
  let nextPageToken: string | null = null

  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: '50',
      key: YOUTUBE_API_KEY,
    })
    if (nextPageToken) {
      params.set('pageToken', nextPageToken)
    }

    const url = `${YOUTUBE_API_BASE}/playlistItems?${params.toString()}`
    const res: Response = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`YouTube API error ${res.status}: ${text}`)
    }

    const json: any = await res.json()

    if (json.error) {
      console.error('YouTube API error:', json.error.message)
      break
    }

    for (const item of json.items || []) {
      const snippet = item.snippet || {}
      const title = snippet?.title || 'Sem título'
      const description = snippet?.description || ''
      
      videos.push({
        videoId: snippet?.resourceId?.videoId || item.contentDetails?.videoId || '',
        title,
        description,
        thumbnail: getThumbnail(snippet),
        publishedAt: snippet?.publishedAt || '',
        category: categorizeVideo(title, description),
      })
    }

    nextPageToken = json.nextPageToken
  } while (nextPageToken)

  return videos
}

export async function fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY || videoIds.length === 0) return []

  const params = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: videoIds.join(','),
    key: YOUTUBE_API_KEY,
  })

  const url = `${YOUTUBE_API_BASE}/videos?${params.toString()}`
  const res = await fetch(url, { next: { revalidate: 3600 } })

  if (!res.ok) {
    console.error('Failed to fetch video details')
    return []
  }

  const json: any = await res.json()

  return (json.items || []).map((item: any) => ({
    videoId: item.id,
    title: item.snippet?.title || '',
    description: item.snippet?.description || '',
    thumbnail: getThumbnail(item.snippet),
    publishedAt: item.snippet?.publishedAt || '',
    duration: item.contentDetails?.duration || '',
    viewCount: item.statistics?.viewCount || '0',
    likeCount: item.statistics?.likeCount || '0',
    tags: item.snippet?.tags || [],
    category: categorizeVideo(item.snippet?.title || '', item.snippet?.description || ''),
  }))
}

export function extractMomentsFromVideo(video: YouTubeVideo): VideoMoment[] {
  const moments: VideoMoment[] = []
  const title = video.title.toLowerCase()
  const desc = video.description.toLowerCase()

  // Padrões para identificar momentos-chave
  const patterns = [
    { type: 'exhaustion' as const, keywords: ['exaustão', '80%', '100%', 'máxima', 'correção', 'reversão'] },
    { type: 'channel' as const, keywords: ['canal', 'ponto-a', 'ponto-b', 'zona neutra', 'referência'] },
    { type: 'mistake' as const, keywords: ['erro', 'cuidado', 'atenção', 'não faça', 'evite', 'armadilha'] },
    { type: 'routine' as const, keywords: ['rotina', 'hábito', 'disciplina', 'gestão emocional', 'psicologia'] },
    { type: 'setup' as const, keywords: ['setup', 'entrada', 'operação', 'compra', 'venda', 'take profit'] },
  ]

  for (const pattern of patterns) {
    if (pattern.keywords.some(k => title.includes(k) || desc.includes(k))) {
      moments.push({
        id: `${video.videoId}-${pattern.type}`,
        videoId: video.videoId,
        title: `Momento: ${pattern.type}`,
        description: video.title,
        startTime: 0,
        endTime: 0,
        category: pattern.type,
        thumbnail: video.thumbnail,
      })
    }
  }

  return moments
}

export async function fetchAllChannelVideos(): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) return []

  const videos: YouTubeVideo[] = []
  let nextPageToken: string | null = null
  let pageCount = 0
  const MAX_PAGES = 5 // Limit to ~250 videos to avoid quota exhaustion

  do {
    pageCount++
    const params = new URLSearchParams({
      part: 'snippet',
      channelId: YOUTUBE_CHANNEL_ID,
      maxResults: '50',
      order: 'date',
      type: 'video',
      key: YOUTUBE_API_KEY,
    })
    if (nextPageToken) {
      params.set('pageToken', nextPageToken)
    }

    const url = `${YOUTUBE_API_BASE}/search?${params.toString()}`
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) break

    const json: any = await res.json()

    for (const item of json.items || []) {
      if (item.id?.kind === 'youtube#video') {
        const title = item.snippet?.title || ''
        const description = item.snippet?.description || ''
        
        videos.push({
          videoId: item.id.videoId,
          title,
          description,
          thumbnail: getThumbnail(item.snippet),
          publishedAt: item.snippet?.publishedAt || '',
          category: categorizeVideo(title, description),
        })
      }
    }

    nextPageToken = json.nextPageToken
  } while (nextPageToken && pageCount < MAX_PAGES)

  return videos
}

const STATIC_PLAYLISTS: YouTubePlaylist[] = [
  {
    id: 'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I',
    title: 'Fimathe Checkpoint | FOREX',
    description: 'Fimathe Checkpoint é o momento em que o Marcelão revisita tudo o que foi estudado e confere as movimentações do mercado.',
    thumbnail: 'https://img.youtube.com/vi/C77_DevBR8w/maxresdefault.jpg',
    videoCount: 15,
    category: 'checkpoint',
  },
  {
    id: 'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9',
    title: 'Primórdios da Fimathe',
    description: 'Série que revela a jornada de criação da Fimathe, método revolucionário no Forex.',
    thumbnail: 'https://img.youtube.com/vi/rl_UgvfXdfw/maxresdefault.jpg',
    videoCount: 5,
    category: 'fundamentos',
  },
  {
    id: 'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh',
    title: 'Marcelão in London [2024]',
    description: 'Acompanhe as análises gráficas do Marcelão direto de Londres.',
    thumbnail: 'https://img.youtube.com/vi/mhg53yJpq2k/maxresdefault.jpg',
    videoCount: 3,
    category: 'analise-mercado',
  },
  {
    id: 'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK',
    title: 'As melhores do XAUUSD',
    description: 'Os melhores momentos operando XAUUSD (Ouro) com a metodologia Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/EoVfQJoWLPU/maxresdefault.jpg',
    videoCount: 2,
    category: 'xauusd',
  },
  {
    id: 'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ',
    title: 'FOREX SCALPER FIMATHE',
    description: 'Operando Forex com a técnica Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/Zu57DaCN9Es/maxresdefault.jpg',
    videoCount: 20,
    category: 'scalping',
  },
  {
    id: 'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD',
    title: 'IMERSÃO MÉTODO FIMATHE',
    description: 'Aprofunde-se no Método Fimathe com esta imersão completa.',
    thumbnail: 'https://img.youtube.com/vi/6xcNZAyftXY/maxresdefault.jpg',
    videoCount: 2,
    category: 'imersao',
  },
  {
    id: 'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5',
    title: 'ESTUDOS EM EUR/USD',
    description: 'Estudos e análises do par EUR/USD com a Técnica Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/HcSWF3rPaw0/maxresdefault.jpg',
    videoCount: 10,
    category: 'eurusd',
  },
  {
    id: 'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV',
    title: 'FIMATHE NO OURO',
    description: 'Operando ouro (XAU/USD) com a metodologia Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/1MpCAh6Ost4/maxresdefault.jpg',
    videoCount: 6,
    category: 'ouro',
  },
]

export { STATIC_PLAYLISTS }

export const PLAYLIST_MAP: Record<string, string> = {
  'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I': 'Fimathe Checkpoint | FOREX',
  'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9': 'Primórdios da Fimathe',
  'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh': 'Marcelão in London [2024]',
  'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK': 'As melhores do XAUUSD',
  'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ': 'FOREX SCALPER FIMATHE',
  'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD': 'IMERSÃO MÉTODO FIMATHE',
  'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5': 'ESTUDOS EM EUR/USD',
  'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV': 'FIMATHE NO OURO',
}

export const CATEGORY_LABELS: Record<string, string> = {
  'checkpoint': 'Checkpoint',
  'fundamentos': 'Fundamentos',
  'analise-mercado': 'Análise de Mercado',
  'xauusd': 'XAU/USD (Ouro)',
  'scalping': 'Scalping',
  'imersao': 'Imersão',
  'eurusd': 'EUR/USD',
  'ouro': 'Fimathe no Ouro',
  'geral': 'Geral',
}
