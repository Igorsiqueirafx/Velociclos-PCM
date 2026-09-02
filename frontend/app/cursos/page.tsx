import { Metadata } from 'next'
import { fetchPlaylists, fetchPlaylistItems, CATEGORY_LABELS, YouTubePlaylist, YouTubeVideo } from '@/lib/youtube'
import VideoCard from '@/components/VideoCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cursos e Aulas - Velociclos PCM',
  description: 'Acesse todas as aulas sobre o Método Fimathe. Cursos organizados por tema: Forex, Ouro, Análise Técnica e mais.',
}

interface PlaylistWithVideos extends YouTubePlaylist {
  videos: YouTubeVideo[]
}

async function getPlaylistsWithVideos(): Promise<PlaylistWithVideos[]> {
  try {
    const playlists = await fetchPlaylists()
    
    const playlistsWithVideos = await Promise.all(
      playlists.slice(0, 6).map(async (playlist) => {
        const videos = await fetchPlaylistItems(playlist.id)
        return {
          ...playlist,
          videos: videos.slice(0, 8),
        }
      })
    )
    
    return playlistsWithVideos
  } catch (error) {
    console.error('Failed to load playlists:', error)
    return []
  }
}

export default async function CursosPage() {
  const playlists = await getPlaylistsWithVideos()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0f0f19] to-[#1a1f25]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#ffd700] rounded-full filter blur-[150px] opacity-5" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full filter blur-[120px] opacity-5" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-full mb-6">
              <i className="fas fa-graduation-cap text-[#ffd700]" />
              <span className="text-[#ffd700] text-sm font-medium">Aprenda com os Melhores</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Cursos e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ffed4e]">Aulas</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#a0a0a0] mb-10 max-w-2xl mx-auto leading-relaxed">
              Conteúdo completo sobre o Método Fimathe. Aprenda Forex, Análise Técnica
              e Gestão de Risco diretamente na plataforma.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/cursos/momentos"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] font-bold rounded-xl hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all duration-300"
              >
                <i className="fas fa-play-circle" />
                <span>Momentos Chave</span>
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/metodo-fimathe"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#404857] text-[#dcdcdc] font-semibold rounded-xl hover:border-[#ffd700] hover:text-[#ffd700] transition-all duration-300"
              >
                <span>Sobre o Método</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-[#404857]/50 bg-[#1a1f25]/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${playlists.length}+`, label: 'Cursos' },
              { value: `${playlists.reduce((acc, p) => acc + p.videos.length, 0)}+`, label: 'Aulas' },
              { value: '100%', label: 'Online' },
              { value: '24/7', label: 'Acesso' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#ffd700]">{stat.value}</div>
                <div className="text-sm text-[#707070]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Playlists Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Playlists Disponíveis</h2>
              <p className="text-[#a0a0a0]">Explore nosso conteúdo organizado por tema</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#707070]">
              <i className="fas fa-info-circle" />
              <span>Clique no vídeo para assistir</span>
            </div>
          </div>

          {/* Playlists Grid */}
          <div className="space-y-12">
            {playlists.map((playlist, index) => (
              <div
                key={playlist.id}
                className="bg-[#1e2329] border border-[#404857] rounded-2xl overflow-hidden hover:border-[#ffd700]/30 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Playlist Header */}
                <div className="p-6 sm:p-8 border-b border-[#404857]/50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                        {playlist.videoCount} vídeos
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-white">{playlist.title}</h3>
                        {playlist.category && CATEGORY_LABELS[playlist.category] && (
                          <span className="px-3 py-1 bg-[#ffd700]/10 text-[#ffd700] text-xs font-medium rounded-full">
                            {CATEGORY_LABELS[playlist.category]}
                          </span>
                        )}
                      </div>
                      <p className="text-[#a0a0a0] text-sm leading-relaxed line-clamp-2">
                        {playlist.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Videos Grid */}
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {playlist.videos.map((video) => (
                      <VideoCard
                        key={video.videoId}
                        videoId={video.videoId}
                        title={video.title}
                        description={video.description}
                        thumbnail={video.thumbnail}
                        publishedAt={video.publishedAt}
                        category={video.category}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {playlists.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2a2e39] flex items-center justify-center">
                <i className="fas fa-video-slash text-3xl text-[#404857]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhum curso disponível</h3>
              <p className="text-[#a0a0a0]">Em breve novos conteúdos serão adicionados.</p>
            </div>
          )}
        </div>
      </section>

      {/* Moments CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#ffd700]/10 via-[#ffd700]/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Procando algo <span className="text-[#ffd700]">específico</span>?
            </h2>
            <p className="text-[#a0a0a0] text-lg mb-8">
              Acesse os Momentos Chave e encontre rapidamente os trechos mais importantes de cada vídeo.
            </p>
            <Link
              href="/cursos/momentos"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] font-bold rounded-xl text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all duration-300"
            >
              <i className="fas fa-bolt" />
              <span>Ver Momentos Chave</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
