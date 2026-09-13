import { createClient } from '@/app/lib/supabase/server'
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
}

export async function getPublishedArticles(): Promise<ArticleRow[]> {
  const supabase = await createClient()
  let articles: ArticleRow[] = []
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    if (!error) articles = data || []
  } catch (e) {
    logEvent('articles_load', 'error', 'Failed to load articles', { error: e instanceof Error ? e.message : String(e) })
  }
  return articles
}
