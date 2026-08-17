'use client'

import { useState, useEffect } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

interface Video {
  id: string
  videoId: string
  title: string
  description: string
  module: string
  createdAt: string
}

export default function VideosPage() {
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      await fetchVideos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir vídeo')
    }
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModule = moduleFilter === 'all' || video.module === moduleFilter
    return matchesSearch && matchesModule
  })

  const modules = Array.from(new Set(videos.map((v) => v.module).filter(Boolean))).sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando vídeos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Vídeos</h1>
          <p className="text-[#a0a0a0]">Gerenciamento de vídeos cadastrados</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
        >
          <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showAddForm ? 'Cancelar' : 'Novo Vídeo'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-[#dcdcdc] mb-4">Adicionar Novo Vídeo</h2>
          <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Video ID (YouTube)</label>
              <input
                type="text"
                value={formData.videoId}
                onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                placeholder="Ex: dQw4w9WgXcQ"
                required
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do vídeo"
                required
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Módulo</label>
              <input
                type="text"
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                placeholder="Ex: Método Fimathe"
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do vídeo"
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-circle-notch fa-spin"></i>
                    Salvando...
                  </span>
                ) : (
                  'Salvar Vídeo'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Total de Vídeos</p>
          <p className="text-3xl font-bold text-[#ffd700]">{videos.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Módulos</p>
          <p className="text-3xl font-bold text-[#00ff7f]">{modules.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Filtrados</p>
          <p className="text-3xl font-bold text-[#dcdcdc]">{filteredVideos.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm text-[#a0a0a0] mb-2">Buscar vídeo</label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#707070]"></i>
              <input
                id="search"
                type="text"
                placeholder="Título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label htmlFor="module" className="block text-sm text-[#a0a0a0] mb-2">Filtrar por módulo</label>
            <select
              id="module"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
            >
              <option value="all">Todos</option>
              {modules.map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-[#dcdcdc] mb-4">
          Lista de Vídeos ({filteredVideos.length})
        </h2>
        {filteredVideos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#404857]">
                  <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Módulo</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">YouTube ID</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Criado em</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video) => (
                  <tr key={video.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                    <td className="py-3 text-[#dcdcdc]">
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-xs text-[#707070] mt-0.5 line-clamp-1">{video.description}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-[#00ff7f]/10 text-[#00ff7f]">
                        {video.module || '-'}
                      </span>
                    </td>
                    <td className="py-3 text-[#a0a0a0] font-mono text-xs">
                      {video.videoId}
                    </td>
                    <td className="py-3 text-[#a0a0a0]">
                      {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#a0a0a0] hover:text-[#ffd700] transition-colors"
                          title="Ver no YouTube"
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </a>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2 text-[#a0a0a0] hover:text-[#ff4444] transition-colors"
                          title="Excluir"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#a0a0a0] text-center py-8">
            {searchTerm || moduleFilter !== 'all' ? 'Nenhum vídeo encontrado com os filtros aplicados.' : 'Nenhum vídeo encontrado.'}
          </p>
        )}
      </div>
    </div>
  )
}
