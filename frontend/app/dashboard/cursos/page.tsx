'use client'

import { useState, useEffect } from 'react'
import { YouTubePlaylist } from '@/lib/youtube'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

export default function CursosPage() {
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/playlists`)
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = await res.json()
        setPlaylists(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    loadPlaylists()
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/playlists/sync', {
        method: 'POST',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Sync failed: ${res.status}`)
      }
      const data = await res.json()
      if (data.playlists) {
        setPlaylists(data.playlists)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao sincronizar')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando cursos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Cursos</h1>
          <p className="text-[#a0a0a0]">Playlists do YouTube canal Velociclos</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          {syncing ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i>
              Sincronizando...
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt"></i>
              Sincronizar YouTube
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="card group hover:border-[#ffd700]/30 transition-all duration-200">
              <div className="relative mb-4 rounded-lg overflow-hidden bg-[#1e2329]">
                {playlist.thumbnail ? (
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-[#2a2e39]">
                    <i className="fas fa-play-circle text-4xl text-[#404857]"></i>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e2329]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-xs text-[#ffd700] font-medium">
                    {playlist.videoCount} vídeos
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-[#dcdcdc] mb-2 line-clamp-2 group-hover:text-[#ffd700] transition-colors">
                {playlist.title}
              </h3>
              <p className="text-sm text-[#a0a0a0] line-clamp-2 mb-3">
                {playlist.description || 'Sem descrição'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#707070] font-mono">{playlist.id}</span>
                <a
                  href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#ffd700] hover:text-[#ffdd33] transition-colors"
                >
                  Ver no YouTube <i className="fas fa-external-link-alt ml-1"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <i className="fas fa-play-circle text-4xl text-[#404857] mb-4"></i>
          <p className="text-[#a0a0a0]">Nenhuma playlist encontrada.</p>
          <p className="text-sm text-[#707070] mt-1">Clique em "Sincronizar YouTube" para buscar playlists.</p>
        </div>
      )}
    </div>
  )
}
