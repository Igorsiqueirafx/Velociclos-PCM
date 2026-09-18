import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

describe('Footer', () => {
  it('renders the site name', () => {
    render(<Footer />)
    expect(screen.getByText('Velociclos')).toBeInTheDocument()
  })

  it('renders current year in copyright', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument()
  })

  it('renders all footer link sections', () => {
    render(<Footer />)

    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
    expect(screen.getByText('Ferramentas')).toBeInTheDocument()
    expect(screen.getByText('Navegação')).toBeInTheDocument()
  })

  it('renders links with correct hrefs', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: 'Cursos' })).toHaveAttribute('href', '/cursos')
    expect(screen.getByRole('link', { name: 'Vídeos' })).toHaveAttribute('href', '/cursos/videos')
    expect(screen.getByRole('link', { name: 'Artigos' })).toHaveAttribute('href', '/artigos')
    expect(screen.getByRole('link', { name: 'Expert Advisor' })).toHaveAttribute('href', '/ea')
    expect(screen.getByRole('link', { name: 'Método Fimathe' })).toHaveAttribute('href', '/metodo-fimathe')
    expect(screen.getByRole('link', { name: 'Mapa do Site' })).toHaveAttribute('href', '/site-map')
  })
})
