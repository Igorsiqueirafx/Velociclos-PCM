'use client'

export default function MediaLogos() {
  return (
    <section className="py-12 bg-[#0a0a12] border-y border-[#404858]/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[#707070] text-sm mb-6 uppercase tracking-wider">Como visto em</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {[
            { icon: 'fa-newspaper', label: 'Forbes' },
            { icon: 'fa-chart-line', label: 'Investing.com' },
            { icon: 'fa-magnifying-glass', label: 'IstoÉ' },
            { icon: 'fa-bitcoin', label: 'Criptofacio' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[#707070] hover:text-white transition-colors">
              <i className={`fas ${item.icon} text-xl`} />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
