'use client'

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
      <section className="relative min-h-[60vh] flex items-center bg-[#1a1a2e]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/85 to-[#1e2329]/75 z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-4">
              <span className="block">Nossos</span>
              <span className="text-[#ffd700]">Artigos</span>
            </h1>
            <p className="text-[#a0a0a0] text-lg">
              Conteúdo exclusivo sobre trading, mesas proprietárias e estratégias.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1e2329]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#dcdcdc] mb-3">Nossos Artigos</h2>
            <p className="text-[#a0a0a0]">Desenvolvido com dedicação para traders</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                data-filter={btn.value}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  btn.value === 'all'
                    ? 'bg-[#ffd700] text-[#1e2329] border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                    : 'bg-[#1e2329]/50 text-[#a0a0a0] border-[#404857] hover:text-[#ffd700] hover:border-[#ffd700]/30'
                }`}
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                data-category={article.category}
                className="bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden transition-all hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] text-left"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-lg flex items-center justify-center text-[#1e2329]">
                      <i className={`fas ${article.icon}`} aria-hidden="true"></i>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        article.badgeColor === 'iniciante'
                          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                          : article.badgeColor === 'intermediario'
                          ? 'bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30'
                          : 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
                      }`}
                    >
                      {article.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#dcdcdc] mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[#a0a0a0] text-sm mb-4 flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#707070] mb-4">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-clock" aria-hidden="true"></i> {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-signal" aria-hidden="true"></i> {article.level}
                    </span>
                  </div>
                  <button
                    onClick={() => (window.location.href = `/artigos/${article.id}`)}
                    className="w-full px-4 py-2 bg-[#ffd700] text-[#1e2329] font-bold rounded-md hover:bg-[#ffdd33] transition-colors focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
                  >
                    Ler Artigo
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
