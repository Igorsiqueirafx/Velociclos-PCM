'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import Link from 'next/link'

interface Lead {
  id: string
  email: string | null
  name: string | null
  phone: string | null
  utm_campaign: string | null
  utm_source: string | null
  status: string | null
  created_at: string
}

export default function LeadsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth/login')
        return
      }
      setSessionChecked(true)
      fetchLeads()
    })
  }, [router, supabase])

  const fetchLeads = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data, error: supabaseError } = await supabase
      .from('leads')
      .select('*')
      .eq('email', session.user.email)
      .order('created_at', { ascending: false })

    if (supabaseError) {
      console.error('Error fetching leads:', supabaseError)
    } else {
      setLeads(data || [])
    }
    setLoading(false)
  }

  if (!sessionChecked || loading) {
    return (
      <div className="min-h-screen bg-[#1e2329] flex items-center justify-center">
        <div className="text-[#ffd700] text-xl">Carregando…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)`,
        }}
      />
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ffd700]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ffd700]/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#dcdcdc]">Meus Leads</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-[#1e2329] border border-[#404857] rounded-lg text-[#a0a0a0] hover:text-[#dcdcdc] hover:border-[#ffd700]/30 transition-all text-sm"
          >
            Voltar ao Dashboard
          </Link>
        </div>

        {leads.length > 0 ? (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-[#2a2e39] border border-[#404857] rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#dcdcdc]">{lead.name || 'Sem nome'}</p>
                    <p className="text-[#a0a0a0]">{lead.email || 'Sem email'}</p>
                    {lead.phone && <p className="text-[#a0a0a0]">{lead.phone}</p>}
                    {lead.utm_campaign && (
                      <span className="inline-block px-2 py-1 bg-[#ffd700]/10 text-[#ffd700] rounded-full text-xs">
                        {lead.utm_campaign}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#a0a0a0]">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-12 text-center">
            <i className="fas fa-inbox text-4xl text-[#404857] mb-4"></i>
            <p className="text-[#a0a0a0]">Nenhum lead encontrado para este usuário.</p>
          </div>
        )}
      </div>
    </div>
  )
}
