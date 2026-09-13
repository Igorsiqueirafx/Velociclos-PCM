'use client'

interface CertificateFormData {
  title: string
  description: string
  image_url: string
  issue_date: string
  order_index: number
}

interface CertificateFormProps {
  form: CertificateFormData
  setForm: React.Dispatch<React.SetStateAction<CertificateFormData>>
  showForm: boolean
  saving: boolean
  editingId: string | null
  onSubmit: (e: React.FormEvent) => void
}

export default function CertificateForm({ form, setForm, showForm, saving, editingId, onSubmit }: CertificateFormProps) {
  if (!showForm) return null

  return (
    <form onSubmit={onSubmit} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Título" required>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="input-field"
        />
      </Field>
      <Field label="Imagem URL" required>
        <input
          type="text"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          required
          className="input-field"
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Descrição">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="input-field"
          />
        </Field>
      </div>
      <Field label="Data de emissão">
        <input
          type="date"
          value={form.issue_date}
          onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
          className="input-field"
        />
      </Field>
      <Field label="Ordem">
        <input
          type="number"
          value={form.order_index}
          onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
          className="input-field"
        />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton saving={saving} editingId={editingId} labels={['Salvar Certificado', 'Atualizar Certificado']} />
      </div>
    </form>
  )
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm text-[#a0a0a0] mb-2">{label}{required && ' *'}</label>
      {children}
    </div>
  )
}

function SubmitButton({ saving, editingId, labels }: { saving: boolean; editingId: string | null; labels: [string, string] }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="submit-btn"
    >
      {saving ? 'Salvando...' : editingId ? labels[1] : labels[0]}
    </button>
  )
}
