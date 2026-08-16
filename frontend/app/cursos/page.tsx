'use client'

import { useState, useEffect } from 'react'
import { fetchPlaylists, fetchPlaylistItems, STATIC_PLAYLISTS, YouTubePlaylist, YouTubeVideo } from '@/lib/youtube'

const CATEGORIES = ['Todas', 'Fimathe', 'Forex', 'Ouro', 'Scalper']

export default function CursosPage() {
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [selectedPlaylist, setSelectedPlaylist] = useState<YouTubePlaylist | null>(null)
  const [playlistVideos, setPlaylistVideos] = useState<YouTubeVideo[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null)

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true)
      try {
        const ytPlaylists = await fetchPlaylists()
        if (ytPlaylists.length > 0) {
          setPlaylists(ytPlaylists)
        } else {
          setPlaylists(STATIC_PLAYLISTS)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar playlists')
        setPlaylists(STATIC_PLAYLISTS)
      } finally {
        setLoading(false)
      }
    }
    loadPlaylists()
  }, [])

  const openPlaylistModal = async (playlist: YouTubePlaylist) => {
    setSelectedPlaylist(playlist)
    setLoadingVideos(true)
    setCurrentVideo(null)
    try {
      const videos = await fetchPlaylistItems(playlist.id)
      setPlaylistVideos(videos)
      if (videos.length > 0) setCurrentVideo(videos[0])
    } catch (e) {
      console.error('Failed to load videos:', e)
      setPlaylistVideos([])
    } finally {
      setLoadingVideos(false)
    }
  }

  const closeModal = () => {
    setSelectedPlaylist(null)
    setPlaylistVideos([])
    setCurrentVideo(null)
  }

  const selectVideo = (video: YouTubeVideo) => {
    setCurrentVideo(video)
  }

  const filteredPlaylists = playlists.filter((pl) => {
    if (activeCategory === 'Todas') return true
    const title = pl.title.toLowerCase()
    const map: Record<string, string[]> = {
      Fimathe: ['fimathe', 'método'],
      Forex: ['forex'],
      Ouro: ['ouro', 'xau'],
      Scalper: ['scalper'],
    }
    return map[activeCategory]?.some((keyword) => title.includes(keyword)) ?? false
  })

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#1e2329]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-4">
            Playlists Fimathe
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Todas as playlists do canal Fimathe para você aprofundar seus conhecimentos em trading.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#ffd700] text-[#1e2329] shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                  : 'bg-[#2a2e39] text-[#a0a0a0] border border-[#404857] hover:text-[#ffd700]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#2a2e39] rounded-xl border border-[#404857] overflow-hidden animate-pulse">
                <div className="aspect-video bg-[#343a47]"></div>
                <div className="p-4">
                  <div className="h-5 bg-[#343a47] rounded mb-2"></div>
                  <div className="h-4 bg-[#343a47] rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="bg-[#2a2e39] border border-[#ef4444]/50 rounded-xl p-6 text-center">
            <p className="text-[#ef4444]">Erro: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-[#ffd700] text-[#1e2329] rounded-md font-medium hover:bg-[#ffdd33] transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => openPlaylistModal(playlist)}
                className="group bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden text-left transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
              >
                <div className="relative aspect-video">
                  <img
                    src={playlist.thumbnail || `https://img.youtube.com/vi/${playlist.id}/mqdefault.jpg`}
                    alt={playlist.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/320x180/343a47/ffffff?text=Sem+thumbnail'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-play text-3xl text-white" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#dcdcdc] mb-1 group-hover:text-[#ffd700] transition-colors line-clamp-1">
                    {playlist.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                    <i className="fas fa-video" aria-hidden="true"></i>
                    <span>{playlist.videoCount || 0} vídeos</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedPlaylist && (
          <PlaylistModal
            playlist={selectedPlaylist}
            videos={playlistVideos}
            loading={loadingVideos}
            currentVideo={currentVideo}
            onSelectVideo={selectVideo}
            onClose={closeModal}
          />
        )}
      </div>
    </section>
  )
}

function PlaylistModal({
  playlist,
  videos,
  loading,
  currentVideo,
  onSelectVideo,
  onClose,
}: {
  playlist: YouTubePlaylist
  videos: YouTubeVideo[]
  loading: boolean
  currentVideo: YouTubeVideo | null
  onSelectVideo: (video: YouTubeVideo) => void
  onClose: () => void
}) {
  const videoId = currentVideo?.videoId || ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-5xl mx-4 bg-[#2a2e39] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#1e2329] text-[#a0a0a0] hover:text-[#ffd700] rounded-full flex items-center justify-center focus:ring-2 focus:ring-[#ffd700] transition-colors"
          aria-label="Fechar"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>

        <div className="aspect-video bg-[#1e2329]">
          {currentVideo ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&fs=0&disablekb=1`}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#a0a0a0]">
              {loading ? 'Carregando vídeos...' : 'Nenhum vídeo encontrado.'}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#404857]">
          <h3 id="modal-title" className="text-lg font-bold text-[#dcdcdc] mb-3 flex items-center gap-2">
            <i className="fas fa-list text-[#ffd700]" aria-hidden="true"></i>
            {playlist.title} ({videos.length} vídeos)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
            {videos.map((video) => (
              <button
                key={video.videoId}
                onClick={() => onSelectVideo(video)}
                className={`flex gap-3 p-2 rounded-lg text-left transition-all ${
                  currentVideo?.videoId === video.videoId
                    ? 'bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700]'
                    : 'bg-[#1e2329] hover:bg-[#343a47] text-[#dcdcdc]'
                } focus:outline-none focus:ring-1 focus:ring-[#ffd700]`}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-14 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                  <p className="text-xs text-[#a0a0a0] mt-1">{video.publishedAt?.split('T')[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
