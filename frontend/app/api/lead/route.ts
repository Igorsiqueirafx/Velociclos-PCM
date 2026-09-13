import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logEvent } from '@/lib/logging'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are required')
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function buildLeadData(
  body: {
    email: string
    name?: string | null
    phone?: string | null
    utm_campaign?: string | null
    utm_source?: string | null
    utm_medium?: string | null
    utm_content?: string | null
  },
  request: NextRequest
) {
  const { email, name, phone, utm_campaign, utm_source, utm_medium, utm_content } = body

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
  const userAgent = request.headers.get('user-agent') || ''

  return {
    email,
    name: name || null,
    phone: phone || null,
    utm_campaign,
    utm_source: utm_source || 'website',
    utm_medium,
    utm_content,
    ip_address: ip.split(',')[0]?.trim() || null,
    user_agent: userAgent,
    source: utm_source || 'lead-capture',
  }
}

async function upsertLead(
  supabase: ReturnType<typeof getSupabase>,
  leadData: Record<string, unknown>,
  existingLead: { id: string } | null,
  email: string
) {
  let result
  if (existingLead) {
    logEvent('lead_update', 'info', 'Atualizando lead existente', { email, leadId: existingLead.id })
    result = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', existingLead.id)
      .select()
  } else {
    logEvent('lead_insert', 'info', 'Criando novo lead', { email })
    result = await supabase
      .from('leads')
      .insert([leadData])
      .select()
  }
  return result
}

async function processLead(request: NextRequest) {
  const supabase = getSupabase()
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

  const { data: existingLead, error: lookupError } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (lookupError) {
    logEvent('lead_error', 'error', 'Erro ao buscar lead existente', { email, error: lookupError.message })
    return NextResponse.json(
      { error: 'Erro ao verificar lead existente' },
      { status: 500 }
    )
  }

  const leadData = buildLeadData(body, request)
  const result = await upsertLead(supabase, leadData, existingLead, email)

  if (result.error) {
    logEvent('lead_error', 'error', 'Erro ao salvar lead', { email, error: result.error.message })
    return NextResponse.json(
      { error: `Erro ao salvar lead: ${result.error.message}` },
      { status: 500 }
    )
  }

  logEvent('lead_success', 'info', 'Lead salvo com sucesso', { email, leadId: result.data?.[0]?.id })

  return NextResponse.json(
    { success: true, message: 'Lead salvo com sucesso!', data: result.data },
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
