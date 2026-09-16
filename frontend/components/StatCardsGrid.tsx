'use client'

interface StatCardsGridProps {
  items: Array<{ label: string; value: string | number; icon: string; color: string; href: string }>
}

export default function StatCardsGrid({ items }: StatCardsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {items.map((stat) => (
        <a
          key={stat.label}
          href={stat.href}
          className="card group hover:border-[#0071e3]/30 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8a8a8d] mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
              <i className={`${stat.icon} text-lg text-white`}></i>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}