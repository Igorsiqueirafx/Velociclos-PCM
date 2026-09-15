import { Metadata } from 'next'
import { logEvent } from '@/lib/logging'
import { getCertificates } from '@/lib/repositories/certificates'
import CertificadosClient from './CertificadosClient'

export const metadata: Metadata = {
  title: 'Certificados - Velociclos PCM | Conquistas Fimathe',
  description: 'Veja os certificados e conquistas da Velociclos PCM. Certificações em Forex, Trading e Investimentos.',
}

interface Certificate {
  id: string
  title: string
  description: string
  image: string | null
}

export default async function CertificadosPage() {
  let certificates: Certificate[] = []
  try {
    const rawCertificates = await getCertificates()
    certificates = rawCertificates.map((cert) => ({
      id: cert.id,
      title: cert.title,
      description: cert.description || '',
      image: cert.image_url,
    }))
  } catch (e) {
    logEvent('certificates_load', 'error', 'Failed to load certificates', { error: e instanceof Error ? e.message : String(e) })
  }

  return <CertificadosClient initialCertificates={certificates} />}
