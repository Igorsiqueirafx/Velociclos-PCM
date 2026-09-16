'use client'

import { SystemCheck } from '@/app/dashboard/monitoramento/use-system-checks'

export default function CheckCard({ check }: { check: SystemCheck }) {
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          check.status === 'online'
            ? 'bg-[#34c759]/20 text-[#34c759]'
            : check.status === 'warning'
            ? 'bg-[#ff9500]/20 text-[#ff9500]'
            : 'bg-[#ff453a]/20 text-[#ff453a]'
        }`}>
          <i className={`${check.icon} text-lg`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-sm">{check.name}</h3>
          <p className={`text-xs mt-1 ${
            check.status === 'online'
              ? 'text-[#34c759]'
              : check.status === 'warning'
              ? 'text-[#ff9500]'
              : 'text-[#ff453a]'
          }`}>
            {check.status === 'online' ? 'Online' : check.status === 'warning' ? 'Aviso' : 'Offline'}
          </p>
          <p className="text-xs text-[#8a8a8d] mt-1 line-clamp-2">{check.detail}</p>
        </div>
      </div>
    </div>
  )
}