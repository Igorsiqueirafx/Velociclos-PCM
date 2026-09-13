import { Metadata } from 'next'
import { logEvent } from '@/lib/logging'
import { getCertificates } from '@/lib/repositories/certificates'
import CertificadosClient from './CertificadosClient'

export const metadata: Metadata = {
  title: 'Certificados - Velociclos PCM | Conquistas Fimathe',
  description: 'Veja os certificados e conquistas da Velociclos PCM. Certificações em Forex, Trading e Investimentos.',
}

export default async function CertificadosPage() {
  let certificates: Awaited<ReturnType<typeof getCertificates>> = []
  try {
    certificates = await getCertificates()
  } catch (e) {
    logEvent('certificates_load', 'error', 'Failed to load certificates', { error: e instanceof Error ? e.message : String(e) })
  }

  return <CertificadosClient initialCertificates={certificates} />}
