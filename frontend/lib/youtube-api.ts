import type { YouTubePlaylist, YouTubeVideo, VideoMoment } from './youtube-types'
import { PLAYLIST_CATEGORIES, VIDEO_CATEGORIES, STATIC_PLAYLISTS } from './youtube-constants'
import { logEvent } from './logging'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.vercel.app'
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
const YOUTUBE_CHANNEL_ID = 'UCwk7RuafgXHRqSmS3qO8qQQ'
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

interface ThumbnailSnippet {
  thumbnails?: {
    maxres?: { url: string }
    high?: { url: string }
    medium?: { url: string }
    standard?: { url: string }
    default?: { url: string }
  }
}

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json() as T
}

function getThumbnail(snippet: ThumbnailSnippet): string {
  const thumbs = snippet.thumbnails
  if (!thumbs) return ''
  const entries = [thumbs.maxres, thumbs.high, thumbs.medium, thumbs.standard, thumbs.default]
  for (const entry of entries) {
    if (entry && entry.url) return entry.url
  }
  return ''
}

function categorizeVideo(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()
  for (const [category, keywords] of Object.entries(VIDEO_CATEGORIES)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category
    }
  }
  return 'geral'
}

function shouldExcludePlaylist(title: string, _id: string): boolean {
  const upper = title.toUpperCase()
  return upper.includes('SHORTS')
}

function parseYouTubePlaylistItem(item: Record<string, unknown>): YouTubePlaylist | null {
  const snippet = (item.snippet || {}) as Record<string, unknown>
  const title = (snippet.title as string) || 'Sem título'
  if (shouldExcludePlaylist(title, item.id as string)) return null
  return {
    id: item.id as string,
    title,
    description: (snippet.description as string) || '',
    thumbnail: getThumbnail(snippet as ThumbnailSnippet),
    videoCount: ((item.contentDetails || {}) as Record<string, unknown>).itemCount as number || 0,
    category: PLAYLIST_CATEGORIES[item.id as string] || 'geral',
  }
}

export async function fetchPlaylists(): Promise<YouTubePlaylist[]> {
  try {
    return await api<YouTubePlaylist[]>('/api/playlists')
  } catch (error) {
    logEvent('youtube_api', 'warn', 'Backend /api/playlists unavailable', { error: error instanceof Error ? error.message : String(error) })
  }
  if (!YOUTUBE_API_KEY) {
    logEvent('youtube_api', 'warn', 'No YouTube API key available for fallback')
    return STATIC_PLAYLISTS
  }
  try {
    return await fetchPlaylistsFromYouTube()
  } catch (error) {
    logEvent('youtube_api', 'error', 'Failed to fetch playlists from YouTube API', { error: error instanceof Error ? error.message : String(error) })
    return STATIC_PLAYLISTS
  }
}

