'use client'

const manualSections = [
  {
    id: 'instalacao',
    icon: 'fa-download',
    title: 'Instalação',
    description: 'Siga os passos abaixo para instalar o E.A. no seu MetaTrader 5.',
    steps: [
      {
        number: 1,
        title: 'Baixe o arquivo',
        content: 'Clique no botão de download na página do Expert Advisor para baixar o arquivo Velociclos PCM.ex5.',
        link: '/ea',
        linkText: 'Expert Advisor',
      },
      {
        number: 2,
        title: 'Abra a pasta do MetaTrader',
        content: 'No MetaTrader 5, vá em Arquivo → Abrir Pasta de Dados → MQL5 → Experts.',
        hint: 'Atalho: pressione Ctrl+Shift+D no MT5 para abrir a pasta rapidamente.',
        hintIcon: 'fa-info-circle',
      },
      {
        number: 3,
        title: 'Cole o arquivo',
        content: 'Copie o arquivo Velociclos PCM.ex5 para a pasta Experts que abriu.',
      },
      {
        number: 4,
        title: 'Reinicie o MetaTrader',
        content: 'Feche e abra novamente o MetaTrader 5. O E.A. aparecerá na janela Navegador → Expert Advisors.',
      },
      {
        number: 5,
        title: 'Arraste para o gráfico',
        content: 'Arraste o E.A. para o gráfico desejado (recomendado: XAUUSD M5). Ative o Trading Automático na barra de ferramentas.',
        hint: 'Antes de operar em conta real, teste sempre em conta demo.',
        hintType: 'warning',
        hintIcon: 'fa-exclamation-triangle',
      },
    ],
  },
  {
    id: 'modos',
    icon: 'fa-cogs',
    title: 'Modos de Operação',
    description: 'Escolha o modo que melhor se adapta ao seu estilo de trading.',
    modes: [
      {
        icon: 'fa-robot',
        title: 'Automático',
        description: 'O E.A. identifica ciclos automaticamente e abre ordens com base nos últimos candles do dia. Ideal para quem quer operar com menos intervenção manual.',
        features: [
          'Detecção automática de ciclos',
          'Entradas baseadas em padrões',
          'Menor necessidade de monitoramento',
        ],
      },
      {
        icon: 'fa-mouse-pointer',
        title: 'Manual',
        description: 'Você recebe alerts sonoros e visuais quando uma operação é identificada, mas precisa confirmar a entrada manualmente.',
        features: [
          'Notificações em tempo real',
          'Controle total sobre entradas',
          'Ideal para traders ativos',
        ],
      },
    ],
  },
]

export default function ManualPage() {
  return (
    <div className="py-16 bg-[#1e2329]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#ffd700]/10 text-[#ffd700] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-book-open" aria-hidden="true"></i>
              <span>Documentação Oficial</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-6">
              Manual do Usuário
            </h1>
            <p className="text-[#a0a0a0] text-lg mb-8">
              Guia completo para instalar, configurar e operar o Expert Advisor Velociclos PCM no MetaTrader 5.
            </p>
            <div className="flex gap-8 flex-wrap mb-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#ffd700]">v7.33</span>
                <span className="text-sm text-[#707070]">Versão Atual</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#ffd700]">MT5</span>
                <span className="text-sm text-[#707070]">Plataforma</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#ffd700]">5</span>
                <span className="text-sm text-[#707070]">Configurações</span>
              </div>
            </div>
          </div>
        </section>

        {manualSections.map((section) => (
          <section key={section.id} className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#dcdcdc] flex items-center gap-3 mb-3">
                <i className={`fas ${section.icon}`} aria-hidden="true"></i>
                {section.title}
              </h2>
              <p className="text-[#a0a0a0]">{section.description}</p>
            </div>

            {section.steps && (
              <div className="space-y-6">
                {section.steps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#ffd700] text-[#1e2329] rounded-full flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#dcdcdc] mb-2">{step.title}</h3>
                      <p className="text-[#a0a0a0] mb-2">
                        {step.content}{' '}
                        {step.link && (
                          <a href={step.link} className="text-[#ffd700] hover:underline">
                            {step.linkText}
                          </a>
                        )}
                      </p>
                      {step.hint && (
                        <div
                          className={`mt-2 p-3 rounded-lg text-sm ${
                            step.hintType === 'warning'
                              ? 'bg-[#450a0a]/20 border border-[#ef4444]/30 text-[#fca5a5]'
                              : 'bg-[#343a47]/50 border border-[#404857] text-[#a0a0a0]'
                          }`}
                        >
                          <i className={`${step.hintIcon} mr-2`} aria-hidden="true"></i>
                          {step.hint}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.modes && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {section.modes.map((mode) => (
                  <div
                    key={mode.title}
                    className="bg-[#2a2e39] border border-[#404857] rounded-xl p-8 transition-all hover:border-[#ffd700]"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-lg flex items-center justify-center text-[#1e2329]">
                        <i className={`fas ${mode.icon}`} aria-hidden="true"></i>
                      </div>
                      <h3 className="text-2xl font-bold text-[#dcdcdc]">{mode.title}</h3>
                    </div>
                    <p className="text-[#a0a0a0] mb-4">{mode.description}</p>
                    {mode.features && (
                      <ul className="space-y-2">
                        {mode.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                            <i className="fas fa-check text-[#00ff7f]" aria-hidden="true"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
