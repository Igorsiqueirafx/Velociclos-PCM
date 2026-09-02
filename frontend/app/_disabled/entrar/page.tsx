'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerEmail } from './actions'

export default function EntrarPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('registered') === '1') {
      setSuccess(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await registerEmail(new FormData(e.currentTarget as HTMLFormElement))

    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(true)
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
            <i className="fas fa-bolt text-2xl text-[#1e2329]" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-[#dcdcdc] mb-1">
            Velociclos <span className="text-[#ffd700]">PCM</span>
          </h1>
          <p className="text-[#a0a0a0] text-sm">Entre para o time</p>
        </div>

        <div className="bg-[#2a2e39] border border-[#404857] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full mb-4">
                <i className="fas fa-check text-xl text-[#1e2329]" aria-hidden="true"></i>
              </div>
              <h2 className="text-xl font-bold text-[#dcdcdc] mb-2">Cadastro realizado!</h2>
              <p className="text-[#a0a0a0] text-sm mb-6">
                Seu email foi cadastrado com sucesso.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-lg hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
              >
                Voltar ao site
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
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
                    Cadastrando...
                  </span>
                ) : (
                  'Cadastrar email'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-[#a0a0a0] text-sm">
              <Link href="/" className="text-[#ffd700] hover:text-[#ffdd33] transition-colors font-medium">
                Voltar ao site principal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
