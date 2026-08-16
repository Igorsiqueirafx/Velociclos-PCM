'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

export default function DashboardPage() {
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
        <h1>Dashboard</h1>
        <div className="card">
          <h2>Bem-vindo, {user?.email}</h2>
        </div>
      </main>
    </div>
  )
}
