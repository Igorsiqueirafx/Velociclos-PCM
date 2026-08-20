'use client'

import { useState, useEffect } from 'react'

interface Download {
  id: string
  title: string
  description: string
  version: string
  file_url: string
  file_size: string
  changelog: string
  is_published: boolean
  download_count: number
  created_at: string
  updated_at: string
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    version: '',
    file_url: '',
    file_size: '',
    changelog: '',
    is_published: false,
  })

  const fetchDownloads = async () => {
    try {
      const res = await fetch('/api/admin/downloads', { cache: 'no-store' })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setDownloads(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar downloads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDownloads()
  }, [])

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      version: '',
      file_url: '',
      file_size: '',
      changelog: '',
      is_published: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (download: Download) => {
    setForm({
      title: download.title,
      description: download.description || '',
      version: download.version || '',
      file_url: download.file_url || '',
      file_size: download.file_size || '',
      changelog: download.changelog || '',
      is_published: download.is_published,
    })
    setEditingId(download.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const url = editingId ? `/api/admin/downloads/${editingId}` : '/api/admin/downloads'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save download')
      resetForm()
      await fetchDownloads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar download')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este download?')) return
    try {
      const res = await fetch(`/api/admin/downloads/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete download')
      setDownloads(downloads.filter((d) => d.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir download')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando downloads...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Downloads</h1>
          <p className="text-[#a0a0a0]">Gerenciamento de arquivos do Expert Advisor</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? 'Cancelar' : 'Novo Download'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Título</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Versão</label>
              <input
                type="text"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="Ex: 1.0.0"
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#a0a0a0] mb-2">URL do Arquivo</label>
              <input
                type="text"
                value={form.file_url}
                onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                required
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Tamanho do Arquivo</label>
              <input
                type="text"
                value={form.file_size}
                onChange={(e) => setForm({ ...form, file_size: e.target.value })}
                placeholder="Ex: 2.5 MB"
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center gap-2 self-end pb-2">
              <input
                id="download-published"
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="w-4 h-4 rounded border-[#404857] bg-[#1e2329] text-[#ffd700] focus:ring-[#ffd700]"
              />
              <label htmlFor="download-published" className="text-sm text-[#dcdcdc]">Publicado</label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#a0a0a0] mb-2">Changelog</label>
              <textarea
                value={form.changelog}
                onChange={(e) => setForm({ ...form, changelog: e.target.value })}
                rows={2}
                placeholder="Novas funcionalidades, correções..."
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? 'Salvando...' : editingId ? 'Atualizar Download' : 'Salvar Download'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto card">
        <h2 className="text-lg font-semibold text-[#dcdcdc] mb-4">
          Lista de Downloads ({downloads.length})
        </h2>
        {downloads.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[#404857]">
                <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
                <th className="pb-3 text-[#a0a0a0] font-medium">Versão</th>
                <th className="pb-3 text-[#a0a0a0] font-medium">Status</th>
                <th className="pb-3 text-[#a0a0a0] font-medium">Downloads</th>
                <th className="pb-3 text-[#a0a0a0] font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((download) => (
                <tr key={download.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                  <td className="py-3 text-[#dcdcdc]">{download.title}</td>
                  <td className="py-3 text-[#a0a0a0]">{download.version || '-'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${download.is_published ? 'bg-[#00ff7f]/10 text-[#00ff7f]' : 'bg-[#ff4444]/10 text-[#ff4444]'}`}>
                      {download.is_published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="py-3 text-[#a0a0a0]">{download.download_count || 0}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(download)}
                        className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(download.id)}
                        className="px-3 py-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg text-sm hover:bg-[#ff4444]/20 transition-colors"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-[#a0a0a0] text-center py-8">Nenhum download encontrado.</p>
        )}
      </div>
    </div>
  )
}
