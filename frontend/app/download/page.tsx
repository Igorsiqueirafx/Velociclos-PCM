import { createClient } from '@/app/lib/supabase/server'
import AppleCard from '@/components/AppleCard'
import AppleButton from '@/components/AppleButton'
import Link from 'next/link'
import { logEvent } from '@/lib/logging'

export const dynamic = 'force-dynamic'

function VerificationError() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#121212] to-[#1a1a2e] flex items-center justify-center px-4">
      <div className="text-center max-w-md" role="alert">
        <h1 className="text-2xl font-semibold text-white mb-3">Não foi possível verificar seu acesso</h1>
        <p className="text-[#b0b0b0] mb-6">O serviço de verificação está temporariamente indisponível. Tente novamente mais tarde.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0071e3] text-white font-semibold rounded-lg">
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}

export default async function DownloadPage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    logEvent('download_access_check', 'error', 'Failed to verify authenticated user', {
      error: userError.message,
    })
    return <VerificationError />
  }

  if (!user?.email) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#121212] to-[#1a1a2e] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-3">Acesso restrito</h1>
          <p className="text-[#b0b0b0] mb-6">Entre com sua conta para verificar seu acesso.</p>
          <Link href="/auth/login?callbackUrl=%2Fdownload" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0071e3] text-white font-semibold rounded-lg">
            Entrar
          </Link>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#121212] to-[#1a1a2e] flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-semibold text-white mb-4">Download do Expert Advisor</h1>
        <p className="text-[#8a8a8d] text-lg mb-8">Seu acesso foi liberado!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppleCard className="p-6 text-center">
            <i className="fas fa-robot text-3xl text-[#0071e3] mb-4" aria-hidden="true"></i>
            <h2 className="text-lg font-semibold text-white mb-2">Expert Advisor</h2>
            <AppleButton href="/ea" className="text-sm">Baixar Agora</AppleButton>
          </AppleCard>
          <AppleCard className="p-6 text-center">
            <i className="fas fa-play-circle text-3xl text-[#0071e3] mb-4" aria-hidden="true"></i>
            <h2 className="text-lg font-semibold text-white mb-2">Cursos Gratuitos</h2>
            <AppleButton href="/cursos" className="text-sm">Acessar Cursos</AppleButton>
          </AppleCard>
        </div>
      </div>
    </div>
  )
}
