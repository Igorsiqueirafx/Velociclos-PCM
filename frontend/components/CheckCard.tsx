'use client'

import { SystemCheck } from '@/app/dashboard/monitoramento/use-system-checks'

export default function CheckCard({ check }: { check: SystemCheck }) {
  return (
    <div className="card">
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
  )
}
