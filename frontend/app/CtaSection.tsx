'use client'

import Link from 'next/link'

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
        <Link
          href="/cursos"
          className="inline-flex items-center gap-3 px-10 py-5 bg-[#0071e3] text-white font-semibold rounded-xl text-lg hover:bg-[#005fd9] hover:shadow-[0_0_40px_rgba(0,113,227,0.3)] transition-all duration-300"
        >
          <span>Começar Agora</span>
          <i className="fas fa-arrow-right" />
        </Link>
      </div>
    </section>
  )
}