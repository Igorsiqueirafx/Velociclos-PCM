'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { logEvent } from '@/lib/logging'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    void supabase.auth.signOut().then((result) => {
      const error = result.error as { message?: string } | null
      if (error) {
        logEvent('supabase_sign_out', 'error', 'Failed to sign out from Supabase', {
          error: error.message,
        })
        return
      }

      router.replace('/auth/login')
      router.refresh()
    })
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#121212] to-[#1a1a2e] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
          <i className="fas fa-circle-notch fa-spin text-2xl text-[#0071e3]" aria-hidden="true"></i>
        </div>
        <p className="text-[#8a8a8d]">Saindo...</p>
      </div>
    </div>
  )
}