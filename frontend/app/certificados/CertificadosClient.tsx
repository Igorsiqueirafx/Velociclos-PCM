'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import AppleCard from '@/components/AppleCard'
import CertificateHero from './CertificateHero'
import { GlassModal } from '@/components/glassify/glass-modal'

interface Certificate {
  id: string
  title: string
  description: string
  image: string | null
}

interface CertificadosClientProps {
  initialCertificates: Certificate[]
}

const descriptions: Record<string, string> = {
  'Laboratório Fimathe': 'Laboratório prático da técnica Fimathe, com aplicação direta nos gráficos e validação de setups no mercado real.',
  'Método Fimathe': 'Formação completa no método criado por Marcelo Ferreira, com mais de 23 anos de mercado e referência em análise gráfica para traders de língua portuguesa.',
  'Scalper': 'Curso focado em operações rápidas no Forex, aplicando a Fimathe em gráficos de 1 e 5 minutos com gestão de risco e disciplina.',
  'MasterClass Fimathe': 'Treinamento intensivo com conteúdo avançado e aplicação prática da metodologia Fimathe para quem busca consistência.',
  'Fórmula do Ouro': 'Curso dedicado ao ativo XAUUSD, unindo a técnica Fimathe às particularidades do mercado de ouro.',
}

type FilterType = 'all' | 'fimathe' | 'specialized'

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Fimathe', value: 'fimathe' },
  { label: 'Especializados', value: 'specialized' },
]

export default function CertificadosClient({ initialCertificates }: CertificadosClientProps) {
  const [selectedCert, setSelectedCert] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')

  const certificates = useMemo(() => {
    const seen = new Set<string>()
    return initialCertificates
      .map((cert) => ({
        ...cert,
        description: descriptions[cert.title] || cert.description,
      }))
      .filter((cert) => {
        if (seen.has(cert.title)) return false
        seen.add(cert.title)
        return true
      })
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [initialCertificates])

  const filteredCertificates = useMemo(() => {
    if (filter === 'all') return certificates
    return certificates.filter((cert) => {
      const title = cert.title.toLowerCase()
      if (filter === 'fimathe') return title.includes('fimathe') || title.includes('laboratório') || title.includes('masterclass') || title.includes('método')
      if (filter === 'specialized') return title.includes('fórmula') || title.includes('scalper') || title.includes('ouro')
      return true
    })
  }, [certificates, filter])

  return (
    <>
      <CertificatesHero />
      <CertificatesSection
        certificates={filteredCertificates}
        filter={filter}
        onFilterChange={setFilter}
        onSelectCert={setSelectedCert}
      />
      <FounderSection />
      <CertificateHero />
      <CertificateModal
        selectedCert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </>
  )
}

function CertificatesHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center bg-[#0a0a12]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/90 to-[#121212]/80 z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#0071e3]/10 text-[#0071e3] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Autoridade & Credibilidade</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4 tracking-tight">
            Certificados
          </h1>
          <p className="text-[#8a8a8d] text-lg leading-relaxed max-w-2xl">
            Credenciais que habilitam Igor Siqueira a desenvolver este ecossistema e divulgar tecnicamente o método Fimathe de Marcelo Ferreira, com a missão de democratizar o acesso ao Mercado Forex.
          </p>
        </div>
      </div>
    </section>
  )
}

interface CertificatesSectionProps {
  certificates: Certificate[]
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  onSelectCert: (imageUrl: string | null) => void
}

function CertificatesSection({ certificates, filter, onFilterChange, onSelectCert }: CertificatesSectionProps) {
  return (
    <section className="py-16 bg-[#121212]" aria-labelledby="certificates-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 id="certificates-heading" className="text-3xl font-semibold text-white tracking-tight">
              Certificados
            </h2>
            <p className="text-[#8a8a8d] mt-1">
              {certificates.length} {certificates.length === 1 ? 'credencial' : 'credenciais'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFilterChange(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  filter === option.value
                    ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-black/20'
                    : 'bg-[#1e1e1e]/50 text-[#8a8a8d] border-[#3a3a3c] hover:text-white hover:border-[#0071e3]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {certificates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {certificates.map((cert) => (
              <AppleCard key={cert.id} hover className="h-full overflow-hidden">
                <button
                  className="text-left w-full h-full flex flex-col focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2"
                  onClick={() => onSelectCert(cert.image)}
                  aria-label={`Ver certificado: ${cert.title}`}
                >
                  <div className="aspect-square overflow-hidden relative">
                    {cert.image ? (
                      <Image
                        src={cert.image}
                        alt={`Certificado ${cert.title}`}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#121212]">
                        <svg className="w-12 h-12 text-[#3a3a3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white">
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
        )}
      </div>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2a2e39] flex items-center justify-center">
        <svg className="w-10 h-10 text-[#404857]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Nenhum certificado encontrado</h3>
      <p className="text-[#a0a0a0]">Tente ajustar os filtros para ver mais credenciais.</p>
    </div>
  )
}

function FounderSection() {
  return (
    <section className="py-16 bg-[#121212] flex justify-center">
      <div className="relative max-w-md sm:max-w-lg lg:max-w-xl">
        <Image
          src="/IMG_0975_new.jpg"
          alt="Igor Siqueira - Fundador do Velociclos PCM"
          width={500}
          height={600}
          className="aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] object-cover rounded-xl border border-[#3a3a3c] shadow-lg hover:border-[#0071e3]/50 transition-colors duration-300"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB//2Q=="
        />
        <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-[#0071e3] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-lg whitespace-nowrap">
          Fundador
        </div>
      </div>
    </section>
  )
}

interface CertificateModalProps {
  selectedCert: string | null
  onClose: () => void
}

function CertificateModal({ selectedCert, onClose }: CertificateModalProps) {
  return (
    <GlassModal
      isOpen={!!selectedCert}
      onClose={onClose}
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
  )
}
