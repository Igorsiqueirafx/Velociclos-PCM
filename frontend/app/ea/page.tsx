import { Metadata } from 'next'
import EaPage from '@/components/EaPage'

export const metadata: Metadata = {
  title: 'Expert Advisor Velociclos PCM | Automação de Mercado',
  description: 'Expert Advisor Velociclos PCM para MetaTrader 5. Baixe o arquivo .ex5, acesse o manual e instale com segurança.',
  openGraph: {
    title: 'Expert Advisor Velociclos PCM | Automação de Mercado',
    description: 'Expert Advisor Velociclos PCM para MetaTrader 5. Baixe o arquivo .ex5, acesse o manual e instale com segurança.',
    type: 'website',
    images: [{ url: '/og-ea.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expert Advisor Velociclos PCM | Automação de Mercado',
    description: 'Expert Advisor Velociclos PCM para MetaTrader 5.',
    images: ['/og-ea.png'],
  },
}

export default EaPage
