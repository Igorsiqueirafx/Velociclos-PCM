'use client'

import { useState, useEffect } from 'react'
import { getLeads, type Lead, type LeadStats } from '@/lib/repositories/leads'
import AdminPageHeader from '@/components/AdminPageHeader'

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<LeadStats>({ total: 0, thisMonth: 0, sources: {} })

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const result = await getLeads()
      setLeads(result.leads)
      setStats(result.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#0071e3] text-xl">Carregando leads…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Leads" subtitle="Gerenciamento de leads capturados" showForm={false} onToggle={() => {}} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Total de Leads</p>
          <p className="text-3xl font-bold text-[#0071e3]">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Este Mês</p>
          <p className="text-3xl font-bold text-[#00ff7f]">{stats.thisMonth}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Origens</p>
          <p className="text-3xl font-bold text-[#dcdcdc]">{Object.keys(stats.sources).length}</p>
        </div>
      </div>

      <div className="card">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#707070]"></i>
          <input
            type="text"
            placeholder="Buscar por email ou nome…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[#dcdcdc] mb-4">
          Lista de Leads ({filteredLeads.length})
        </h2>
        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#404857]">
                  <th className="pb-3 text-[#a0a0a0] font-medium">Nome</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Email</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">UTM</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Origem</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                    <td className="py-3 text-[#dcdcdc]">{lead.name || '—'}</td>
                    <td className="py-3 text-[#dcdcdc]">{lead.email || '—'}</td>
                    <td className="py-3">
                      {lead.utm_campaign ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-[#0071e3]/10 text-[#0071e3]">
                          {lead.utm_campaign}
                        </span>
                      ) : (
                        <span className="text-[#707070]">—</span>
                      )}
                    </td>
                    <td className="py-3 text-[#a0a0a0]">{lead.utm_source || 'direct'}</td>
                    <td className="py-3 text-[#a0a0a0]">
                      {new Date(lead.created_at).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#a0a0a0] text-center py-8">
            {searchTerm ? 'Nenhum lead encontrado com os filtros aplicados.' : 'Nenhum lead encontrado.'}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg p-4">
          <p className="text-[#ff6b6b]">Erro: {error}</p>
        </div>
      )}
    </div>
  )
}
