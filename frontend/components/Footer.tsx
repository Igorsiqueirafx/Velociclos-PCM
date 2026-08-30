import Link from 'next/link'

type FooterProps = {
  siteName?: string
}

const CURRENT_YEAR = new Date().getFullYear()

const footerLinks = {
  conteudo: [
    { name: 'Cursos', href: '/cursos' },
    { name: 'Artigos', href: '/artigos' },
    { name: 'Certificados', href: '/certificados' },
    { name: 'Manual', href: '/manual' },
  ],
  ferramentas: [
    { name: 'Expert Advisor', href: '/ea' },
    { name: 'Relógio Forex', href: '/relogio' },
    { name: 'Método Fimathe', href: '/metodo-fimathe' },
  ],
  conta: [
    { name: 'Login', href: '/auth/login' },
    { name: 'Registrar', href: '/auth/register' },
    { name: 'Newsletter', href: '/entrar' },
  ],
  sitemap: [
    { name: 'Mapa do Site', href: '/site-map' },
  ],
}

export default function Footer({ siteName = 'Velociclos' }: FooterProps) {
  return (
    <footer className="bg-[#2a2e39] border-t border-[#404857] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Branding */}
          <div>
            <h3 className="text-lg font-bold text-[#ffd700] mb-3">{siteName}</h3>
            <p className="text-[#a0a0a0] text-sm">Automação de mercado com liberdade. Trading 24/7 com o método Fimathe.</p>
          </div>

          {/* Conteúdo */}
          <div>
            <h4 className="text-sm font-semibold text-[#dcdcdc] mb-3">Conteúdo</h4>
            <ul className="space-y-2">
              {footerLinks.conteudo.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ferramentas */}
          <div>
            <h4 className="text-sm font-semibold text-[#dcdcdc] mb-3">Ferramentas</h4>
            <ul className="space-y-2">
              {footerLinks.ferramentas.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h4 className="text-sm font-semibold text-[#dcdcdc] mb-3">Minha Conta</h4>
            <ul className="space-y-2">
              {footerLinks.conta.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[#dcdcdc] mb-3">Navegação</h4>
            <ul className="space-y-2">
              {footerLinks.sitemap.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#404857] pt-6 text-center">
          <p className="text-[#a0a0a0] text-xs">
            &copy; {CURRENT_YEAR} {siteName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
