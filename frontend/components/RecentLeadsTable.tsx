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
          <tr className="text-left border-b border-[#404857]">
            <th className="pb-3 text-[#a0a0a0] font-medium">Email</th>
            <th className="pb-3 text-[#a0a0a0] font-medium">Origem</th>
            <th className="pb-3 text-[#a0a0a0] font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub) => (
            <tr key={sub.id} className="border-b border-[#404857]/30 last:border-0">
              <td className="py-3 text-[#dcdcdc]">{sub.email}</td>
              <td className="py-3">
                <span className="px-2 py-1 rounded-full text-xs bg-[#ffd700]/10 text-[#ffd700]">
                  {sub.source || 'website'}
                </span>
              </td>
              <td className="py-3 text-[#a0a0a0]">
                {new Date(sub.created_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
