'use client'

import { useState, useMemo } from 'react'

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
  const articles = initialArticles.filter((a) => a.is_published)

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return articles
    return articles.filter((a) => {
      const slug = (a.slug || '').toLowerCase()
      const title = (a.title || '').toLowerCase()
      return slug.includes(activeCategory) || title.includes(activeCategory)
    })
  }, [articles, activeCategory])

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center bg-[#1a1a2e]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/85 to-[#1e2329]/75 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-4">
              <span className="block">Nossos</span>
              <span className="text-[#ffd700]">Artigos</span>
            </h1>
            <p className="text-[#a0a0a0] text-lg">
              Conteúdo exclusivo sobre trading, mesas proprietárias e estratégias.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1e2329]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#dcdcdc] mb-3">Nossos Artigos</h2>
            <p className="text-[#a0a0a0]">Desenvolvido com dedicação para traders</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setActiveCategory(btn.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === btn.value
                    ? 'bg-[#ffd700] text-[#1e2329] border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                    : 'bg-[#1e2329]/50 text-[#a0a0a0] border-[#404857] hover:text-[#ffd700] hover:border-[#ffd700]/30'
                }`}
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden transition-all hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] text-left"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-lg flex items-center justify-center text-[#1e2329]">
                      <i className="fas fa-newspaper" aria-hidden="true"></i>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30">
                      Artigo
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#dcdcdc] mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[#a0a0a0] text-sm mb-4 flex-1 line-clamp-3">
                    {article.excerpt || article.title}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#707070] mb-4">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-calendar" aria-hidden="true"></i>{' '}
                      {article.published_at ? new Date(article.published_at).toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </div>
                  <button
                    onClick={() => (window.location.href = `/artigos/${article.slug || article.id}`)}
                    className="w-full px-4 py-2 bg-[#ffd700] text-[#1e2329] font-bold rounded-md hover:bg-[#ffdd33] transition-colors focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
                  >
                    Ler Artigo
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
