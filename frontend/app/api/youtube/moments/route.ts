import { NextRequest, NextResponse } from 'next/server'
import type { YouTubeApiSearchItem } from '@/lib/youtube-types'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
const YOUTUBE_CHANNEL_ID = 'UCwk7RuafgXHRqSmS3qO8qQQ'
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

const cache: Record<string, { data: unknown; timestamp: number }> = {}
const CACHE_TTL = 3600000

function getCached(key: string): unknown | null {
  const cached = cache[key]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCache(key: string, data: unknown): void {
  cache[key] = { data, timestamp: Date.now() }
}

async function fetchYouTube(endpoint: string, params: Record<string, string>): Promise<unknown> {
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

const MOMENT_SEARCH_TERMS: Record<string, string> = {
  'exaustao': 'exaustão Fimathe 80% 100%',
  'canal': 'canal referência ponto-a ponto-b',
  'erro': 'erro iniciante cuidado armadilha',
  'rotina': 'rotina trader disciplina hábito',
  'setup': 'setup entrada operação take stop',
}

function getMomentVideoId(item: YouTubeApiSearchItem): string {
  return item.id?.videoId || ''
}

function getMomentTitle(item: YouTubeApiSearchItem): string {
  return item.snippet?.title || ''
}

function getMomentDescription(item: YouTubeApiSearchItem): string {
  return item.snippet?.description || ''
}

function getMomentThumbnail(item: YouTubeApiSearchItem): string {
  return item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || ''
}

function getMomentPublishedAt(item: YouTubeApiSearchItem): string {
  return item.snippet?.publishedAt || ''
}

function mapMomentItem(item: YouTubeApiSearchItem, category: string) {
  return {
    id: `${getMomentVideoId(item)}_${category}`,
    videoId: getMomentVideoId(item),
    title: getMomentTitle(item),
    description: getMomentDescription(item),
    thumbnail: getMomentThumbnail(item),
    publishedAt: getMomentPublishedAt(item),
    category,
  }
}

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

    const moments = ((data as { items?: YouTubeApiSearchItem[] }).items || []).map((item) => mapMomentItem(item, category))

    setCache(cacheKey, moments)
    return NextResponse.json(moments)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch moments' }, { status: 500 })
  }
}
