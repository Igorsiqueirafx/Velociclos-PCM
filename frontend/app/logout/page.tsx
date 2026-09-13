'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/repositories/auth'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    signOut().then(() => {
      router.replace('/auth/login')
    })
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
          <i className="fas fa-circle-notch fa-spin text-2xl text-[#ffd700]" aria-hidden="true"></i>
        </div>
        <p className="text-[#a0a0a0]">Saindo...</p>
      </div>
    </div>
  )
}
