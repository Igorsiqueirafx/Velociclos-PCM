'use client'

import { useSystemChecks } from './use-system-checks'
import SystemStatusCard from '@/components/SystemStatusCard'
import CheckCard from '@/components/CheckCard'
import SystemInfo from '@/components/SystemInfo'
import AdminPageHeader from '@/components/AdminPageHeader'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.vercel.app'

export default function MonitoramentoPage() {
  const { health, loading, checks, onlineCount, offlineCount, warningCount, overallStatus } = useSystemChecks()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#0071e3] text-xl">Verificando sistema...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Monitoramento" subtitle="Status do sistema e saúde dos serviços" showForm={false} onToggle={() => {}} />

      <SystemStatusCard
        overallStatus={overallStatus}
        onlineCount={onlineCount}
        warningCount={warningCount}
        offlineCount={offlineCount}
        health={health}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {checks.map((check) => (
          <CheckCard key={check.name} check={check} />
        ))}
      </div>

      <SystemInfo backendUrl={BACKEND_URL} />
    </div>
  )
}
