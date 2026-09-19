'use client'

import { useState, useMemo } from 'react'
import AppleCard from '@/components/AppleCard'
import AppleButton from '@/components/AppleButton'
import ApiErrorState from '@/components/ApiErrorState'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  cover_image: string
  is_published: boolean
  published_at: string
  created_at: string
}

interface ArtigosClientProps {
  initialArticles: Article[]
}

const filterButtons = [
  { label: 'Todos', value: 'all' },
  { label: 'Iniciantes', value: 'iniciante' },
  { label: 'Intermediário', value: 'intermediario' },
  { label: 'Avançado', value: 'avancado' },
]

export default function ArtigosClient({ initialArticles }: ArtigosClientProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [articlesError, setArticlesError] = useState<Error | null>(null)
  const articles = initialArticles.filter((a) => a.is_published)

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return articles
    return articles.filter((a) => {
      const slug = (a.slug || '').toLowerCase()
      const title = (a.title || '').toLowerCase()
      return slug.includes(activeCategory) || title.includes(activeCategory)
    })
  }, [articles, activeCategory])

  const retryArticles = () => {
    setArticlesError(null)
    window.location.reload()
  }

  if (articlesError && articles.length === 0) {
    return <ApiErrorState title="Não foi possível carregar os artigos" retry={retryArticles} fallbackHref="/" />
  }

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center bg-[#0a0a12]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/90 to-[#121212]/80 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4 tracking-tight">
              <span className="block">Nossos</span>
              <span className="text-[#0071e3]">Artigos</span>
            </h1>
            <p className="text-[#8a8a8d] text-lg">
              Conteúdo exclusivo sobre trading, mesas proprietárias e estratégias.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-white mb-3">Nossos Artigos</h2>
            <p className="text-[#8a8a8d]">Desenvolvido com dedicação para traders</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setActiveCategory(btn.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === btn.value
                    ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-black/20'
                    : 'bg-[#1e1e1e]/50 text-[#8a8a8d] border-[#3a3a3c] hover:text-white hover:border-[#0071e3]'
                }`}
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <AppleCard key={article.id} hover className="h-full text-left">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0071e3] to-[#6567f1] rounded-lg flex items-center justify-center text-white">
                      <i className="fas fa-newspaper" aria-hidden="true"></i>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#0071e3]/15 text-[#0071e3] border border-[#0071e3]/30">
                      Artigo
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[#8a8a8d] text-sm mb-4 flex-1 line-clamp-3">
                    {article.excerpt || article.title}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#8a8a8d] mb-4">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-calendar" aria-hidden="true"></i>{' '}
                      {article.published_at ? new Date(article.published_at).toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </div>
                  <AppleButton onClick={() => (window.location.href = `/artigos/${article.slug || article.id}`)} className="w-full">
                    Ler Artigo
                  </AppleButton>
                </div>
              </AppleCard>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
