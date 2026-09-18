'use client'

import { useCallback } from 'react'
import ResponsiveVideoEmbed from '@/components/ResponsiveVideoEmbed'

const CATEGORY_LABELS: Record<string, string> = {
  'exaustao': 'Exaustão',
  'canal': 'Canal',
  'erro': 'Erro',
  'rotina': 'Rotina',
  'setup': 'Setup',
}

const CATEGORY_COLORS: Record<string, string> = {
  'exaustao': 'bg-red-500/20 text-red-400',
  'canal': 'bg-blue-500/20 text-blue-400',
  'erro': 'bg-yellow-500/20 text-yellow-400',
  'rotina': 'bg-green-500/20 text-green-400',
  'setup': 'bg-purple-500/20 text-purple-400',
}

interface VideoThumbnailProps {
  videoId: string
  title: string
  thumbnail: string
  isPlaying: boolean
  imageLoaded: boolean
  imageError: boolean
  onPlay: () => void
  onClose: () => void
  duration?: string
  category?: string
  onImageLoad?: () => void
  onImageError?: () => void
}

export default function VideoThumbnail({ videoId, title, thumbnail, isPlaying, imageLoaded, imageError, onPlay, onClose, duration, category, onImageLoad, onImageError }: VideoThumbnailProps) {
  const handlePlayClick = useCallback(() => {
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return
    onPlay()
  }, [videoId, onPlay])

  const handleCloseClick = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <div className="relative aspect-video bg-[#121212] group">
      {isPlaying && /^[A-Za-z0-9_-]{11}$/.test(videoId) ? (
        <ResponsiveVideoEmbed
          videoId={videoId}
          title={title}
          autoplay
          onClose={handleCloseClick}
          overlay={
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handlePlayClick}
            />
          }
        />
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
            onLoad={onImageLoad}
            onError={onImageError}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handlePlayClick}
          >
            <div className="w-14 h-14 bg-[#0071e3] rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg group-hover:shadow-[#0071e3]/40">
              <i className="fas fa-play text-white text-xl ml-1" />
            </div>
          </div>
          {duration && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium">
              {duration}
            </div>
          )}
          {category && CATEGORY_LABELS[category] && (
            <div className={`absolute top-2 left-2 ${CATEGORY_COLORS[category] || 'bg-[#0071e3]/20 text-[#0071e3]'} text-xs px-2 py-1 rounded font-medium`}>
              {CATEGORY_LABELS[category]}
            </div>
          )}
        </>
      )}
    </div>
  )
}