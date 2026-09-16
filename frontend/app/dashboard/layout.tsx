'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Sidebar from '@/components/Sidebar'
import DashboardHeader from '@/components/DashboardHeader'

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
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-[#0071e3] text-xl">Carregando...</div>
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <div className="min-h-screen bg-[#121212] flex">
      <Sidebar
        navItems={navItems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSignOut={() => signOut({ redirectTo: "/auth/login" })}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader
          pathname={pathname}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user ?? null}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}