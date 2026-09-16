'use client'

import { GlassCard } from '@/components/glassify/glass-card'
import { GlassButton } from '@/components/glassify/glass-button'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <GlassCard glass="frosted" className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#ffd700]/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-[#ffd700] mb-2">404</h1>
        <h2 className="text-xl font-bold text-[#dcdcdc] mb-3">Página não encontrada</h2>
        <p className="text-[#a0a0a0] mb-6">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="flex gap-3 justify-center">
          <GlassButton variant="solid" onClick={() => window.location.href = '/'}>
            Voltar ao início
          </GlassButton>
          <GlassButton variant="outline" onClick={() => window.location.href = '/site-map'}>
            Ver mapa do site
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  )
}