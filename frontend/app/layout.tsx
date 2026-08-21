import { Space_Grotesk, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'Velociclos PCM - Automação de Mercado | Opere com Liberdade!',
  description: 'Automação de Mercado - Velociclos PCM. Opere com liberdade usando Expert Advisor, método Fimathe e cursos gratuitos.',
  keywords: 'trading, forex, ouro, expert advisor, automação, fimathe, cursos grátis',
  authors: [{ name: 'Velociclos' }],
  openGraph: {
    title: 'Velociclos PCM - Automação de Mercado | Opere com Liberdade!',
    description: 'Automação de Mercado - Velociclos PCM. Opere com liberdade usando Expert Advisor, método Fimathe e cursos gratuitos.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdminSite = process.env.NEXT_PUBLIC_IS_ADMIN_SITE === 'true'

  return (
    <html lang="pt-BR" data-theme="dark" className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetBrainsMono.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        />
      </head>
      <body className="bg-[#0f1115] text-[#e8e8e8] font-body antialiased">
        <SkipLink />
        {!isAdminSite && <Header />}
        <main
          id="main-content"
          className={isAdminSite ? "min-h-screen" : "min-h-[calc(100vh-120px)]"}
        >
          {children}
        </main>
        {!isAdminSite && <Footer />}
      </body>
    </html>
  )
}

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only fixed top-4 left-4 z-[9999] px-4 py-2 bg-[#1e2329] text-[#e8e8e8] rounded-md focus:ring-2 focus:ring-[#ffd700] transition-transform"
    >
      Ir para o conteúdo
    </a>
  )
}

