'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

interface Subscriber {
  id: string
  email: string
  source: string
  created_at: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/login')
    })

    const fetchSubscribers = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) {
          setError(supabaseError.message)
        } else {
          setSubscribers(data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscribers()
  }, [router, supabase])

  if (loading) return <div>Carregando subscribers...</div>
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
        <h1>Subscribers</h1>
        <div className="card">
          <h2>Leads Cadastrados</h2>
          {subscribers.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#404857]">
                  <th className="pb-2 text-[#a0a0a0]">Email</th>
                  <th className="pb-2 text-[#a0a0a0]">Source</th>
                  <th className="pb-2 text-[#a0a0a0]">Data</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-[#404857]/30">
                    <td className="py-2 text-[#dcdcdc]">{sub.email}</td>
                    <td className="py-2 text-[#a0a0a0]">{sub.source || 'website'}</td>
                    <td className="py-2 text-[#a0a0a0]">
                      {new Date(sub.created_at).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhum subscriber encontrado.</p>
          )}
        </div>
      </main>
    </div>
  )
}
