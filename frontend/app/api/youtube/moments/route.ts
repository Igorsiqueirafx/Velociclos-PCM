import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
const YOUTUBE_CHANNEL_ID = 'UCwk7RuafgXHRqSmS3qO8qQQ'
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

// Cache simples em memória
const cache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_TTL = 3600000 // 1 hora

function getCached(key: string): any | null {
  const cached = cache[key]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCache(key: string, data: any): void {
  cache[key] = { data, timestamp: Date.now() }
}

async function fetchYouTube(endpoint: string, params: Record<string, string>): Promise<any> {
  const searchParams = new URLSearchParams({
    ...params,
    key: YOUTUBE_API_KEY,
  })
  
  const url = `${YOUTUBE_API_BASE}/${endpoint}?${searchParams.toString()}`
  const res = await fetch(url)
  
  if (!res.ok) {
    throw new Error(`YouTube API error: ${res.status}`)
  }
  
  return res.json()
}

// Termos de busca para cada categoria de momento
const MOMENT_SEARCH_TERMS: Record<string, string> = {
  'exaustao': 'exaustão Fimathe 80% 100%',
  'canal': 'canal referência ponto-a ponto-b',
  'erro': 'erro iniciante cuidado armadilha',
  'rotina': 'rotina trader disciplina hábito',
  'setup': 'setup entrada operação take stop',
}

// GET /api/youtube/moments?category=exaustao
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category') || ''
  
  const searchTerm = MOMENT_SEARCH_TERMS[category] || 'Fimathe análise mercado'
  const cacheKey = `moments_${category}`
  const cached = getCached(cacheKey)
  if (cached) return NextResponse.json(cached)

  try {
    const data = await fetchYouTube('search', {
      part: 'snippet',
      channelId: YOUTUBE_CHANNEL_ID,
      q: searchTerm,
      type: 'video',
      maxResults: '10',
      order: 'relevance',
    })

    const moments = (data.items || []).map((item: any) => ({
      id: `${item.id?.videoId}_${category}`,
      videoId: item.id?.videoId || '',
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
      publishedAt: item.snippet?.publishedAt || '',
      category,
    }))

    setCache(cacheKey, moments)
    return NextResponse.json(moments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch moments' }, { status: 500 })
  }
}
