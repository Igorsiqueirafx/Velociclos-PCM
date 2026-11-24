import { Metadata } from 'next'
import { logEvent } from '@/lib/logging'
import { getPublishedArticles, type ArticleRow } from '@/lib/repositories/articles'
import ArtigosClient from './ArtigosClient'

export const metadata: Metadata = {
  title: 'Artigos - Velociclos PCM | Trading, Forex e Mesas Proprietárias',
  description: 'Artigos completos sobre Forex, trading e mesas proprietárias. Conteúdo exclusivo sobre análise técnica, gestão de risco e estratégias Fimathe.',
  openGraph: {
    title: 'Artigos - Velociclos PCM | Trading, Forex e Mesas Proprietárias',
    description: 'Artigos completos sobre Forex, trading e mesas proprietárias. Conteúdo exclusivo sobre análise técnica, gestão de risco e estratégias Fimathe.',
    type: 'website',
    images: [{ url: '/og-artigos.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artigos - Velociclos PCM | Trading, Forex e Mesas Proprietárias',
    description: 'Artigos completos sobre Forex, trading e mesas proprietárias.',
    images: ['/og-artigos.png'],
  },
}

export const dynamic = 'force-dynamic'

export default async function ArtigosPage() {
  let articles: ArticleRow[] = []

  try {
    articles = await getPublishedArticles()
  } catch (e) {
    logEvent('articles_load', 'error', 'Failed to load articles', { error: e instanceof Error ? e.message : String(e) })
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
