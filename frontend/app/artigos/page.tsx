import { createClient } from '@/app/lib/supabase/server'
import { Metadata } from 'next'
import ArtigosClient from './ArtigosClient'

export const metadata: Metadata = {
  title: 'Artigos - Velociclos PCM | Trading, Forex e Mesas Proprietárias',
  description: 'Artigos completos sobre Forex, trading e mesas proprietárias. Conteúdo exclusivo sobre análise técnica, gestão de risco e estratégias Fimathe.',
}

type ArticleRow = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  is_published: boolean
  published_at: string
  created_at: string
}

export default async function ArtigosPage() {
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
    console.error('Failed to load articles:', e)
  }

  const initialArticles = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? '',
    cover_image: a.cover_image ?? '',
    is_published: a.is_published,
    published_at: a.published_at,
    created_at: a.created_at,
  }))

  return <ArtigosClient initialArticles={initialArticles} />
}
