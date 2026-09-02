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

  // Try to send welcome email via Brevo (non-blocking)
  try {
    await sendWelcomeEmail(email)
  } catch (emailError) {
    console.error('Error sending welcome email:', emailError)
    // Don't fail the registration if email sending fails
  }

  return { success: true as const }
}

async function sendWelcomeEmail(email: string): Promise<void> {
  const BREVO_API_KEY = process.env.BREVO_API_KEY
  
  if (!BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured. Welcome email not sent.')
    return
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        to: [{ email }],
        sender: { email: 'contato@velociclos.com.br', name: 'Velociclos PCM' },
        subject: 'Bem-vindo ao Velociclos PCM! 🚀',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 20px; border-radius: 8px; color: #dcdcdc;">
            <h1 style="color: #ffd700;">Bem-vindo ao Velociclos PCM!</h1>
            <p>Obrigado por se cadastrar na nossa plataforma de trading automatizado.</p>
            <p>Você agora tem acesso a conteúdo exclusivo sobre o método Fimathe, cursos gratuitos e muito mais.</p>
            <a href="https://velociclos.vercel.app/cursos" style="display: inline-block; background-color: #ffd700; color: #1e2329; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px;">Explorar Cursos</a>
            <p style="margin-top: 30px; font-size: 12px; color: #a0a0a0;">© 2026 Velociclos PCM. Todos os direitos reservados.</p>
          </div>
        `,
        replyTo: { email: 'contato@velociclos.com.br' },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Brevo API error:', error)
      throw new Error(`Brevo API error: ${response.status}`)
    }
  } catch (error) {
    console.error('Failed to send welcome email via Brevo:', error)
    throw error
  }
}

async function fallbackToBackend(email: string): Promise<{ success?: boolean; error?: string }> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api-backend.vercel.app'
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

