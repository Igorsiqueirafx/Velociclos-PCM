'use client'

import { useState, useEffect } from 'react'
import { getMonitoringCounts } from '@/lib/repositories/monitoring'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.vercel.app'

export interface SystemCheck {
  name: string
  status: 'online' | 'offline' | 'warning'
  detail: string
  icon: string
}

export interface HealthStatus {
  status: string
  timestamp: string
}

export function useSystemChecks() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [checks, setChecks] = useState<SystemCheck[]>([])

  useEffect(() => {
    const checkSystem = async () => {
      const results: SystemCheck[] = []

      const startTime = Date.now()
      try {
        const res = await fetch(`${BACKEND_URL}/api/health`, {
          signal: AbortSignal.timeout(5000),
        })
        const responseTime = Date.now() - startTime

        if (res.ok) {
          const data = await res.json()
          setHealth(data)
          results.push({
            name: 'Backend API',
            status: 'online',
            detail: `Respondeu em ${responseTime}ms - Status: ${data.status}`,
            icon: 'fas fa-server',
          })
        } else {
          results.push({
            name: 'Backend API',
            status: 'offline',
            detail: `HTTP ${res.status}`,
            icon: 'fas fa-server',
          })
        }
      } catch {
        results.push({
          name: 'Backend API',
          status: 'offline',
          detail: 'Sem resposta (timeout ou conexão recusada)',
          icon: 'fas fa-server',
        })
      }

      const counts = await getMonitoringCounts()

      const tableChecks = [
        { name: 'Cursos', table: 'courses', icon: 'fas fa-play-circle' },
        { name: 'Aulas', table: 'lessons', icon: 'fas fa-book-open' },
        { name: 'Artigos', table: 'articles', icon: 'fas fa-newspaper' },
        { name: 'Subscribers', table: 'subscribers', icon: 'fas fa-users' },
      ]

      for (const tc of tableChecks) {
        const countKey = tc.table === 'courses' ? 'courseCount' :
                         tc.table === 'lessons' ? 'lessonCount' :
                         tc.table === 'articles' ? 'articleCount' : 'subscriberCount'
        const count = counts[countKey]

        results.push({
          name: tc.name,
          status: count !== null && count !== undefined ? 'online' : 'offline',
          detail: `${count || 0} ${tc.name.toLowerCase()} cadastrados`,
          icon: tc.icon,
        })
      }

      results.push({
        name: 'Frontend (Vercel)',
        status: 'online',
        detail: 'Renderizando corretamente',
        icon: 'fas fa-globe',
      })

      setChecks(results)
      setLoading(false)
    }

    checkSystem()
  }, [])

  const onlineCount = checks.filter((c) => c.status === 'online').length
  const offlineCount = checks.filter((c) => c.status === 'offline').length
  const warningCount = checks.filter((c) => c.status === 'warning').length
  const overallStatus = offlineCount > 0 ? 'offline' : warningCount > 0 ? 'warning' : 'online'

  return { health, loading, checks, onlineCount, offlineCount, warningCount, overallStatus }
}
