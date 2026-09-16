import { apiGet } from '@/lib/api'
import { logEvent } from '@/lib/logging'

export interface Subscriber {
  id: string
  email: string
  source: string
  created_at: string
}

export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await apiGet<Subscriber[]>('/api/subscribers')
    return data || []
  } catch (error) {
    logEvent('subscribers_load', 'error', 'Failed to load subscribers', { error: error instanceof Error ? error.message : 'Unknown error' })
    return []
  }
}