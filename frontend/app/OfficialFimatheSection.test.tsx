import { render, screen } from '@testing-library/react'
import OfficialFimatheSection from './OfficialFimatheSection'

describe('OfficialFimatheSection', () => {
  it('attributes Fimathe and Hantec information to their official sources', () => {
    render(<OfficialFimatheSection />)

    expect(
      screen.getByRole('heading', { name: 'O novo ambiente digital da Fimathe' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Ambiente oficial Fimathe®')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Fimathe e Hantec Markets' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/não são destinados nem oferecidos a residentes do Brasil/i))
      .toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Restrições e políticas da Hantec/ }),
    ).toHaveAttribute('href', 'https://hmarkets.com/pt/terms/hantec-policies/')
    expect(
      screen.getByRole('link', { name: /Ver a parceria no Portal Fimathe/ }),
    ).toHaveAttribute('href', 'https://portalfimathe.com/')
  })

  it('displays official brand assets with accessible descriptions', () => {
    render(<OfficialFimatheSection />)

    expect(screen.getByRole('img', { name: 'Fimathe Hub' })).toHaveAttribute(
      'src',
      '/official/fimathe-hub-logo.png',
    )
    expect(screen.getByRole('img', { name: 'Hantec Markets' })).toHaveAttribute(
      'src',
      '/official/hantec-markets-logo.png',
    )
  })
})
