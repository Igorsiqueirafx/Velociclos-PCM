'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'

export default function LogoutPage() {
  const [done, setDone] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.signOut().finally(() => setDone(true))
  }, [])

  if (done) {
    // Use window.location for hard refresh after signout
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    return <div>Redirecionando...</div>
  }

  return <div>Fazendo logout...</div>
}
