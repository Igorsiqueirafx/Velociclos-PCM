'use client'

import Link from 'next/link'

export default function CursosHero() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#ffd700] rounded-full filter blur-[150px] opacity-5" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full filter blur-[120px] opacity-5" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-full mb-6">
            <i className="fas fa-graduation-cap text-[#ffd700]" />
            <span className="text-[#ffd700] text-sm font-medium">Aprenda com os Melhores</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Cursos e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ffed4e]">Aulas</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#a0a0a0] mb-10 max-w-2xl mx-auto leading-relaxed">
            Conteúdo completo sobre o Método Fimathe. Aprenda Forex, Análise Técnica
            e Gestão de Risco diretamente na plataforma.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/cursos/momentos"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] font-bold rounded-xl hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all duration-300"
            >
              <i className="fas fa-play-circle" />
              <span>Momentos Chave</span>
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/metodo-fimathe"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#404857] text-[#dcdcdc] font-semibold rounded-xl hover:border-[#ffd700] hover:text-[#ffd700] transition-all duration-300"
            >
              <span>Sobre o Método</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
