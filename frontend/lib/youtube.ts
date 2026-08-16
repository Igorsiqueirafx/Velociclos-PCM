export interface YouTubePlaylist {
  id: string
  title: string
  description: string
  thumbnail: string
  videoCount: number
}

export interface YouTubeVideo {
  videoId: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchPlaylists(): Promise<YouTubePlaylist[]> {
  try {
    return await api<YouTubePlaylist[]>('/api/playlists')
  } catch (error) {
    console.error('Failed to fetch playlists:', error)
    return STATIC_PLAYLISTS
  }
}

export async function fetchPlaylistItems(playlistId: string): Promise<YouTubeVideo[]> {
  try {
    return await api<YouTubeVideo[]>(`/api/playlist/${playlistId}/items`)
  } catch (error) {
    console.error(`Failed to fetch playlist items for ${playlistId}:`, error)
    return []
  }
}

const STATIC_PLAYLISTS: YouTubePlaylist[] = [
  {
    id: 'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I',
    title: 'Fimathe Checkpoint | FOREX',
    description: 'Fimathe Checkpoint é o momento em que o Marcelão revisa tudo o que foi estudado e confere as movimentações do mercado.',
    thumbnail: 'https://img.youtube.com/vi/C77_DevBR8w/maxresdefault.jpg',
    videoCount: 15,
  },
  {
    id: 'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9',
    title: 'Primórdios da Fimathe',
    description: 'Série que revela a jornada de criação da Fimathe, método revolucionário no Forex.',
    thumbnail: 'https://img.youtube.com/vi/rl_UgvfXdfw/maxresdefault.jpg',
    videoCount: 5,
  },
  {
    id: 'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh',
    title: 'Marcelão in London [2024]',
    description: 'Acompanhe as análises gráficas do Marcelão direto de Londres.',
    thumbnail: 'https://img.youtube.com/vi/mhg53yJpq2k/maxresdefault.jpg',
    videoCount: 3,
  },
  {
    id: 'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK',
    title: 'As melhores do XAUUSD',
    description: 'Os melhores momentos operando XAUUSD (Ouro) com a metodologia Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/EoVfQJoWLPU/maxresdefault.jpg',
    videoCount: 2,
  },
  {
    id: 'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ',
    title: 'FOREX SCALPER FIMATHE',
    description: 'Operando Forex com a técnica Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/Zu57DaCN9Es/maxresdefault.jpg',
    videoCount: 20,
  },
  {
    id: 'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD',
    title: 'IMERSÃO MÉTODO FIMATHE',
    description: 'Aprofunde-se no Método Fimathe com esta imersão completa.',
    thumbnail: 'https://img.youtube.com/vi/6xcNZAyftXY/maxresdefault.jpg',
    videoCount: 2,
  },
  {
    id: 'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5',
    title: 'ESTUDOS EM EUR/USD',
    description: 'Estudos e análises do par EUR/USD com a Técnica Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/HcSWF3rPaw0/maxresdefault.jpg',
    videoCount: 10,
  },
  {
    id: 'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV',
    title: 'FIMATHE NO OURO',
    description: 'Operando ouro (XAU/USD) com a metodologia Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/1MpCAh6Ost4/maxresdefault.jpg',
    videoCount: 6,
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
