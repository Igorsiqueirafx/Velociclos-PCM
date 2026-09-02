import Link from 'next/link'

type FooterProps = {
  siteName?: string
}

const CURRENT_YEAR = new Date().getFullYear()

const footerLinks = {
  conteudo: [
    { name: 'Cursos', href: '/cursos' },
    { name: 'Momentos Chave', href: '/cursos/momentos' },
    { name: 'Artigos', href: '/artigos' },
    { name: 'Método Fimathe', href: '/metodo-fimathe' },
  ],
  ferramentas: [
    { name: 'Expert Advisor', href: '/ea' },
    { name: 'Relógio Forex', href: '/relogio' },
    { name: 'Manual', href: '/manual' },
    { name: 'Certificados', href: '/certificados' },
  ],
}

export default function Footer({ siteName = 'Velociclos' }: FooterProps) {
  return (
    <footer className="bg-[#0a0a12] border-t border-[#404857]/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#ffed4e] flex items-center justify-center">
                <i className="fas fa-bolt text-[#1a1f25] text-lg" />
              </div>
              <span className="text-xl font-bold text-white">{siteName}</span>
            </Link>
            <p className="text-[#a0a0a0] text-sm leading-relaxed max-w-sm mb-6">
              Plataforma de educação e automação para trading no mercado financeiro.
              Aprenda o Método Fimathe e opere com confiança.
            </p>
            <div className="flex gap-4">
              <a
                href="/cursos"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 text-[#ffd700] rounded-lg text-sm font-medium hover:bg-[#ffd700]/20 transition-colors"
              >
                <i className="fas fa-play-circle" />
                Ver Cursos
              </a>
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Conteúdo</h4>
            <ul className="space-y-3">
              {footerLinks.conteudo.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ferramentas */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Ferramentas</h4>
            <ul className="space-y-3">
              {footerLinks.ferramentas.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#404857]/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-[#707070] text-sm">
              &copy; {CURRENT_YEAR} {siteName}. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/metodo-fimathe" className="text-[#707070] text-sm hover:text-[#ffd700] transition-colors">
                Sobre
              </Link>
              <Link href="/ea" className="text-[#707070] text-sm hover:text-[#ffd700] transition-colors">
                Expert Advisor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
