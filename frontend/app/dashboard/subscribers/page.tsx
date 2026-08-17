'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/app/lib/supabase/client'

interface Subscriber {
  id: string
  email: string
  source: string
  created_at: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const supabase = createClient()
        const { data, error: supabaseError } = await supabase
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) {
          setError(supabaseError.message)
        } else {
          setSubscribers(data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscribers()
  }, [])

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSource = sourceFilter === 'all' || sub.source === sourceFilter
      return matchesSearch && matchesSource
    })
  }, [subscribers, searchTerm, sourceFilter])

  const sources = useMemo(() => {
    const uniqueSources = Array.from(new Set(subscribers.map((s) => s.source || 'website')))
    return uniqueSources.sort()
  }, [subscribers])

  const totalCount = subscribers.length
  const thisMonth = subscribers.filter((s) => {
    const date = new Date(s.created_at)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando subscribers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="card border-[#ff4444]/30 bg-[#ff4444]/5">
          <p className="text-[#ff6b6b]">Erro: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Subscribers</h1>
        <p className="text-[#a0a0a0]">Gerenciamento de leads e emails cadastrados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Total de Leads</p>
          <p className="text-3xl font-bold text-[#ffd700]">{totalCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Este Mês</p>
          <p className="text-3xl font-bold text-[#00ff7f]">{thisMonth}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Origem</p>
          <p className="text-3xl font-bold text-[#dcdcdc]">{sources.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm text-[#a0a0a0] mb-2">Buscar email</label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#707070]"></i>
              <input
                id="search"
                type="text"
                placeholder="Digite o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label htmlFor="source" className="block text-sm text-[#a0a0a0] mb-2">Filtrar por origem</label>
            <select
              id="source"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
            >
              <option value="all">Todas</option>
              {sources.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-[#dcdcdc] mb-4">
          Lista de Subscribers ({filteredSubscribers.length})
        </h2>
        {filteredSubscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#404857]">
                  <th className="pb-3 text-[#a0a0a0] font-medium">Email</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Origem</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Data de Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                    <td className="py-3 text-[#dcdcdc]">{sub.email}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-[#ffd700]/10 text-[#ffd700]">
                        {sub.source || 'website'}
                      </span>
                    </td>
                    <td className="py-3 text-[#a0a0a0]">
                      {new Date(sub.created_at).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#a0a0a0] text-center py-8">
            {searchTerm || sourceFilter !== 'all' ? 'Nenhum subscriber encontrado com os filtros aplicados.' : 'Nenhum subscriber encontrado.'}
          </p>
        )}
      </div>
    </div>
  )
}
