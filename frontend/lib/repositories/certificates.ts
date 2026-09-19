import { apiGet } from '@/lib/api'
import { logEvent } from '@/lib/logging'

export type CertificateRow = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  order_index: number
  created_at: string
}

// Fallback static data when backend is unavailable or empty
const FALLBACK_CERTIFICATES: CertificateRow[] = [
  {
    id: 'formula-ouro',
    title: 'Fórmula do Ouro',
    description: 'Certificado de conclusão do curso Fórmula do Ouro',
    image_url: '/certificados/Formula do Ouro.webp',
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'laboratorio-fimathe',
    title: 'Laboratório Fimathe',
    description: 'Certificado do Laboratório Fimathe',
    image_url: '/certificados/Laboratorio Fimathe.webp',
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'masterclass-fimathe',
    title: 'MasterClass Fimathe',
    description: 'Certificado de participação na MasterClass',
    image_url: '/certificados/MasterClass Fimathe.webp',
    order_index: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'metodo-fimathe',
    title: 'Método Fimathe',
    description: 'Certificado de conclusão do Método Fimathe',
    image_url: '/certificados/Metodo Fimathe.webp',
    order_index: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'scalper',
    title: 'Scalper',
    description: 'Certificado de conclusão do curso de Scalper',
    image_url: '/certificados/Scalper.webp',
    order_index: 5,
    created_at: new Date().toISOString(),
  },
]

export async function getCertificates(): Promise<CertificateRow[]> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return FALLBACK_CERTIFICATES
  }

  try {
    const data = await apiGet<unknown[]>('/api/certificates')
    
    if (data && data.length > 0) {
      return (data as CertificateRow[]).map((cert) => ({
        ...cert,
        image_url: (cert as Record<string, unknown>).image ? String((cert as Record<string, unknown>).image) : cert.image_url,
      }))
    }
    
    // Use fallback data if backend returns empty
    return FALLBACK_CERTIFICATES
  } catch (e) {
    logEvent('certificates_load', 'error', 'Failed to load certificates', { error: e instanceof Error ? e.message : String(e) })
    return FALLBACK_CERTIFICATES
  }
}