'use client'

import { useState, useEffect } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

interface Certificate {
  id: string
  title: string
  description: string
  image_url: string
  issue_date: string | null
  order_index: number
  created_at: string
}

export default function CertificadosPage() {
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
      const res = await fetch(`${BACKEND_URL}/api/certificates`)
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
      const url = editingId ? `${BACKEND_URL}/api/certificates/${editingId}` : `${BACKEND_URL}/api/certificates`
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
      const res = await fetch(`${BACKEND_URL}/api/certificates/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete certificate')
      setCertificates(certificates.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir certificado')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando certificados...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Certificados</h1>
          <p className="text-[#a0a0a0]">Gerenciamento de certificados e conquistas</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? 'Cancelar' : 'Novo Certificado'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block text-sm text-[#a0a0a0] mb-2">Imagem URL</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
            />
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
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Data de emissão</label>
            <input
              type="date"
              value={form.issue_date}
              onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Ordem</label>
            <input
              type="number"
              value={form.order_index}
              onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? 'Salvando...' : editingId ? 'Atualizar Certificado' : 'Salvar Certificado'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[#404857]">
              <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
              <th className="pb-3 text-[#a0a0a0] font-medium">Imagem</th>
              <th className="pb-3 text-[#a0a0a0] font-medium">Emissão</th>
              <th className="pb-3 text-[#a0a0a0] font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                <td className="py-3 text-[#dcdcdc]">{cert.title}</td>
                <td className="py-3 text-[#a0a0a0]">
                  <a href={cert.image_url} target="_blank" rel="noopener noreferrer" className="text-[#ffd700] hover:text-[#ffdd33]">
                    Abrir imagem
                  </a>
                </td>
                <td className="py-3 text-[#a0a0a0]">
                  {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(cert)}
                      className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
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
