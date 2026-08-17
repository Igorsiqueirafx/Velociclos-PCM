import { Metadata } from 'next'
import ArtigosClient from './ArtigosClient'

export const metadata: Metadata = {
  title: 'Artigos - Velociclos PCM | Trading, Forex e Mesas Proprietárias',
  description: 'Artigos completos sobre Forex, trading e mesas proprietárias. Conteúdo exclusivo sobre análise técnica, gestão de risco e estratégias Fimathe.',
}

export default async function ArtigosPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'
  let articles = []
  try {
    const res = await fetch(`${BACKEND_URL}/api/articles`, {
      next: { revalidate: 60 },
    })
    if (res.ok) {
      articles = await res.json()
    }
  } catch (e) {
    console.error('Failed to load articles:', e)
  }

  return <ArtigosClient initialArticles={articles} />
}
