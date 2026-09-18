'use client'

import { useState } from 'react'
import { subscribeToNewsletter, type SubscribeState } from './actions'

export default function EntrarPage() {
  const [result, setResult] = useState<SubscribeState | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setResult(null)
    const formData = new FormData(e.currentTarget)
    const state = await subscribeToNewsletter(formData)
    setResult(state)
    setIsPending(false)
  }

  return (
    <div className="min-h-screen bg-[#1e2329] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#252b33] rounded-2xl border border-[#404857] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Newsletter Velociclos</h1>
            <p className="text-[#8a8a8d]">
              Cadastre-se para receber novidades, conteúdos exclusivos e lançamentos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#dcdcdc] mb-2">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                className="w-full px-4 py-3 bg-[#1e2329] border border-[#404857] rounded-xl text-[#dcdcdc] placeholder-[#606877] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#dcdcdc] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-[#1e2329] border border-[#404857] rounded-xl text-[#dcdcdc] placeholder-[#606877] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center px-6 py-3.5 bg-[#0071e3] text-white font-semibold rounded-xl shadow-md transition-all duration-200 ease-in-out hover:bg-[#005fd9] hover:shadow-[0_0_30px_rgba(0,113,227,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Enviando...' : 'Cadastrar'}
            </button>
          </form>

          {result?.success && (
            <p className="text-center text-sm text-green-400 mt-6">{result.message}</p>
          )}
          {result && !result.success && (
            <p className="text-center text-sm text-red-400 mt-6">{result.error}</p>
          )}

          <p className="text-center text-xs text-[#606877] mt-6">
            Respeitamos sua privacidade. Nenhum spam, apenas conteúdo relevante.
          </p>
        </div>
      </div>
    </div>
  )
}