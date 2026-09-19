'use client'

import AppleButton from '@/components/AppleButton'

export default function CursosHero() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#0071e3] rounded-full filter blur-[150px] opacity-[0.04]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#6567f1] rounded-full filter blur-[120px] opacity-[0.04]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-full mb-6">
            <i className="fas fa-graduation-cap text-[#0071e3]" />
            <span className="text-[#0071e3] text-sm font-medium">Aprenda com os Melhores</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight tracking-tight">
            Cursos e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071e3] to-[#6567f1]">Aulas</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#8a8a8d] mb-10 max-w-2xl mx-auto leading-relaxed">
            Conteúdo completo sobre o Método Fimathe. Aprenda Forex, Análise Técnica
            e Gestão de Risco diretamente na plataforma.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <AppleButton href="/cursos/momentos" size="lg" icon={<i className="fas fa-play-circle" aria-hidden="true" />}>
              <span>Momentos Chave</span>
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform" />
            </AppleButton>
            <AppleButton href="/metodo-fimathe" variant="secondary" size="lg">
              <span>Sobre o Método</span>
            </AppleButton>
          </div>
        </div>
      </div>
    </section>
  )
}