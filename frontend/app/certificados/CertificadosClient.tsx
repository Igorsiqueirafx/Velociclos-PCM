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
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const certificates = initialCertificates.map((cert) => ({
    id: cert.id,
    title: cert.title,
    description: cert.description || '',
    image: cert.image_url,
  }))

  // Scroll-driven animation using native CSS where supported
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Calculate progress: 0 when top at bottom of viewport, 1 when bottom at top
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (rect.height + viewportHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prefersReducedMotion])

  return (
    <>
      <style jsx>{`
        .hero-section {
          perspective: 1200px;
          perspective-origin: center center;
        }
        
        .image-3d-wrapper {
          perspective: 1200px;
          transform-style: preserve-3d;
          will-change: transform;
        }
        
        .image-layer {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform, opacity, clip-path;
        }
        
        .image-core {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        
        .glow-layer {
          position: absolute;
          inset: -20%;
          background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
        }
        
        .particle-layer {
          position: absolute;
          inset: -10%;
          background-image: 
            radial-gradient(2px 2px at 20% 30%, rgba(255,215,0,0.4), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(255,215,0,0.3), transparent),
            radial-gradient(1.5px 1.5px at 80% 20%, rgba(255,215,0,0.2), transparent),
            radial-gradient(1px 1px at 40% 80%, rgba(255,215,0,0.25), transparent);
          background-repeat: no-repeat;
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
        }
        
        .reveal-mask {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,15,25,1) 0%, transparent 50%, transparent 100%);
          pointer-events: none;
          will-change: opacity;
        }
        
        .bio-text {
          opacity: 0;
          transform: translateY(30px);
          will-change: opacity, transform;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
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

      {/* 3D Scroll Reveal Section */}
      <section 
        ref={containerRef}
        className="relative py-32 bg-transparent hero-section"
        style={{ 
          '--scroll-progress': scrollProgress,
          perspective: '1200px',
          perspectiveOrigin: 'center center'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10">
            <div className="mx-auto max-w-3xl sm:max-w-4xl" ref={imageWrapperRef}>
              {/* Depth layer 1: Far background particles */}
              <div className="particle-layer image-layer" style={{
                transform: `translateZ(-100px) scale(1.15) translateY(${scrollProgress * -80}px) rotateX(${scrollProgress * -5}deg)`,
                opacity: Math.min(scrollProgress * 1.5, 0.4),
                transition: 'transform 0.1s linear, opacity 0.3s ease-out'
              }} aria-hidden="true" />
              
              {/* Depth layer 2: Ambient glow */}
              <div className="glow-layer image-layer" style={{
                transform: `translateZ(-50px) scale(1.08) translateY(${scrollProgress * -40}px)`,
                opacity: Math.min(scrollProgress * 1.2, 0.3),
                transition: 'transform 0.1s linear, opacity 0.3s ease-out'
              }} aria-hidden="true" />
              
              {/* Main image layer with 3D transform */}
              <div className="relative image-layer" style={{
                transform: `translateZ(0) translateY(${scrollProgress * -20}px) rotateX(${scrollProgress * -2}deg)`,
                opacity: scrollProgress,
                transition: 'transform 0.1s linear, opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <div className="relative group rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#1e2329] via-[#2a2e39] to-[#1e2329] border border-[#ffd700]/20 group-hover:border-[#ffd700]/40 transition-all duration-700">
                  {/* Vignette overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(15,15,25,0.5)_100%)] pointer-events-none" aria-hidden="true" />
                  
                  {/* Subtle top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#ffd700]/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
                  
                  {/* Main image with 3D perspective */}
                  <div className="image-core" style={{ 
                    transform: `perspective(1000px) rotateX(0deg)`,
                    transformStyle: 'preserve-3d'
                  }}>
                    <img
                      src="/IMG_0975_Igor.jpg"
                      alt="Igor Siqueira - Fundador do Velociclos PCM"
                      className="relative w-full aspect-[3/4] sm:aspect-square object-cover transition-all duration-1000 ease-out"
                      loading="eager"
                      style={{ 
                        filter: 'grayscale(20%) contrast(1.08) saturate(0.95)',
                        transform: `translateZ(20px)`,
                        transformStyle: 'preserve-3d'
                      }}
                    />
                  </div>
                  
                  {/* Subtle bottom vignette */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0f0f19]/80 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 border-2 border-transparent rounded-[2rem] transition-all duration-700 group-hover:border-[#ffd700]/30 pointer-events-none" aria-hidden="true" />
                  
                  {/* Corner accents */}
                  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#ffd700]/40 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#ffd700]/40 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#ffd700]/40 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#ffd700]/40 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300" />
                  </div>
                </div>
              </div>
              
              {/* Foreground depth layer: subtle overlay */}
              <div className="reveal-mask image-layer" style={{
                transform: `translateZ(50px) translateY(${scrollProgress * 30}px)`,
                opacity: Math.max(0, 1 - scrollProgress * 1.5),
                transition: 'transform 0.1s linear, opacity 0.4s ease-out'
              }} aria-hidden="true" />
              
              {/* Depth layer 4: Foreground particles */}
              <div className="particle-layer image-layer" style={{
                transform: `translateZ(100px) scale(0.9) translateY(${scrollProgress * 60}px) rotateX(${scrollProgress * 3}deg)`,
                opacity: Math.min(scrollProgress * 0.8, 0.3),
                transition: 'transform 0.1s linear, opacity 0.3s ease-out'
              }} aria-hidden="true" />
            </div>

            {/* Bio text with staggered reveal */}
            <div className="mt-12 bio-text" style={{
              opacity: Math.max(0, (scrollProgress - 0.3) * 2),
              transform: `translateY(${Math.max(0, 30 - scrollProgress * 60)}px)`,
              transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <p className="text-[#a0a0a0] text-base max-w-2xl mx-auto leading-relaxed text-center">
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