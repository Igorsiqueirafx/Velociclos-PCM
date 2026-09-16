import { apiGet } from '@/lib/api'
import { logEvent } from '@/lib/logging'

export interface Lead {
  id: string
  email: string | null
  name: string | null
  phone: string | null
  utm_campaign: string | null
  utm_source: string | null
  utm_medium: string | null
  status: string | null
  created_at: string
}

export interface LeadStats {
  total: number
  thisMonth: number
  sources: Record<string, number>
}

export async function getLeads(): Promise<{ leads: Lead[]; stats: LeadStats }> {
  try {
    const data = await apiGet<Lead[]>('/api/leads')
    
    const sources: Record<string, number> = {}
    let thisMonth = 0
    const now = new Date()

    data.forEach((lead: Lead) => {
      const source = lead.utm_source || 'direct'
      sources[source] = (sources[source] || 0) + 1

      const date = new Date(lead.created_at)
      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        thisMonth++
      }
    })

    return {
      leads: data,
      stats: {
        total: data.length,
        thisMonth,
        sources,
      },
    }
  } catch (error) {
    logEvent('leads_load', 'error', 'Failed to load leads', { error: error instanceof Error ? error.message : 'Unknown error' })
    return { leads: [], stats: { total: 0, thisMonth: 0, sources: {} } }
  }
}