'use client'

import { useState, useEffect } from 'react'
import { getDashboardStats } from '@/lib/repositories/dashboard'
import { logEvent } from '@/lib/logging'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api-backend.vercel.app'

export interface HealthStatus {
  status: string
  timestamp: string
}

export function useDashboardData() {
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
        const dashboardStats = await getDashboardStats()
        const healthRes = await fetch(`${BACKEND_URL}/api/health`).catch(() => null)

        setStats(dashboardStats)

        if (healthRes && healthRes.ok) {
          setHealth(await healthRes.json())
        }
      } catch (error) {
        logEvent('dashboard_load', 'error', 'Error fetching dashboard data', { error: error instanceof Error ? error.message : String(error) })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { stats, health, loading }
}
