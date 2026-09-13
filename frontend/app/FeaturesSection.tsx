'use client'

import Link from 'next/link'

const FEATURES = [
  {
    icon: 'fa-check-circle',
    title: 'Método Comprovado',
    desc: 'Análise técnica baseada em dados reais do mercado',
  },
  {
    icon: 'fa-robot',
    title: 'Automação Inteligente',
    desc: 'Expert Advisor que opera 24/7 no mercado',
  },
  {
    icon: 'fa-book-open',
    title: 'Conteúdo Completo',
    desc: 'Cursos, análises e suporte para sua evolução',
  },
  {
    icon: 'fa-shield-alt',
    title: 'Gestão de Risco',
    desc: 'Estratégias para proteger seu capital',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-[#0f0f19]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-white mb-6">
              Por que escolher o <span className="text-[#ffd700]">Velociclos</span>?
            </h2>
            <div className="space-y-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-4 rounded-xl bg-[#1e2329]/50 border border-[#404858]/50 hover:border-[#ffd700]/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#ffd700]/10 flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${feature.icon} text-[#ffd700]`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-[#a0a0a0]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#1e2329] border border-[#404858] rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ffed4e] flex items-center justify-center">
                  <i className="fas fa-user-tie text-2xl text-[#1a1f25]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Marcelo Ferreira</h3>
                  <p className="text-[#a0a0a0] text-sm">Criador do Método Fimathe</p>
                </div>
              </div>
              <blockquote className="text-[#dcdcdc] italic border-l-4 border-[#ffd700] pl-4">
                "O mercado financeiro exige conhecimento, disciplina e as ferramentas certas.
                O Método Fimathe foi desenvolvido para quem busca consistência."
              </blockquote>
              <div className="mt-6 flex gap-4">
                <Link
                  href="/cursos"
                  className="flex-1 py-3 bg-[#ffd700] text-[#1a1f25] font-bold rounded-lg text-center hover:bg-[#ffed4e] transition-colors"
                >
                  Ver Cursos
                </Link>
                <Link
                  href="/ea"
                  className="flex-1 py-3 border border-[#404858] text-[#dcdcdc] font-medium rounded-lg text-center hover:border-[#ffd700] transition-colors"
                >
                  Expert Advisor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
