import { createClient } from '@/app/lib/supabase/client'
import { logEvent } from '@/lib/logging'

export interface Subscriber {
  id: string
  email: string
  source: string
  created_at: string
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    logEvent('subscribers_load', 'error', 'Failed to load subscribers', { error: error?.message || 'Unknown error' })
    return []
  }

  return data || []
}
