import { Metadata } from 'next'
import { fetchPlaylists, fetchPlaylistItems, CATEGORY_LABELS, YouTubePlaylist, YouTubeVideo } from '@/lib/youtube'

export const metadata: Metadata = {
  title: 'Cursos e Aulas - Velociclos PCM | Método Fimathe',
  description: 'Acesse todas as aulas do Marcelo Ferreira sobre o Método Fimathe. Cursos organizados por tema: Forex, Ouro, Análise Técnica e mais.',
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
          videos: videos.slice(0, 10),
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25]">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffd700]/5 to-transparent" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-4">
              Cursos e <span className="text-[#ffd700]">Aulas</span>
            </h1>
            <p className="text-lg text-[#a0a0a0] mb-8">
              Acesse todo o conteúdo educacional do Marcelo Ferreira sobre o Método Fimathe. 
              Aprenda Forex, Análise Técnica e Gestão de Risco com quem mais entende do assunto.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.youtube.com/@MARCELOFERREIRAFIMATHE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg hover:from-[#ffdd33] hover:to-[#ffd700] transition-all"
              >
                <i className="fab fa-youtube text-xl" />
                Canal no YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Playlists Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            <button className="px-4 py-2 bg-[#ffd700] text-[#1e2329] rounded-full text-sm font-medium">
              Todos
            </button>
            {Object.entries(CATEGORY_LABELS).slice(0, 6).map(([key, label]) => (
              <button
                key={key}
                className="px-4 py-2 bg-[#2a2e39] text-[#a0a0a0] border border-[#404857] rounded-full text-sm font-medium hover:border-[#ffd700] hover:text-[#ffd700] transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Playlists Grid */}
          <div className="space-y-12">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden">
                {/* Playlist Header */}
                <div className="p-6 border-b border-[#404857]">
                  <div className="flex items-start gap-4">
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-[#dcdcdc] mb-2">
                        {playlist.title}
                      </h2>
                      <p className="text-[#a0a0a0] text-sm mb-2">
                        {playlist.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-[#707070]">
                        <span>
                          <i className="fas fa-play-circle mr-1" />
                          {playlist.videoCount} vídeos
                        </span>
                        {playlist.category && (
                          <span className="px-2 py-1 bg-[#ffd700]/10 text-[#ffd700] rounded text-xs">
                            {CATEGORY_LABELS[playlist.category] || playlist.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Videos Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {playlist.videos.map((video) => (
                      <a
                        key={video.videoId}
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <i className="fas fa-play text-3xl text-white" />
                          </div>
                        </div>
                        <h3 className="text-sm font-medium text-[#dcdcdc] line-clamp-2 group-hover:text-[#ffd700] transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs text-[#707070] mt-1">
                          {new Date(video.publishedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moments Section */}
      <section className="py-12 bg-[#1e2329]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#dcdcdc] mb-3">
              Momentos <span className="text-[#ffd700]">Chave</span>
            </h2>
            <p className="text-[#a0a0a0]">
              Trechos selecionados dos vídeos para aprendizado rápido
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: 'exaustao', title: '3 Sinais de Exaustão', icon: 'fa-chart-line' },
              { type: 'canal', title: 'Como Marcar Canal de Abertura', icon: 'fa-layer-group' },
              { type: 'erro', title: 'Erros Comuns de Iniciantes', icon: 'fa-exclamation-triangle' },
              { type: 'rotina', title: 'Rotina do Trader Profissional', icon: 'fa-clock' },
              { type: 'setup', title: 'Setup de Entrada Perfeito', icon: 'fa-bullseye' },
            ].map((moment) => (
              <a
                key={moment.type}
                href={`/cursos/momentos?category=${moment.type}`}
                className="bg-[#2a2e39] border border-[#404857] rounded-xl p-6 hover:border-[#ffd700] transition-colors group"
              >
                <div className="w-12 h-12 bg-[#ffd700]/10 rounded-lg flex items-center justify-center mb-4">
                  <i className={`fas ${moment.icon} text-xl text-[#ffd700]`} />
                </div>
                <h3 className="text-lg font-bold text-[#dcdcdc] group-hover:text-[#ffd700] transition-colors">
                  {moment.title}
                </h3>
                <p className="text-sm text-[#a0a0a0] mt-2">
                  Assista os melhores momentos sobre este tema
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
