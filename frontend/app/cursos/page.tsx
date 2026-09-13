import { Metadata } from 'next'
import { fetchPlaylists, fetchPlaylistItems, YouTubePlaylist, YouTubeVideo } from '@/lib/youtube'
import { logEvent } from '@/lib/logging'
import CursosHero from './CursosHero'
import PlaylistCard from './PlaylistCard'
import CursosStatsBar from './CursosStatsBar'
import CursosCtaSection from './CursosCtaSection'

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
    logEvent('playlists_load', 'error', 'Failed to load playlists', { error: error instanceof Error ? error.message : String(error) })
    return []
  }
}

export default async function CursosPage() {
  const playlists = await getPlaylistsWithVideos()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0f0f19] to-[#1a1f25]">
      <CursosHero />

      <CursosStatsBar playlists={playlists} />

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="space-y-12">
            {playlists.map((playlist, index) => (
              <PlaylistCard key={playlist.id} playlist={playlist} videos={[]} index={index} />
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

      <CursosCtaSection />
    </main>
  )
}
