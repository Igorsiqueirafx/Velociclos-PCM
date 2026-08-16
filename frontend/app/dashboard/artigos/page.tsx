'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

export default function ArtigosPage() {
  const [artigos, setArtigos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/login')
    })

    const fetchArtigos = async () => {
      const { data } = await supabase.from('artigos').select('*').order('created_at', { ascending: false })
      setArtigos(data || [])
      setLoading(false)
    }
    fetchArtigos()
  }, [router])

  if (loading) return <div>Carregando artigos...</div>

  return (
    <div className="app">
      <nav className="sidebar">
        <h2>Velociclos Admin</h2>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/dashboard/cursos">Cursos</a></li>
          <li><a href="/dashboard/artigos">Artigos</a></li>
          <li><a href="/dashboard/monitoramento">Monitoramento</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </nav>
      <main className="main-content">
        <h1>Artigos</h1>
        <div className="card">
          <h2>Lista de Artigos</h2>
          {artigos.length > 0 ? (
            <ul>
              {artigos.map((art: any) => (
                <li key={art.id}>{art.title}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhum artigo encontrado.</p>
          )}
        </div>
      </main>
    </div>
  )
}
