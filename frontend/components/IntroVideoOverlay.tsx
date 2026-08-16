'use client'

import { useState, useEffect, useRef } from 'react'

export default function IntroVideoOverlay({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = async () => {
      try {
        await video.play()
      } catch {
        video.muted = true
        try {
          await video.play()
        } catch {
          setVisible(false)
          onComplete()
        }
      }
    }

    const handleEnded = () => {
      setVisible(false)
      onComplete()
    }
    const handleError = () => {
      setVisible(false)
      onComplete()
    }

    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    playVideo()

    return () => {
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Vídeo de introdução - O Método Fimathe"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster="/bg-capa-marcelo.png"
        preload="auto"
        playsInline
      >
        <source src="/bg-metodo-fimathe.mp4" type="video/mp4" />
      </video>
      <button
        onClick={() => {
          setVisible(false)
          onComplete()
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#2a2e39] hover:bg-[#343a47] text-[#dcdcdc] px-6 py-3 rounded-full font-medium flex items-center gap-2 focus:ring-2 focus:ring-[#ffd700] transition-colors"
        aria-label="Pular vídeo"
      >
        <span>Pular</span>
        <i className="fas fa-forward" aria-hidden="true"></i>
      </button>
    </div>
  )
}
