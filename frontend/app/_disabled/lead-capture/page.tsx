'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import Link from 'next/link'

function LeadCaptureForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const utm_campaign = searchParams.get('utm_campaign') || ''
  const utm_source = searchParams.get('utm_source') || ''
  const utm_medium = searchParams.get('utm_medium') || ''
  const utm_content = searchParams.get('utm_content') || ''

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsSignedIn(true)
        if (session.user?.email) setEmail(session.user.email)
        if (session.user?.user_metadata?.full_name) setName(session.user.user_metadata.full_name)
      }
    })
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email) {
      setError('Email é obrigatório')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          phone: phone || undefined,
          utm_campaign: utm_campaign || undefined,
          utm_source: utm_source || undefined,
          utm_medium: utm_medium || undefined,
          utm_content: utm_content || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao salvar lead')
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/leads')
        }, 2000)
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignUp = async () => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/lead-capture?utm_campaign=${utm_campaign || ''}&utm_source=${utm_source || ''}&utm_medium=${utm_medium || ''}&utm_content=${utm_content || ''}`,
      },
    })
    if (authError) setError(authError.message)
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00ff7f] to-[#00e671] rounded-full mb-6">
          <i className="fas fa-check text-2xl text-[#1e2329]"></i>
        </div>
        <h2 className="text-2xl font-bold text-[#dcdcdc] mb-2">Cadastro realizado!</h2>
        <p className="text-[#a0a0a0]">Redirecionando…</p>
      </div>
    )
  }

  return (
    <>
      {!isSignedIn && (
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#ffffff]/10 border border-[#ffffff]/20 rounded-lg text-[#dcdcdc] hover:bg-[#ffffff]/20 transition-all duration-200 text-sm"
          >
            <i className="fab fa-google text-[#ffd700]"></i>
            Entrar com Google
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#a0a0a0] mb-2">
            Nome
          </label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-200"
          />
        </div>

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
            className="w-full px-4 py-3 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#a0a0a0] mb-2">
            Telefone (opcional)
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-200"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#2a2e39]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-circle-notch fa-spin"></i>
              Salvando…
            </span>
          ) : (
            'Garantir minha vaga'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[#a0a0a0] text-sm">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="text-[#ffd700] hover:text-[#ffdd33] transition-colors font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </>
  )
}

export default function LeadCapturePage() {
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
          <p className="text-[#a0a0a0] text-sm">Garanta acesso exclusivo ao conteúdo</p>
        </div>

        <div className="bg-[#2a2e39] border border-[#404857] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-[#dcdcdc] text-center mb-6">
            Faça parte da comunidade
          </h2>
          <Suspense fallback={<div className="text-center text-[#a0a0a0]">Carregando…</div>}>
            <LeadCaptureForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
