import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

// Simple logging
function logEvent(event: string, level: 'info' | 'error' | 'warn', message: string, meta?: Record<string, unknown>) {
  const timestamp = new Date().toISOString()
  const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
  logFn(`[${timestamp}] [${level.toUpperCase()}] [${event}] ${message}`, meta ?? '')
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()

    const body = await request.json()
    const { email, name, phone, utm_campaign, utm_source, utm_medium, utm_content } = body

    if (!email) {
      logEvent('lead_error', 'error', 'Lead submission without email', { body })
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    logEvent('lead_start', 'info', 'Processando captura de lead', { email, source: utm_source })

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

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const userAgent = request.headers.get('user-agent') || ''

    const leadData = {
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
  } catch (err) {
    logEvent('lead_fatal', 'error', 'Erro interno no API de leads', { error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
