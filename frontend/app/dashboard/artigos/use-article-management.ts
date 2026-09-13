'use client'

import { useState, useEffect } from 'react'

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  tags: string[]
  author: string
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export function useArticleManagement() {
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
    category: '',
    tags: '',
    author: '',
    is_published: false,
    published_at: '',
  })

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles', { cache: 'no-store' })
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
    setForm({ title: '', slug: '', excerpt: '', content: '', cover_image: '', category: '', tags: '', author: '', is_published: false, published_at: '' })
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
      category: article.category || '',
      tags: (article.tags || []).join(', '),
      author: article.author || '',
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
      const url = editingId ? `/api/admin/articles/${editingId}` : '/api/admin/articles'
      const method = editingId ? 'PUT' : 'POST'
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete article')
      setArticles(articles.filter((a) => a.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir artigo')
    }
  }

  return {
    articles, loading, error,
    showForm, setShowForm,
    saving, editingId, form, setForm,
    resetForm, startEdit,
    handleSubmit, handleDelete,
  }
}
