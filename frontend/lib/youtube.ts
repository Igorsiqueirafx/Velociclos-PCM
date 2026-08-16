const API_BASE = 'https://www.googleapis.com/youtube/v3'

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

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

export async function fetchPlaylists(playlistIds: string[]): Promise<YouTubePlaylist[]> {
  if (!API_KEY) {
    console.warn('YouTube API key not configured')
    return []
  }

  const ids = playlistIds.join(',')
  const url = `${API_BASE}/playlists?key=${API_KEY}&id=${ids}&maxResults=${playlistIds.length}&part=snippet,contentDetails`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)
    const data = await res.json()

    return (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet?.title || 'Sem título',
      description: item.snippet?.description || '',
      thumbnail:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        '',
      videoCount: item.contentDetails?.itemCount || 0,
    }))
  } catch (error) {
    console.error('Failed to fetch playlists:', error)
    return []
  }
}

export async function fetchPlaylistItems(playlistId: string): Promise<YouTubeVideo[]> {
  if (!API_KEY) {
    console.warn('YouTube API key not configured')
    return []
  }

  const url = `${API_BASE}/playlistItems?key=${API_KEY}&playlistId=${encodeURIComponent(playlistId)}&maxResults=50&part=snippet,contentDetails`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)
    const data = await res.json()

    return (data.items || [])
      .filter((item: any) => item.contentDetails?.videoId)
      .map((item: any) => ({
        videoId: item.contentDetails.videoId,
        title: item.snippet?.title || 'Sem título',
        description: item.snippet?.description || '',
        thumbnail:
          item.snippet?.thumbnails?.medium?.url ||
          `https://img.youtube.com/vi/${item.contentDetails.videoId}/mqdefault.jpg`,
        publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt,
      }))
  } catch (error) {
    console.error(`Failed to fetch playlist items for ${playlistId}:`, error)
    return []
  }
}

const PLAYLIST_IDS = [
  'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I', // Fimathe Checkpoint
  'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9', // Primórdios da Fimathe
  'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh', // Marcelão in London
  'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK', // As melhores do XAUUSD
  'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ', // FOREX SCALPER FIMATHE
  'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD', // IMERSÃO MÉTODO FIMATHE
  'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5', // ESTUDOS EM EUR/USD
  'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV', // FIMATHE NO OURO
  'PLWhqc48nlRWJpjKnjSaJpq4jMRE_ukg6V', // FIMATHE EM CRIPTOMOEDA
  'PLWhqc48nlRWJZyYdEi3gcSIHx6cy0Hxlb', // TRADE PARA INICIANTES
  'PLWhqc48nlRWLqE-RBi_RTBjKit-xFWeOC', // VLOG
  'PLWhqc48nlRWKu17t5xqL6Sr3T6Pwn1DcL', // COLLABS
  'PLWhqc48nlRWIKhZTuRMMy4vtOhN_HANlw', // MEU PORTFÓLIO NO DAYTRADE
  'PLWhqc48nlRWIuwZkiaLAfDfFKWWndWUxO', // FOREX DO ZERO
]

export async function fetchAllPlaylists(): Promise<YouTubePlaylist[]> {
  return fetchPlaylists(PLAYLIST_IDS)
}

export const PLAYLIST_MAP: Record<string, string> = {
  'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I': 'Fimathe Checkpoint | FOREX',
  'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9': 'Primórdios da Fimathe',
  'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh': 'Marcelão in London [2024]',
  'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK': 'As melhores do XAUUSD',
  'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ': 'FOREX SCALPER FIMATHE',
  'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD': 'IMERSÃO MÉTODO FIMATHE',
  'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5': 'ESTUDOS EM EUR/USD',
  'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV': 'FIMATHE NO OURO',
  'PLWhqc48nlRWJpjKnjSaJpq4jMRE_ukg6V': 'FIMATHE EM CRIPTOMOEDA',
  'PLWhqc48nlRWJZyYdEi3gcSIHx6cy0Hxlb': 'TRADE PARA INICIANTES',
  'PLWhqc48nlRWLqE-RBi_RTBjKit-xFWeOC': 'VLOG',
  'PLWhqc48nlRWKu17t5xqL6Sr3T6Pwn1DcL': 'COLLABS',
  'PLWhqc48nlRWIKhZTuRMMy4vtOhN_HANlw': 'MEU PORTFÓLIO NO DAYTRADE É A BOLETA',
  'PLWhqc48nlRWIuwZkiaLAfDfFKWWndWUxO': 'FOREX DO ZERO? COMECE AQUI',
}
