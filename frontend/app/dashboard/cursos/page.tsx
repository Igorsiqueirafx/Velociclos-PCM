'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { fetchPlaylists } from '@/lib/youtube'

export default function CursosPage() {
  const [playlists, setPlaylists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/login')
    })

    const loadPlaylists = async () => {
      try {
        const data = await fetchPlaylists()
        setPlaylists(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadPlaylists()
  }, [router, supabase])

  if (loading) return <div>Carregando cursos...</div>
  if (error) return <div>Erro: {error}</div>

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
        <h1>Cursos</h1>
        <div className="card">
          <h2>Playlists do YouTube</h2>
          {playlists.length > 0 ? (
            <ul>
              {playlists.map((pl: any) => (
                <li key={pl.id}>{pl.title || pl.id}</li>
              ))}
            </ul>
          ) : (
            <p>Carregando playlists ou erro de API.</p>
          )}
        </div>
      </main>
    </div>
  )
}
