import { NextRequest, NextResponse } from 'next/server'
import type { YouTubeApiPlaylist, YouTubeApiPlaylistItem } from '@/lib/youtube-types'

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

function getVideoTitle(item: YouTubeApiPlaylistItem): string {
  return item.snippet?.title || ''
}

function getVideoDescription(item: YouTubeApiPlaylistItem): string {
  return item.snippet?.description || ''
}

function getVideoThumbnail(item: YouTubeApiPlaylistItem): string {
  return item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || `https://img.youtube.com/vi/${item.contentDetails?.videoId}/mqdefault.jpg`
}

function getVideoPublishedAt(item: YouTubeApiPlaylistItem): string {
  return item.snippet?.publishedAt || ''
}

function getVideoId(item: YouTubeApiPlaylistItem): string {
  return item.contentDetails?.videoId || item.snippet?.resourceId?.videoId || ''
}

function mapPlaylistItemToVideo(item: YouTubeApiPlaylistItem) {
  const videoId = getVideoId(item)
  return {
    videoId,
    title: getVideoTitle(item),
    description: getVideoDescription(item),
    thumbnail: getVideoThumbnail(item),
    publishedAt: getVideoPublishedAt(item),
  }
}

async function getChannelPlaylists(): Promise<YouTubeApiPlaylist[]> {
  const data = await fetchYouTube('playlists', {
    part: 'snippet,contentDetails',
    channelId: YOUTUBE_CHANNEL_ID,
    maxResults: '50',
  })

  return ((data as { items?: YouTubeApiPlaylist[] }).items || []).filter(
    (item) => !item.snippet?.title?.toUpperCase().includes('SHORTS')
  )
}

async function getPlaylistItems(playlistId: string): Promise<ReturnType<typeof mapPlaylistItemToVideo>[]> {
  const items: YouTubeApiPlaylistItem[] = []
  let nextPageToken: string | null = null

  do {
    const params: Record<string, string> = {
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: '50',
    }
    if (nextPageToken) params.pageToken = nextPageToken

    const data = await fetchYouTube('playlistItems', params)
    const pageItems = ((data as { items?: YouTubeApiPlaylistItem[] }).items || []) as YouTubeApiPlaylistItem[]
    items.push(...pageItems)
    nextPageToken = (data as { nextPageToken?: string | null }).nextPageToken || null
  } while (nextPageToken)

  return items.map(mapPlaylistItemToVideo)
}

export async function GET(_request: NextRequest) {
  const cacheKey = 'channel_videos'
  const cached = getCached(cacheKey)
  if (cached) return NextResponse.json(cached)

  try {
    const playlists = await getChannelPlaylists()

    const videoArrays = await Promise.all(
      playlists.map((playlist) => getPlaylistItems(playlist.id))
    )

    const allVideos = videoArrays.flat()
    const seen = new Set<string>()
    const deduped = allVideos.filter((video) => {
      if (!video.videoId || seen.has(video.videoId)) return false
      seen.add(video.videoId)
      return true
    })

    const sorted = deduped.sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1))

    setCache(cacheKey, sorted)
    return NextResponse.json(sorted)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch channel videos' }, { status: 500 })
  }
}
