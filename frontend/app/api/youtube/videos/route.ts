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

// GET /api/youtube/videos?ids=id1,id2,id3
export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get('ids')
  
  if (!ids) {
    return NextResponse.json({ error: 'No video IDs provided' }, { status: 400 })
  }

  const cacheKey = `videos_${ids.replace(/,/g, '_')}`
  const cached = getCached(cacheKey)
  if (cached) return NextResponse.json(cached)

  try {
    const data = await fetchYouTube('videos', {
      part: 'snippet,statistics,contentDetails',
      id: ids,
    })

    const videos = (data.items || []).map((item: any) => ({
      videoId: item.id,
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
      publishedAt: item.snippet?.publishedAt || '',
      duration: item.contentDetails?.duration || '',
      viewCount: item.statistics?.viewCount || '0',
      likeCount: item.statistics?.likeCount || '0',
      tags: item.snippet?.tags || [],
    }))

    setCache(cacheKey, videos)
    return NextResponse.json(videos)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video details' }, { status: 500 })
  }
}
