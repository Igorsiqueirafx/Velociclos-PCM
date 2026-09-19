'use client'

import { useState, useEffect } from 'react'
import VideoCardCompact from './VideoCardCompact'
import VideoThumbnail from './VideoThumbnail'
import VideoMeta from './VideoMeta'
import AppleCard from './AppleCard'

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

  const handleClose = () => {
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
    <AppleCard hover className="h-full">
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
    </AppleCard>
  )
}
