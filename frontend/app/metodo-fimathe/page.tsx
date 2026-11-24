import { Metadata } from 'next'
import MetodoFimathePage from '@/components/MetodoFimathePage'

export const metadata: Metadata = {
  title: 'O Método Fimathe | A Nova Análise Gráfica | Velociclos PCM',
  description: 'Assista às aulas completas do Método Fimathe, a análise gráfica que está transformando traders. Conteúdo 100% gratuito.',
  openGraph: {
    title: 'O Método Fimathe | A Nova Análise Gráfica | Velociclos PCM',
    description: 'Assista às aulas completas do Método Fimathe, a análise gráfica que está transformando traders. Conteúdo 100% gratuito.',
    type: 'website',
    images: [{ url: '/og-metodo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O Método Fimathe | A Nova Análise Gráfica | Velociclos PCM',
    description: 'Assista às aulas completas do Método Fimathe. Conteúdo 100% gratuito.',
    images: ['/og-metodo.png'],
  },
}

export default MetodoFimathePage
