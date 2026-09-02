'use client'

import { useState, useEffect, useCallback } from 'react'

type NavigationItem = {
  name: string
  href: string
}

const navigation: NavigationItem[] = [
  { name: 'Início', href: '/' },
  { name: 'Expert Advisor', href: '/ea' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'Momentos Chave', href: '/cursos/momentos' },
  { name: 'Método Fimathe', href: '/metodo-fimathe' },
  { name: 'Artigos', href: '/artigos' },
  { name: 'Certificados', href: '/certificados' },
  { name: 'Manual', href: '/manual' },
  { name: 'Relógio', href: '/relogio' },
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

  const toggleMenu = useCallback(() => setMobileMenuOpen(prev => !prev), [])

  return (
    <header className="bg-[#2a2e39] border-b border-[#404857] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center text-[#dcdcdc] font-bold text-xl" aria-label="Velociclos - Página inicial">
              <i className="fas fa-bolt mr-2 text-[#ffd700]"></i>
              <span>Velociclos</span>
            </a>
          </div>

          <nav className="hidden md:flex space-x-6" aria-label="Menu de navegação principal">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#a0a0a0] hover:text-[#ffd700] transition-colors duration-200 font-medium text-sm"
                aria-current={item.href === '/' ? 'page' : undefined}
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
              onClick={toggleMenu}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2a2e39] border-t border-[#404857]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-[#a0a0a0] hover:text-[#ffd700] hover:bg-[#343a47] rounded-md transition-colors duration-200"
                aria-current={item.href === '/' ? 'page' : undefined}
                onClick={closeMenu}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
