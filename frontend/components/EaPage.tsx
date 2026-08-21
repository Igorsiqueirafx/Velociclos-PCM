'use client'

import { useState, useCallback } from 'react'

type FeatureItem = {
  title: string
  description: string
  icon: string
}

const VIDEO_URL = 'https://www.youtube.com/embed/_BaLT-9zzwU?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&fs=0&disablekb=1'

const features: FeatureItem[] = [
  {
    title: 'Instalação rápida',
    description: 'Coloque o arquivo .ex5 na pasta correta do MetaTrader e ative o E.A. em poucos passos.',
    icon: 'fa-download',
  },
  {
    title: 'Configuração segura',
    description: 'Use valores recomendados e personalize apenas o que precisa para o seu estilo de trade.',
    icon: 'fa-cogs',
  },
  {
    title: 'Suporte claro',
    description: 'Leia o manual antes de operar e siga as orientações de gestão para proteger seu capital.',
    icon: 'fa-shield-alt',
  },
]

export default function EaPage() {
  const [showVideo, setShowVideo] = useState(false)

  const openVideo = useCallback(() => setShowVideo(true), [])
  const closeVideo = useCallback(() => setShowVideo(false), [])

  return (
    <>
      <section className="relative min-h-[70vh] flex items-center bg-cover bg-top bg-no-repeat bg-[url('/bg-capa-marcelo.webp')]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/85 to-[#1e2329]/75 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[50vh]">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] leading-tight">
                Expert Advisor
                <span className="block text-[#ffd700]">Velociclos PCM</span>
              </h1>
              <p className="text-[#a0a0a0] text-lg">
                Instale, configure e use o seu sistema automatizado no MetaTrader com segurança.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/velociclos-pcm.ex5"
                  download
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#ffd700] text-[#1e2329] font-bold rounded-lg shadow-lg hover:bg-[#ffdd33] transition-all focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                  aria-label="Baixar o arquivo Velociclos PCM.ex5"
                >
                  <i className="fas fa-download mr-2" aria-hidden="true"></i>
                  Baixar Expert Advisor
                </a>
                <a
                  href="/manual"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#404857] text-[#dcdcdc] font-bold rounded-lg hover:border-[#ffd700] hover:text-[#ffd700] transition-all focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                  aria-label="Abrir manual do usuário"
                >
                  Manual do Usuário
                </a>
              </div>

              <p className="text-sm text-[#a0a0a0]">
                <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>
                Disponível apenas para Windows. Em mobile, use um desktop para baixar o arquivo .ex5.
              </p>
            </div>

            <div className="relative flex justify-center">
              <div className="relative group">
                <img
                  src="/ea-screenshot.webp"
                  alt="Expert Advisor Velociclos PCM"
                  className="w-full max-w-md rounded-lg shadow-2xl transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={openVideo}
                  aria-label="Assistir vídeo demonstrativo"
                  role="button"
                >
                  <button
                    className="w-16 h-16 bg-[#ffd700] text-[#1e2329] rounded-full flex items-center justify-center font-bold text-xl hover:bg-[#ffdd33] transition-colors focus:ring-2 focus:ring-[#ffd700]"
                    aria-label="Assistir vídeo demonstrativo"
                  >
                    <i className="fas fa-play" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#2a2e39]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((item) => (
              <div
                key={item.title}
                className="bg-[#1e2329] border border-[#404857] rounded-xl p-8 text-center transition-all hover:border-[#ffd700]"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`fas ${item.icon} text-2xl text-[#1e2329]`} aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-[#dcdcdc] mb-3">{item.title}</h3>
                <p className="text-[#a0a0a0] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={closeVideo}
          role="dialog"
          aria-modal="true"
          aria-label="Vídeo demonstrativo"
        >
          <div
            className="relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#2a2e39] text-[#a0a0a0] hover:text-[#ffd700] rounded-full flex items-center justify-center focus:ring-2 focus:ring-[#ffd700]"
              aria-label="Fechar vídeo"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
            <iframe
              width="100%"
              height="100%"
              src={VIDEO_URL}
              title="Expert Advisor Velociclos PCM - Demonstração"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}
