'use client'

import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#ffd700]/10 via-[#ffd700]/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-black text-white mb-4">
          Pronto para começar?
        </h2>
        <p className="text-[#a0a0a0] text-lg mb-8 max-w-2xl mx-auto">
          Explore nossos cursos e comece sua jornada no mercado financeiro hoje mesmo.
        </p>
        <Link
          href="/cursos"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] font-bold rounded-xl text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all duration-300"
        >
          <span>Começar Agora</span>
          <i className="fas fa-arrow-right" />
        </Link>
      </div>
    </section>
  )
}
