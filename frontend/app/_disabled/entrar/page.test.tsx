import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockRegisterEmail } = vi.hoisted(() => ({
  mockRegisterEmail: vi.fn(),
}))

vi.mock('./actions', () => ({
  registerEmail: mockRegisterEmail,
}))

import Page from './page'

describe('EntrarPage', () => {
  beforeEach(() => {
    cleanup()
    mockRegisterEmail.mockReset()
  })

  it('renders the form with email input and submit button', () => {
    render(<Page />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cadastrar email/i })).toBeInTheDocument()
  })

  it('shows error when registerEmail returns error', async () => {
    mockRegisterEmail.mockResolvedValue({ error: 'Invalid email format' })
    const user = userEvent.setup()

    render(<Page />)

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    fireEvent.submit(document.querySelector('form')!)

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument()
  })

  it('shows success state when registration succeeds', async () => {
    mockRegisterEmail.mockResolvedValue({ success: true })
    const user = userEvent.setup()

    render(<Page />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    fireEvent.submit(document.querySelector('form')!)

    expect(await screen.findByText(/cadastro realizado/i)).toBeInTheDocument()
  })

  it('shows error message when email already registered', async () => {
    mockRegisterEmail.mockResolvedValue({ error: 'Ja esta cadastrado' })
    const user = userEvent.setup()

    render(<Page />)

    await user.type(screen.getByLabelText('Email'), 'existing@example.com')
    fireEvent.submit(document.querySelector('form')!)

    expect(await screen.findByText(/ja esta cadastrado/i)).toBeInTheDocument()
  })

  it('shows loading state during submission', async () => {
    mockRegisterEmail.mockImplementation(() => new Promise(() => {}))
    const user = userEvent.setup()

    render(<Page />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    fireEvent.submit(document.querySelector('form')!)

    expect(await screen.findByText(/cadastrando/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cadastrando/i })).toBeDisabled()
  })
})
