import './globals.css'
import './glassify.css'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Velociclos PCM - Automação de Mercado | Opere com Liberdade!',
  description: 'Automação de Mercado - Velociclos PCM. Opere com liberdade usando Expert Advisor, método Fimathe e cursos gratuitos.',
  keywords: 'trading, forex, ouro, expert advisor, automação, fimathe, cursos grátis',
  authors: [{ name: 'Velociclos' }],
  openGraph: {
    title: 'Velociclos PCM - Automação de Mercado | Opere com Liberdade!',
    description: 'Automação de Mercado - Velociclos PCM. Opere com liberdade usando Expert Advisor, método Fimathe e cursos gratuitos.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Velociclos PCM',
    url: 'https://velociclos.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Velociclos PCM - Automação de Mercado',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velociclos PCM - Automação de Mercado | Opere com Liberdade!',
    description: 'Automação de Mercado - Velociclos PCM. Opere com liberdade usando Expert Advisor, método Fimathe e cursos gratuitos.',
    images: ['/og-image.png'],
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
  return (
    <html lang="pt-BR" data-theme="dark" className="scroll-smooth">
       <head>
         <link
           rel="stylesheet"
           href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
         />
         <link
           rel="stylesheet"
           href="https://unpkg.com/boxicons@2.1.4/dist/css/boxicons.min.css"
         />
         {process.env.NEXT_PUBLIC_GA_ID && (
           <>
             <Script
               src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
               strategy="afterInteractive"
             />
             <Script id="ga-init" strategy="afterInteractive">
               {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
             </Script>
           </>
         )}
       </head>
      <body className="bg-[var(--cor-fundo)] text-[var(--cor-texto-principal)] font-primary antialiased">
        <SkipLink />
        <Header />
        <main
          id="main-content"
          className="min-h-[calc(100vh-120px)]"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only fixed top-4 left-4 z-[9999] px-4 py-2 bg-[#1e1e1e] text-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#0071e3] transition-transform"
    >
      Ir para o conteúdo
    </a>
  )
}