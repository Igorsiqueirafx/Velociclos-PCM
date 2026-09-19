'use client'

import AppleButton from '@/components/AppleButton'

export default function CursosCtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0071e3]/10 via-[#0071e3]/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Procurando algo <span className="text-[#0071e3]">específico</span>?
          </h2>
          <p className="text-[#8a8a8d] text-lg mb-8">
            Acesse os Momentos Chave para trechos rápidos ou o catálogo completo com todos os vídeos do canal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <AppleButton href="/cursos/momentos" size="lg" icon={<i className="fas fa-bolt" aria-hidden="true" />}>
              Ver Momentos Chave
            </AppleButton>
            <AppleButton href="/cursos/videos" variant="secondary" size="lg" icon={<i className="fas fa-play-circle" aria-hidden="true" />}>
              Ver Todos os Vídeos
            </AppleButton>
          </div>
        </div>
      </div>
    </section>
  )
}