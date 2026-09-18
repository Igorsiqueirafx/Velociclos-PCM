'use client'

import { useState, useCallback, useEffect, type ReactNode, useRef } from 'react'

interface ResponsiveVideoEmbedProps {
  videoId: string
  title: string
  className?: string
  overlay?: ReactNode
  onReady?: () => void
  onClose?: () => void
  onEnded?: () => void
  autoplay?: boolean
  startTime?: number
  params?: Record<string, string | number>
}

function buildYouTubeUrl(videoId: string, options: { autoplay?: boolean; startTime?: number; params?: Record<string, string | number>; origin?: string }) {
  const searchParams = new URLSearchParams()
  if (options.autoplay) searchParams.set('autoplay', '1')
  if (options.startTime) searchParams.set('start', String(options.startTime))
  if (options.origin) searchParams.set('origin', options.origin)
  searchParams.set('rel', '0')
  searchParams.set('modestbranding', '1')
  searchParams.set('showinfo', '0')
  searchParams.set('iv_load_policy', '3')
  searchParams.set('controls', '1')
  searchParams.set('fs', '1')
  searchParams.set('disablekb', '0')
  searchParams.set('enablejsapi', '1')
  searchParams.set('playsinline', '1')
  for (const [key, value] of Object.entries(options.params || {})) {
    searchParams.set(key, String(value))
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${searchParams.toString()}`
}

function useYouTubeEndListener(onEnded?: () => void) {
  useEffect(() => {
    if (!onEnded) return
    const handler = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.event === 'infoDelivery' && data?.info?.event === 'videoEnd') {
          onEnded()
        }
      } catch {
        // ignore non-JSON messages
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onEnded])
}

function useVideoState(videoId: string, startTime?: number) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
  }, [videoId, startTime])

  const handleLoad = useCallback(() => setLoading(false), [])
  const handleError = useCallback(() => {
    setLoading(false)
    setError(true)
  }, [])

  const retry = useCallback(() => {
    setLoading(true)
    setError(false)
  }, [])

  return { loading, error, handleLoad, handleError, retry }
}

export default function ResponsiveVideoEmbed({
  videoId,
  title,
  className = '',
  overlay,
  onReady,
  onClose,
  onEnded,
  autoplay,
  startTime,
  params,
}: ResponsiveVideoEmbedProps) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const src = buildYouTubeUrl(videoId, { autoplay, startTime, params, origin })
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { loading, error, handleLoad, handleError, retry } = useVideoState(videoId, startTime)

  useYouTubeEndListener(onEnded)

  const handleLoadWithReady = useCallback(() => {
    handleLoad()
    onReady?.()
  }, [handleLoad, onReady])

  return (
    <div className={`relative aspect-video w-full bg-black ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#8a8a8d]">Carregando vídeo...</span>
          </div>
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
          <div className="text-center">
            <svg className="w-10 h-10 text-[#ff453a] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-[#8a8a8d]">Não foi possível carregar o vídeo.</p>
            <button
              onClick={retry}
              className="mt-3 px-4 py-2 bg-[#0071e3] text-white text-sm font-semibold rounded-lg hover:bg-[#005fd9] transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          onLoad={handleLoadWithReady}
          onError={handleError}
          style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s ease' }}
        />
      )}

      {overlay && !loading && !error && (
        <div className="absolute inset-0 pointer-events-none">{overlay}</div>
      )}

      {onClose && !loading && !error && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
          aria-label="Fechar vídeo"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
