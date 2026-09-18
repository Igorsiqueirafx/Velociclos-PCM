import { apiGet } from '@/lib/api'
import { logEvent } from '@/lib/logging'

export type ArticleRow = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  is_published: boolean
  published_at: string
  created_at: string
  content?: string | null
  tags?: string[] | null
}

export async function getPublishedArticles(): Promise<ArticleRow[]> {
  try {
    const articles = await apiGet<ArticleRow[]>('/api/articles')
    return articles
  } catch (e) {
    logEvent('articles_load', 'error', 'Failed to load articles', { error: e instanceof Error ? e.message : String(e) })
    return []
  }
}