async function fetchPlaylistsFromYouTube(): Promise<YouTubePlaylist[]> {
  const playlists: YouTubePlaylist[] = []
  let nextPageToken: string | null = null
  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      channelId: YOUTUBE_CHANNEL_ID,
      maxResults: '50',
      key: YOUTUBE_API_KEY,
    })
    if (nextPageToken) params.set('pageToken', nextPageToken)
    const url = `${YOUTUBE_API_BASE}/playlists?${params.toString()}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`YouTube API error ${res.status}: ${text}`)
    }
    const json = (await res.json()) as Record<string, unknown>
    if ((json as { error?: { message?: string } }).error) {
      throw new Error(`YouTube API error: ${(json as { error: { message: string } }).error.message}`)
    }
    for (const item of (json.items || []) as Array<Record<string, unknown>>) {
      const playlist = parseYouTubePlaylistItem(item)
      if (playlist) playlists.push(playlist)
    }
    nextPageToken = json.nextPageToken as string | null
  } while (nextPageToken)
  return playlists
}

function parsePlaylistItem(item: Record<string, unknown>): YouTubeVideo {
  const snippet = (item.snippet || {}) as Record<string, unknown>
  const title = (snippet.title as string) || 'Sem título'
  const description = (snippet.description as string) || ''
  return {
    videoId: (snippet.resourceId as Record<string, string> | undefined)?.videoId || (item.contentDetails as Record<string, string> | undefined)?.videoId || '',
    title,
    description,
    thumbnail: getThumbnail(snippet as ThumbnailSnippet),
    publishedAt: (snippet.publishedAt as string) || '',
    category: categorizeVideo(title, description),
  }
}

async function fetchPlaylistItemsFromYouTube(playlistId: string): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = []
  let nextPageToken: string | null = null
  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: '50',
      key: YOUTUBE_API_KEY,
    })
    if (nextPageToken) params.set('pageToken', nextPageToken)
    const url = `${YOUTUBE_API_BASE}/playlistItems?${params.toString()}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`YouTube API error ${res.status}: ${text}`)
    }
    const json = (await res.json()) as Record<string, unknown>
    if ((json as { error?: { message?: string } }).error) {
      logEvent('youtube_api', 'error', 'YouTube API error', { error: (json as { error: { message: string } }).error.message })
      break
    }
    for (const item of (json.items || []) as Array<Record<string, unknown>>) {
      videos.push(parsePlaylistItem(item))
    }
    nextPageToken = json.nextPageToken as string | null
  } while (nextPageToken)
  return videos
}

export async function fetchPlaylistItems(playlistId: string): Promise<YouTubeVideo[]> {
  try {
    return await api<YouTubeVideo[]>(`/api/playlist/${playlistId}/items`)
  } catch (error) {
    logEvent('youtube_api', 'warn', `Backend unavailable for playlist ${playlistId}`, { error: error instanceof Error ? error.message : String(error) })
  }
  if (!YOUTUBE_API_KEY) {
    logEvent('youtube_api', 'error', 'No YouTube API key available for fallback')
    return []
  }
  return fetchPlaylistItemsFromYouTube(playlistId)
}

function getYouTubeVideoTitle(snippet: Record<string, unknown>): string {
  return (snippet.title as string) || ''
}

function getYouTubeVideoDescription(snippet: Record<string, unknown>): string {
  return (snippet.description as string) || ''
}

function getYouTubeVideoPublishedAt(snippet: Record<string, unknown>): string {
  return (snippet.publishedAt as string) || ''
}

function getYouTubeVideoDuration(item: Record<string, unknown>): string {
  return (item.contentDetails as Record<string, string> | undefined)?.duration || ''
}

function getYouTubeVideoViewCount(item: Record<string, unknown>): string {
  return (item.statistics as Record<string, string> | undefined)?.viewCount || '0'
}

function getYouTubeVideoLikeCount(item: Record<string, unknown>): string {
  return (item.statistics as Record<string, string> | undefined)?.likeCount || '0'
}

function getYouTubeVideoTags(snippet: Record<string, unknown>): string[] {
  return (snippet.tags as string[] | undefined) || []
}

function mapYouTubeVideoItem(item: Record<string, unknown>): YouTubeVideo {
  const snippet = (item.snippet || {}) as Record<string, unknown>
  const title = getYouTubeVideoTitle(snippet)
  const description = getYouTubeVideoDescription(snippet)
  return {
    videoId: item.id as string,
    title,
    description,
    thumbnail: getThumbnail((snippet || {}) as ThumbnailSnippet),
    publishedAt: getYouTubeVideoPublishedAt(snippet),
    duration: getYouTubeVideoDuration(item),
    viewCount: getYouTubeVideoViewCount(item),
    likeCount: getYouTubeVideoLikeCount(item),
    tags: getYouTubeVideoTags(snippet),
    category: categorizeVideo(title, description),
  }
}

