'use client'

import { useState, useCallback } from 'react'
import AppleCard from '@/components/AppleCard'

type Certificate = {
  id: string
  title: string
  description: string
  image: string
}

const certificates: Certificate[] = [
  {
    id: 'formula-ouro',
    title: 'Fórmula do Ouro',
    description: 'Certificado de conclusão do curso Fórmula do Ouro',
    image: '/certificados/Formula do Ouro.webp',
  },
  {
    id: 'laboratorio-fimathe',
    title: 'Laboratório Fimathe',
    description: 'Certificado do Laboratório Fimathe',
    image: '/certificados/Laboratorio Fimathe.webp',
  },
  {
    id: 'masterclass-fimathe',
    title: 'MasterClass Fimathe',
    description: 'Certificado de participação na MasterClass',
    image: '/certificados/MasterClass Fimathe.webp',
  },
  {
    id: 'metodo-fimathe',
    title: 'Método Fimathe',
    description: 'Certificado de conclusão do Método Fimathe',
    image: '/certificados/Metodo Fimathe.webp',
  },
  {
    id: 'scalper',
    title: 'Scalper',
    description: 'Certificado de conclusão do curso de Scalper',
    image: '/certificados/Scalper.webp',
  },
]

const FALLBACK_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWUyMzI5Ii8+PHRleHQgeD0iNTAiIHk9IjUwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYTBhMGEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM5OCI+SW1hZ2VtIG7vPhQ4PC90ZXh0Pjwvc3ZnPg=='

export default function CertificadosPage() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null)

  const openCert = useCallback((image: string) => setSelectedCert(image), [])
  const closeCert = useCallback(() => setSelectedCert(null), [])

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center bg-[#0a0a12]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/90 to-[#121212]/80 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#0071e3]/10 text-[#0071e3] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-award" aria-hidden="true"></i>
              <span>Conquistas</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-6 flex items-center gap-3">
              <i className="fas fa-award text-[#0071e3]" aria-hidden="true"></i>
              <span>Certificados</span>
            </h1>
            <p className="text-[#8a8a8d] text-lg">
              Conquistas do Igor Siqueira durante sua trajetória no Grupo Fimathe.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {certificates.map((cert) => (
              <AppleCard key={cert.id} hover className="h-full">
                <button
                  onClick={() => openCert(cert.image)}
                  className="w-full text-left focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 focus:ring-offset-[#121212] rounded-2xl"
                  aria-label={`Abrir certificado ${cert.title}`}
                >
                  <div className="aspect-square overflow-hidden rounded-t-2xl">
                    <img
                      src={cert.image}
                      alt={`Certificado ${cert.title}`}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = FALLBACK_IMAGE
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#0071e3] transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-[#8a8a8d] mt-1 line-clamp-2">
                      {cert.description}
                    </p>
                  </div>
                </button>
              </AppleCard>
            ))}
          </div>
        </div>
      </section>

      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={closeCert}
          role="dialog"
          aria-modal="true"
          aria-label="Visualizador de certificado"
        >
          <div
            className="relative max-w-4xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeCert}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#1e1e1e] text-[#8a8a8d] hover:text-white rounded-full flex items-center justify-center transition-colors duration-200 focus:ring-2 focus:ring-[#0071e3]"
              aria-label="Fechar certificado"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
            <img
              src={selectedCert}
              alt="Certificado ampliado"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}
