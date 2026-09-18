import { Metadata } from 'next'
import { logEvent } from '@/lib/logging'
import { getCertificates } from '@/lib/repositories/certificates'
import CertificadosClient from './CertificadosClient'

export const metadata: Metadata = {
  title: 'Certificados - Velociclos PCM | Igor Siqueira',
  description: 'Certificados que comprovam a capacitação técnica de Igor Siqueira para divulgar o método Fimathe de Marcelo Ferreira e democratizar o acesso ao Mercado Forex.',
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
