'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

export default function MonitoramentoPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/login')
      setUser(user)
      setLoading(false)
    })
  }, [router])

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  if (loading) return <div>Loading...</div>

  return (
    <div className="app">
      <nav className="sidebar">
        <h2>Velociclos Admin</h2>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/dashboard/cursos">Cursos</a></li>
          <li><a href="/dashboard/artigos">Artigos</a></li>
          <li><a href="/dashboard/monitoramento">Monitoramento</a></li>
        </ul>
      </nav>
      <main className="main-content">
        <h1>Monitoramento</h1>
        <div className="card">
          <h2>Saúde do Sistema</h2>
          <ul>
            <li>Status: {user ? 'online' : 'offline'}</li>
            <li>Autenticado: {user ? 'Sim' : 'Não'}</li>
            <li>API Key (YouTube): {apiKey ? 'Configurada' : 'Não configurada'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
