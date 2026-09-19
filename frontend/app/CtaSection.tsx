'use client'

import AppleButton from '@/components/AppleButton'

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0071e3]/10 via-[#0071e3]/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-semibold text-white mb-4 tracking-tight">
          Pronto para começar?
        </h2>
        <p className="text-[#8a8a8d] text-lg mb-8 max-w-2xl mx-auto">
          Explore nossos cursos e comece sua jornada no mercado financeiro hoje mesmo.
        </p>
        <AppleButton href="/cursos" size="lg">
          <span>Começar Agora</span>
          <i className="fas fa-arrow-right" />
        </AppleButton>
      </div>
    </section>
  )
}
