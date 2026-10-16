import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DownloadPage from './page'

const { mockCreateClient } = vi.hoisted(() => ({
  mockCreateClient: vi.fn(),
}))

vi.mock('@/app/lib/supabase/server', () => ({ createClient: mockCreateClient }))

function mockSupabase({
  user = null,
  userError = null,
  lead = null,
  leadError = null,
}: {
  user?: { email: string } | null
  userError?: { message: string } | null
  lead?: { id: string } | null
  leadError?: { message: string } | null
}) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: lead, error: leadError })
  const eq = vi.fn().mockReturnValue({ maybeSingle })
  const select = vi.fn().mockReturnValue({ eq })
  const from = vi.fn().mockReturnValue({ select })
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: userError }),
    },
    from,
  })

  return { from, select, eq, maybeSingle }
}

describe('DownloadPage', () => {
  it('asks anonymous visitors to sign in without querying leads', async () => {
    const client = mockSupabase({})

    render(await DownloadPage())

    expect(screen.getByRole('heading', { name: 'Acesso restrito' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/auth/login?callbackUrl=%2Fdownload',
    )
    expect(client.from).not.toHaveBeenCalled()
  })

  it('shows the download only when the authenticated email has a lead record', async () => {
    const client = mockSupabase({
      user: { email: 'member@example.com' },
      lead: { id: 'lead-id' },
    })

    render(await DownloadPage())

    expect(screen.getByRole('heading', { name: 'Download do Expert Advisor' })).toBeInTheDocument()
    expect(client.from).toHaveBeenCalledWith('leads')
    expect(client.select).toHaveBeenCalledWith('id')
    expect(client.eq).toHaveBeenCalledWith('email', 'member@example.com')
    expect(client.maybeSingle).toHaveBeenCalledOnce()
  })

  it('does not grant access to an authenticated user without a lead record', async () => {
    mockSupabase({ user: { email: 'unknown@example.com' } })

    render(await DownloadPage())

    expect(screen.getByRole('heading', { name: 'Acesso não liberado' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Download do Expert Advisor' })).not.toBeInTheDocument()
  })

  it('fails closed when authentication verification returns an error', async () => {
    const client = mockSupabase({
      userError: { message: 'Auth service unavailable' },
    })

    render(await DownloadPage())

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível verificar seu acesso')
    expect(client.from).not.toHaveBeenCalled()
  })

  it('fails closed when the lead access query returns an error', async () => {
    mockSupabase({
      user: { email: 'member@example.com' },
      leadError: { message: 'Database unavailable' },
    })

    render(await DownloadPage())

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível verificar seu acesso')
    expect(screen.queryByRole('heading', { name: 'Download do Expert Advisor' })).not.toBeInTheDocument()
  })
})
