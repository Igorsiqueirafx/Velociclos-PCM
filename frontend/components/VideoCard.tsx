'use client'

import { useState, useEffect } from 'react'
import VideoCardCompact from './VideoCardCompact'
import VideoThumbnail from './VideoThumbnail'
import VideoMeta from './VideoMeta'

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlaying) {
        setIsPlaying(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isPlaying])

  const handlePlay = () => {
    if (!isValidVideoId(videoId)) return
    setIsPlaying(true)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(false)
  }

  if (compact) {
    return (
      <VideoCardCompact
        _videoId={videoId}
        title={title}
        thumbnail={thumbnail}
        publishedAt={publishedAt}
        viewCount={viewCount}
        onPlay={handlePlay}
      />
    )
  }

  const handleImageLoad = () => setImageLoaded(true)
  const handleImageError = () => { setImageError(true); setImageLoaded(true) }

  return (
    <div className="group bg-[#1e2329] border border-[#404857]/50 rounded-xl overflow-hidden hover:border-[#ffd700]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#ffd700]/5">
      <VideoThumbnail
        videoId={videoId}
        title={title}
        thumbnail={thumbnail}
        isPlaying={isPlaying}
        imageLoaded={imageLoaded}
        imageError={imageError}
        onPlay={handlePlay}
        onClose={handleClose}
        duration={duration}
        category={category}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
      />
      <VideoMeta
        title={title}
        description={description}
        publishedAt={publishedAt}
        viewCount={viewCount}
        onPlay={handlePlay}
      />
    </div>
  )
}
