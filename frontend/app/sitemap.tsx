import Link from 'next/link'

const publicRoutes = [
  { href: '/', label: 'Início' },
  { href: '/cursos', label: 'Cursos' },
  { href: '/cursos/videos', label: 'Todos os Vídeos' },
  { href: '/cursos/momentos', label: 'Momentos Chave' },
  { href: '/artigos', label: 'Artigos' },
  { href: '/certificados', label: 'Certificados' },
  { href: '/metodo-fimathe', label: 'Método Fimathe' },
  { href: '/manual', label: 'Manual' },
  { href: '/ea', label: 'Expert Advisor' },
  { href: '/relogio', label: 'Relógio Forex' },
]

export const metadata = {
  title: 'Mapa do Site - Velociclos PCM',
  description: 'Mapa visual completo do site Velociclos PCM. Encontre todas as páginas: cursos, artigos, certificados, método Fimathe e mais.',
}

export default function SiteMapPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#121212] to-[#1a1a2e]">
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4 tracking-tight">
              Mapa do <span className="text-[#0071e3]">Site</span>
            </h1>
            <p className="text-[#8a8a8d] text-lg max-w-2xl mx-auto">
              Encontre rapidamente todas as páginas e seções do Velociclos PCM.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {publicRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6 transition-all duration-300 hover:border-[#0071e3] hover:shadow-[0_0_25px_rgba(0,113,227,0.15)] text-left focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0071e3]/10 rounded-lg flex items-center justify-center text-[#0071e3] group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                    <i className="fas fa-link" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-[#0071e3] transition-colors">
                      {route.label}
                    </h3>
                    <p className="text-xs text-[#8a8a8d] font-mono">{route.href}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
