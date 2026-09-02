import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '@/components/Header'

describe('Header', () => {
  it('renders the brand name', () => {
    render(<Header />)
    expect(screen.getByText('Velociclos')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    const routes = [
      'Início', 'Expert Advisor', 'Cursos', 'Momentos Chave', 'Método Fimathe',
      'Artigos', 'Certificados', 'Manual', 'Relógio',
    ]
    render(<Header />)
    routes.forEach(route => {
      expect(screen.getByText(route)).toBeInTheDocument()
    })
  })

  it('toggles mobile menu when hamburger button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const toggleButton = screen.getByLabelText('Abrir menu de navegação')
    expect(toggleButton).toBeInTheDocument()

    await user.click(toggleButton)

    const mobileLinks = screen.getAllByRole('link')
    expect(mobileLinks.length).toBeGreaterThan(9)

    await user.click(toggleButton)
  })

  it('closes mobile menu on Escape key', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const toggleButton = screen.getByLabelText('Abrir menu de navegação')
    await user.click(toggleButton)

    await user.keyboard('{Escape}')

    const expanded = screen.getByLabelText('Abrir menu de navegação')
    expect(expanded).toHaveAttribute('aria-expanded', 'false')
  })
})
