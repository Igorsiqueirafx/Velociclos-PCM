'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
    })
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Velociclos PCM</h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem', textAlign: 'center' }}>Painel Administrativo</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Entrar</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a href="https://velociclos.com.br" style={{ color: '#3b82f6', fontSize: '0.875rem' }}>← Voltar ao site principal</a>
        </p>
      </div>
    </div>
  )
}
