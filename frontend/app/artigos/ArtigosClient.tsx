'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
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
      <section
        className="relative min-h-[60vh] flex items-center overflow-hidden"
        aria-label="Hero da seção de artigos"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg-capa-marcelo.webp"
            alt=""
            fill
            className="object-cover opacity-50"
            aria-hidden="true"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12]/80 via-[#121212]/70 to-[#121212]/80" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0071e3]/20 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#6567f1]/20 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16">
          <div className="max-w-3xl glass-card rounded-3xl p-8 sm:p-12 hover-lift">
            <div className="inline-flex items-center gap-2 bg-[#0071e3]/10 text-[#0071e3] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#0071e3]/20">
              <i className="fas fa-newspaper" aria-hidden="true"></i>
              <span>Conteúdo Exclusivo</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4 tracking-tight">
              <span className="block">Nossos</span>
              <span className="gradient-text">Artigos</span>
            </h1>
            <p className="text-[#b0b0b0] text-lg leading-relaxed max-w-2xl">
              Conteúdo exclusivo sobre trading, mesas proprietárias e estratégias do método Fimathe.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#121212]" aria-labelledby="artigos-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="artigos-heading" className="text-3xl font-semibold text-white mb-3">
              <span className="gradient-text">Nossos Artigos</span>
            </h2>
            <p className="text-[#8a8a8d]">Desenvolvido com dedicação para traders</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10" role="radiogroup" aria-label="Filtrar artigos por nível">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setActiveCategory(btn.value)}
                role="radio"
                aria-checked={activeCategory === btn.value}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === btn.value
                    ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-black/20'
                    : 'glass-subtle text-[#8a8a8d] border-[#3a3a3c] hover:text-white hover:border-[#0071e3]'
                }`}
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <AppleCard
                key={article.id}
                hover
                className="h-full text-left glass-card hover-lift"
                aria-label={`Ler artigo: ${article.title}`}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="aspect-video overflow-hidden rounded-xl mb-4 relative">
                    {article.cover_image ? (
                      <Image
                        src={article.cover_image}
                        alt={`Capa do artigo ${article.title}`}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1e1e1e]">
                        <i className="fas fa-newspaper text-2xl text-[#3a3a3c]" aria-hidden="true" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-1 bg-[#0071e3] text-white text-xs font-semibold rounded-md">
                      Artigo
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[#8a8a8d] text-sm mb-4 flex-1 line-clamp-3">
                    {article.excerpt || article.title}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#8a8a8d] mb-4 mt-auto">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-calendar" aria-hidden="true"></i>
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
