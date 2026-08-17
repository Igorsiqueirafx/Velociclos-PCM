import { Metadata } from 'next'
import CertificadosClient from './CertificadosClient'

export const metadata: Metadata = {
  title: 'Certificados - Velociclos PCM | Conquistas Fimathe',
  description: 'Veja os certificados e conquistas da Velociclos PCM. Certificações em Forex, Trading e Investimentos.',
}

export default async function CertificadosPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'
  let certificates = []
  try {
    const res = await fetch(`${BACKEND_URL}/api/certificates`, {
      next: { revalidate: 60 },
    })
    if (res.ok) {
      certificates = await res.json()
    }
  } catch (e) {
    console.error('Failed to load certificates:', e)
  }

  return <CertificadosClient initialCertificates={certificates} />
}
