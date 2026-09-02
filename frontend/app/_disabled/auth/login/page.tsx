'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
    })
  }, [router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
    } else {
      router.push('/dashboard')
    }
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (authError) {
      setError(authError.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)`,
        }}
      />

      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ffd700]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ffd700]/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full mb-4 shadow-[0_0_30px_rgba(255,215,0,0.4)]">
            <i className="fas fa-lock text-2xl text-[#1e2329]" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-[#dcdcdc] mb-1">
            Velociclos <span className="text-[#ffd700]">PCM</span>
          </h1>
          <p className="text-[#a0a0a0] text-sm">Acesso restrito</p>
        </div>

        <div className="bg-[#2a2e39] border border-[#404857] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="w-full px-4 py-3 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                minLength={6}
                className="w-full px-4 py-3 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-200"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
                <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#2a2e39]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#ffffff]/10 border border-[#ffffff]/20 rounded-lg text-[#dcdcdc] hover:bg-[#ffffff]/20 transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i className="fab fa-google text-[#ffd700]"></i>
              Entrar com Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
