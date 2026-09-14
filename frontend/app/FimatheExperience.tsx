'use client'

import { useState, useEffect, useCallback } from 'react'

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

export default function FimatheExperience() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

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
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isPlaying, nextSlide])

  return (
    <section className="bg-[#161b20] py-20" aria-labelledby="experience-title">
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

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#404857] bg-[#2a2e39] touch-pan-y focus:outline-none focus:ring-2 focus:ring-[#ffd700]" role="region" aria-roledescription="carousel" aria-label="Galeria de fotos do Fimathe Experience" tabIndex={0}>
              {IMAGES.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={index === 0 ? image.alt : ''}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  draggable="false"
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
                <div className="flex items-center gap-2" role="tablist" aria-label="Selecionar foto do carrossel">
                  {IMAGES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      aria-selected={index === currentIndex}
                      aria-label={`Exibir foto ${index + 1}: ${IMAGES[index].alt}`}
                      className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-1 focus:ring-offset-black/40 ${index === currentIndex ? 'w-8 bg-[#ffd700]' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition hover:border-[#ffd700] hover:text-[#ffd700] focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                    aria-label="Foto anterior"
                    onClick={prevSlide}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left" aria-hidden="true">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition hover:border-[#ffd700] hover:text-[#ffd700] focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                    aria-label="Próxima foto"
                    onClick={nextSlide}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right" aria-hidden="true">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="button"
                aria-label={isPlaying ? 'Pausar apresentação do carrossel' : 'Retomar apresentação do carrossel'}
                aria-pressed={isPlaying}
                className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/20 transition hover:bg-black/60 hover:border-[#ffd700] hover:text-[#ffd700] focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause" aria-hidden="true">
                    <rect x="14" y="3" width="5" height="18" rx="1" />
                    <rect x="5" y="3" width="5" height="18" rx="1" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 lg:grid-cols-2 lg:content-start mt-5">
              {IMAGES.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Exibir miniatura ${index + 1}: ${image.alt}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-[#ffd700] ${index === currentIndex ? 'border-[#ffd700] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  onClick={() => goToSlide(index)}
                >
                  <img src={image.src} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}