'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { CheckCircle, Loader2 } from 'lucide-react'
import { logEvent } from '@/lib/logging'

export default function CadastroLeadPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/login')
        return
      }

      const userEmail = session.user?.email || ''
      setEmail(userEmail)

      // Check if user already has a lead profile
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle()

      if (!leadError && lead) {
        // Lead already exists, redirect to dashboard
        logEvent('lead_access_granted', 'info', 'Usuário já tem lead - redirecionando para download', { email: userEmail })
        router.push('/download')
        return
      }

      // Try to pre-fill from user_metadata
      const metadata = session.user?.user_metadata || {}
      if (metadata.full_name) setFullName(metadata.full_name)

      setSessionChecked(true)
      setLoading(false)
    }

    checkSession()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    logEvent('lead_form_submit', 'info', 'Formulário de cadastro de lead enviado', { email })

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: fullName,
          phone: phone || undefined,
          utm_source: whatsapp ? 'whatsapp' : 'google',
          utm_medium: 'organic',
          utm_campaign: 'login_google',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar lead')
      }

      logEvent('lead_created', 'info', 'Lead criado com sucesso', { email, name: fullName })

      setSuccess(true)

      // Redirect to download after success
      setTimeout(() => {
        router.push('/download')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !sessionChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#ffd700]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verificando sua sessão...</span>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00ff7f] to-[#00e671] rounded-full mb-6">
            <CheckCircle className="w-8 h-6 text-[#1e2329]" />
          </div>
          <h2 className="text-2xl font-bold text-[#dcdcdc] mb-2">Cadastro realizado!</h2>
          <p className="text-[#a0a0a0] mb-2">Redirecionando para a área de download…</p>
          <p className="text-[#a0a0a0] text-sm">Em instantes você terá acesso ao Expert Advisor e aos cursos.</p>
        </div>
      </div>
    )
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
            <i className="fas fa-user-plus text-2xl text-[#1e2329]" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-[#dcdcdc] mb-1">
            Quase lá!
          </h1>
          <p className="text-[#a0a0a0] text-sm">Complete seu cadastro para acessar o conteúdo</p>
        </div>

        <div className="bg-[#2a2e39] border border-[#404857] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Email (confirmado)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-[#1e2329]/50 border border-[#404857] rounded-lg text-[#a0a0a0] cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Nome completo
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Como deseja ser chamado?"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                WhatsApp (opcional)
              </label>
              <input
                id="whatsapp"
                type="tel"
                placeholder="https://wa.me/5511999999999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-[#a0a0a0] mt-1">Para receber notificações importantes</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
                <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#2a2e39]"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Salvando…
                </span>
              ) : (
                'Finalizar cadastro e acessar conteúdo'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#404857]">
            <div className="text-center">
              <p className="text-xs text-[#707070]">
                Ao finalizar, você concorda com os <a href="/termos" className="text-[#ffd700] hover:text-[#ffdd33]">Termos de Uso</a> e <a href="/privacidade" className="text-[#ffd700] hover:text-[#ffdd33]">Política de Privacidade</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
