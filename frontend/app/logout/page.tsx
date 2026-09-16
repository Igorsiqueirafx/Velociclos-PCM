'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/app/lib/auth/config'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    signOut({ redirectTo: '/auth/login' }).catch(() => {
      router.replace('/auth/login')
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