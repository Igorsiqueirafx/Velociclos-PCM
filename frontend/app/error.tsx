'use client'

import { useEffect } from 'react'
import { logEvent } from '@/lib/logging'
import { GlassCard } from '@/components/glassify/glass-card'
import { GlassButton } from '@/components/glassify/glass-button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logEvent('app_error', 'error', 'Application error', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <GlassCard glass="frosted" className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#ffd700]/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#dcdcdc] mb-3">Algo deu errado</h1>
        <p className="text-[#a0a0a0] mb-6">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>
        <div className="flex gap-3 justify-center">
          <GlassButton variant="solid" onClick={reset}>
            Tentar novamente
          </GlassButton>
          <a href="/" className="flex items-center justify-center px-6 py-3 text-[#a0a0a0] hover:text-[#ffd700] transition-colors">
            Voltar ao início
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-[#6b6b6b] cursor-pointer">Detalhes técnicos</summary>
            <pre className="mt-2 p-3 bg-[#1e2329] rounded text-xs text-[#6b6b6b] overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </GlassCard>
    </div>
  )
}