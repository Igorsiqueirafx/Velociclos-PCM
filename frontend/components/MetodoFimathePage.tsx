'use client'

import { useState } from 'react'
import IntroVideoOverlay from '@/components/IntroVideoOverlay'

const aulas = [
  { id: 'aula-01', title: 'AULA 01 - INTRODUÇÃO AO FOREX', videoId: 'L3XbYm_WOQA' },
  { id: 'aula-02', title: 'AULA 01 - ANÁLISE NO OURO', videoId: 'tgH0fjnGOlk' },
  { id: 'aula-03', title: 'AULA 02 - ANÁLISE NO OURO PART. 2', videoId: 'zlx26zrcDOg' },
  { id: 'aula-04', title: 'AULA 03 - ANÁLISE NO OURO PART. 3', videoId: 'ynkO0RpRrVo' },
  { id: 'aula-05', title: 'AULA 04 - ANÁLISE NO OURO PART. 4', videoId: 'SaR-4Dp_0AI' },
  { id: 'aula-06', title: 'AULA 05 - ANÁLISE NO OURO PART. 5', videoId: 'rYd_oE_z7vo' },
]

export default function MetodoFimathePage() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      {showIntro && (
        <IntroVideoOverlay onComplete={() => setShowIntro(false)} />
      )}

      <section className="relative min-h-[70vh] flex items-center bg-cover bg-top bg-no-repeat bg-[url('/bg-capa-marcelo.png')]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/85 to-[#1e2329]/75 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#ffd700]/10 text-[#ffd700] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-graduation-cap" aria-hidden="true"></i>
              <span>Curso Completo</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-6 leading-tight">
              O <span className="text-[#ffd700]">Método Fimathe</span>
              <span className="block">A Nova Análise Gráfica</span>
            </h1>
            <p className="text-[#a0a0a0] text-lg mb-8">
              Assista às aulas completas do método que está transformando traders.
            </p>
            <div className="flex gap-8 flex-wrap">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#ffd700]">7</span>
                <span className="text-sm text-[#707070]">Vídeos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#ffd700]">100%</span>
                <span className="text-sm text-[#707070]">Gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1e2329]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#dcdcdc] mb-3 flex items-center justify-center gap-3">
              <i className="fas fa-book-open text-[#ffd700]" aria-hidden="true"></i>
              Playlist do Método Fimathe
            </h2>
            <p className="text-[#a0a0a0]">Assista todas as aulas diretamente no site.</p>
          </div>

          <div className="mb-12 bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#ffd700]/10 to-transparent p-6 border-b border-[#404857]">
              <div className="flex items-center gap-3 mb-2">
                <i className="fas fa-crown text-[#ffd700]" aria-hidden="true"></i>
                <span className="text-[#ffd700] font-medium">Destaque</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#dcdcdc] mb-2">
                Fimathe O Legado de Marcelo Ferreira
              </h3>
              <p className="text-[#a0a0a0] text-sm">
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
                className="bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden transition-all hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)]"
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
                  <span className="text-xs text-[#ffd700] font-medium">Aula</span>
                  <h3 className="mt-1 font-bold text-[#dcdcdc] line-clamp-2">
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
