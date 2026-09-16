export default function CursosStatsBar({ playlists }: { playlists: { videos: { length: number } }[] }) {
  return (
    <section className="py-8 border-y border-[#3a3a3c]/50 bg-[#0a0a12]/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: `${playlists.length}+`, label: 'Cursos' },
            { value: `${playlists.reduce((acc, p) => acc + p.videos.length, 0)}+`, label: 'Aulas' },
            { value: '100%', label: 'Online' },
            { value: '24/7', label: 'Acesso' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-white">{stat.value}</div>
              <div className="text-sm text-[#8a8a8d]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}