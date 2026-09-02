'use client'

import { useState, useEffect, useRef } from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null)

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
    'exaustao': 'bg-red-500/10 text-red-400',
    'canal': 'bg-blue-500/10 text-blue-400',
    'erro': 'bg-yellow-500/10 text-yellow-400',
    'rotina': 'bg-green-500/10 text-green-400',
    'setup': 'bg-purple-500/10 text-purple-400',
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
        ref={containerRef}
        className="group flex gap-3 p-2 rounded-lg hover:bg-[#2a2e39] transition-colors cursor-pointer"
        onClick={handlePlay}
      >
        <div className="relative w-40 aspect-video rounded overflow-hidden flex-shrink-0">
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
              <img
                src={imageError ? `https://img.youtube.com/vi/${videoId}/default.jpg` : thumbnail}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="fas fa-play text-xl text-white" />
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
    <div className="group block bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden hover:border-[#ffd700] transition-all hover:shadow-lg hover:shadow-[#ffd700]/5">
      <div className="relative aspect-video">
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
              className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Fechar vídeo"
            >
              <i className="fas fa-times" />
            </button>
          </>
        ) : (
          <>
            <img
              src={imageError ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
            />
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              onClick={handlePlay}
            >
              <div className="w-16 h-16 bg-[#ffd700] rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                <i className="fas fa-play text-2xl text-[#1e2329] ml-1" />
              </div>
            </div>
            {duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {duration}
              </div>
            )}
            {category && categoryLabels[category] && (
              <div className={`absolute top-2 left-2 ${categoryColors[category] || 'bg-[#ffd700]/10 text-[#ffd700]'} text-xs px-2 py-1 rounded`}>
                {categoryLabels[category]}
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4">
        <h3
          className="text-sm font-medium text-[#dcdcdc] line-clamp-2 group-hover:text-[#ffd700] transition-colors mb-2 cursor-pointer"
          onClick={handlePlay}
        >
          {title}
        </h3>
        {description && (
          <p className="text-xs text-[#707070] line-clamp-2 mb-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-[#707070]">
          <span>{formatDate(publishedAt)}</span>
          {viewCount && (
            <span>
              <i className="fas fa-eye mr-1" />
              {formatViews(viewCount)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
