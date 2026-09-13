import { createClient } from '@/app/lib/supabase/server'
import { logEvent } from '@/lib/logging'

export type CertificateRow = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  order_index: number
  created_at: string
}

export async function getCertificates(): Promise<CertificateRow[]> {
  const supabase = await createClient()
  let certificates: CertificateRow[] = []
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('order_index', { ascending: true })

    if (!error) {
      certificates = (data || []).map((cert) => ({
        ...cert,
        image_url: cert.image || cert.image_url,
      })) as CertificateRow[]
    }
  } catch (e) {
    logEvent('certificates_load', 'error', 'Failed to load certificates', { error: e instanceof Error ? e.message : String(e) })
  }
  return certificates
}
