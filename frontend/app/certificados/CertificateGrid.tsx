'use client'

import Image from 'next/image'
import AppleCard from '@/components/AppleCard'

interface Certificate {
  id: string
  title: string
  description: string
  image: string | null
}

interface CertificateGridProps {
  certificates: Certificate[]
  onSelect: (imageUrl: string | null) => void
}

const PLACEHOLDER_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWUyMzI5Ii8+PHRleHQgeD0iNTAiIHk9IjUwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYTBhMGEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM5OCI+SW1hZ2VtIG7vPhQ4PC90ZXh0Pjwvc3ZnPg=='

export default function CertificateGrid({ certificates, onSelect }: CertificateGridProps) {
  return (
    <section className="py-16 bg-[#121212]" aria-labelledby="certificates-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="certificates-heading" className="sr-only">Certificados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {certificates.map((cert) => (
            <button
              key={cert.id}
              onClick={() => onSelect(cert.image)}
              className="group text-left focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2"
              aria-label={`Ver certificado: ${cert.title}`}
            >
              <AppleCard className="overflow-hidden">
                <div className="aspect-square overflow-hidden relative">
                  {cert.image ? (
                    <Image
                      src={cert.image}
                      alt={`Certificado ${cert.title}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                      placeholder="blur"
                      blurDataURL={PLACEHOLDER_SVG}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#121212]">
                      <svg className="w-12 h-12 text-[#3a3a3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#0071e3] transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-[#8a8a8d] mt-1 line-clamp-2">
                    {cert.description}
                  </p>
                </div>
              </AppleCard>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
