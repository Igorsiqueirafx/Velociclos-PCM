'use client'

import { useEffect, useRef, useState } from 'react'

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
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const certificates = initialCertificates.map((cert) => ({
    id: cert.id,
    title: cert.title,
    description: cert.description || '',
    image: cert.image_url,
  }))

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (rect.height + viewportHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prefersReducedMotion])

  return (
    <>
      <style jsx>{`
        .hero-section {
          perspective: 1400px;
          perspective-origin: center center;
        }
        
        .image-3d-wrapper {
          perspective: 1400px;
          transform-style: preserve-3d;
          will-change: transform;
        }
        
        .image-layer {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform, opacity;
        }
        
        .glow-layer {
          position: absolute;
          inset: -30%;
          background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.12) 0%, transparent 60%);
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
        }
        
        .particle-layer {
          position: absolute;
          inset: -20%;
          background-image: 
            radial-gradient(2px 2px at 15% 25%, rgba(255,215,0,0.35), transparent),
            radial-gradient(1px 1px at 70% 65%, rgba(255,215,0,0.25), transparent),
            radial-gradient(1.5px 1.5px at 85% 15%, rgba(255,215,0,0.2), transparent),
            radial-gradient(1px 1px at 35% 85%, rgba(255,215,0,0.2), transparent);
          background-repeat: no-repeat;
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
        }
        
        .reveal-mask {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,15,25,1) 0%, transparent 40%, transparent 100%);
          pointer-events: none;
          will-change: opacity;
        }
        
        .bio-text {
          opacity: 0;
          transform: translateY(20px);
          will-change: opacity, transform;
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .image-core {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .image-layer, .glow-layer, .particle-layer, .reveal-mask, .bio-text {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

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

      {/* 3D Scroll Reveal - Natural Image Emergence */}
      <section 
        ref={containerRef}
        className="relative py-28 bg-transparent hero-section"
        style={{ 
          '--scroll-progress': scrollProgress,
          perspective: '1400px',
          perspectiveOrigin: 'center center'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10">
            <div className="mx-auto max-w-2xl sm:max-w-3xl xl:max-w-4xl">
              {/* Depth layer 1: Distant atmospheric particles */}
              <div className="particle-layer image-layer" style={{
                transform: `translateZ(-120px) scale(1.2) translateY(${scrollProgress * -100}px) rotateX(${scrollProgress * -6}deg)`,
                opacity: Math.min(scrollProgress * 1.8, 0.35),
                transition: 'transform 0.1s linear, opacity 0.4s ease-out'
              }} aria-hidden="true" />
              
              {/* Depth layer 2: Soft ambient glow behind */}
              <div className="glow-layer image-layer" style={{
                transform: `translateZ(-60px) scale(1.1) translateY(${scrollProgress * -50}px)`,
                opacity: Math.min(scrollProgress * 1.5, 0.25),
                transition: 'transform 0.1s linear, opacity 0.3s ease-out'
              }} aria-hidden="true" />
              
              {/* Main image - floating naturally in 3D space */}
              <div className="relative image-layer" style={{
                transform: `translateZ(0) translateY(${scrollProgress * -15}px) rotateX(${scrollProgress * -1.5}deg)`,
                opacity: scrollProgress,
                filter: `blur(${Math.max(0, (1 - scrollProgress) * 4)}px)`,
                transition: 'transform 0.1s linear, opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease-out'
              }}>
                <div className="image-core" style={{ 
                  transformStyle: 'preserve-3d',
                  filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.5)) drop-shadow(0 0 60px rgba(255,215,0,0.08))'
                }}>
                  <img
                    src="/IMG_0975_Igor.jpg"
                    alt="Igor Siqueira - Fundador do Velociclos PCM"
                    className="relative w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-square object-cover transition-all duration-1000 ease-out"
                    loading="eager"
                    style={{ 
                      filter: 'grayscale(25%) contrast(1.1) saturate(0.92)',
                      transform: `translateZ(30px)`,
                      transformStyle: 'preserve-3d',
                      borderRadius: '1.5rem'
                    }}
                  />
                </div>
                
                {/* Subtle vignette overlay for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(15,15,25,0.35)_100%)] pointer-events-none rounded-[1.5rem]" aria-hidden="true" />
                
                {/* Top catch light */}
                <div className="absolute top-0 left-0 right-0 h-2/5 bg-gradient-to-b from-[#ffd700]/08 via-transparent to-transparent pointer-events-none rounded-t-[1.5rem] opacity-0 transition-opacity duration-700" aria-hidden="true" />
                
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-[#0f0f19]/70 via-transparent to-transparent pointer-events-none rounded-b-[1.5rem]" aria-hidden="true" />
              </div>
              
              {/* Foreground depth layer: soft reveal mask */}
              <div className="reveal-mask image-layer" style={{
                transform: `translateZ(40px) translateY(${scrollProgress * 25}px)`,
                opacity: Math.max(0, 1 - scrollProgress * 1.2),
                transition: 'transform 0.1s linear, opacity 0.5s ease-out'
              }} aria-hidden="true" />
              
              {/* Foreground atmospheric particles */}
              <div className="particle-layer image-layer" style={{
                transform: `translateZ(80px) scale(0.95) translateY(${scrollProgress * 50}px) rotateX(${scrollProgress * 2.5}deg)`,
                opacity: Math.min(scrollProgress * 1, 0.25),
                transition: 'transform 0.1s linear, opacity 0.3s ease-out'
              }} aria-hidden="true" />
            </div>

            {/* Bio text - fades in after image */}
            <div className="mt-10 bio-text" style={{
              opacity: Math.max(0, (scrollProgress - 0.25) * 2.5),
              transform: `translateY(${Math.max(0, 20 - scrollProgress * 50)}px)`,
              transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <p className="text-[#a0a0a0] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-center">
                Fundador do <span className="text-[#ffd700] font-medium">Velohub</span> e criador do
                <span className="text-[#ffd700] font-medium">Velociclos PCM</span>. A fimathe é arte!
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