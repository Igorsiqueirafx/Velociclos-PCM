'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'EA', href: '/ea' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'Vídeos', href: '/cursos/videos' },
  { name: 'Método', href: '/metodo-fimathe' },
  { name: 'Documentação', href: '/metodo-fimathe/documentacao' },
  { name: 'Artigos', href: '/artigos' },
  { name: 'Certificados', href: '/certificados' },
  { name: 'Manual', href: '/manual' },
  { name: 'Relógio', href: '/relogio' },
  { name: 'Sitemap', href: '/site-map' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const closeMenu = useCallback(() => setMobileMenuOpen(false), [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'glass-header shadow-lg'
          : 'bg-[#121212]'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Velociclos - Página inicial">
            <img src="/logo f.png" alt="" className="h-9 w-9 object-contain" aria-hidden="true" />
            <span className="text-xl font-semibold text-white tracking-[-0.01em]">Velociclos</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Menu de navegação principal">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-[#b0b0b0] hover:text-white transition-all duration-200 font-medium text-sm rounded-lg hover:bg-white/5"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              className="text-[#e5e5e5] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3] rounded-lg p-2 transition-all duration-200 hover:bg-white/5"
              aria-label="Abrir menu de navegação"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden px-4 py-4 space-y-1 glass-header animate-slide-up" aria-label="Menu mobile">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-3 text-[#b0b0b0] hover:text-white transition-all duration-200 rounded-xl text-sm font-medium hover:bg-white/5"
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/cursos"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#0071e3] text-white font-semibold rounded-xl hover:bg-[#005fd9] transition-all duration-200 shadow-lg shadow-[#0071e3]/20"
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