export async function fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY || videoIds.length === 0) return []
  const params = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: videoIds.join(','),
    key: YOUTUBE_API_KEY,
  })
  const url = `${YOUTUBE_API_BASE}/videos?${params.toString()}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) {
    logEvent('youtube_api', 'error', 'Failed to fetch video details')
    return []
  }
  const json = (await res.json()) as Record<string, unknown>
  return ((json.items || []) as Array<Record<string, unknown>>).map(mapYouTubeVideoItem)
}

function parseSearchItem(item: Record<string, unknown>): YouTubeVideo | null {
  if ((item.id as Record<string, string>)?.kind !== 'youtube#video') return null
  const snippet = (item.snippet || {}) as Record<string, unknown>
  const title = (snippet.title as string) || ''
  const description = (snippet.description as string) || ''
  return {
    videoId: (item.id as Record<string, string>).videoId,
    title,
    description,
    thumbnail: getThumbnail(snippet as ThumbnailSnippet),
    publishedAt: (snippet.publishedAt as string) || '',
    category: categorizeVideo(title, description),
  }
}

async function fetchChannelSearchPage(
  nextPageToken: string | null
): Promise<{ json: Record<string, unknown>; nextPageToken: string | null; shouldStop: boolean }> {
  const params = new URLSearchParams({
    part: 'snippet',
    channelId: YOUTUBE_CHANNEL_ID,
    maxResults: '50',
    order: 'date',
    type: 'video',
    key: YOUTUBE_API_KEY,
  })
  if (nextPageToken) params.set('pageToken', nextPageToken)
  const url = `${YOUTUBE_API_BASE}/search?${params.toString()}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return { json: {}, nextPageToken: null, shouldStop: true }
  const json = (await res.json()) as Record<string, unknown>
  if ((json as { error?: { message?: string } }).error) {
    return { json, nextPageToken: null, shouldStop: true }
  }
  return { json, nextPageToken: json.nextPageToken as string | null, shouldStop: false }
}

export async function fetchAllChannelVideos(): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) return []
  const videos: YouTubeVideo[] = []
  let nextPageToken: string | null = null
  let pageCount = 0
  const MAX_PAGES = 5
  do {
    pageCount++
    const { json, nextPageToken: newNextPageToken, shouldStop } = await fetchChannelSearchPage(nextPageToken)
    if (shouldStop) break
    for (const item of (json.items || []) as Array<Record<string, unknown>>) {
      const video = parseSearchItem(item)
      if (video) videos.push(video)
    }
    nextPageToken = newNextPageToken
  } while (nextPageToken && pageCount < MAX_PAGES)
  return videos
}

export function extractMomentsFromVideo(video: YouTubeVideo): VideoMoment[] {
  const moments: VideoMoment[] = []
  const title = video.title.toLowerCase()
  const desc = video.description.toLowerCase()
  const patterns = [
    { type: 'exhaustion' as const, keywords: ['exaustão', '80%', '100%', 'máxima', 'correção', 'reversão'] },
    { type: 'channel' as const, keywords: ['canal', 'ponto-a', 'ponto-b', 'zona neutra', 'referência'] },
    { type: 'mistake' as const, keywords: ['erro', 'cuidado', 'atenção', 'não faça', 'evite', 'armadilha'] },
    { type: 'routine' as const, keywords: ['rotina', 'hábito', 'disciplina', 'gestão emocional', 'psicologia'] },
    { type: 'setup' as const, keywords: ['setup', 'entrada', 'operação', 'compra', 'venda', 'take profit'] },
  ]
  for (const pattern of patterns) {
    if (pattern.keywords.some(k => title.includes(k) || desc.includes(k))) {
      moments.push({
        id: `${video.videoId}-${pattern.type}`,
        videoId: video.videoId,
        title: `Momento: ${pattern.type}`,
        description: video.title,
        startTime: 0,
        endTime: 0,
        category: pattern.type,
        thumbnail: video.thumbnail,
      })
    }
  }
  return moments
}

export { STATIC_PLAYLISTS, PLAYLIST_MAP, CATEGORY_LABELS } from './youtube-constants'
