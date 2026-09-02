import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/background marcelos.png"
            alt="Marcelo Ferreira"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a12] via-[#0a0a12]/90 to-[#0a0a12]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-[#0a0a12]/50" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-full backdrop-blur-sm">
                <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-pulse" />
                <span className="text-[#ffd700] text-sm font-medium">Trading Automatizado</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] text-white drop-shadow-lg">
                Domine o
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ffed4e]">
                  Mercado
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl text-[#dcdcdc] font-light mt-2">
                  com Velociclos PCM
                </span>
              </h1>

              <p className="text-lg text-[#dcdcdc] max-w-xl leading-relaxed drop-shadow">
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
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-[#ffd700] hover:text-[#ffd700] transition-all duration-300 backdrop-blur-sm"
                >
                  <span>Sobre o Método</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-black text-[#ffd700]">5+</div>
                  <div className="text-sm text-[#dcdcdc]">Cursos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-[#ffd700]">50+</div>
                  <div className="text-sm text-[#dcdcdc]">Aulas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-[#ffd700]">24/7</div>
                  <div className="text-sm text-[#dcdcdc]">Automação</div>
                </div>
              </div>
            </div>

            {/* Right - Marcelo Image */}
            <div className="relative hidden lg:flex justify-center">
              <div className="relative">
                <img
                  src="/Marcelo olhando pra cima.svg"
                  alt="Marcelo Ferreira"
                  className="w-80 h-auto drop-shadow-2xl"
                />
                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-[#2a2e39]/90 backdrop-blur border border-[#404858] rounded-xl p-4 shadow-2xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-arrow-up text-green-500" />
                    </div>
                    <div>
                      <div className="text-xs text-[#a0a0a0]">EUR/USD</div>
                      <div className="text-lg font-bold text-green-500">+0.45%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-[#2a2e39]/90 backdrop-blur border border-[#404858] rounded-xl p-4 shadow-2xl animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ffd700]/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-coins text-[#ffd700]" />
                    </div>
                    <div>
                      <div className="text-xs text-[#a0a0a0]">XAU/USD</div>
                      <div className="text-lg font-bold text-white">$2,035</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-white/60">Scroll</span>
          <i className="fas fa-chevron-down text-[#ffd700]" />
        </div>
      </section>

      {/* Media Section */}
      <section className="py-12 bg-[#0a0a12] border-y border-[#404858]/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[#707070] text-sm mb-6 uppercase tracking-wider">Como visto em</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 hover:opacity-80 transition-opacity">
            <img src="/logo forbes link matéria add.svg" alt="Forbes" className="h-8 w-auto grayscale hover:grayscale-0 transition-all" />
            <img src="/logo investing matéria add link.svg" alt="Investing" className="h-8 w-auto grayscale hover:grayscale-0 transition-all" />
            <img src="/istoe materia logo add link.svg" alt="IstoÉ" className="h-6 w-auto grayscale hover:grayscale-0 transition-all" />
            <img src="/criptofacio add link materia.svg" alt="Criptofacio" className="h-6 w-auto grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </section>

      {/* Courses Preview Section */}
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
                  <img
                    src="/Marcelo olhando pra cima.svg"
                    alt="Marcelo Ferreira"
                    className="w-20 h-20 rounded-full object-cover"
                  />
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
