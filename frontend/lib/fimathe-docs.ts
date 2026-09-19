import type { Section } from './fimathe-docs-types'

export const sections: Section[] = [
  {
    id: 'historia',
    title: '1. Contexto Histórico e Evolução',
    body: 'O Método Fimathe foi criado por Marcelo Ferreira, trader profissional com mais de 25 anos de experiência no mercado financeiro. Natural de Cataguases, interior de Minas Gerais, Marcelo começou sua trajetória no mercado ainda jovem, após trabalhar como entregador de remédios na Barra da Tijuca, Rio de Janeiro. Ele perdeu mais da metade do seu patrimônio inicial, mas essa experiência o motivou a estudar ainda mais as técnicas clássicas de análise gráfica até desenvolver a Fimathe — uma metodologia própria baseada em Fibonacci e matemática.',
    stats: [
      { value: '180K+', label: 'Pessoas impactadas' },
      { value: '25+', label: 'Anos de Mercado' },
      { value: '650K+', label: 'Seguidores nas redes' },
    ],
  },
  {
    id: 'criador',
    title: '2. Marcelo Ferreira',
    body: 'Marcelo Ferreira é mais do que um trader: é um estudioso e visionário. Ele é o criador da Técnica Fimathe, hoje a metodologia de análise gráfica mais utilizada em toda a América Latina e nos países de língua portuguesa. Ele criou conceitos fundamentais como Zonas Neutras e Canais de Referência, Linhas do Equador, Teoria Macro, Micro e do Ciclo do Canal, Subciclo e o famoso "Stop Fora da Caixinha", além da Teoria dos Ciclos Fimathe.',
    highlights: [
      'Mais de 25 anos de experiência no mercado financeiro',
      'Criador da Técnica Fimathe: análise gráfica baseada em Fibonacci e matemática',
      'Reconhecido por operar com consistência ao longo de mais de uma década',
      'CEO do Grupo Fimathe, que inclui Fimathe App, Fimathe Prop, Robô Fimathe 2.0 e o Fimathe Experience',
    ],
  },
  {
    id: 'fundamentos',
    title: '3. Fundamentos Teóricos',
    body: 'O Método Fimathe baseia-se em princípios matemáticos e na sequência de Fibonacci para criar regras objetivas de entrada e saída no mercado. Diferente da análise gráfica tradicional, que pode ser subjetiva, a Fimathe usa geometria e matemática pura para eliminar o achismo e trazer clareza às operações.',
    pillars: [
      'Sequência de Fibonacci: Usada para definir a largura do canal, alvos de lucro e níveis de retração.',
      'Razão Áurea (1.618): Aplicada em extensões de Fibonacci e relação risco-retorno.',
      'Análise de Estrutura de Preço: Identificação objetiva de swing highs e swing lows.',
      'Probabilidade de Rompimento: Abordagem estatística para breakouts de canal.',
      'Zona Neutra: Filtro decisório baseado no quartil central do canal.',
      'Canais de Referência: Estrutura horizontal que delimita o campo de preço.',
    ],
    fibLevels: [
      { pct: '23.6%', label: 'Retração' },
      { pct: '38.2%', label: 'Retração' },
      { pct: '61.8%', label: 'Retração Áurea' },
      { pct: '161.8%', label: 'Extensão Principal' },
    ],
  },
  {
    id: 'conceitos',
    title: '4. Conceitos Fundamentais',
    body: 'A Fimathe introduz diversos conceitos proprietários que diferenciam a metodologia de outras formas de análise técnica. Esses conceitos foram desenvolvidos ao longo de anos de operação e validação prática.',
    concepts: [
      {
        title: 'Zona Neutra',
        description: 'A Zona Neutra é o quartil central do canal. Ela funciona como uma zona de decisão durante a consolidação. O rompimento dessa zona confirma o viés direcional e gera sinais de Breakout NZ para ativação de canais de lucro.',
      },
      {
        title: 'Canais de Referência',
        description: 'Linhas horizontais traçadas com base no Highest High e Lowest Low das primeiras velas do período. O preço deve operar dentro desses limites até que ocorra um rompimento válido.',
      },
      {
        title: 'Linhas do Equador',
        description: 'Conceito que divide o canal em zonas de equilíbrio e desequilíbrio, ajudando o trader a identificar onde o preço está mais propenso a reagir.',
      },
      {
        title: 'Stop Fora da Caixinha',
        description: 'Estratégia de proteção de capital que coloca o stop loss além da máxima/mínima das velas de entrada, evitando ser atingido prematuramente por volatilidade normal.',
      },
    ],
  },
  {
    id: 'pcm',
    title: '5. Mecânica Técnica do PCM',
    body: 'O Price Channel Method (PCM) é o coração da estratégia Fimathe. Trata-se de um sistema de rompimento de canal de preço com regras objetivas de entrada, saída e gerenciamento de risco.',
    steps: [
      {
        num: 1,
        title: 'Formação do Canal',
        text: 'Na abertura do mercado, aguardar as primeiras 4 velas completarem, identificar o Highest High (HH) e Lowest Low (LL), e traçar o canal horizontal.',
      },
      {
        num: 2,
        title: 'Detecção de Rompimento',
        text: 'A partir da 5ª vela: sinal de compra quando fechar acima da linha superior; sinal de venda quando fechar abaixo da linha inferior.',
      },
      {
        num: 3,
        title: 'Confirmação',
        text: 'Para compra: vela de 5min fecha acima e faz pullback. Para venda: vela de 5min fecha abaixo e faz pullback.',
      },
      {
        num: 4,
        title: 'Execução e Gerenciamento',
        text: 'Entrada na confirmação, stop no lado oposto do canal, alvos em extensões Fibonacci. Usar a estratégia de "costurar" para transformar resultados de operações anteriores em novas entradas.',
      },
    ],
  },
  {
    id: 'regras',
    title: '6. Regras de Entrada e Saída',
    entries: {
      long: [
        'Fechamento acima da linha superior do canal',
        'Vela de confirmação com pullback para suporte',
        'Linha superior funciona como suporte',
        'Entrada no teste de suporte confirmado',
      ],
      short: [
        'Fechamento abaixo da linha inferior do canal',
        'Vela de confirmação com pullback para resistência',
        'Linha inferior funciona como resistência',
        'Entrada no teste de resistência confirmado',
      ],
    },
    stopLoss: {
      long: 'Stop na linha inferior do canal (LL das 4 velas iniciais)',
      short: 'Stop na linha superior do canal (HH das 4 velas iniciais)',
    },
    targets: [
      { label: '1º Alvo', value: '127.2% de extensão Fibonacci' },
      { label: '2º Alvo', value: '161.8% de extensão Fibonacci (principal)' },
      { label: '3º Alvo', value: '261.8% de extensão Fibonacci (agressivo)' },
    ],
    exitNote: 'Fechar 50% no primeiro alvo, mover stop para breakeven, deixar o restante correr para os alvos seguintes.',
  },
  {
    id: 'timeframes',
    title: '7. Aplicação por Timeframe',
    timeframes: [
      {
        title: 'Day Trading',
        items: ['Timeframes: 5min, 15min, 1H', 'Ativos: Forex majors, XAU/USD', 'Holding: Intradia', 'Sinais: 1-2 trades/dia'],
      },
      {
        title: 'Scalping',
        items: ['Timeframe: 1 minuto', 'Canal: Primeiros 4 minutos', 'Entrada: Execução rápida', 'Frequência: Alta'],
      },
      {
        title: 'Multi-Timeframe',
        items: ['4H/Daily: Confirmação de tendência', 'Weekly: Suporte/Resistência', 'Filtro de sinais'],
      },
    ],
  },
  {
    id: 'risco',
    title: '8. Gestão de Risco',
    riskItems: [
      {
        title: 'Position Sizing',
        text: 'Risco máximo de 1-2% por trade. Tamanho baseado na distância entrada-stop. Sem martingale ou aumento de posição em prejuízo. Marcelo Ferreira sempre enfatiza: "nunca arrisque mais que 2% em uma operação".',
      },
      {
        title: 'Relação Risco-Retorno',
        rows: [
          { label: 'Day Trade', value: 'Mínimo 1:1.5 | Ideal 1:2.5 a 1:3' },
          { label: 'Scalp', value: 'Mínimo 1:1 | Ideal 1:1.5' },
        ],
      },
      {
        title: 'Estratégias de Stop Loss',
        text: '1. Stop na fronteira do canal (padrão). 2. Stop baseado em Fibonacci além de 61.8%. 3. Stop baseado em ATR (1-2x ATR além do canal). 4. Stop em swing point recente.',
      },
    ],
  },
  {
    id: 'ferramentas',
    title: '9. Ferramentas e Implementação',
    tools: [
      {
        title: 'Indicador Oficial para MetaTrader 5',
        text: 'Suporte e resistência interativos, canal de referência automático, zona neutra com slicing em quartis, alertas visuais e sonoros de rompimento, modos Uptrend/Downtrend.',
      },
      {
        title: 'Robô Fimathe 2.0',
        text: 'Automação da operação com base na primeira entrada da Técnica. Modo PCM Dedicado, decisão automática (corpo x pavio), fatiamento automático e proteção de capital.',
      },
      {
        title: 'Fimathe App',
        text: 'Centro de aprendizado e acompanhamento diário. Inclui análises, setups, conteúdo educacional e suporte para traders de todos os níveis.',
      },
      {
        title: 'Implementações Open Source',
        text: 'O projeto cgmello/fimathe-pcm no GitHub oferece gráficos interativos estilo TradingView, motor de backtesting, visualização de canais e estatísticas de trades.',
      },
    ],
  },
  {
    id: 'criticas',
    title: '10. Críticas e Limitações',
    criticismItems: [
      {
        title: 'Críticas Comuns',
        bullets: [
          'Alvos de alta precisão: Claims de 90%+ de acerto são questionados pela comunidade.',
          'Curva de aprendizado: Identificação e confirmação de canais exigem prática.',
          'Dependência de mercado: Performance varia conforme condições.',
          'Risco de overfitting: Parâmetros Fibonacci podem ser ajustados retrospectivamente.',
        ],
      },
      {
        title: 'Limitações Técnicas',
        bullets: [
          'Falsos rompimentos: Whipsaws em mercados laterais.',
          'Confirmação atrasada: Entradas ocorrem após rompimento inicial.',
          'Sensibilidade à largura: Canais largos geram stops grandes; canais estreitos geram muitos falsos sinais.',
          'Eventos de notícia: Gaps e volatilidade extrema comprometem o método.',
        ],
      },
    ],
  },
  {
    id: 'conclusao',
    title: '11. Conclusão',
    paragraphs: [
      'O Método Fimathe representa uma abordagem sistematizada e matematicamente orientada para trading de rompimento de canal. Suas características definidoras são regras objetivas para formação de canal, alvos de lucro baseados em Fibonacci, confirmação obrigatória de entrada e o conceito de Zona Neutra.',
      'Embora o método tenha demonstrado popularidade significativa e produzido traders bem-sucedidos, sua eficácia depende de implementação disciplinada, seleção apropriada de mercado e gerenciamento de risco rigoroso. A disponibilidade de implementações open-source e indicadores para MetaTrader facilita o teste e validação, mas traders devem realizar extensivos backtests e testes forward antes de operar com capital real.',
    ],
  },
]
