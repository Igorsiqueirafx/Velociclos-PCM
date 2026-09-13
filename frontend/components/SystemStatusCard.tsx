'use client'

export default function SystemStatusCard({
  overallStatus,
  onlineCount,
  warningCount,
  offlineCount,
  health,
}: {
  overallStatus: string
  onlineCount: number
  warningCount: number
  offlineCount: number
  health: { timestamp?: string } | null
}) {
  return (
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
            {onlineCount} online · {warningCount} avisos · {offlineCount} offline
          </p>
          {health?.timestamp && (
            <p className="text-sm text-[#707070] mt-1">
              última verificação: {new Date(health.timestamp).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
