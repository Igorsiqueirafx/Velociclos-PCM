'use client'

export default function SiteMapPage() {
  const publicPages = [
    {
      category: '🏠 Principal',
      pages: [
        { name: 'Home', href: '/', description: 'Página inicial com hero e boas-vindas' },
      ],
    },
    {
      category: '📚 Conteúdo',
      pages: [
        { name: 'Cursos', href: '/cursos', description: 'Playlists do YouTube com aulas do método Fimathe' },
        { name: 'Artigos', href: '/artigos', description: 'Blog com análises técnicas e estudos de caso' },
        { name: 'Método Fimathe', href: '/metodo-fimathe', description: 'Explicação do método de trading propriedade Fimathe' },
        { name: 'Manual', href: '/manual', description: 'Guia de instalação e uso do Expert Advisor' },
      ],
    },
    {
      category: '🎓 Certificados & Downloads',
      pages: [
        { name: 'Certificados', href: '/certificados', description: 'Galeria dos certificados de conclusão de cursos' },
        { name: 'Expert Advisor', href: '/ea', description: 'Download e informações sobre o EA Velociclos' },
      ],
    },
    {
      category: '🛠️ Ferramentas',
      pages: [
        { name: 'Relógio Forex', href: '/relogio', description: 'Mapa interativo com horários das sessões de trading' },
        { name: 'Cadastro de Lead', href: '/lead-capture', description: 'Landing page para captura de contatos' },
        { name: 'Newsletter', href: '/entrar', description: 'Inscrição na newsletter e lead capture' },
      ],
    },
    {
      category: '🔐 Autenticação',
      pages: [
        { name: 'Login', href: '/auth/login', description: 'Entrar na sua conta' },
        { name: 'Registrar', href: '/auth/register', description: 'Criar nova conta' },
        { name: 'Logout', href: '/logout', description: 'Sair da conta' },
      ],
    },
    {
      category: '👤 Área do Usuário',
      pages: [
        { name: 'Meus Leads', href: '/leads', description: 'Painel de leads capturados (requer autenticação)' },
        { name: 'Downloads Exclusivos', href: '/download', description: 'Acesso a downloads autenticados (requer autenticação)' },
      ],
    },
    {
      category: '⚙️ Admin (Protegido)',
      pages: [
        { name: 'Dashboard Admin', href: '/dashboard', description: 'Painel administrativo (requer autenticação)' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#dcdcdc] mb-3">
            Mapa do Site
          </h1>
          <p className="text-[#a0a0a0] text-lg">
            Navegue por todas as páginas públicas da Velociclos PCM
          </p>
        </div>

        <div className="space-y-8">
          {publicPages.map((section, idx) => (
            <div key={idx} className="bg-[#2a2e39] border border-[#404857] rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#ffd700] mb-4">{section.category}</h2>
              <ul className="space-y-3">
                {section.pages.map((page, pidx) => (
                  <li key={pidx} className="flex items-start gap-3">
                    <a
                      href={page.href}
                      className="text-[#ffd700] hover:text-[#ffdd33] font-medium transition-colors flex-1"
                    >
                      {page.name}
                    </a>
                    <span className="text-[#a0a0a0] text-sm text-right">{page.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg p-6 text-center">
          <p className="text-[#a0a0a0] mb-4">
            ✨ Todas as páginas públicas estão disponíveis. Páginas marcadas com 🔐 requerem autenticação.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg hover:from-[#ffdd33] hover:to-[#ffd700] transition-all"
          >
            ← Voltar à Home
          </a>
        </div>
      </div>
    </div>
  )
}
