'use client'

import { useState, useCallback } from 'react'
import IntroVideoOverlay from '@/components/IntroVideoOverlay'

type Aula = {
  id: string
  title: string
  videoId: string
}

const aulas: Aula[] = [
  { id: 'aula-01', title: 'AULA 01 - INTRODUÇÃO AO FOREX', videoId: 'L3XbYm_WOQA' },
  { id: 'aula-02', title: 'AULA 01 - ANÁLISE NO OURO', videoId: 'tgH0fjnGOlk' },
  { id: 'aula-03', title: 'AULA 02 - ANÁLISE NO OURO PART. 2', videoId: 'zlx26zrcDOg' },
  { id: 'aula-04', title: 'AULA 03 - ANÁLISE NO OURO PART. 3', videoId: 'ynkO0RpRrVo' },
  { id: 'aula-05', title: 'AULA 04 - ANÁLISE NO OURO PART. 4', videoId: 'SaR-4Dp_0AI' },
  { id: 'aula-06', title: 'AULA 05 - ANÁLISE NO OURO PART. 5', videoId: 'rYd_oE_z7vo' },
]

export default function MetodoFimathePage() {
  const [showIntro, setShowIntro] = useState(true)

  const handleIntroComplete = useCallback(() => setShowIntro(false), [])

  return (
    <>
      {showIntro && (
        <IntroVideoOverlay onComplete={handleIntroComplete} />
      )}

      <section className="relative min-h-[70vh] flex items-center bg-cover bg-top bg-no-repeat bg-[url('/bg-capa-marcelo.webp')]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/90 to-[#121212]/80 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#0071e3]/10 text-[#0071e3] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-graduation-cap" aria-hidden="true"></i>
              <span>Curso Completo</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              O <span className="text-[#0071e3]">Método Fimathe</span>
              <span className="block">A Nova Análise Gráfica</span>
            </h1>
            <p className="text-[#8a8a8d] text-lg mb-8">
              Assista às aulas completas do método que está transformando traders.
            </p>
            <div className="flex gap-8 flex-wrap">
              <div className="flex flex-col">
                <span className="text-3xl font-semibold text-[#0071e3]">7</span>
                <span className="text-sm text-[#8a8a8d]">Vídeos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-semibold text-[#0071e3]">100%</span>
                <span className="text-sm text-[#8a8a8d]">Gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-white mb-3 flex items-center justify-center gap-3">
              <i className="fas fa-book-open text-[#0071e3]" aria-hidden="true"></i>
              Playlist do Método Fimathe
            </h2>
            <p className="text-[#8a8a8d]">Assista todas as aulas diretamente no site.</p>
          </div>

          <div className="mb-12 bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0071e3]/10 to-transparent p-6 border-b border-[#3a3a3c]">
              <div className="flex items-center gap-3 mb-2">
                <i className="fas fa-crown text-[#0071e3]" aria-hidden="true"></i>
                <span className="text-[#0071e3] font-medium">Destaque</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                Fimathe O Legado de Marcelo Ferreira
              </h3>
              <p className="text-[#8a8a8d] text-sm">
                A história e o impacto do método que mudou a forma de operar no mercado financeiro.
              </p>
            </div>
            <div className="aspect-video">
              <iframe
                src="https://www.youtube-nocookie.com/embed/HM0cOcrXwaM"
                title="Fimathe O Legado de Marcelo Ferreira"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aulas.map((aula) => (
              <div
                key={aula.id}
                className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl overflow-hidden transition-all hover:border-[#0071e3] hover:shadow-md hover:shadow-black/20"
              >
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${aula.videoId}`}
                    title={aula.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs text-[#0071e3] font-medium">Aula</span>
                  <h3 className="mt-1 font-semibold text-white line-clamp-2">
                    {aula.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}