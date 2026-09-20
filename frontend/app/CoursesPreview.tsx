'use client'

import Link from 'next/link'
import AppleCard from '@/components/AppleCard'

const COURSES = [
  {
    title: 'Método Fimathe',
    description: 'Aprenda a metodologia completa de análise técnica para Forex e Ouro',
    icon: 'fa-graduation-cap',
    color: 'from-[#0071e3] to-[#6567f1]',
    href: '/metodo-fimathe',
  },
  {
    title: 'Cursos Completos',
    description: 'Playlists organizadas por tema para seu aprendizado',
    icon: 'fa-play-circle',
    color: 'from-[#0071e3] to-[#3a84ff]',
    href: '/cursos',
  },
  {
    title: 'Análises de Mercado',
    description: 'Acompanhe as análises semanais do mercado',
    icon: 'fa-chart-bar',
    color: 'from-[#34c759] to-[#28a745]',
    href: '/artigos',
  },
]

export default function CoursesPreview() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0a0a12] to-[#121212]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-4 tracking-tight">
            Aprenda com os <span className="text-[#0071e3]">Melhores</span>
          </h2>
          <p className="text-[#8a8a8d] text-lg max-w-2xl mx-auto">
            Conteúdo completo para você dominar o mercado financeiro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative block h-full focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AppleCard hover className="h-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-md`}>
                  <i className={`fas ${item.icon} text-xl text-white`} />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#0071e3] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#8a8a8d] text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[#0071e3] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform" />
                </div>
              </AppleCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
