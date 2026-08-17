'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

interface Subscriber {
  id: string
  email: string
  source: string
  created_at: string
}

interface Playlist {
  id: string
  title: string
  videoCount: number
}

interface Video {
  id: string
  title: string
  module: string
}

interface HealthStatus {
  status: string
  timestamp: string
}

export default function DashboardHome() {
  const [subscriberCount, setSubscriberCount] = useState<number>(0)
  const [recentSubscribers, setRecentSubscribers] = useState<Subscriber[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const [subscribersRes, playlistsRes, videosRes, healthRes] = await Promise.all([
          supabase.from('subscribers').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
          fetch(`${BACKEND_URL}/api/playlists`),
          fetch(`${BACKEND_URL}/api/videos`),
          fetch(`${BACKEND_URL}/api/health`).catch(() => null),
        ])

        const subCount = subscribersRes.count || 0
        setSubscriberCount(subCount)
        setRecentSubscribers(subscribersRes.data || [])

        if (playlistsRes.ok) {
          const playlistsData = await playlistsRes.json()
          setPlaylists(Array.isArray(playlistsData) ? playlistsData : [])
        }

        if (videosRes.ok) {
          const videosData = await videosRes.json()
          setVideos(Array.isArray(videosData) ? videosData : [])
        }

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
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando dados...</div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Leads',
      value: subscriberCount,
      icon: 'fas fa-users',
      color: 'from-[#ffd700] to-[#ffeb3b]',
      href: '/dashboard/subscribers',
    },
    {
      label: 'Playlists',
      value: playlists.length,
      icon: 'fas fa-play-circle',
      color: 'from-[#00ff7f] to-[#00cc66]',
      href: '/dashboard/cursos',
    },
    {
      label: 'Vídeos',
      value: videos.length,
      icon: 'fas fa-video',
      color: 'from-[#ff6b6b] to-[#ff4444]',
      href: '/dashboard/videos',
    },
    {
      label: 'Sistema',
      value: health?.status === 'ok' ? 'Online' : 'Offline',
      icon: 'fas fa-heartbeat',
      color: health?.status === 'ok' ? 'from-[#00ff7f] to-[#00cc66]' : 'from-[#ff6b6b] to-[#ff4444]',
      href: '/dashboard/monitoramento',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Dashboard</h1>
        <p className="text-[#a0a0a0]">Visão geral do sistema Velociclos PCM</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                <i className={`${stat.icon} text-xl text-[#1e2329]`}></i>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Recent Subscribers */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#dcdcdc]">Leads Recentes</h2>
          <a href="/dashboard/subscribers" className="text-sm text-[#ffd700] hover:text-[#ffdd33] transition-colors">
            Ver todos
          </a>
        </div>
        {recentSubscribers.length > 0 ? (
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
                {recentSubscribers.map((sub) => (
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
    </div>
  )
}
