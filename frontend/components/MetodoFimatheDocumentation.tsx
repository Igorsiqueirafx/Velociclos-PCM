'use client'

import { useState, useEffect } from 'react'
import { sections } from '@/lib/fimathe-docs'
import { sectionRenderers } from './MetodoFimatheDocumentationRenderers'

export default function MetodoFimatheDocumentation() {
  const [activeSection, setActiveSection] = useState('historia')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0071e3] rounded-full filter blur-[150px] opacity-[0.04]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-full mb-6">
              <i className="fas fa-book text-[#0071e3]" />
              <span className="text-[#0071e3] text-sm font-medium">Documentação Técnica</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Método <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071e3] to-[#6567f1]">Fimathe</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#8a8a8d] max-w-2xl mx-auto leading-relaxed">
              Análise técnica completa e aprofundada do Price Channel Method (PCM): fundamentos matemáticos, regras operacionais, gestão de risco e aplicação prática nos mercados financeiros.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="sticky top-24 glass-card rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 text-sm">Navegação</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-[#0071e3] text-white'
                          : 'text-[#8a8a8d] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="lg:col-span-3 space-y-12">
              {sections.map((section, index) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="glass-card rounded-xl p-6 sm:p-8 scroll-mt-24 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">{section.title}</h2>
                  {sectionRenderers[section.id]?.(section)}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
