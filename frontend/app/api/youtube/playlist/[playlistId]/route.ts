import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
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

// GET /api/youtube/playlist/[playlistId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  const { playlistId } = await params
  const cacheKey = `playlist_${playlistId}`
  const cached = getCached(cacheKey)
  if (cached) return NextResponse.json(cached)

  try {
    const data = await fetchYouTube('playlistItems', {
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: '50',
    })

    const videos = (data.items || []).map((item: any) => ({
      videoId: item.snippet?.resourceId?.videoId || item.contentDetails?.videoId || '',
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
      publishedAt: item.snippet?.publishedAt || '',
    }))

    setCache(cacheKey, videos)
    return NextResponse.json(videos)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch playlist items' }, { status: 500 })
  }
}
