'use server'

import { createClient } from '@/app/lib/supabase/server'
import { headers } from 'next/headers'

const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>()

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

async function getClientIP(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return '127.0.0.1'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now })
    return true
  }

  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  rateLimitMap.set(ip, { count: entry.count + 1, firstAttempt: entry.firstAttempt })
  return true
}

export async function registerEmail(formData: FormData) {
  const ip = await getClientIP()

  if (!checkRateLimit(ip)) {
    return { error: 'Você enviou muitas solicitações. Tente novamente em 10 minutos.' }
  }

  const email = formData.get('email')?.toString().trim()

  if (!email || !email.includes('@')) {
    return { error: 'Email inválido' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('subscribers').insert([{ email }])

  if (error) {
    if (error.code === '23505') {
      return { error: 'Este email já está cadastrado' }
    }
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return await fallbackToBackend(email)
    }
    return { error: 'Erro ao cadastrar. Tente novamente.' }
  }

  return { success: true as const }
}

async function fallbackToBackend(email: string): Promise<{ success?: boolean; error?: string }> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'
  try {
    const res = await fetch(`${BACKEND_URL}/api/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      return { success: true }
    }
    if (res.status === 409) {
      return { error: 'Este email já está cadastrado' }
    }
    return { error: 'Erro ao cadastrar. Tente novamente.' }
  } catch {
    return { error: 'A tabela de subscribers não está configurada. Tente novamente mais tarde.' }
  }
}
