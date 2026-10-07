'use client'

import AppleButton from '@/components/AppleButton'
import { logEvent } from '@/lib/logging'
import { useEffect, useRef, useState } from 'react'

export default function HomeHero() {
  const [backgroundMotionAllowed, setBackgroundMotionAllowed] = useState(false)
  const backgroundVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const updateMotionPreference = () => setBackgroundMotionAllowed(motionPreference.matches)

    updateMotionPreference()
    motionPreference.addEventListener('change', updateMotionPreference)
    return () => motionPreference.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const video = backgroundVideoRef.current
    if (!video) return
    if (!backgroundMotionAllowed) {
      video.pause()
      return
    }

    video.play().catch((error: unknown) => {
      if (error instanceof DOMException && ['AbortError', 'NotAllowedError'].includes(error.name)) return
      logEvent('home_hero_video_play_failed', 'error', 'Background video could not play', {
        errorName: error instanceof Error ? error.name : 'UnknownError',
        errorMessage: error instanceof Error ? error.message : String(error),
      })
    })
  }, [backgroundMotionAllowed])

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/bg-capa-marcelo.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <video
          ref={backgroundVideoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          aria-hidden="true"
          tabIndex={-1}
          autoPlay={backgroundMotionAllowed}
          muted
          loop
          playsInline
          preload={backgroundMotionAllowed ? 'metadata' : 'none'}
          poster="/bg-capa-marcelo.png"
        >
          <source src="/bg-metodo-fimathe.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#000000]/90 to-[#121212]/80" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[60vh]">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tighter">
              Opere o
              <span className="text-[#0071e3]">Mercado</span>
              <span className="block">24/7 com Velociclos PCM</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#b0b0b0] max-w-2xl leading-relaxed">
              Descubra o poder do trading automatizado com inteligência artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-[#0071e3]">Forex</span>
                <span className="text-sm text-[#8a8a8d] max-w-[140px]">Mercado cambial global</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-[#0071e3]">Ouro</span>
                <span className="text-sm text-[#8a8a8d] max-w-[140px]">Operações com XAU/USD</span>
              </div>
            </div>
            <div className="flex gap-6">
              <AppleButton href="/cursos" size="lg" aria-label="Ver cursos">
                Cursos
              </AppleButton>
              <AppleButton href="/ea" variant="primary" size="lg" aria-label="Conhecer o Expert Advisor Velociclos PCM">
                Saiba sobre o E.A.
              </AppleButton>
            </div>
          </div>

          <div className="relative flex justify-center" aria-hidden="true">
            <div className="relative">
              <img
                src="/background marcelos.png"
                alt="Marcelo analisando gráficos"
                className="w-80 h-80 sm:w-96 sm:h-96 rounded-lg object-cover border border-[#3a3a3c] shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
