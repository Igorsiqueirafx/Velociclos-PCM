import './globals.css'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { resolveIsAdminSite } from '@/lib/admin-config'

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const host = headersList.get('host')
  const isAdminSite = resolveIsAdminSite(host)

  return (
    <html lang="pt-BR" data-theme="dark" className="scroll-smooth">
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
      <body className="bg-[#1e2329] text-[#dcdcdc] font-sans antialiased">
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
      className="sr-only focus:not-sr-only fixed top-4 left-4 z-[9999] px-4 py-2 bg-[#2a2e39] text-[#dcdcdc] rounded-md focus:ring-2 focus:ring-[#ffd700] transition-transform"
    >
      Ir para o conteúdo
    </a>
  )
}

