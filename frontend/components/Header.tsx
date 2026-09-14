'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'EA', href: '/ea' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'Método', href: '/metodo-fimathe' },
  { name: 'Artigos', href: '/artigos' },
  { name: 'Certificados', href: '/certificados' },
  { name: 'Manual', href: '/manual' },
  { name: 'Relógio', href: '/relogio' },
  { name: 'Sitemap', href: '/site-map' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const closeMenu = useCallback(() => setMobileMenuOpen(false), [])

  return (
    <header className="bg-[#2a2e39] border-b border-[#404857] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Velociclos - Página inicial">
            <img src="/logo f.png" alt="" className="mr-2 h-9 w-9 object-contain" aria-hidden="true" />
            <span className="text-xl font-bold text-white">Velociclos</span>
          </Link>

          <nav className="hidden md:flex space-x-6" aria-label="Menu de navegação principal">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#a0a0a0] hover:text-[#ffd700] transition-colors duration-200 font-medium text-sm"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              className="text-[#dcdcdc] hover:text-[#ffd700] focus:outline-none focus:ring-2 focus:ring-[#ffd700] rounded-md p-2"
              aria-label="Abrir menu de navegação"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fas fa-bars" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden px-4 py-4 space-y-1 bg-[#2a2e39] border-t border-[#404857]">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-3 text-[#a0a0a0] hover:text-[#ffd700] transition-colors rounded-xl text-sm font-medium"
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/cursos"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1e2329] font-semibold rounded-xl"
              onClick={closeMenu}
            >
              <i className="fas fa-play-circle" />
              <span>Assistir Cursos</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}