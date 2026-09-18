import { Metadata } from 'next'
import { logEvent } from '@/lib/logging'
import VideoCard from '@/components/VideoCard'

export const metadata: Metadata = {
  title: 'Todos os Vídeos - Velociclos PCM',
  description: 'Catálogo completo de vídeos do canal Velociclos PCM. Acesse todas as aulas, análises e conteúdos sobre o Método Fimathe.',
}

async function getAllVideos() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/youtube/channel-videos`, {
      next: { revalidate: 1800 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch channel videos: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    logEvent('channel_videos_load', 'error', 'Failed to load channel videos', { error: error instanceof Error ? error.message : String(error) })
    return []
  }
}

export default async function VideosPage() {
  const videos = await getAllVideos()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0f0f19] to-[#1a1f25]">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0071e3] rounded-full filter blur-[150px] opacity-[0.04]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-full mb-6">
              <i className="fas fa-play text-[#0071e3]" />
              <span className="text-[#0071e3] text-sm font-medium">Catálogo Completo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Todos os <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071e3] to-[#6567f1]">Vídeos</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#8a8a8d] max-w-2xl mx-auto leading-relaxed">
              Todo o conteúdo do canal em um só lugar. Aulas, análises e momentos-chave do Método Fimathe.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {videos.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-[#8a8a8d]">
                  <span className="text-[#0071e3] font-bold">{videos.length}</span> vídeos disponíveis
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video: { videoId: string; title: string; description?: string; thumbnail: string; publishedAt: string }) => (
                  <VideoCard
                    key={video.videoId}
                    videoId={video.videoId}
                    title={video.title}
                    description={video.description}
                    thumbnail={video.thumbnail}
                    publishedAt={video.publishedAt}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                <i className="fas fa-search text-3xl text-[#3a3a3c]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum vídeo encontrado</h3>
              <p className="text-[#8a8a8d] mb-6">Tente novamente mais tarde.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
