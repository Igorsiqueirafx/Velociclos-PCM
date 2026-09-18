import type { Section } from './fimathe-docs-types'

export const sections: Section[] = [
  {
    id: 'historia',
    title: '1. Contexto Histórico e Evolução',
    body: 'O método FIMATHE foi desenvolvido por Marcelo Ferreira, trader profissional com mais de 23 anos de experiência no mercado financeiro. Criado para corrigir erros da análise gráfica tradicional, o método evoluiu de uma estratégia pessoal para a técnica de análise técnica mais utilizada nos países de língua portuguesa.',
    stats: [
      { value: '150K+', label: 'Alunos Treinados' },
      { value: '23+', label: 'Anos de Mercado' },
      { value: '446K', label: 'Inscritos no YouTube' },
    ],
  },
  {
    id: 'fundamentos',
    title: '2. Fundamentos Teóricos',
    body: 'O método FIMATHE baseia-se em princípios matemáticos e na sequência de Fibonacci para criar regras objetivas de entrada e saída no mercado.',
    pillars: [
      'Sequência de Fibonacci: Usada para definir a largura do canal, alvos de lucro e níveis de retração.',
      'Razão Áurea (1.618): Aplicada em extensões de Fibonacci e relação risco-retorno.',
      'Análise de Estrutura de Preço: Identificação objetiva de swing highs e swing lows.',
      'Probabilidade de Rompimento: Abordagem estatística para breakouts de canal.',
    ],
    fibLevels: [
      { pct: '23.6%', label: 'Retração' },
      { pct: '38.2%', label: 'Retração' },
      { pct: '61.8%', label: 'Retração Áurea' },
      { pct: '161.8%', label: 'Extensão Principal' },
    ],
  },
  {
    id: 'mecanica',
    title: '3. Mecânica Técnica do PCM',
    body: 'O Price Channel Method (PCM) é o coração da estratégia FIMATHE. Trata-se de um sistema de rompimento de canal de preço com regras objetivas de entrada, saída e gerenciamento de risco.',
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
    ],
  },
  {
    id: 'zona-neutra',
    title: '4. Zona Neutra',
    body: 'A Zona Neutra é um conceito distintivo do FIMATHE que adiciona uma camada extra de filtragem às operações.',
    bullets: [
      'Definida como o quartil central (50%) do canal.',
      'Atua como zona de decisão durante consolidação.',
      'Rompimento da Zona Neutra confirma viés direcional.',
      'Gera sinais de <strong>Breakout NZ</strong> para ativação de canais de lucro.',
    ],
  },
  {
    id: 'regras',
    title: '5. Regras de Entrada e Saída',
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
    title: '6. Aplicação por Timeframe',
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
    title: '7. Gestão de Risco',
    riskItems: [
      {
        title: 'Position Sizing',
        text: 'Risco máximo de 1-2% por trade. Tamanho baseado na distância entrada-stop. Sem martingale ou aumento de posição em prejuízo.',
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
    title: '8. Ferramentas e Implementação',
    tools: [
      {
        title: 'Indicador Oficial para MetaTrader 5',
        text: 'Suporte e resistência interativos, canal de referência automático, zona neutra com slicing em quartis, alertas visuais e sonoros de rompimento, modos Uptrend/Downtrend.',
      },
      {
        title: 'Implementações Open Source',
        text: 'O projeto <strong>cgmello/fimathe-pcm</strong> no GitHub oferece gráficos interativos estilo TradingView, motor de backtesting, visualização de canais e estatísticas de trades.',
      },
    ],
  },
  {
    id: 'criticas',
    title: '9. Críticas e Limitações',
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
    title: '10. Conclusão',
    paragraphs: [
      'O método FIMATHE representa uma abordagem sistematizada e matematicamente orientada para trading de rompimento de canal. Suas características definidoras são regras objetivas para formação de canal, alvos de lucro baseados em Fibonacci, confirmação obrigatória de entrada e o conceito de Zona Neutra.',
      'Embora o método tenha demonstrado popularidade significativa e produzido traders bem-sucedidos, sua eficácia depende de implementação disciplinada, seleção apropriada de mercado e gerenciamento de risco rigoroso. A disponibilidade de implementações open-source e indicadores para MetaTrader facilita o teste e validação, mas traders devem realizar extensivos backtests e testes forward antes de operar com capital real.',
    ],
  },
]
