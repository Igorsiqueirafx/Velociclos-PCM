'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <>
      <section className="relative min-h-[70vh] flex items-center bg-cover bg-top bg-no-repeat bg-[url('/bg-capa-marcelo.png')]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/85 to-[#1e2329]/75 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[60vh]">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#dcdcdc]">
                Opere o <span className="text-[#ffd700]">Mercado</span>
                <span className="block"> 24/7 com Velociclos PCM</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#a0a0a0] max-w-2xl">
                Descubra o poder do trading automatizado.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex gap-8 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-[#ffd700]">Forex</span>
                    <span className="text-sm text-[#707070] max-w-[120px]">Mercado cambial global</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-[#ffd700]">Ouro</span>
                    <span className="text-sm text-[#707070] max-w-[120px]">Operações com XAU/USD</span>
                  </div>
                </div>
                <Link
                  href="/ea"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#ffd700] text-[#1e2329] font-bold rounded-lg shadow-lg hover:bg-[#ffdd33] transition-all duration-200 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
                  aria-label="Conhecer o Expert Advisor Velociclos PCM"
                >
                  Saiba sobre o E.A.
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative">
                <div
                  className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,215,0,0.15)_0%,_rgba(255,215,0,0.05)_50%,_transparent_100%)] border border-[#ffd700] flex items-center justify-center text-center p-12 relative overflow-hidden
                  before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-radial before:from-[#ffd700]/15 before:via-[#ffd700]/5 before:to-transparent before:z-0"
                >
                  <div className="relative z-10">
                    <i className="fas fa-arrow-trend-up text-5xl sm:text-6xl text-[#ffd700] mb-4 block" aria-hidden="true"></i>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#dcdcdc] mb-3">
                      Expert Advisor
                    </h2>
                    <p className="text-[#a0a0a0] text-sm leading-relaxed">
                      Este é um sistema profissional,<br />
                      recomendado para traders conscientes<br />
                      e preparados.
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffd700]/5 via-transparent to-transparent opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#2a2e39]" aria-labelledby="benefits-title">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-8 text-center transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-users text-2xl text-[#1e2329]" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-[#dcdcdc] mb-3">Conta Real</h3>
              <p className="text-[#a0a0a0] text-sm">
                Desenvolvido e refinado com experiências de operações reais do mercado financeiro.
              </p>
            </div>

            <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-8 text-center transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-chart-line text-2xl text-[#1e2329]" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-[#dcdcdc] mb-3">Método Comprovado</h3>
              <p className="text-[#a0a0a0] text-sm">
                Os números mostram claramente que é possível construir uma renda consistente.
              </p>
            </div>

            <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-8 text-center transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-award text-2xl text-[#1e2329]" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-[#dcdcdc] mb-3">Receba em Dólares</h3>
              <p className="text-[#a0a0a0] text-sm">
                Aprenda a escalar o seu capital em mesas proprietárias e alcance as suas metas profissionais.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
