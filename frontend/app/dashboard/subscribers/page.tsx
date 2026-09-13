'use client'

import { useSubscriberManagement } from './use-subscriber-management'
import AdminPageHeader from '@/components/AdminPageHeader'

export default function SubscribersPage() {
  const {
    loading, error,
    searchTerm, setSearchTerm,
    sourceFilter, setSourceFilter,
    filteredSubscribers, sources, stats,
  } = useSubscriberManagement()

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
      <AdminPageHeader title="Subscribers" subtitle="Gerenciamento de leads e emails cadastrados" showForm={false} onToggle={() => {}} />

      <StatsGrid stats={stats} />

      <FiltersCard
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        sources={sources}
      />

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

function StatsGrid({ stats }: { stats: { totalCount: number; thisMonth: number; sourceCount: number } }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Total de Leads" value={stats.totalCount} color="text-[#ffd700]" />
      <StatCard label="Este Mês" value={stats.thisMonth} color="text-[#00ff7f]" />
      <StatCard label="Origem" value={stats.sourceCount} color="text-[#dcdcdc]" />
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="card">
      <p className="text-sm text-[#a0a0a0] mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function FiltersCard({ searchTerm, setSearchTerm, sourceFilter, setSourceFilter, sources }: {
  searchTerm: string; setSearchTerm: (v: string) => void;
  sourceFilter: string; setSourceFilter: (v: string) => void;
  sources: string[];
}) {
  return (
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
  )
}
