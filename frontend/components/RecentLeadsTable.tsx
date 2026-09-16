'use client'

interface Subscriber {
  id: string
  email: string
  source: string
  created_at: string
}

interface RecentLeadsTableProps {
  subscribers: Subscriber[]
}

export default function RecentLeadsTable({ subscribers }: RecentLeadsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-[#3a3a3c]">
            <th className="pb-3 text-[#8a8a8d] font-medium">Email</th>
            <th className="pb-3 text-[#8a8a8d] font-medium">Origem</th>
            <th className="pb-3 text-[#8a8a8d] font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub) => (
            <tr key={sub.id} className="border-b border-[#3a3a3c]/30 last:border-0">
              <td className="py-3 text-white">{sub.email}</td>
              <td className="py-3">
                <span className="px-2 py-1 rounded-full text-xs bg-[#0071e3]/10 text-[#0071e3]">
                  {sub.source || 'website'}
                </span>
              </td>
              <td className="py-3 text-[#8a8a8d]">
                {new Date(sub.created_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}