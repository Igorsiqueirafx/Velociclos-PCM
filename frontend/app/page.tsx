import Link from 'next/link'
import ScrollytellingSection from '@/components/ScrollytellingSection'

type BenefitItem = {
  title: string
  description: string
  icon: string
}

const benefits: BenefitItem[] = [
  {
    title: 'Conta Real',
    description: 'Desenvolvido e refinado com experiências de operações reais do mercado financeiro.',
    icon: 'fa-users',
  },
  {
    title: 'Método Comprovado',
    description: 'Os números mostram claramente que é possível construir uma renda consistente.',
    icon: 'fa-chart-line',
  },
  {
    title: 'Receba em Dólares',
    description: 'Aprenda a escalar o seu capital em mesas proprietárias e alcance as suas metas profissionais.',
    icon: 'fa-award',
  },
]

const methodSteps = [
  {
    title: 'Contexto',
    description: 'Análise do mercado com price action puro, sem filtros que atrasam a entrada.',
    icon: 'fa-chart-area',
  },
  {
    title: 'Zona',
    description: 'Identificação da zona de referência usando o canal Fimathe PCM.',
    icon: 'fa-crosshairs',
  },
  {
    title: 'Execução',
    description: 'Ordem executada no fechamento da vela que rompe a zona, com lógica transparente.',
    icon: 'fa-bolt',
  },
]

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[70vh] flex items-center bg-cover bg-top bg-no-repeat bg-[url('/bg-capa-marcelo.webp')]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/85 to-[#1e2329]/75 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[60vh]">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#e8e8e8]">
                Execução disciplinada no mercado de Forex.
              </h1>
              <p className="text-lg sm:text-xl text-[#a0a0a0] max-w-2xl">
                Velociclos PCM 8.0 — Expert Advisor baseado no método Fimathe, com price action puro e linhas de referência estáticas.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex gap-8 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-[#ffd700]">Forex</span>
                    <span className="text-sm text-[#6b7280] max-w-[120px]">Mercado cambial global</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-[#ffd700]">Ouro</span>
                    <span className="text-sm text-[#6b7280] max-w-[120px]">Operações com XAU/USD</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link
                    href="/entrar"
                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#ffd700] text-[#ffd700] font-bold rounded-lg hover:bg-[#ffd700]/10 transition-all duration-200 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
                    aria-label="Entrar ou cadastrar email"
                  >
                    Acessar Plataforma
                  </Link>
                  <Link
                    href="/ea"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#ffd700] text-[#1e2329] font-bold rounded-lg shadow-lg hover:bg-[#ffdd33] transition-all duration-200 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
                    aria-label="Conhecer o Expert Advisor Velociclos PCM"
                  >
                    Ver Demonstração
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center" aria-hidden="true">
              <div className="relative">
                <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,215,0,0.15)_0%,_rgba(255,215,0,0.05)_50%,_transparent_100%)] border border-[#ffd700] flex items-center justify-center text-center p-12 relative overflow-hidden
                  before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-radial before:from-[#ffd700]/15 before:via-[#ffd700]/5 before:to-transparent before:z-0">
                  <div className="relative z-10">
                    <i className="fas fa-arrow-trend-up text-5xl sm:text-6xl text-[#ffd700] mb-4 block"></i>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#dcdcdc] mb-3">
                      Expert Advisor
                    </h2>
                    <p className="text-[#a0a0a0] text-sm leading-relaxed">
                      Este é um sistema profissional,<br />
                      recomendado para traders conscientes<br />
                      e preparados.
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffd700]/5 via-transparent to-transparent opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SCROLLYTELLING ===== */}
      <ScrollytellingSection />

      {/* ===== MÉTODO 3 ETAPAS ===== */}
      <section className="py-16 sm:py-20 bg-[#161a21]" aria-labelledby="method-title">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="method-title" className="text-3xl sm:text-4xl font-bold text-[#e8e8e8] mb-4">
              Método em 3 etapas
            </h2>
            <p className="text-[#a0a0a0] max-w-2xl mx-auto">
              Do contexto à execução, com disciplina e transparência.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methodSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative bg-[#1e2329] border-l-2 border-[#ffd700] rounded-r-xl p-6 transition-all duration-300 hover:border-l-4 hover:shadow-glow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 text-[#ffd700] flex items-center justify-center font-mono text-sm font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <i className={`fas ${step.icon} text-[#ffd700]`} aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-[#e8e8e8] mb-2">{step.title}</h3>
                <p className="text-[#a0a0a0] text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROVA ===== */}
      <section className="py-16 sm:py-20 bg-[#0f1115]" aria-labelledby="proof-title">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="proof-title" className="text-3xl sm:text-4xl font-bold text-[#e8e8e8] mb-4">
              Prova e Transparência
            </h2>
            <p className="text-[#a0a0a0] max-w-2xl mx-auto">
              Resultados reais, sem promessas fictícias. A disciplina do método se reflete nos números.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="bg-[#161a21] border border-[#232730] rounded-xl p-6 text-center transition-all duration-300 hover:border-[#ffd700] hover:shadow-glow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`fas ${item.icon} text-2xl text-[#1e2329]`} aria-hidden="true"></i>
                </div>
                <h3 className="text-lg font-bold text-[#e8e8e8] mb-2">{item.title}</h3>
                <p className="text-sm text-[#a0a0a0]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-16 sm:py-20 bg-[#161a21]" aria-labelledby="cta-title">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="cta-title" className="text-3xl sm:text-4xl font-bold text-[#e8e8e8] mb-4">
              Pronto para operar com disciplina?
            </h2>
            <p className="text-[#a0a0a0] mb-8">
              Acesse a plataforma e descubra o poder do Velociclos PCM 8.0.
            </p>
            <Link
              href="/entrar"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#ffd700] text-[#1e2329] font-bold rounded-lg shadow-glow hover:bg-[#ffdd33] transition-all duration-200 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#161a21]"
            >
              Acessar Plataforma
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}