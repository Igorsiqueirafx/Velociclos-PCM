import { createClient } from '@/app/lib/supabase/server'
import { Metadata } from 'next'
import ArtigosClient from './ArtigosClient'

export const metadata: Metadata = {
  title: 'Artigos - Velociclos PCM | Trading, Forex e Mesas Proprietárias',
  description: 'Artigos completos sobre Forex, trading e mesas proprietárias. Conteúdo exclusivo sobre análise técnica, gestão de risco e estratégias Fimathe.',
}

export default async function ArtigosPage() {
  const supabase = createClient()
  let articles = []
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    if (!error) articles = data || []
  } catch (e) {
    console.error('Failed to load articles:', e)
  }

  return <ArtigosClient initialArticles={articles} />
}
