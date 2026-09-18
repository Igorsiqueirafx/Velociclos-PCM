import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublishedArticles, type ArticleRow } from '@/lib/repositories/articles'
import { logEvent } from '@/lib/logging'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<ArticleRow | null> {
  try {
    const articles = await getPublishedArticles()
    return articles.find((a) => a.slug === slug) || null
  } catch (e) {
    logEvent('article_detail_load', 'error', 'Failed to load article', { slug, error: e instanceof Error ? e.message : String(e) })
    return null
  }
}

export async function generateStaticParams() {
  try {
    const articles = await getPublishedArticles()
    return articles.map((article) => ({
      slug: article.slug,
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return {
      title: 'Artigo não encontrado - Velociclos PCM',
    }
  }

  return {
    title: `${article.title} - Velociclos PCM`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      type: 'article',
      publishedTime: article.published_at,
    },
  }
}

export default async function ArtigoPage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#121212] to-[#1a1a2e]">
      <article className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/artigos"
              className="inline-flex items-center gap-2 text-[#8a8a8d] hover:text-white transition-colors mb-8 text-sm"
            >
              <i className="fas fa-arrow-left" aria-hidden="true" />
              <span>Voltar para artigos</span>
            </Link>

            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#0071e3]/15 text-[#0071e3] border border-[#0071e3]/30">
                  Artigo
                </span>
                {publishedDate && (
                  <span className="text-xs text-[#8a8a8d] flex items-center gap-1">
                    <i className="fas fa-calendar" aria-hidden="true" />
                    {publishedDate}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-lg text-[#8a8a8d] leading-relaxed">{article.excerpt}</p>
              )}
            </header>

            {article.cover_image && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-10 border border-[#3a3a3c]">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              {article.content ? (
                <div
                  className="text-[#dcdcdc] leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                    <i className="fas fa-newspaper text-2xl text-[#3a3a3c]" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Conteúdo em breve</h3>
                  <p className="text-[#8a8a8d]">Este artigo ainda não está disponível para leitura.</p>
                </div>
              )}
            </div>

            <footer className="mt-12 pt-8 border-t border-[#3a3a3c]">
              <Link
                href="/artigos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0071e3] text-white font-semibold rounded-lg hover:bg-[#005fd9] transition-colors"
              >
                <i className="fas fa-arrow-left" aria-hidden="true" />
                <span>Ver todos os artigos</span>
              </Link>
            </footer>
          </div>
        </div>
      </article>
    </main>
  )
}
