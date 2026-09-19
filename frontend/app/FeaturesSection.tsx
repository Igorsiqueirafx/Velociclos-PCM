'use client'

import AppleCard from '@/components/AppleCard'

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#1e1e1e]" aria-labelledby="benefits-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AppleCard className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0071e3] to-[#6567f1] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-users text-2xl text-white" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Conta Real</h3>
            <p className="text-[#8a8a8d] text-sm">Desenvolvido e refinado com experiências de operações reais do mercado financeiro.</p>
          </AppleCard>

          <AppleCard className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0071e3] to-[#6567f1] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-chart-line text-2xl text-white" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Método Comprovado</h3>
            <p className="text-[#8a8a8d] text-sm">Os números mostram claramente que é possível construir uma renda consistente.</p>
          </AppleCard>

          <AppleCard className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0071e3] to-[#6567f1] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-award text-2xl text-white" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Receba em Dólares</h3>
            <p className="text-[#8a8a8d] text-sm">Aprenda a escalar o seu capital em mesas proprietárias e alcance as suas metas profissionais.</p>
          </AppleCard>
        </div>
      </div>
    </section>
  )
}
