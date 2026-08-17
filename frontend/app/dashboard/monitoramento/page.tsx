'use client'

import { useState, useEffect } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

interface HealthStatus {
  status: string
  timestamp: string
}

interface SystemCheck {
  name: string
  status: 'online' | 'offline' | 'warning'
  detail: string
  icon: string
}

export default function MonitoramentoPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [checks, setChecks] = useState<SystemCheck[]>([])

  useEffect(() => {
    const checkSystem = async () => {
      const results: SystemCheck[] = []
      const timestamp = new Date().toISOString()

      try {
        const startTime = Date.now()
        const res = await fetch(`${BACKEND_URL}/api/health`, {
          signal: AbortSignal.timeout(5000),
        })
        const responseTime = Date.now() - startTime

        if (res.ok) {
          const data = await res.json()
          setHealth(data)
          results.push({
            name: 'Backend API',
            status: 'online',
            detail: `Respondeu em ${responseTime}ms - Status: ${data.status}`,
            icon: 'fas fa-server',
          })
        } else {
          results.push({
            name: 'Backend API',
            status: 'offline',
            detail: `HTTP ${res.status}`,
            icon: 'fas fa-server',
          })
        }
      } catch {
        results.push({
          name: 'Backend API',
          status: 'offline',
          detail: 'Sem resposta (timeout ou conexão recusada)',
          icon: 'fas fa-server',
        })
      }

      try {
        const supabaseRes = await fetch(`${BACKEND_URL}/api/subscribers`)
        if (supabaseRes.ok) {
          results.push({
            name: 'Endpoint Subscribers',
            status: 'online',
            detail: 'Acessível via backend',
            icon: 'fas fa-users',
          })
        } else {
          results.push({
            name: 'Endpoint Subscribers',
            status: 'warning',
            detail: `HTTP ${supabaseRes.status}`,
            icon: 'fas fa-users',
          })
        }
      } catch {
        results.push({
          name: 'Endpoint Subscribers',
          status: 'offline',
          detail: 'Sem resposta',
          icon: 'fas fa-users',
        })
      }

      try {
        const videosRes = await fetch(`${BACKEND_URL}/api/videos`)
        if (videosRes.ok) {
          const data = await videosRes.json()
          results.push({
            name: 'Endpoint Vídeos',
            status: 'online',
            detail: `${Array.isArray(data) ? data.length : 0} vídeos cadastrados`,
            icon: 'fas fa-video',
          })
        } else {
          results.push({
            name: 'Endpoint Vídeos',
            status: 'warning',
            detail: `HTTP ${videosRes.status}`,
            icon: 'fas fa-video',
          })
        }
      } catch {
        results.push({
          name: 'Endpoint Vídeos',
          status: 'offline',
          detail: 'Sem resposta',
          icon: 'fas fa-video',
        })
      }

      try {
        const playlistsRes = await fetch(`${BACKEND_URL}/api/playlists`)
        if (playlistsRes.ok) {
          const data = await playlistsRes.json()
          results.push({
            name: 'Endpoint Playlists',
            status: 'online',
            detail: `${Array.isArray(data) ? data.length : 0} playlists cadastradas`,
            icon: 'fas fa-list',
          })
        } else {
          results.push({
            name: 'Endpoint Playlists',
            status: 'warning',
            detail: `HTTP ${playlistsRes.status}`,
            icon: 'fas fa-list',
          })
        }
      } catch {
        results.push({
          name: 'Endpoint Playlists',
          status: 'offline',
          detail: 'Sem resposta',
          icon: 'fas fa-list',
        })
      }

      results.push({
        name: 'Frontend (Vercel)',
        status: 'online',
        detail: 'Renderizando corretamente',
        icon: 'fas fa-globe',
      })

      setChecks(results)
      setLoading(false)
    }

    checkSystem()
  }, [])

  const onlineCount = checks.filter((c) => c.status === 'online').length
  const offlineCount = checks.filter((c) => c.status === 'offline').length
  const warningCount = checks.filter((c) => c.status === 'warning').length
  const overallStatus = offlineCount > 0 ? 'offline' : warningCount > 0 ? 'warning' : 'online'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Verificando sistema...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Monitoramento</h1>
        <p className="text-[#a0a0a0]">Status do sistema e saúde dos serviços</p>
      </div>

      {/* Overall Status */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            overallStatus === 'online'
              ? 'bg-[#00ff7f]/20 text-[#00ff7f]'
              : overallStatus === 'warning'
              ? 'bg-[#ffd700]/20 text-[#ffd700]'
              : 'bg-[#ff4444]/20 text-[#ff4444]'
          }`}>
            <i className={`fas ${
              overallStatus === 'online'
                ? 'fa-check-circle'
                : overallStatus === 'warning'
                ? 'fa-exclamation-triangle'
                : 'fa-times-circle'
            } text-3xl`}></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#dcdcdc]">
              Sistema {overallStatus === 'online' ? 'Operacional' : overallStatus === 'warning' ? 'Parcialmente Operacional' : 'Indisponível'}
            </h2>
            <p className="text-[#a0a0a0]">
              {onlineCount} online • {warningCount} avisos • {offlineCount} offline
            </p>
            {health?.timestamp && (
              <p className="text-sm text-[#707070] mt-1">
                Última verificação: {new Date(health.timestamp).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Checks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {checks.map((check) => (
          <div key={check.name} className="card">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                check.status === 'online'
                  ? 'bg-[#00ff7f]/20 text-[#00ff7f]'
                  : check.status === 'warning'
                  ? 'bg-[#ffd700]/20 text-[#ffd700]'
                  : 'bg-[#ff4444]/20 text-[#ff4444]'
              }`}>
                <i className={`${check.icon} text-lg`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#dcdcdc] text-sm">{check.name}</h3>
                <p className={`text-xs mt-1 ${
                  check.status === 'online'
                    ? 'text-[#00ff7f]'
                    : check.status === 'warning'
                    ? 'text-[#ffd700]'
                    : 'text-[#ff4444]'
                }`}>
                  {check.status === 'online' ? 'Online' : check.status === 'warning' ? 'Aviso' : 'Offline'}
                </p>
                <p className="text-xs text-[#707070] mt-1 line-clamp-2">{check.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-[#dcdcdc] mb-4">Informações do Sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <i className="fas fa-code-branch text-[#ffd700]"></i>
            <span>Backend URL: {BACKEND_URL}</span>
          </div>
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <i className="fas fa-database text-[#ffd700]"></i>
            <span>Banco: Supabase (PostgreSQL)</span>
          </div>
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <i className="fas fa-shield-alt text-[#ffd700]"></i>
            <span>Auth: Supabase Auth</span>
          </div>
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <i className="fas fa-clock text-[#ffd700]"></i>
            <span>Verificado em: {new Date().toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
