'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/glassify/glass-card'
import { GlassModal } from '@/components/glassify/glass-modal'
import CertificateHero from './CertificateHero'

interface Certificate {
  id: string
  title: string
  description: string
  image: string | null
}

interface CertificadosClientProps {
  initialCertificates: Certificate[]
}

export default function CertificadosClient({ initialCertificates }: CertificadosClientProps) {
  const [selectedCert, setSelectedCert] = useState<string | null>(null)

  return (
    <>
      <section className="relative min-h-[70vh] flex items-center bg-cover bg-center bg-no-repeat bg-[url('/FimatheProp_QuemSomos.webp')]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/90 to-[#1e2329]/80 z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#ffd700]/10 text-[#ffd700] px-4 py-2 rounded-full text-sm font-medium mb-6" aria-label="Categoria">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Conquistas</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Certificados</span>
            </h1>
            <p className="text-[#a0a0a0] text-lg">
              Conquistas do Igor Siqueira durante sua trajetória no Grupo Fimathe.
            </p>
          </div>
          
          {/* Igor image feature */}
          <div className="mt-10 hidden lg:block">
            <div className="relative max-w-md mx-auto">
              <img
                src="/IMG_0975_new.jpg"
                alt="Igor Siqueira - Fundador do Velociclos PCM"
                className="w-full aspect-[3/4] object-cover rounded-2xl border border-[#404857] shadow-[0_25px_50px_rgba(0,0,0,0.5)] hover:border-[#ffd700]/50 transition-colors duration-300"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#ffd700] text-[#0f0f19] px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                Fundador
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1e2329]" aria-labelledby="certificates-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="certificates-heading" className="sr-only">Certificados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {initialCertificates.map((cert) => (
              <GlassCard
                key={cert.id}
                glass="frosted"
                className="group overflow-hidden transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] cursor-pointer"
                onClick={() => setSelectedCert(cert.image)}
              >
                <div className="aspect-square overflow-hidden relative">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={`Certificado ${cert.title}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1e2329]">
                      <svg className="w-12 h-12 text-[#404857]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#dcdcdc] group-hover:text-[#ffd700] transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-[#a0a0a0] mt-1 line-clamp-2">
                    {cert.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <CertificateHero />

      <GlassModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        glass="liquid"
        title="Certificado"
        className="max-w-4xl max-h-[90vh] mx-4"
      >
        {selectedCert && (
          <img
            src={selectedCert}
            alt="Certificado ampliado"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        )}
      </GlassModal>
    </>
  )
}