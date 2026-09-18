import { headers } from 'next/headers'
import { logEvent } from '@/lib/logging'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.vercel.app'

const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = 10 * 60 * 1000

async function getClientIp(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  )
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  if (record) {
    if (now - record.firstAttempt > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip)
      return { allowed: true }
    }
    if (record.count >= RATE_LIMIT_MAX) {
      return { allowed: false, retryAfter: RATE_LIMIT_WINDOW - (now - record.firstAttempt) }
    }
  }
  return { allowed: true }
}

function recordAttempt(ip: string) {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  if (record && now - record.firstAttempt <= RATE_LIMIT_WINDOW) {
    record.count++
  } else {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now })
  }
}

async function sendBrevoEmail(email: string, name: string) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    logEvent('brevo_skip', 'warn', 'BREVO_API_KEY not configured. Skipping welcome email.')
    return
  }
  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'Velociclos', email: 'contato@velociclos.com.br' },
        to: [{ email, name: name || undefined }],
        subject: 'Bem-vindo ao Velociclos PCM!',
        htmlContent: `<p>Olá ${name || ''},</p><p>Seja bem-vindo ao Velociclos PCM! Em breve você receberá novidades.</p>`,
      }),
    })
  } catch (err) {
    logEvent('brevo_error', 'error', 'Failed to send welcome email', { error: err instanceof Error ? err.message : String(err) })
  }
}

export type SubscribeState =
  | { success: true; message: string }
  | { success: false; error: string }

export async function subscribeToNewsletter(formData: FormData): Promise<SubscribeState> {
  const email = (formData.get('email') as string)?.trim()
  const name = (formData.get('name') as string)?.trim() || null

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Email inválido' }
  }

  const ip = await getClientIp()
  const rateLimit = checkRateLimit(ip)
  if (!rateLimit.allowed) {
    const retryAfterSec = Math.ceil((rateLimit.retryAfter || 0) / 1000)
    return { success: false, error: `Muitas tentativas. Tente novamente em ${retryAfterSec} segundos.` }
  }

  recordAttempt(ip)
  return await saveLeadAndNotify(email, name)
}

async function saveLeadAndNotify(email: string, name: string | null): Promise<SubscribeState> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, utm_source: 'website' }),
    })
    const result = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { success: false, error: result.error || `Erro ao salvar lead (${res.status})` }
    }

    sendBrevoEmail(email, name || '')

    return { success: true, message: 'Cadastro realizado com sucesso!' }
  } catch (err) {
    logEvent('lead_subscribe_error', 'error', 'Erro interno no saveLeadAndNotify', { error: err instanceof Error ? err.message : String(err) })
    return { success: false, error: 'Erro interno do servidor' }
  }
}