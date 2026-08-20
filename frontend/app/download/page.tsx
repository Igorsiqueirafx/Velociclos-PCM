import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DownloadPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session || !session.user?.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-[#ff6b6b]">
            <i className="fas fa-lock-open text-3xl"></i>
          </div>
          <h2 className="text-xl font-bold text-[#dcdcdc] mb-2">Acesso restrito</h2>
          <p className="text-[#a0a0a0] mb-4">Faça login para acessar o download.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg hover:from-[#ffdd33] hover:to-[#ffd700] transition-all"
          >
            <i className="fas fa-sign-in-alt"></i>
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  // Check if user's email exists in leads table
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('email')
    .eq('email', session.user.email)
    .maybeSingle()

  const hasAccess = !!lead && !leadError

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4 text-[#ffd700]">
            <i className="fas fa-download text-3xl"></i>
          </div>
          <h2 className="text-xl font-bold text-[#dcdcdc] mb-2">Libere o acesso</h2>
          <p className="text-[#a0a0a0] mb-6">
            Você precisa cadastrar seu email na página de captura antes de poder baixar o robô.
          </p>
          <Link
            href="/cadastro-lead"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg hover:from-[#ffdd33] hover:to-[#ffd700] transition-all"
          >
            <i className="fas fa-bullseye"></i>
            Garantir acesso ao download
          </Link>
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

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full mb-6 shadow-[0_0_40px_rgba(255,215,0,0.4)]">
            <i className="fas fa-robot text-3xl text-[#1e2329]"></i>
          </div>
          <h1 className="text-4xl font-extrabold text-[#dcdcdc] mb-4">
            Download do Expert Advisor
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Seu acesso foi liberado! Você já é parte da comunidade e pode
            baixar o robô de trading e acompanhar os cursos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-6 text-center">
            <i className="fas fa-robot text-3xl text-[#ffd700] mb-4"></i>
            <h3 className="text-lg font-bold text-[#dcdcdc] mb-2">Expert Advisor</h3>
            <p className="text-[#a0a0a0] text-sm mb-4">Versão completa</p>
            <a
              href="/ea"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg hover:from-[#ffdd33] hover:to-[#ffd700] transition-all text-sm"
            >
              <i className="fas fa-download"></i>
              Baixar Agora
            </a>
          </div>

          <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-6 text-center">
            <i className="fas fa-play-circle text-3xl text-[#ffd700] mb-4"></i>
            <h3 className="text-lg font-bold text-[#dcdcdc] mb-2">Cursos Gratuitos</h3>
            <p className="text-[#a0a0a0] text-sm mb-4">700+ aulas exclusivas</p>
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg hover:from-[#ffdd33] hover:to-[#ffd700] transition-all text-sm"
            >
              <i className="fas fa-arrow-right"></i>
              Acessar Cursos
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/leads"
            className="text-[#a0a0a0] hover:text-[#ffd700] text-sm transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-user-circle"></i>
            Meu painel de leads
          </Link>
        </div>
      </div>
    </div>
  )
}
