'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

interface HealthStatus {
  status: string
  timestamp: string
}

export default function MonitoramentoPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/login')
      setUser(user)
    })

    const checkHealth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/health`)
        if (!res.ok) throw new Error('Health check failed')
        const data = await res.json()
        setHealth(data)
      } catch {
        setHealth({ status: 'offline', timestamp: new Date().toISOString() })
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [router, supabase])

  if (loading) return <div>Loading...</div>

  return (
    <div className="app">
      <nav className="sidebar">
        <h2>Velociclos Admin</h2>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/dashboard/cursos">Cursos</a></li>
          <li><a href="/dashboard/artigos">Artigos</a></li>
          <li><a href="/dashboard/subscribers">Subscribers</a></li>
          <li><a href="/dashboard/monitoramento">Monitoramento</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </nav>
      <main className="main-content">
        <h1>Monitoramento</h1>
        <div className="card">
          <h2>Saúde do Sistema</h2>
          <ul>
            <li>Status: {health?.status === 'ok' ? 'online' : 'offline'}</li>
            <li>Autenticado: {user ? 'Sim' : 'Não'}</li>
            <li>Backend: {BACKEND_URL}</li>
            {health?.timestamp && (
              <li>Última verificação: {new Date(health.timestamp).toLocaleString('pt-BR')}</li>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}
