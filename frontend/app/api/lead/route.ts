import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logEvent } from '@/lib/logging'

export const dynamic = 'force-dynamic'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

function buildLeadData(body: {
  email: string
  name?: string | null
  phone?: string | null
  utm_campaign?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_content?: string | null
}) {
  const { email, name, phone, utm_campaign, utm_source, utm_medium, utm_content } = body

  return {
    email,
    name: name || null,
    phone: phone || null,
    utm_campaign,
    utm_source: utm_source || 'website',
    utm_medium,
    utm_content,
    source: utm_source || 'lead-capture',
  }
}

async function upsertLead(
  leadData: Record<string, unknown>,
  _email: string
) {
  const res = await fetch(`${BACKEND_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  })

  const result = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data: result }
}

async function processLead(request: NextRequest) {
  const body = await request.json()
  const { email } = body

  if (!email) {
    logEvent('lead_error', 'error', 'Lead submission without email', { body })
    return NextResponse.json(
      { error: 'Email é obrigatório' },
      { status: 400 }
    )
  }

  logEvent('lead_start', 'info', 'Processando captura de lead', { email, source: body.utm_source })

  const leadData = buildLeadData(body)
  const result = await upsertLead(leadData, email)

  if (!result.ok) {
    logEvent('lead_error', 'error', 'Erro ao salvar lead', { email, error: result.data?.error || 'Unknown error' })
    return NextResponse.json(
      { error: `Erro ao salvar lead: ${result.data?.error || 'Unknown error'}` },
      { status: result.status }
    )
  }

  logEvent('lead_success', 'info', 'Lead salvo com sucesso', { email, leadId: result.data?.data?.id })

  return NextResponse.json(
    { success: true, message: 'Lead salvo com sucesso!', data: result.data?.data },
    { status: 200 }
  )
}

export async function POST(request: NextRequest) {
  try {
    return await processLead(request)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    logEvent('lead_fatal', 'error', 'Erro interno no API de leads', { error: message })
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: message },
      { status: 500 }
    )
  }
}