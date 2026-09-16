import { auth } from '@/app/lib/auth/config'
import Link from 'next/link'
import { logEvent } from '@/lib/logging'

export const dynamic = 'force-dynamic'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

export default async function DownloadPage() {
  const session = await auth()

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#121212] to-[#1a1a2e] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-[#ff453a]">
            <i className="fas fa-lock-open text-3xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Acesso restrito</h2>
          <p className="text-[#8a8a8d] mb-4">Faça login para acessar o download.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0071e3] text-white font-semibold rounded-lg hover:bg-[#005fd9] transition-colors duration-200"
          >
            <i className="fas fa-sign-in-alt"></i>
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  let hasAccess = false;
  const userEmail = session?.user?.email || '';
  try {
    const res = await fetch(`${BACKEND_URL}/api/leads`, { cache: 'no-store' })
    if (res.ok) {
      const leads = await res.json()
      const found = leads.find((l: { email: string }) => l.email === userEmail)
      hasAccess = !!found
    }
  } catch (error) {
    logEvent('download_access', 'error', 'Error checking lead access', { error: error instanceof Error ? error.message : String(error) })
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#121212] to-[#1a1a2e] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4 text-[#0071e3]">
            <i className="fas fa-download text-3xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Libere o acesso</h2>
          <p className="text-[#8a8a8d] mb-6">
            Você precisa cadastrar seu email na página de captura antes de poder baixar o robô.
          </p>
          <Link
            href="/cadastro-lead"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#0071e3] text-white font-semibold rounded-lg hover:bg-[#005fd9] transition-colors duration-200"
          >
            <i className="fas fa-bullseye"></i>
            Garantir acesso ao download
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#121212] to-[#1a1a2e] flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,113,227,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(0,113,227,0.05) 0%, transparent 50%)`,
        }}
      />
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#0071e3]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#0071e3]/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0071e3] to-[#6567f1] rounded-full mb-6 shadow-lg">
            <i className="fas fa-robot text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-semibold text-white mb-4 tracking-tight">
            Download do Expert Advisor
          </h1>
          <p className="text-[#8a8a8d] text-lg max-w-2xl mx-auto">
            Seu acesso foi liberado! Você já é parte da comunidade e pode
            baixar o robô de trading e acompanhar os cursos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6 text-center hover:border-[#0071e3] transition-colors duration-200">
            <i className="fas fa-robot text-3xl text-[#0071e3] mb-4"></i>
            <h3 className="text-lg font-semibold text-white mb-2">Expert Advisor</h3>
            <p className="text-[#8a8a8d] text-sm mb-4">Versão completa</p>
            <a
              href="/ea"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0071e3] text-white font-semibold rounded-lg hover:bg-[#005fd9] transition-colors duration-200 text-sm"
            >
              <i className="fas fa-download"></i>
              Baixar Agora
            </a>
          </div>

          <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6 text-center hover:border-[#0071e3] transition-colors duration-200">
            <i className="fas fa-play-circle text-3xl text-[#0071e3] mb-4"></i>
            <h3 className="text-lg font-semibold text-white mb-2">Cursos Gratuitos</h3>
            <p className="text-[#8a8a8d] text-sm mb-4">700+ aulas exclusivas</p>
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0071e3] text-white font-semibold rounded-lg hover:bg-[#005fd9] transition-colors duration-200 text-sm"
            >
              <i className="fas fa-arrow-right"></i>
              Acessar Cursos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}