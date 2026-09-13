import { NextRequest, NextResponse } from 'next/server'
import type { YouTubeApiPlaylistItem } from '@/lib/youtube-types'

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

function getPlaylistItemVideoId(item: YouTubeApiPlaylistItem): string {
  return item.snippet?.resourceId?.videoId || item.contentDetails?.videoId || ''
}

function getPlaylistItemTitle(item: YouTubeApiPlaylistItem): string {
  return item.snippet?.title || ''
}

function getPlaylistItemDescription(item: YouTubeApiPlaylistItem): string {
  return item.snippet?.description || ''
}

function getPlaylistItemThumbnail(item: YouTubeApiPlaylistItem): string {
  return item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || ''
}

function getPlaylistItemPublishedAt(item: YouTubeApiPlaylistItem): string {
  return item.snippet?.publishedAt || ''
}

function mapPlaylistItemToVideo(item: YouTubeApiPlaylistItem) {
  return {
    videoId: getPlaylistItemVideoId(item),
    title: getPlaylistItemTitle(item),
    description: getPlaylistItemDescription(item),
    thumbnail: getPlaylistItemThumbnail(item),
    publishedAt: getPlaylistItemPublishedAt(item),
  }
}

export async function GET(
  _request: NextRequest,
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

    const videos = ((data as { items?: YouTubeApiPlaylistItem[] }).items || []).map((item) => mapPlaylistItemToVideo(item))

    setCache(cacheKey, videos)
    return NextResponse.json(videos)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch playlist items' }, { status: 500 })
  }
}
