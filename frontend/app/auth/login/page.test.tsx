import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './page'

const { mockReplace, mockRefresh, mockSignInWithPassword, mockSignInWithOAuth } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockRefresh: vi.fn(),
  mockSignInWithPassword: vi.fn(),
  mockSignInWithOAuth: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, refresh: mockRefresh }),
  useSearchParams: () => new URLSearchParams('callbackUrl=%2Fdownload'),
}))

vi.mock('@/app/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}))

describe('LoginPage', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('offers the same email and Google sign-in methods as the admin app', () => {
    render(<LoginPage />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar com Google' })).toBeInTheDocument()
  })

  it('returns to the requested internal page after password sign-in', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null })
    const user = userEvent.setup()

    render(<LoginPage />)
    await user.type(screen.getByLabelText('Email'), 'member@example.com')
    await user.type(screen.getByLabelText('Senha'), 'safe-test-password')
    await user.click(screen.getByRole('button', { name: 'Entrar com email' }))

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'member@example.com',
      password: 'safe-test-password',
    })
    expect(mockReplace).toHaveBeenCalledWith('/download')
    expect(mockRefresh).toHaveBeenCalledOnce()
  })

  it('displays a sign-in error without redirecting', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: new Error('Invalid credentials') })
    const user = userEvent.setup()

    render(<LoginPage />)
    await user.type(screen.getByLabelText('Email'), 'member@example.com')
    await user.type(screen.getByLabelText('Senha'), 'incorrect-password')
    await user.click(screen.getByRole('button', { name: 'Entrar com email' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível entrar')
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('starts Google OAuth with the internal callback path', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null })
    const user = userEvent.setup()

    render(<LoginPage />)
    await user.click(screen.getByRole('button', { name: 'Continuar com Google' }))

    const [{ provider, options }] = mockSignInWithOAuth.mock.calls[0]
    expect(provider).toBe('google')
    const redirectTo = new URL(options.redirectTo)
    expect(redirectTo.origin).toBe(window.location.origin)
    expect(redirectTo.pathname).toBe('/auth/callback')
    expect(redirectTo.searchParams.get('next')).toBe('/download')
  })
})
