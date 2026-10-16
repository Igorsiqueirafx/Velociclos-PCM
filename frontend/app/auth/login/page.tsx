"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const requestedCallbackUrl = searchParams.get("callbackUrl")
  const callbackUrl = requestedCallbackUrl
    ? (() => {
        try {
          const url = new URL(requestedCallbackUrl, window.location.origin)
          return url.origin === window.location.origin
            ? `${url.pathname}${url.search}${url.hash}`
            : "/"
        } catch {
          return "/"
        }
      })()
    : "/"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(
    searchParams.get("error") ? "Não foi possível concluir o login. Tente novamente." : "",
  )
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handlePasswordLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError("Não foi possível entrar. Confira seu email e senha.")
      setIsLoading(false)
      return
    }

    router.replace(callbackUrl)
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsLoading(true)

    const redirectTo = new URL("/auth/callback", window.location.origin)
    redirectTo.searchParams.set("next", callbackUrl)
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    })

    if (authError) {
      setError("Não foi possível iniciar o login com Google. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e2329] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#252b33] rounded-2xl border border-[#404857] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Velociclos</h1>
            <p className="text-[#8a8a8d]">Entre com a mesma conta usada no painel</p>
          </div>

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#a0a0a0]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[#404857] bg-[#1e2329] px-4 py-3 text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#a0a0a0]">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#404857] bg-[#1e2329] px-4 py-3 text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
            </div>
            {error && <p role="alert" className="text-sm text-[#ff6b6b]">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#0071e3] px-6 py-3.5 font-medium text-white transition-colors hover:bg-[#0062c4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Entrar com email
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-[#8a8a8d]">
            <span className="h-px flex-1 bg-[#404857]" />
            ou
            <span className="h-px flex-1 bg-[#404857]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full rounded-xl border border-[#404857] bg-[#2d333d] px-6 py-3.5 font-medium text-[#dcdcdc] transition-colors hover:bg-[#343a47] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continuar com Google
          </button>
        </div>
      </div>
    </div>
  )
}