import { apiGet } from '@/lib/api'
import { logEvent } from '@/lib/logging'

export type ArticleRow = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  is_published: boolean
  published_at: string
  created_at: string
  content?: string | null
  tags?: string[] | null
}

const FALLBACK_ARTICLES: ArticleRow[] = [
  {
    id: 'mitos-prop-firms',
    title: '5 Mitos sobre Mesas Proprietárias no Forex',
    slug: 'mitos-prop-firms',
    excerpt: 'Existem muitos mitos sobre mesas proprietárias circulando no mercado. Entenda o que é verdade, o que é mentira e como identificar uma empresa séria.',
    cover_image: null,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'm15-m5-timeframe',
    title: 'M15 ou M5: Qual Timeframe Oferece Mais Assertividade?',
    slug: 'm15-m5-timeframe',
    excerpt: 'Entenda as diferenças entre operar no M5 e no M15, qual oferece mais precisão e qual tem maior poder de recuperação.',
    cover_image: null,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'operar-mesaproprietaria',
    title: 'O Que Precisa de Saber Antes de Operar em Mesa Proprietária',
    slug: 'operar-mesaproprietaria',
    excerpt: 'A maioria falha por não entender as regras do jogo. Aprenda a proteger seu capital, usar sub-ciclos e evitar erros.',
    cover_image: null,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'overtrading',
    title: 'Overtrading: O Vício que Destrói Contas de Trading',
    slug: 'overtrading',
    excerpt: 'O overtrading é um dos maiores vilões. Entenda por que acontece e como aplicar gerenciamento rigoroso.',
    cover_image: null,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'ganhos-prop-trader',
    title: 'Quanto Pode Ganhar um Trader numa Mesa Proprietária?',
    slug: 'ganhos-prop-trader',
    excerpt: 'Descubra o potencial real de ganhos, com cálculos práticos de lotes, gestão de drawdown e exemplos.',
    cover_image: null,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'noticias-volatility',
    title: 'Devo Evitar Operar em Notícias? A Visão da Volatilidade',
    slug: 'noticias-volatility',
    excerpt: 'Muitos evitam notícias por medo. Descubra por que a volatilidade é sua aliada e como usar o calendário.',
    cover_image: null,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
]

export async function getPublishedArticles(): Promise<ArticleRow[]> {
  try {
    const articles = await apiGet<ArticleRow[]>('/api/articles')
    if (articles && articles.length > 0) {
      return articles
    }
    return FALLBACK_ARTICLES
  } catch (e) {
    logEvent('articles_load', 'error', 'Failed to load articles', { error: e instanceof Error ? e.message : String(e) })
    return FALLBACK_ARTICLES
  }
}
