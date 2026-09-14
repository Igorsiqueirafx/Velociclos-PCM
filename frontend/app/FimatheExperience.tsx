'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const IMAGES = [
  { src: '/carrossel/1.webp', alt: 'Encontro presencial de alunos do Método Fimathe Experience' },
  { src: '/carrossel/3.webp', alt: 'Comunidade reunida em evento de trading com Marcelo Ferreira' },
  { src: '/carrossel/4.webp', alt: 'Sala de aula do curso Fimathe com alunos praticando análise gráfica' },
  { src: '/carrossel/5.webp', alt: 'Workshop ao vivo do Método Fimathe com explicação de operações' },
  { src: '/carrossel/6.webp', alt: 'Grupo de alunos certificados do Método Fimathe' },
  { src: '/carrossel/7.webp', alt: 'Painel de mercado Forex sendo analisado durante evento Fimathe' },
  { src: '/carrossel/8.webp', alt: 'Networking entre alunos da comunidade Velociclos PCM' },
  { src: '/carrossel/10.webp', alt: 'Mentoria em grupo com discussão de estratégias de scalper' },
  { src: '/carrossel/13.webp', alt: 'Encontro de encerramento do Fimathe Experience com a turma' },
  { src: '/carrossel/15.webp', alt: 'Alunos operando ao vivo com o Expert Advisor Velociclos PCM' },
  { src: '/carrossel/Imagem-Evento-2.webp', alt: 'Cobertura fotográfica do Evento Fimathe Experience' },
]

const AUTO_PLAY_DELAY = 6000
const TRANSITION_DURATION = 500

export default function FimatheExperience() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoPlayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  useEffect(() => {
    if (!isPlaying) return
    
    const startTime = Date.now()
    const duration = AUTO_PLAY_DELAY
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      setProgress(Math.min((elapsed / duration) * 100, 100))
    }, 50)

    autoPlayIntervalRef.current = setInterval(() => {
      nextSlide()
    }, AUTO_PLAY_DELAY)

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current)
    }
  }, [isPlaying, nextSlide])

  useEffect(() => {
    setProgress(0)
  }, [currentIndex])

  useEffect(() => {
    const handleMouseEnter = () => setIsPlaying(false)
    const handleMouseLeave = () => setIsPlaying(true)
    
    const container = document.querySelector('[data-carousel-container]')
    container?.addEventListener('mouseenter', handleMouseEnter)
    container?.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      container?.removeEventListener('mouseenter', handleMouseEnter)
      container?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, isPlaying])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchX = e.touches[0].clientX
    const diff = touchStart - touchX
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide()
      else prevSlide()
      setTouchStart(null)
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  return (
    <section className="bg-[#161b20] py-20" aria-labelledby="experience-title" data-carousel-container>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#ffd700]">Fimathe Experience</p>
            <h2 id="experience-title" className="text-3xl font-bold text-[#f3f4f6] sm:text-4xl">Aprendizado que acontece junto</h2>
            <p className="mt-4 text-base leading-7 text-[#a0a0a0]">Um pouco da comunidade, dos encontros e da experiência por trás do Método Fimathe.</p>
          </div>
          <div className="text-sm text-[#a0a0a0]" aria-live="polite">
            <span className="font-semibold text-[#f3f4f6]">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="mx-2 text-[#404857]">/</span>
            <span>{IMAGES.length}</span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)]">
          <div className="relative">
            <div 
              className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#404857] bg-[#2a2e39] touch-pan-y focus:outline-none focus:ring-2 focus:ring-[#ffd700]" 
              role="region" 
              aria-roledescription="carousel" 
              aria-label="Galeria de fotos do Fimathe Experience" 
              tabIndex={0}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="absolute top-0 left-0 h-1 bg-[#404857] z-10 transition-all duration-500" style={{ width: `${progress}%` }}>
                <div className="h-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e] transform origin-left transition-transform duration-500 ease-linear" style={{ transform: `scaleX(${progress / 100})` }} />
              </div>

              <div className="relative h-full w-full">
                {IMAGES.map((image, index) => (
                  <div
                    key={image.src}
                    className={`absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-[${TRANSITION_DURATION}ms] ease-in-out ${
                      index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} de ${IMAGES.length}`}
                    aria-hidden={index !== currentIndex}
                  >
                    <img
                      src={image.src}
                      alt={index === currentIndex ? image.alt : ''}
                      className="h-full w-full object-cover"
                      loading={index === currentIndex || index === (currentIndex + 1) % IMAGES.length ? 'eager' : 'lazy'}
                      draggable="false"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex h-12 w-12 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:border-[#ffd700] hover:bg-black/70 hover:text-[#ffd700] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-black/50"
                  aria-label="Foto anterior"
                  onClick={prevSlide}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex h-12 w-12 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:border-[#ffd700] hover:bg-black/70 hover:text-[#ffd700] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-black/50"
                  aria-label="Próxima foto"
                  onClick={nextSlide}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 p-4 pb-6">
                  <div className="flex items-center gap-2" role="tablist" aria-label="Selecionar foto do carrossel">
                    {IMAGES.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        role="tab"
                        aria-selected={index === currentIndex}
                        aria-label={`Ir para foto ${index + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-black/50 ${index === currentIndex ? 'w-10 bg-[#ffd700]' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    aria-label={isPlaying ? 'Pausar carrossel' : 'Retomar carrossel'}
                    aria-pressed={isPlaying}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:border-[#ffd700] hover:bg-black/70 hover:text-[#ffd700] focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="14" y="3" width="5" height="18" rx="1" />
                        <rect x="5" y="3" width="5" height="18" rx="1" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden">
              <div className="flex gap-2 overflow-x-auto scroll-snap-x pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {IMAGES.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    aria-label={`Ver miniatura ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : 'false'}
                    className={`flex-shrink-0 aspect-[4/3] w-32 sm:w-40 overflow-hidden rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffd700] ${index === currentIndex ? 'border-[#ffd700] opacity-100 ring-2 ring-[#ffd700]/50' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    onClick={() => goToSlide(index)}
                    scroll-snap-align="center"
                  >
                    <img src={image.src} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}