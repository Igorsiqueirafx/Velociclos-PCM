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

export function useDownloadManagement() {
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
    setForm({ title: '', description: '', version: '', file_url: '', file_size: '', changelog: '', is_published: false })
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

  return {
    downloads, loading, error,
    showForm, setShowForm,
    saving, editingId, form, setForm,
    resetForm, startEdit,
    handleSubmit, handleDelete,
  }
}
