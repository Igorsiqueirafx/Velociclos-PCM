'use client'

import { useState, useEffect, useMemo } from 'react'

interface Video {
  id: string
  videoId: string
  title: string
  description: string
  module: string
  createdAt: string
}

export function useVideoManagement() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    videoId: '',
    title: '',
    description: '',
    module: '',
  })

  const fetchVideos = async () => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api-backend.vercel.app'
      const res = await fetch(`${BACKEND_URL}/api/videos`)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setVideos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Failed: ${res.status}`)
      }
      setFormData({ videoId: '', title: '', description: '', module: '' })
      setShowAddForm(false)
      await fetchVideos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar vídeo')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      await fetchVideos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir vídeo')
    }
  }

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesModule = moduleFilter === 'all' || video.module === moduleFilter
      return matchesSearch && matchesModule
    })
  }, [videos, searchTerm, moduleFilter])

  const modules = useMemo(() => {
    return Array.from(new Set(videos.map((v) => v.module).filter(Boolean))).sort()
  }, [videos])

  const stats = useMemo(() => ({
    total: videos.length,
    moduleCount: modules.length,
    filtered: filteredVideos.length,
  }), [videos.length, modules.length, filteredVideos.length])

  return {
    videos, loading, error,
    searchTerm, setSearchTerm,
    moduleFilter, setModuleFilter,
    showAddForm, setShowAddForm,
    saving, formData, setFormData,
    filteredVideos, modules, stats,
    fetchVideos,
    handleAddVideo, handleDeleteVideo,
  }
}
