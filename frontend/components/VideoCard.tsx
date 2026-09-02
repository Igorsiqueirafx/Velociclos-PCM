'use client'

import { useState, useEffect } from 'react'

interface VideoCardProps {
  videoId: string
  title: string
  description?: string
  thumbnail: string
  publishedAt: string
  duration?: string
  viewCount?: string
  category?: string
  compact?: boolean
}

function isValidVideoId(videoId: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(videoId)
}

export default function VideoCard({
  videoId,
  title,
  description,
  thumbnail,
  publishedAt,
  duration,
  viewCount,
  category,
  compact = false,
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatViews = (views: string) => {
    const num = parseInt(views)
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return views
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const categoryLabels: Record<string, string> = {
    'exaustao': 'Exaustão',
    'canal': 'Canal',
    'erro': 'Erro',
    'rotina': 'Rotina',
    'setup': 'Setup',
  }

  const categoryColors: Record<string, string> = {
    'exaustao': 'bg-red-500/20 text-red-400',
    'canal': 'bg-blue-500/20 text-blue-400',
    'erro': 'bg-yellow-500/20 text-yellow-400',
    'rotina': 'bg-green-500/20 text-green-400',
    'setup': 'bg-purple-500/20 text-purple-400',
  }

  const handlePlay = () => {
    if (!isValidVideoId(videoId)) return
    setIsPlaying(true)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(false)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlaying) {
        setIsPlaying(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isPlaying])

  if (compact) {
    return (
      <div
        className="group flex gap-3 p-3 rounded-xl hover:bg-[#2a2e39] transition-all duration-200 cursor-pointer"
        onClick={handlePlay}
      >
        <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1f25]">
          {isPlaying && isValidVideoId(videoId) ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          ) : (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 skeleton" />
              )}
              <img
                src={imageError ? `https://img.youtube.com/vi/${videoId}/default.jpg` : thumbnail}
                alt={title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true)
                  setImageLoaded(true)
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-8 h-8 bg-[#ffd700] rounded-full flex items-center justify-center">
                  <i className="fas fa-play text-[#1a1f25] text-xs ml-0.5" />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-[#dcdcdc] line-clamp-2 group-hover:text-[#ffd700] transition-colors">
            {title}
          </h4>
          <p className="text-xs text-[#707070] mt-1">
            {formatDate(publishedAt)}
          </p>
          {viewCount && (
            <p className="text-xs text-[#707070]">
              {formatViews(viewCount)} visualizações
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-[#1e2329] border border-[#404857]/50 rounded-xl overflow-hidden hover:border-[#ffd700]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#ffd700]/5">
      <div className="relative aspect-video bg-[#1a1f25]">
        {isPlaying && isValidVideoId(videoId) ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white transition-colors z-10"
              aria-label="Fechar vídeo"
            >
              <i className="fas fa-times" />
            </button>
          </>
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            <img
              src={imageError ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : thumbnail}
              alt={title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true)
                setImageLoaded(true)
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={handlePlay}
            >
              <div className="w-14 h-14 bg-[#ffd700] rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg group-hover:shadow-[#ffd700]/40">
                <i className="fas fa-play text-[#1a1f25] text-xl ml-1" />
              </div>
            </div>
            {duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium">
                {duration}
              </div>
            )}
            {category && categoryLabels[category] && (
              <div className={`absolute top-2 left-2 ${categoryColors[category] || 'bg-[#ffd700]/20 text-[#ffd700]'} text-xs px-2 py-1 rounded font-medium`}>
                {categoryLabels[category]}
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4">
        <h3
          className="text-sm font-medium text-[#dcdcdc] line-clamp-2 hover:text-[#ffd700] transition-colors mb-2 cursor-pointer"
          onClick={handlePlay}
        >
          {title}
        </h3>
        {description && (
          <p className="text-xs text-[#707070] line-clamp-2 mb-3">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-[#707070]">
          <span>{formatDate(publishedAt)}</span>
          {viewCount && (
            <span className="flex items-center gap-1">
              <i className="fas fa-eye" />
              {formatViews(viewCount)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
