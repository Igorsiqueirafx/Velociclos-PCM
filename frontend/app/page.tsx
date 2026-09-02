import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] via-[#141820] to-[#1a1f25]">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ffd700] rounded-full filter blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#ffd700] rounded-full filter blur-[100px] animate-pulse delay-1000" />
          </div>
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-full">
                <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-pulse" />
                <span className="text-[#ffd700] text-sm font-medium">Trading Automatizado</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] text-white">
                Domine o
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ffed4e]">
                  Mercado
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl text-[#a0a0a0] font-light mt-2">
                  com Velociclos PCM
                </span>
              </h1>

              <p className="text-lg text-[#a0a0a0] max-w-xl leading-relaxed">
                Aprenda o Método Fimathe e opere Forex e Ouro com confiança.
                Cursos completos, análises de mercado e um Expert Advisor profissional.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/cursos"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
                >
                  <span className="relative z-10">Explorar Cursos</span>
                  <i className="fas fa-arrow-right relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/metodo-fimathe"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#404857] text-[#dcdcdc] font-semibold rounded-xl hover:border-[#ffd700] hover:text-[#ffd700] transition-all duration-300"
                >
                  <span>Sobre o Método</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-[#404857]/50">
                <div className="text-center">
                  <div className="text-3xl font-black text-[#ffd700]">5+</div>
                  <div className="text-sm text-[#707070]">Cursos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-[#ffd700]">50+</div>
                  <div className="text-sm text-[#707070]">Aulas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-[#ffd700]">24/7</div>
                  <div className="text-sm text-[#707070]">Automação</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="relative w-[450px] h-[450px]">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border border-[#ffd700]/20 animate-spin-slow" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-[#ffd700] rounded-full -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Middle Ring */}
                <div className="absolute inset-8 rounded-full border border-[#ffd700]/30 animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                  <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-[#ffd700] rounded-full -translate-x-1/2 translate-y-1/2" />
                </div>

                {/* Center Circle */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[#ffd700]/20 to-transparent backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ffed4e] flex items-center justify-center shadow-[0_0_60px_rgba(255,215,0,0.5)]">
                      <i className="fas fa-chart-line text-4xl text-[#1a1f25]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Método Fimathe</h3>
                    <p className="text-[#a0a0a0] text-sm mt-1">Análise Técnica</p>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute top-10 right-0 bg-[#2a2e39] border border-[#404857] rounded-lg p-3 shadow-xl animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-arrow-up text-green-500 text-xs" />
                    </div>
                    <div>
                      <div className="text-xs text-[#a0a0a0]">EUR/USD</div>
                      <div className="text-sm font-bold text-green-500">+0.45%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-0 bg-[#2a2e39] border border-[#404857] rounded-lg p-3 shadow-xl animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#ffd700]/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-coins text-[#ffd700] text-xs" />
                    </div>
                    <div>
                      <div className="text-xs text-[#a0a0a0]">XAU/USD</div>
                      <div className="text-sm font-bold text-[#dcdcdc]">$2,035</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-[#707070]">Scroll</span>
          <i className="fas fa-chevron-down text-[#ffd700]" />
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a1f25] to-[#0f0f19]">
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
            {[
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
            ].map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative bg-[#2a2e39] border border-[#404857] rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:border-[#ffd700] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,215,0,0.15)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Overlay on Hover */}
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

      {/* Features Section */}
      <section className="py-20 bg-[#0f0f19]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-white mb-6">
                Por que escolher o <span className="text-[#ffd700]">Velociclos</span>?
              </h2>
              <div className="space-y-6">
                {[
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
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="flex gap-4 p-4 rounded-xl bg-[#2a2e39]/50 border border-[#404857]/50 hover:border-[#ffd700]/30 transition-all duration-300"
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
              <div className="bg-[#2a2e39] border border-[#404857] rounded-2xl p-8 shadow-2xl">
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
                    className="flex-1 py-3 border border-[#404857] text-[#dcdcdc] font-medium rounded-lg text-center hover:border-[#ffd700] transition-colors"
                  >
                    Expert Advisor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
    </main>
  )
}
