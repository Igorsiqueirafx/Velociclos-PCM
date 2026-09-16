'use client'

import { usePathname } from 'next/navigation'

interface SidebarProps {
  navItems: Array<{ href: string; label: string; icon: string }>
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onSignOut: () => void
}

export default function Sidebar({ navItems, sidebarOpen, setSidebarOpen, onSignOut }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-out bg-[#1e1e1e] border-r border-[#3a3a3c] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#3a3a3c]">
          <h2 className="text-lg font-semibold text-white">Velociclos Admin</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#8a8a8d] hover:text-white p-1"
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#0071e3]/15 text-[#0071e3]'
                        : 'text-[#8a8a8d] hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className={`${item.icon} text-lg w-5 text-center`}></i>
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#3a3a3c]">
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#ff453a] hover:bg-[#ff453a]/10 transition-colors w-full"
          >
            <i className="fas fa-sign-out-alt text-lg w-5 text-center"></i>
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}