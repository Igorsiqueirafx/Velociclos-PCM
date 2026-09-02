import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Page from '@/app/site-map/page'

describe('SiteMapPage', () => {
  it('renders the page title', () => {
    render(<Page />)
    expect(screen.getByText('Mapa do Site')).toBeInTheDocument()
  })

  it('renders all category sections', () => {
    render(<Page />)

    expect(screen.getByText(/🏠 Principal/i)).toBeInTheDocument()
    expect(screen.getByText(/📚 Conteúdo/i)).toBeInTheDocument()
    expect(screen.getByText(/🎓 Certificados/i)).toBeInTheDocument()
    expect(screen.getByText(/🛠️ Ferramentas/i)).toBeInTheDocument()
    expect(screen.getByText(/🔐 Autenticação/i)).toBeInTheDocument()
    expect(screen.getByText(/👤 Área do Usuário/i)).toBeInTheDocument()
    expect(screen.getByText(/⚙️ Admin/i)).toBeInTheDocument()
  })

  it('renders links for all public pages', () => {
    render(<Page />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Cursos' })).toHaveAttribute('href', '/cursos')
    expect(screen.getByRole('link', { name: 'Artigos' })).toHaveAttribute('href', '/artigos')
    expect(screen.getByRole('link', { name: 'Expert Advisor' })).toHaveAttribute('href', '/ea')
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/auth/login')
  })

  it('renders back to home link', () => {
    render(<Page />)
    expect(screen.getByRole('link', { name: /voltar à home/i })).toHaveAttribute('href', '/')
  })
})
