import { NextRequest, NextResponse } from 'next/server'
import type { YouTubeApiVideo } from '@/lib/youtube-types'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
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

function getVideoTitle(item: YouTubeApiVideo): string {
  return item.snippet?.title || ''
}

function getVideoDescription(item: YouTubeApiVideo): string {
  return item.snippet?.description || ''
}

function getVideoThumbnail(item: YouTubeApiVideo): string {
  return item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || ''
}

function getVideoPublishedAt(item: YouTubeApiVideo): string {
  return item.snippet?.publishedAt || ''
}

function getVideoDuration(item: YouTubeApiVideo): string {
  return item.contentDetails?.duration || ''
}

function getVideoViewCount(item: YouTubeApiVideo): string {
  return item.statistics?.viewCount || '0'
}

function getVideoLikeCount(item: YouTubeApiVideo): string {
  return item.statistics?.likeCount || '0'
}

function getVideoTags(item: YouTubeApiVideo): string[] {
  return item.snippet?.tags || []
}

function mapVideoItemToVideo(item: YouTubeApiVideo) {
  return {
    videoId: item.id,
    title: getVideoTitle(item),
    description: getVideoDescription(item),
    thumbnail: getVideoThumbnail(item),
    publishedAt: getVideoPublishedAt(item),
    duration: getVideoDuration(item),
    viewCount: getVideoViewCount(item),
    likeCount: getVideoLikeCount(item),
    tags: getVideoTags(item),
  }
}

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

    const videos = ((data as { items?: YouTubeApiVideo[] }).items || []).map((item) => mapVideoItemToVideo(item))

    setCache(cacheKey, videos)
    return NextResponse.json(videos)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch video details' }, { status: 500 })
  }
}
