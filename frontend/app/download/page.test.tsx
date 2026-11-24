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
}: {
  user?: { email: string } | null
  userError?: { message: string } | null
} = {}) {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: userError }),
    },
  })

  return { getUser: mockCreateClient.mock.calls[0]?.[0]?.auth?.getUser ?? vi.fn() }
}

describe('DownloadPage', () => {
  it('asks anonymous visitors to sign in', async () => {
    mockSupabase({ user: null })

    render(await DownloadPage())

    expect(screen.getByRole('heading', { name: 'Acesso restrito' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/auth/login?callbackUrl=%2Fdownload',
    )
  })

  it('grants download access to an authenticated user without requiring a lead record', async () => {
    mockSupabase({ user: { email: 'member@example.com' } })

    render(await DownloadPage())

    expect(screen.getByRole('heading', { name: 'Download do Expert Advisor' })).toBeInTheDocument()
  })

  it('does not grant access to an authenticated user without email', async () => {
    mockSupabase({ user: { email: '' } })

    render(await DownloadPage())

    expect(screen.getByRole('heading', { name: 'Acesso restrito' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Download do Expert Advisor' })).not.toBeInTheDocument()
  })

  it('fails closed when authentication verification returns an error', async () => {
    mockSupabase({ userError: { message: 'Auth service unavailable' } })

    render(await DownloadPage())

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível verificar seu acesso')
  })
})
