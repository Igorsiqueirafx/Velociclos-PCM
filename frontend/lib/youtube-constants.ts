import type { YouTubePlaylist } from './youtube-types'

export const PLAYLIST_CATEGORIES: Record<string, string> = {
  'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I': 'checkpoint',
  'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9': 'fundamentos',
  'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh': 'analise-mercado',
  'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK': 'xauusd',
  'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ': 'scalping',
  'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD': 'imersao',
  'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5': 'eurusd',
  'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV': 'ouro',
};

export const VIDEO_CATEGORIES: Record<string, string[]> = {
  'exaustao': ['exaustão', 'exhaustion', '80%', '100%', 'máxima', 'correção', 'reversão'],
  'canal': ['canal', 'channel', 'ponto-a', 'ponto-b', 'referência', 'zona neutra', 'abertura'],
  'erro': ['erro', 'mistake', 'cuidado', 'atenção', 'não faça', 'evite', 'armadilha'],
  'rotina': ['rotina', 'rotina do trader', 'hábito', 'disciplina', 'gestão emocional', 'psicologia'],
  'setup': ['setup', 'entrada', 'operação', 'compra', 'venda', 'take profit', 'stop loss', 'execução'],
};

export const STATIC_PLAYLISTS: YouTubePlaylist[] = [
  {
    id: 'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I',
    title: 'Fimathe Checkpoint | FOREX',
    description: 'Fimathe Checkpoint é o momento em que o Marcelão revisita tudo o que foi estudado e confere as movimentações do mercado.',
    thumbnail: 'https://img.youtube.com/vi/C77_DevBR8w/maxresdefault.jpg',
    videoCount: 15,
    category: 'checkpoint',
  },
  {
    id: 'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9',
    title: 'Primórdios da Fimathe',
    description: 'Série que revela a jornada de criação da Fimathe, método revolucionário no Forex.',
    thumbnail: 'https://img.youtube.com/vi/rl_UgvfXdfw/maxresdefault.jpg',
    videoCount: 5,
    category: 'fundamentos',
  },
  {
    id: 'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh',
    title: 'Marcelão in London [2024]',
    description: 'Acompanhe as análises gráficas do Marcelão direto de Londres.',
    thumbnail: 'https://img.youtube.com/vi/mhg53yJpq2k/maxresdefault.jpg',
    videoCount: 3,
    category: 'analise-mercado',
  },
  {
    id: 'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK',
    title: 'As melhores do XAUUSD',
    description: 'Os melhores momentos operando XAUUSD (Ouro) com a metodologia Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/EoVfQJoWLPU/maxresdefault.jpg',
    videoCount: 2,
    category: 'xauusd',
  },
  {
    id: 'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ',
    title: 'FOREX SCALPER FIMATHE',
    description: 'Operando Forex com a técnica Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/Zu57DaCN9Es/maxresdefault.jpg',
    videoCount: 20,
    category: 'scalping',
  },
  {
    id: 'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD',
    title: 'IMERSÃO MÉTODO FIMATHE',
    description: 'Aprofunde-se no Método Fimathe com esta imersão completa.',
    thumbnail: 'https://img.youtube.com/vi/6xcNZAyftXY/maxresdefault.jpg',
    videoCount: 2,
    category: 'imersao',
  },
  {
    id: 'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5',
    title: 'ESTUDOS EM EUR/USD',
    description: 'Estudos e análises do par EUR/USD com a Técnica Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/HcSWF3rPaw0/maxresdefault.jpg',
    videoCount: 10,
    category: 'eurusd',
  },
  {
    id: 'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV',
    title: 'FIMATHE NO OURO',
    description: 'Operando ouro (XAU/USD) com a metodologia Fimathe.',
    thumbnail: 'https://img.youtube.com/vi/1MpCAh6Ost4/maxresdefault.jpg',
    videoCount: 6,
    category: 'ouro',
  },
]

export const PLAYLIST_MAP: Record<string, string> = {
  'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I': 'Fimathe Checkpoint | FOREX',
  'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9': 'Primórdios da Fimathe',
  'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh': 'Marcelão in London [2024]',
  'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK': 'As melhores do XAUUSD',
  'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ': 'FOREX SCALPER FIMATHE',
  'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD': 'IMERSÃO MÉTODO FIMATHE',
  'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5': 'ESTUDOS EM EUR/USD',
  'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV': 'FIMATHE NO OURO',
}

export const CATEGORY_LABELS: Record<string, string> = {
  'checkpoint': 'Checkpoint',
  'fundamentos': 'Fundamentos',
  'analise-mercado': 'Análise de Mercado',
  'xauusd': 'XAU/USD',
  'scalping': 'Scalping',
  'imersao': 'Imersão',
  'eurusd': 'EUR/USD',
  'ouro': 'Fimathe no Ouro',
  'geral': 'Geral',
}
