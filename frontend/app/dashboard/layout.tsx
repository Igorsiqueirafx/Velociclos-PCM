'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
  { href: '/dashboard/cursos', label: 'Cursos', icon: 'fas fa-play-circle' },
  { href: '/dashboard/artigos', label: 'Artigos', icon: 'fas fa-newspaper' },
  { href: '/dashboard/certificados', label: 'Certificados', icon: 'fas fa-award' },
  { href: '/dashboard/downloads', label: 'Downloads', icon: 'fas fa-download' },
  { href: '/dashboard/pages', label: 'Páginas', icon: 'fas fa-file-alt' },
  { href: '/dashboard/leads', label: 'Leads', icon: 'fas fa-bullseye' },
  { href: '/dashboard/monitoramento', label: 'Monitoramento', icon: 'fas fa-heartbeat' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const user = session?.user

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#1e2329] flex items-center justify-center">
        <div className="text-[#ffd700] text-xl">Carregando...</div>
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <div className="app">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#404857]">
          <h2 className="text-lg font-bold text-[#ffd700]">Velociclos Admin</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#a0a0a0] hover:text-[#dcdcdc]"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const currentPath = pathname || '/dashboard'
              const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href))
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#ffd700]/10 text-[#ffd700]'
                        : 'text-[#a0a0a0] hover:text-[#dcdcdc] hover:bg-[#343a47]'
                    }`}
                  >
                    <i className={`${item.icon} text-lg w-5 text-center`}></i>
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#404857]">
          <button
            onClick={() => signOut({ redirectTo: "/auth/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#ff4444] hover:bg-[#ff4444]/10 transition-colors w-full"
          >
            <i className="fas fa-sign-out-alt text-lg w-5 text-center"></i>
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content flex-1 min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-[#1e2329]/80 backdrop-blur-md border-b border-[#404857]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[#a0a0a0] hover:text-[#dcdcdc] p-2 -ml-2"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            <h1 className="text-lg font-semibold text-[#dcdcdc] capitalize">
              {(pathname || '/dashboard') === '/dashboard' ? 'Dashboard' : (pathname || '/dashboard').split('/').pop()}
            </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-[#a0a0a0]">
                {user?.image && (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                {!user?.image && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] flex items-center justify-center text-[#1e2329] font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="max-w-[150px] truncate">{user?.name || user?.email}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
