'use client'

import AppleCard from '@/components/AppleCard'
import AppleButton from '@/components/AppleButton'

const articles = [
  {
    id: 'mitos-prop-firms',
    badge: 'Fundamentos',
    badgeColor: 'iniciante',
    icon: 'fa-chart-bar',
    title: '5 Mitos sobre Mesas Proprietárias no Forex',
    excerpt: 'Existem muitos mitos sobre mesas proprietárias circulando no mercado. Entenda o que é verdade, o que é mentira e como identificar uma empresa séria.',
    readTime: '9 min de leitura',
    level: 'Básico',
    category: 'iniciante',
  },
  {
    id: 'm15-m5-timeframe',
    badge: 'Estratégias',
    badgeColor: 'intermediario',
    icon: 'fa-chart-line',
    title: 'M15 ou M5: Qual Timeframe Oferece Mais Assertividade?',
    excerpt: 'Entenda as diferenças entre operar no M5 e no M15, qual oferece mais precisão e qual tem maior poder de recuperação.',
    readTime: '8 min de leitura',
    level: 'Intermediário',
    category: 'intermediario',
  },
  {
    id: 'operar-mesaproprietaria',
    badge: 'Estratégias',
    badgeColor: 'intermediario',
    icon: 'fa-graduation-cap',
    title: 'O Que Precisa de Saber Antes de Operar em Mesa Proprietária',
    excerpt: 'A maioria falha por não entender as regras do jogo. Aprenda a proteger seu capital, usar sub-ciclos e evitar erros.',
    readTime: '10 min de leitura',
    level: 'Intermediário',
    category: 'intermediario',
  },
  {
    id: 'overtrading',
    badge: 'Psicologia',
    badgeColor: 'intermediario',
    icon: 'fa-brain',
    title: 'Overtrading: O Vício que Destrói Contas de Trading',
    excerpt: 'O overtrading é um dos maiores vilões. Entenda por que acontece e como aplicar gerenciamento rigoroso.',
    readTime: '9 min de leitura',
    level: 'Intermediário',
    category: 'intermediario',
  },
  {
    id: 'ganhos-prop-trader',
    badge: 'Estratégias Avançadas',
    badgeColor: 'avancado',
    icon: 'fa-chart-pie',
    title: 'Quanto Pode Ganhar um Trader numa Mesa Proprietária?',
    excerpt: 'Descubra o potencial real de ganhos, com cálculos práticos de lotes, gestão de drawdown e exemplos.',
    readTime: '10 min de leitura',
    level: 'Avançado',
    category: 'avancado',
  },
  {
    id: 'noticias-volatility',
    badge: 'Fundamentos',
    badgeColor: 'intermediario',
    icon: 'fa-newspaper',
    title: 'Devo Evitar Operar em Notícias? A Visão da Volatilidade',
    excerpt: 'Muitos evitam notícias por medo. Descubra por que a volatilidade é sua aliada e como usar o calendário.',
    readTime: '8 min de leitura',
    level: 'Intermediário',
    category: 'intermediario',
  },
]

const filterButtons = [
  { label: 'Todos', value: 'all' },
  { label: 'Iniciantes', value: 'iniciante' },
  { label: 'Intermediário', value: 'intermediario' },
  { label: 'Avançado', value: 'avancado' },
]

export default function ArtigosPage() {
  return (
    <>
      <section className="relative min-h-[60vh] flex items-center bg-[#0a0a12]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/90 to-[#121212]/80 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">
              <span className="block">Nossos</span>
              <span className="text-[#0071e3]">Artigos</span>
            </h1>
            <p className="text-[#8a8a8d] text-lg">
              Conteúdo exclusivo sobre trading, mesas proprietárias e estratégias.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-white mb-3">Nossos Artigos</h2>
            <p className="text-[#8a8a8d]">Desenvolvido com dedicação para traders</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                data-filter={btn.value}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  btn.value === 'all'
                    ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-lg shadow-black/20'
                    : 'bg-[#1e1e1e]/50 text-[#8a8a8d] border-[#3a3a3c] hover:text-white hover:border-[#0071e3]'
                }`}
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <AppleCard key={article.id} className="h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0071e3] to-[#6567f1] rounded-xl flex items-center justify-center text-white">
                      <i className={`fas ${article.icon}`} aria-hidden="true"></i>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        article.badgeColor === 'iniciante'
                          ? 'bg-[#34c759]/15 text-[#34c759] border border-[#34c759]/30'
                          : article.badgeColor === 'intermediario'
                          ? 'bg-[#0071e3]/15 text-[#0071e3] border border-[#0071e3]/30'
                          : 'bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/30'
                      }`}
                    >
                      {article.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[#8a8a8d] text-sm mb-4 flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#8a8a8d] mb-4">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-clock" aria-hidden="true"></i> {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-signal" aria-hidden="true"></i> {article.level}
                    </span>
                  </div>
                  <AppleButton href={`/artigos/${article.id}`} className="w-full">
                    Ler Artigo
                  </AppleButton>
                </div>
              </AppleCard>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
