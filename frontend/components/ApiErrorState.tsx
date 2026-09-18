'use client'

import { GlassButton } from '@/components/glassify/glass-button'

type ApiErrorStateProps = {
  title?: string
  message?: string
  retry?: () => void
  fallbackHref?: string
}

export default function ApiErrorState({
  title = 'Não foi possível carregar',
  message = 'Ocorreu um erro ao buscar estas informações. Tente novamente mais tarde.',
  retry,
  fallbackHref = '/',
}: ApiErrorStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#ff453a]/10 flex items-center justify-center">
        <svg className="w-10 h-10 text-[#ff453a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#8a8a8d] mb-6 max-w-md mx-auto">{message}</p>
      <div className="flex gap-3 justify-center">
        {retry && (
          <GlassButton variant="solid" onClick={retry}>
            Tentar novamente
          </GlassButton>
        )}
        <a
          href={fallbackHref}
          className="inline-flex items-center justify-center px-6 py-3 text-[#8a8a8d] hover:text-white transition-colors"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  )
}
