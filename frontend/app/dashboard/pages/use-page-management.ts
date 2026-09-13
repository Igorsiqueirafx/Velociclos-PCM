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

export function usePageManagement() {
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
    setForm({ title: '', slug: '', content: '', excerpt: '', cover_image: '', is_published: false, sort_order: 0, meta_title: '', meta_description: '' })
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

  return {
    pages, loading, error,
    showForm, setShowForm,
    saving, editingId, form, setForm,
    resetForm, startEdit,
    handleSubmit, handleDelete,
  }
}
