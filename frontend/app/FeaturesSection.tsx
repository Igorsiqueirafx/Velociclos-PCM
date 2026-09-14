'use client'

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#2a2e39]" aria-labelledby="benefits-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-8 text-center transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-users text-2xl text-[#1e2329]" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-[#dcdcdc] mb-3">Conta Real</h3>
            <p className="text-[#a0a0a0] text-sm">Desenvolvido e refinado com experiências de operações reais do mercado financeiro.</p>
          </div>

          <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-8 text-center transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-chart-line text-2xl text-[#1e2329]" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-[#dcdcdc] mb-3">Método Comprovado</h3>
            <p className="text-[#a0a0a0] text-sm">Os números mostram claramente que é possível construir uma renda consistente.</p>
          </div>

          <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-8 text-center transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-award text-2xl text-[#1e2329]" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-[#dcdcdc] mb-3">Receba em Dólares</h3>
            <p className="text-[#a0a0a0] text-sm">Aprenda a escalar o seu capital em mesas proprietárias e alcance as suas metas profissionais.</p>
          </div>
        </div>
      </div>
    </section>
  )
}