'use client'

import { useState, useEffect } from 'react'

interface Certificate {
  id: string
  title: string
  description: string
  image_url: string
  issue_date: string | null
  order_index: number
  created_at: string
}

export function useCertificateManagement() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    issue_date: '',
    order_index: 0,
  })

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/admin/certificates', { cache: 'no-store' })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setCertificates(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar certificados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const resetForm = () => {
    setForm({ title: '', description: '', image_url: '', issue_date: '', order_index: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (cert: Certificate) => {
    setForm({
      title: cert.title,
      description: cert.description || '',
      image_url: cert.image_url,
      issue_date: cert.issue_date ? cert.issue_date.slice(0, 10) : '',
      order_index: cert.order_index,
    })
    setEditingId(cert.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const url = editingId ? `/api/admin/certificates/${editingId}` : '/api/admin/certificates'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save certificate')
      resetForm()
      await fetchCertificates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar certificado')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este certificado?')) return
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete certificate')
      setCertificates(certificates.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir certificado')
    }
  }

  return {
    certificates, loading, error,
    showForm, setShowForm,
    saving, editingId, form, setForm,
    resetForm, startEdit,
    handleSubmit, handleDelete,
  }
}
