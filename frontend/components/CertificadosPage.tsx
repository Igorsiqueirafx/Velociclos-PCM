'use client'

import { useState } from 'react'

const certificates = [
  {
    id: 'formula-ouro',
    title: 'Fórmula do Ouro',
    description: 'Certificado de conclusão do curso Fórmula do Ouro',
    image: '/certificados/Formula do Ouro.png',
  },
  {
    id: 'laboratorio-fimathe',
    title: 'Laboratório Fimathe',
    description: 'Certificado do Laboratório Fimathe',
    image: '/certificados/Laboratorio Fimathe.png',
  },
  {
    id: 'masterclass-fimathe',
    title: 'MasterClass Fimathe',
    description: 'Certificado de participação na MasterClass',
    image: '/certificados/MasterClass Fimathe.png',
  },
  {
    id: 'metodo-fimathe',
    title: 'Método Fimathe',
    description: 'Certificado de conclusão do Método Fimathe',
    image: '/certificados/Metodo Fimathe.png',
  },
  {
    id: 'scalper',
    title: 'Scalper',
    description: 'Certificado de conclusão do curso de Scalper',
    image: '/certificados/Scalper.png',
  },
]

export default function CertificadosPage() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null)

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center bg-[#1a1a2e]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/85 to-[#1e2329]/75 z-10"></div>
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
                    src={cert.image}
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
