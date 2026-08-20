'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

interface HealthStatus {
  status: string
  timestamp: string
}

export default function DashboardHome() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    subscriberCount: 0,
    recentSubscribers: [] as Array<{ id: string; email: string; source: string; created_at: string }>,
    courseCount: 0,
    lessonCount: 0,
    articleCount: 0,
    downloadCount: 0,
    certificateCount: 0,
  })
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          subscribersRes,
          coursesRes,
          lessonsRes,
          articlesRes,
          downloadsRes,
          certificatesRes,
          healthRes,
        ] = await Promise.all([
          supabase.from('subscribers').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('course_lessons').select('*', { count: 'exact', head: true }),
          supabase.from('articles').select('*', { count: 'exact', head: true }),
          supabase.from('downloads').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
          fetch(`${BACKEND_URL}/api/health`).catch(() => null),
        ])

        setStats({
          subscriberCount: subscribersRes.count || 0,
          recentSubscribers: subscribersRes.data || [],
          courseCount: coursesRes.count || 0,
          lessonCount: lessonsRes.count || 0,
          articleCount: articlesRes.count || 0,
          downloadCount: downloadsRes.count || 0,
          certificateCount: certificatesRes.count || 0,
        })

        if (healthRes && healthRes.ok) {
          setHealth(await healthRes.json())
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando dados...</div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Cursos',
      value: stats.courseCount,
      icon: 'fas fa-play-circle',
      color: 'from-[#ffd700] to-[#ffeb3b]',
      href: '/dashboard/cursos',
    },
    {
      label: 'Aulas',
      value: stats.lessonCount,
      icon: 'fas fa-book-open',
      color: 'from-[#00ff7f] to-[#00cc66]',
      href: '/dashboard/cursos',
    },
    {
      label: 'Artigos',
      value: stats.articleCount,
      icon: 'fas fa-newspaper',
      color: 'from-[#60a5fa] to-[#3b82f6]',
      href: '/dashboard/artigos',
    },
    {
      label: 'Downloads',
      value: stats.downloadCount,
      icon: 'fas fa-download',
      color: 'from-[#a855f7] to-[#8b5cf6]',
      href: '/dashboard/downloads',
    },
    {
      label: 'Certificados',
      value: stats.certificateCount,
      icon: 'fas fa-award',
      color: 'from-[#fb7185] to-[#ef4444]',
      href: '/dashboard/certificados',
    },
    {
      label: 'Leads',
      value: stats.subscriberCount,
      icon: 'fas fa-users',
      color: 'from-[#ffd700] to-[#ffeb3b]',
      href: '/dashboard/leads',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Dashboard</h1>
        <p className="text-[#a0a0a0]">Visão geral do ecossistema Fimathe</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="card group hover:border-[#ffd700]/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#a0a0a0] mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-[#dcdcdc]">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                <i className={`${stat.icon} text-lg text-[#1e2329]`}></i>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#dcdcdc]">Leads Recentes</h2>
          <a href="/dashboard/leads" className="text-sm text-[#ffd700] hover:text-[#ffdd33] transition-colors">
            Ver todos
          </a>
        </div>
        {stats.recentSubscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#404857]">
                  <th className="pb-3 text-[#a0a0a0] font-medium">Email</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Origem</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSubscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-[#404857]/30 last:border-0">
                    <td className="py-3 text-[#dcdcdc]">{sub.email}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-[#ffd700]/10 text-[#ffd700]">
                        {sub.source || 'website'}
                      </span>
                    </td>
                    <td className="py-3 text-[#a0a0a0]">
                      {new Date(sub.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#a0a0a0] text-center py-8">Nenhum lead cadastrado ainda.</p>
        )}
      </div>

      {/* System Status */}
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
                Backend API • Supabase (PostgreSQL) • Auth: Supabase Auth
              </p>
            </div>
          </div>
          <a
            href="/dashboard/monitoramento"
            className="text-sm text-[#ffd700] hover:text-[#ffdd33] transition-colors"
          >
            Detalhes
          </a>
        </div>
      </div>
    </div>
  )
}
