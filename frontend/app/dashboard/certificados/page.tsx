'use client'

import { useCertificateManagement } from './use-certificate-management'
import CertificateForm from './CertificateForm'
import AdminPageHeader from '@/components/AdminPageHeader'

export default function CertificadosPage() {
  const {
    certificates, loading, error,
    showForm, setShowForm,
    saving, editingId, form, setForm,
    resetForm, startEdit,
    handleSubmit, handleDelete,
  } = useCertificateManagement()

  const toggleForm = () => { resetForm(); setShowForm(!showForm) }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando certificados...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Certificados" subtitle="Gerenciamento de certificados e conquistas" showForm={showForm} buttonLabel="Novo Certificado" buttonIcon="fa-plus" onToggle={toggleForm} />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <CertificateForm
        form={form}
        setForm={setForm}
        showForm={showForm}
        saving={saving}
        editingId={editingId}
        onSubmit={handleSubmit}
      />

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
                  <ActionButtons onEdit={() => startEdit(cert)} onDelete={() => handleDelete(cert.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button onClick={onEdit} className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors">
        <i className="fas fa-edit"></i>
      </button>
      <button onClick={onDelete} className="px-3 py-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg text-sm hover:bg-[#ff4444]/20 transition-colors">
        <i className="fas fa-trash-alt"></i>
      </button>
    </div>
  )
}
