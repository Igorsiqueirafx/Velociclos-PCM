'use client'

import { useDashboardData } from './use-dashboard-data'
import StatCardsGrid from '@/components/StatCardsGrid'
import RecentLeadsTable from '@/components/RecentLeadsTable'

const STAT_CARDS = [
  {
    label: 'Cursos',
    valuePlaceholder: 'courseCount' as const,
    icon: 'fas fa-play-circle',
    color: 'from-[#0071e3] to-[#6567f1]',
    href: '/dashboard/cursos',
  },
  {
    label: 'Aulas',
    valuePlaceholder: 'lessonCount' as const,
    icon: 'fas fa-book-open',
    color: 'from-[#00ff7f] to-[#00cc66]',
    href: '/dashboard/cursos',
  },
  {
    label: 'Artigos',
    valuePlaceholder: 'articleCount' as const,
    icon: 'fas fa-newspaper',
    color: 'from-[#60a5fa] to-[#3b82f6]',
    href: '/dashboard/artigos',
  },
  {
    label: 'Downloads',
    valuePlaceholder: 'downloadCount' as const,
    icon: 'fas fa-download',
    color: 'from-[#a855f7] to-[#8b5cf6]',
    href: '/dashboard/downloads',
  },
  {
    label: 'Certificados',
    valuePlaceholder: 'certificateCount' as const,
    icon: 'fas fa-award',
    color: 'from-[#fb7185] to-[#ef4444]',
    href: '/dashboard/certificados',
  },
  {
    label: 'Leads',
    valuePlaceholder: 'subscriberCount' as const,
    icon: 'fas fa-users',
    color: 'from-[#0071e3] to-[#6567f1]',
    href: '/dashboard/leads',
  },
]

export default function DashboardHome() {
  const { stats, health, loading } = useDashboardData()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#0071e3] text-xl">Carregando dados...</div>
      </div>
    )
  }

  const statCards = STAT_CARDS.map((card) => ({
    ...card,
    value: stats[card.valuePlaceholder],
  }))

  return (
    <div className="space-y-6">
      <PageHeader />

      <StatCardsGrid items={statCards} />

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#dcdcdc]">Leads Recentes</h2>
          <a href="/dashboard/leads" className="text-sm text-[#0071e3] hover:text-[#005fd9] transition-colors">
            Ver todos
          </a>
        </div>
        {stats.recentSubscribers.length > 0 ? (
          <RecentLeadsTable subscribers={stats.recentSubscribers} />
        ) : (
          <p className="text-[#a0a0a0] text-center py-8">Nenhum lead cadastrado ainda.</p>
        )}
      </div>

      <SystemStatus health={health} />
    </div>
  )
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Dashboard</h1>
      <p className="text-[#a0a0a0]">Visão geral do ecossistema Fimathe</p>
    </div>
  )
}

function SystemStatus({ health }: { health: { status?: string } | null }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            health?.status === 'ok'
              ? 'bg-[#00ff7f]/20 text-[#00ff7f]'
              : 'bg-[#ff4444]/20 text-[#ff4444]'
          }`}>
            <i className={`fas ${health?.status === 'ok' ? 'fa-check-circle' : 'fa-times-circle'} text-2xl`}></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#dcdcdc]">
              Sistema {health?.status === 'ok' ? 'Operacional' : 'Offline'}
            </h2>
             <p className="text-[#a0a0a0] text-sm">
               Backend API (Vercel KV) → Auth: GitHub OAuth
             </p>
          </div>
        </div>
        <a href="/dashboard/monitoramento" className="text-sm text-[#0071e3] hover:text-[#005fd9] transition-colors">
          Detalhes
        </a>
      </div>
    </div>
  )
}
