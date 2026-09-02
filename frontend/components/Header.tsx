'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type NavigationItem = {
  name: string
  href: string
}

const navigation: NavigationItem[] = [
  { name: 'Início', href: '/' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'Momentos', href: '/cursos/momentos' },
  { name: 'Método', href: '/metodo-fimathe' },
  { name: 'Artigos', href: '/artigos' },
  { name: 'EA', href: '/ea' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const closeMenu = useCallback(() => setMobileMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMobileMenuOpen(prev => !prev), [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1a1f25]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-[#404857]/50'
          : 'bg-[#1a1f25] border-b border-[#404857]'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Velociclos - Página inicial"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#ffed4e] flex items-center justify-center shadow-lg group-hover:shadow-[#ffd700]/30 transition-shadow">
              <i className="fas fa-bolt text-[#1a1f25] text-lg" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-[#ffd700] transition-colors">
              Velociclos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Menu principal">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-[#ffd700] bg-[#ffd700]/10'
                    : 'text-[#a0a0a0] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#ffd700] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] font-semibold rounded-lg text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-200"
            >
              <i className="fas fa-play-circle" />
              <span>Assistir</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-[#dcdcdc] hover:text-[#ffd700] transition-colors"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            onClick={toggleMenu}
          >
            <div className="relative w-6 h-5">
              <span
                className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
              <span
                className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 py-4 space-y-1 bg-[#1a1f25] border-t border-[#404857]">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'text-[#ffd700] bg-[#ffd700]/10'
                  : 'text-[#a0a0a0] hover:text-white hover:bg-white/5'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/cursos"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] font-semibold rounded-xl"
              onClick={closeMenu}
            >
              <i className="fas fa-play-circle" />
              <span>Assistir Cursos</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
