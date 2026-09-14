'use client'

import { useState, useEffect, useRef } from 'react'

interface Certificate {
  id: string
  title: string
  description: string | null
  image_url: string | null
}

interface CertificadosClientProps {
  initialCertificates: Certificate[]
}

export default function CertificadosClient({ initialCertificates }: CertificadosClientProps) {
  const [selectedCert, setSelectedCert] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)

  const certificates = initialCertificates.map((cert) => ({
    id: cert.id,
    title: cert.title,
    description: cert.description || '',
    image: cert.image_url,
  }))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )
    if (imageRef.current) observer.observe(imageRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return
      const rect = imageRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrolled = (windowHeight - rect.top) / (rect.height + windowHeight)
        setParallaxOffset(scrolled * 30)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <section className="relative min-h-[70vh] flex items-center bg-cover bg-center bg-no-repeat bg-[url('/FimatheProp_QuemSomos.webp')]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/90 to-[#1e2329]/80 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#ffd700]/10 text-[#ffd700] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-award" aria-hidden="true"></i>
              <span>Conquistas</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-6 flex items-center gap-3">
              <i className="fas fa-award text-[#ffd700]" aria-hidden="true"></i>
              <span>Certificados</span>
            </h1>
            <p className="text-[#a0a0a0] text-lg">
              Conquistas do Igor Siqueira durante sua trajetória no Grupo Fimathe.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1e2329]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {certificates.map((cert) => (
              <button
                key={cert.id}
                onClick={() => setSelectedCert(cert.image)}
                className="group bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] text-left focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cert.image || '/placeholder-certificate.jpg'}
                    alt={`Certificado ${cert.title}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWUyMzI5Ii8+PHRleHQgeD0iNTAiIHk9IjUwIiBmb250LWZhbWlseT0ibW9ub3NwYWVjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2EwaGEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzk4Ij5JbWFnZW0gbm/PhQ4PC90ZXh0Pjwvc3ZnPg=='
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#dcdcdc] group-hover:text-[#ffd700] transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-[#a0a0a0] mt-1 line-clamp-2">
                    {cert.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-transparent" ref={imageRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10" style={{ transform: `translateY(${parallaxOffset}px)` }}>
            <div className="mx-auto max-w-3xl sm:max-w-4xl">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#ffd700]/20 via-transparent to-[#ffd700]/20 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
                <div className="absolute -inset-2 border-2 border-[#ffd700]/30 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#1e2329] via-[#2a2e39] to-[#1e2329] border border-[#ffd700]/20 group-hover:border-[#ffd700]/50 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f19]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                  <img
                    src="/IMG_0975_Igor.jpg"
                    alt="Igor Siqueira - Fundador do Velociclos PCM"
                    className={`relative w-full aspect-[3/4] sm:aspect-square object-cover transition-all duration-700 ease-out ${
                      isVisible
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 translate-y-8'
                    }`}
                    loading="eager"
                    style={{ filter: 'grayscale(15%) contrast(1.05)' }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(15,15,25,0.4)_100%)] pointer-events-none" aria-hidden="true" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none" aria-hidden="true">
                  <div className="flex items-center gap-3 bg-[#0f0f19]/80 backdrop-blur-sm border border-[#ffd700]/30 rounded-full px-5 py-3">
                    <div className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" aria-hidden="true" />
                    <span className="text-sm font-medium text-[#ffd700] tracking-wide">Fundador & CEO</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0f0f19]/80 backdrop-blur-sm border border-[#ffd700]/30 rounded-full px-5 py-3">
                    <i className="fas fa-award text-[#ffd700]" aria-hidden="true" />
                    <span className="text-sm font-medium text-[#dcdcdc]">Velociclos PCM</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-[#a0a0a0] text-base max-w-2xl mx-auto leading-relaxed">
                Fundador do <span className="text-[#ffd700] font-medium">Velociclos PCM</span> e criador do
                <span className="text-[#ffd700] font-medium">Método Fimathe</span>. Mais de uma década de experiência
                em mercados financeiros, transformando traders em profissionais consistentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Visualizador de certificado"
        >
          <div
            className="relative max-w-4xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#2a2e39] text-[#a0a0a0] hover:text-[#ffd700] rounded-full flex items-center justify-center focus:ring-2 focus:ring-[#ffd700]"
              aria-label="Fechar certificado"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
            <img
              src={selectedCert}
              alt="Certificado ampliado"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}