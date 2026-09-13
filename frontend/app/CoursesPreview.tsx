'use client'

import Link from 'next/link'

const COURSES = [
  {
    title: 'Método Fimathe',
    description: 'Aprenda a metodologia completa de análise técnica para Forex e Ouro',
    icon: 'fa-graduation-cap',
    color: 'from-blue-500 to-cyan-500',
    href: '/metodo-fimathe',
  },
  {
    title: 'Cursos Completos',
    description: 'Playlists organizadas por tema para seu aprendizado',
    icon: 'fa-play-circle',
    color: 'from-[#ffd700] to-[#ffed4e]',
    href: '/cursos',
  },
  {
    title: 'Análises de Mercado',
    description: 'Acompanhe as análises semanais do mercado',
    icon: 'fa-chart-bar',
    color: 'from-green-500 to-emerald-500',
    href: '/artigos',
  },
]

export default function CoursesPreview() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0a0a12] to-[#1a1f25]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Aprenda com os <span className="text-[#ffd700]">Melhores</span>
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Conteúdo completo para você dominar o mercado financeiro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative bg-[#1e2329] border border-[#404858] rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:border-[#ffd700] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,215,0,0.15)]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                <i className={`fas ${item.icon} text-2xl text-white`} />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ffd700] transition-colors">
                {item.title}
              </h3>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">
                {item.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-[#ffd700] opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Saiba mais</span>
                <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
