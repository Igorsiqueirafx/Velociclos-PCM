import { createClient } from '@/app/lib/supabase/server'
import { Metadata } from 'next'
import CertificadosClient from './CertificadosClient'

export const metadata: Metadata = {
  title: 'Certificados - Velociclos PCM | Conquistas Fimathe',
  description: 'Veja os certificados e conquistas da Velociclos PCM. Certificações em Forex, Trading e Investimentos.',
}

export default async function CertificadosPage() {
  const supabase = await createClient()
  let certificates = []
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('order_index', { ascending: true })

    if (!error) certificates = data || []
  } catch (e) {
    console.error('Failed to load certificates:', e)
  }

  return <CertificadosClient initialCertificates={certificates} />}
