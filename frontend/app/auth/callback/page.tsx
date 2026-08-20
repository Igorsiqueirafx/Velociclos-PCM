'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { logEvent } from '@/lib/logging'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        setError(sessionError.message)
        logEvent('auth_error', 'error', 'Falha no callback de autenticação', {
          error: sessionError.message,
          provider: 'google',
        })
        return
      }

      if (session) {
        const isAdminSite = process.env.NEXT_PUBLIC_IS_ADMIN_SITE === 'true'
        const userEmail = session.user?.email || ''

        logEvent('auth_success', 'info', 'Usuário autenticado via Google', {
          email: userEmail,
          provider: 'google',
          isAdminSite,
        })

        if (isAdminSite) {
          logEvent('auth_redirect', 'info', 'Redirecionando para dashboard admin', {
            email: userEmail,
            redirectTo: '/dashboard',
          })
          router.push('/dashboard')
        } else {
          const { data: lead } = await supabase
            .from('leads')
            .select('id')
            .eq('email', userEmail)
            .maybeSingle()

          if (lead) {
            logEvent('auth_redirect', 'info', 'Lead encontrado - redirecionando para download', {
              email: userEmail,
              redirectTo: '/download',
            })
            router.push('/download')
          } else {
            logEvent('auth_redirect', 'info', 'Lead não encontrado - redirecionando para cadastro', {
              email: userEmail,
              redirectTo: '/cadastro-lead',
            })
            router.push('/cadastro-lead')
          }
        }
      } else {
        logEvent('auth_no_session', 'warn', 'Callback sem sessão')
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [router, supabase])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg p-6 max-w-md">
            <p className="text-[#ff6b6b]">Erro de autenticação: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#ffd700] text-xl mb-4">Finalizando autenticação…</div>
      </div>
    </div>
  )
}
