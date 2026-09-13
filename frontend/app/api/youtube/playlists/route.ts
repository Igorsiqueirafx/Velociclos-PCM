import { NextRequest, NextResponse } from 'next/server'
import type { YouTubeApiPlaylist } from '@/lib/youtube-types'

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

function getPlaylistTitle(item: YouTubeApiPlaylist): string {
  return item.snippet?.title || ''
}

function getPlaylistDescription(item: YouTubeApiPlaylist): string {
  return item.snippet?.description || ''
}

function getPlaylistThumbnail(item: YouTubeApiPlaylist): string {
  return item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || ''
}

function getPlaylistVideoCount(item: YouTubeApiPlaylist): number {
  return (item.contentDetails as { itemCount?: number })?.itemCount || 0
}

function mapPlaylistItemToPlaylist(item: YouTubeApiPlaylist) {
  return {
    id: item.id,
    title: getPlaylistTitle(item),
    description: getPlaylistDescription(item),
    thumbnail: getPlaylistThumbnail(item),
    videoCount: getPlaylistVideoCount(item),
  }
}

export async function GET(_request: NextRequest) {
  const cached = getCached('playlists')
  if (cached) return NextResponse.json(cached)

  try {
    const data = await fetchYouTube('playlists', {
      part: 'snippet,contentDetails',
      channelId: YOUTUBE_CHANNEL_ID,
      maxResults: '50',
    })

    const playlists = ((data as { items?: YouTubeApiPlaylist[] }).items || [])
      .filter((item) => !item.snippet?.title?.toUpperCase().includes('SHORTS'))
      .map((item) => mapPlaylistItemToPlaylist(item))

    setCache('playlists', playlists)
    return NextResponse.json(playlists)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 })
  }
}
