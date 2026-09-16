'use client'

import { useState, useEffect } from 'react'

import type { User } from 'next-auth'

interface DashboardHeaderProps {
  pathname: string
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: User | null
}

export default function DashboardHeader({ pathname, sidebarOpen, setSidebarOpen, user }: DashboardHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pageTitle = (pathname || '/dashboard') === '/dashboard'
    ? 'Dashboard'
    : (pathname || '/dashboard').split('/').pop()

  return (
    <header className={`sticky top-0 z-20 bg-[#121212]/80 backdrop-blur-xl border-b border-[#3a3a3c] ${scrolled ? 'bg-[#121212]/80' : 'bg-[#121212]'}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-[#8a8a8d] hover:text-white p-2 -ml-2 rounded-lg hover:bg-white/5"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <h1 className="text-lg font-semibold text-white capitalize">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-sm text-[#8a8a8d]">
            {user?.image && (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-8 h-8 rounded-full border border-[#3a3a3c]"
              />
            )}
            {!user?.image && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#6567f1] flex items-center justify-center text-white font-semibold text-xs">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="max-w-[150px] truncate font-medium text-white">{user?.name || user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  )
}