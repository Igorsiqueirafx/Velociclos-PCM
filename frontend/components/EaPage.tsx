'use client'

import { useState, useCallback, useEffect } from 'react'
import ResponsiveVideoEmbed from '@/components/ResponsiveVideoEmbed'
import AppleCard from '@/components/AppleCard'
import AppleButton from '@/components/AppleButton'

type FeatureItem = {
  title: string
  description: string
  icon: string
}

const VIDEO_ID = '_BaLT-9zzwU'

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

  useEffect(() => {
    if (showVideo) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showVideo])

  return (
    <>
      <section className="relative min-h-[70vh] flex items-center bg-cover bg-top bg-no-repeat bg-[url('/bg-capa-marcelo.webp')]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/90 to-[#121212]/80 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[50vh]">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight tracking-tight">
                Expert Advisor
                <span className="block text-[#0071e3]">Velociclos PCM</span>
              </h1>
              <p className="text-[#8a8a8d] text-lg">
                Instale, configure e use o seu sistema automatizado no MetaTrader com segurança.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <AppleButton href="/velociclos-pcm.ex5" icon={<i className="fas fa-download" aria-hidden="true" />}>
                  Baixar Expert Advisor
                </AppleButton>
                <AppleButton href="/manual" variant="secondary">
                  Manual do Usuário
                </AppleButton>
              </div>

              <p className="text-sm text-[#8a8a8d]">
                <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>
                Disponível apenas para Windows. Em mobile, use um desktop para baixar o arquivo .ex5.
              </p>
            </div>

            <div className="relative flex justify-center">
              <div className="relative group">
                <img
                  src="/ea-screenshot.webp"
                  alt="Expert Advisor Velociclos PCM"
                  className="w-full max-w-md rounded-2xl shadow-lg transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={openVideo}
                  aria-label="Assistir vídeo demonstrativo"
                  role="button"
                >
                  <button
                    className="w-16 h-16 bg-[#0071e3] text-white rounded-full flex items-center justify-center font-semibold text-xl hover:bg-[#005fd9] transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-[#0071e3]"
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

      <section className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((item) => (
              <AppleCard key={item.title} className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0071e3] to-[#6567f1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`fas ${item.icon} text-2xl text-white`} aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-[#8a8a8d] text-sm">{item.description}</p>
              </AppleCard>
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
            className="relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#1e1e1e] text-[#8a8a8d] hover:text-white rounded-full flex items-center justify-center transition-colors duration-200 focus:ring-2 focus:ring-[#0071e3]"
              aria-label="Fechar vídeo"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
            <ResponsiveVideoEmbed
              videoId={VIDEO_ID}
              title="Vídeo demonstrativo Velociclos PCM"
              params={{ showinfo: '0', iv_load_policy: '3', disablekb: '0', fs: '1' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
