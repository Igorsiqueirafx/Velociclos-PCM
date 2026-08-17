'use client'

import { useState, useEffect } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export default function ArtigosPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    is_published: false,
    published_at: '',
  })

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/articles`)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setArticles(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar artigos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const resetForm = () => {
    setForm({ title: '', slug: '', excerpt: '', content: '', cover_image: '', is_published: false, published_at: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (article: Article) => {
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content || '',
      cover_image: article.cover_image || '',
      is_published: article.is_published,
      published_at: article.published_at ? article.published_at.slice(0, 16) : '',
    })
    setEditingId(article.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const url = editingId ? `${BACKEND_URL}/api/articles/${editingId}` : `${BACKEND_URL}/api/articles`
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save article')
      resetForm()
      await fetchArticles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar artigo')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return
    try {
      const res = await fetch(`${BACKEND_URL}/api/articles/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete article')
      setArticles(articles.filter((a) => a.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir artigo')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando artigos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Artigos</h1>
          <p className="text-[#a0a0a0]">Gerenciamento de artigos do blog</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? 'Cancelar' : 'Novo Artigo'}
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
              <label className="block text-sm text-[#a0a0a0] mb-2">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
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
            <label className="block text-sm text-[#a0a0a0] mb-2">Conteúdo</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Capa URL</label>
              <input
                type="text"
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Data de publicação</label>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="w-4 h-4 rounded border-[#404857] bg-[#1e2329] text-[#ffd700] focus:ring-[#ffd700]"
            />
            <label htmlFor="published" className="text-sm text-[#dcdcdc]">Publicado</label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? 'Salvando...' : editingId ? 'Atualizar Artigo' : 'Publicar Artigo'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[#404857]">
              <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
              <th className="pb-3 text-[#a0a0a0] font-medium">Slug</th>
              <th className="pb-3 text-[#a0a0a0] font-medium">Status</th>
              <th className="pb-3 text-[#a0a0a0] font-medium">Publicado</th>
              <th className="pb-3 text-[#a0a0a0] font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                <td className="py-3 text-[#dcdcdc]">{article.title}</td>
                <td className="py-3 text-[#a0a0a0] font-mono text-xs">{article.slug}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${article.is_published ? 'bg-[#00ff7f]/10 text-[#00ff7f]' : 'bg-[#ff4444]/10 text-[#ff4444]'}`}>
                    {article.is_published ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="py-3 text-[#a0a0a0]">
                  {article.published_at ? new Date(article.published_at).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(article)}
                      className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
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
      </div>
    </div>
  )
}
