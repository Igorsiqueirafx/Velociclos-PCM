'use client'

import Link from 'next/link'

export default function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/background marcelos.png"
          alt="Marcelo Ferreira"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a12] via-[#0a0a12]/90 to-[#0a0a12]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-[#0a0a12]/50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-pulse" />
              <span className="text-[#ffd700] text-sm font-medium">Trading Automatizado</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] text-white drop-shadow-lg">
              Domine o
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ffed4e]">
                Mercado
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl text-[#dcdcdc] font-light mt-2">
                com Velociclos PCM
              </span>
            </h1>

            <p className="text-lg text-[#dcdcdc] max-w-xl leading-relaxed drop-shadow">
              Aprenda o Método Fimathe e opere Forex e Ouro com confiança.
              Cursos completos, análises de mercado e um Expert Advisor profissional.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/cursos"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
              >
                <span className="relative z-10">Explorar Cursos</span>
                <i className="fas fa-arrow-right relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/metodo-fimathe"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-[#ffd700] hover:text-[#ffd700] transition-all duration-300 backdrop-blur-sm"
              >
                <span>Sobre o Método</span>
              </Link>
            </div>

            <div className="flex gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-black text-[#ffd700]">5+</div>
                <div className="text-sm text-[#dcdcdc]">Cursos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#ffd700]">50+</div>
                <div className="text-sm text-[#dcdcdc]">Aulas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#ffd700]">24/7</div>
                <div className="text-sm text-[#dcdcdc]">Automação</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center">
            <div className="relative">
              <img
                src="/Marcelo olhando pra cima.svg"
                alt="Marcelo Ferreira"
                className="w-80 h-auto drop-shadow-2xl"
              />
              <FloatingCardEURUSD />
              <FloatingCardXAUUSD />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-white/60">Scroll</span>
        <i className="fas fa-chevron-down text-[#ffd700]" />
      </div>
    </section>
  )
}

function FloatingCardEURUSD() {
  return (
    <div className="absolute -top-4 -right-4 bg-[#2a2e39]/90 backdrop-blur border border-[#404858] rounded-xl p-4 shadow-2xl animate-float">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
          <i className="fas fa-arrow-up text-green-500" />
        </div>
        <div>
          <div className="text-xs text-[#a0a0a0]">EUR/USD</div>
          <div className="text-lg font-bold text-green-500">+0.45%</div>
        </div>
      </div>
    </div>
  )
}

function FloatingCardXAUUSD() {
  return (
    <div className="absolute -bottom-4 -left-4 bg-[#2a2e39]/90 backdrop-blur border border-[#404858] rounded-xl p-4 shadow-2xl animate-float-delayed">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#ffd700]/20 rounded-full flex items-center justify-center">
          <i className="fas fa-coins text-[#ffd700]" />
        </div>
        <div>
          <div className="text-xs text-[#a0a0a0]">XAU/USD</div>
          <div className="text-lg font-bold text-white">$2,035</div>
        </div>
      </div>
    </div>
  )
}
