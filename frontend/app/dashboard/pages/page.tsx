'use client'

import { useState, useEffect } from 'react'

interface Page {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string
  is_published: boolean
  sort_order: number
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
}

export default function PagesAdminPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    is_published: false,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
  })

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages', { cache: 'no-store' })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setPages(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar páginas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      cover_image: '',
      is_published: false,
      sort_order: 0,
      meta_title: '',
      meta_description: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (pageData: Page) => {
    setForm({
      title: pageData.title,
      slug: pageData.slug || '',
      content: pageData.content || '',
      excerpt: pageData.excerpt || '',
      cover_image: pageData.cover_image || '',
      is_published: pageData.is_published,
      sort_order: pageData.sort_order || 0,
      meta_title: pageData.meta_title || '',
      meta_description: pageData.meta_description || '',
    })
    setEditingId(pageData.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const url = editingId ? `/api/admin/pages/${editingId}` : '/api/admin/pages'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save page')
      resetForm()
      await fetchPages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar página')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta página?')) return
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete page')
      setPages(pages.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir página')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando páginas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Páginas</h1>
          <p className="text-[#a0a0a0]">Gerenciamento de páginas estáticas (Manual, Termos, Sobre, etc.)</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? 'Cancelar' : 'Nova Página'}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <label className="block text-sm text-[#a0a0a0] mb-2">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="Ex: manual"
                required
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Ordem</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Resumo</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Conteúdo (Rich Text)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Capa URL</label>
            <input
              type="text"
              value={form.cover_image}
              onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Meta Title</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Meta Description</label>
              <input
                type="text"
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="page-published"
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="w-4 h-4 rounded border-[#404857] bg-[#1e2329] text-[#ffd700] focus:ring-[#ffd700]"
            />
            <label htmlFor="page-published" className="text-sm text-[#dcdcdc]">Publicado</label>
          </div>
          <div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? 'Salvando...' : editingId ? 'Atualizar Página' : 'Salvar Página'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto card">
        <h2 className="text-lg font-semibold text-[#dcdcdc] mb-4">
          Lista de Páginas ({pages.length})
        </h2>
        {pages.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[#404857]">
                <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
                <th className="pb-3 text-[#a0a0a0] font-medium">Slug</th>
                <th className="pb-3 text-[#a0a0a0] font-medium">Status</th>
                <th className="pb-3 text-[#a0a0a0] font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((pageData) => (
                <tr key={pageData.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                  <td className="py-3 text-[#dcdcdc]">{pageData.title}</td>
                  <td className="py-3 text-[#a0a0a0] font-mono text-xs">{pageData.slug}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${pageData.is_published ? 'bg-[#00ff7f]/10 text-[#00ff7f]' : 'bg-[#ff4444]/10 text-[#ff4444]'}`}>
                      {pageData.is_published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(pageData)}
                        className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(pageData.id)}
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
          <p className="text-[#a0a0a0] text-center py-8">Nenhuma página encontrada.</p>
        )}
      </div>
    </div>
  )
}
