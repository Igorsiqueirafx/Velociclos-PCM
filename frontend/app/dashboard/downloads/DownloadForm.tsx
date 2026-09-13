'use client'

interface DownloadFormData {
  title: string
  description: string
  version: string
  file_url: string
  file_size: string
  changelog: string
  is_published: boolean
}

interface DownloadFormProps {
  form: DownloadFormData
  setForm: React.Dispatch<React.SetStateAction<DownloadFormData>>
  showForm: boolean
  saving: boolean
  editingId: string | null
  onSubmit: (e: React.FormEvent) => void
}

export default function DownloadForm({ form, setForm, showForm, saving, editingId, onSubmit }: DownloadFormProps) {
  if (!showForm) return null

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Título" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="input-field"
          />
        </Field>
        <Field label="Versão">
          <input
            type="text"
            value={form.version}
            onChange={(e) => setForm({ ...form, version: e.target.value })}
            placeholder="Ex: 1.0.0"
            className="input-field"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="URL do Arquivo" required>
            <input
              type="text"
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              required
              placeholder="https://..."
              className="input-field"
            />
          </Field>
        </div>
        <Field label="Tamanho do Arquivo">
          <input
            type="text"
            value={form.file_size}
            onChange={(e) => setForm({ ...form, file_size: e.target.value })}
            placeholder="Ex: 2.5 MB"
            className="input-field"
          />
        </Field>
        <CheckboxField
          id="download-published"
          label="Publicado"
          checked={form.is_published}
          onChange={(checked) => setForm({ ...form, is_published: checked })}
        />
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
        <div className="sm:col-span-2">
          <Field label="Changelog">
            <textarea
              value={form.changelog}
              onChange={(e) => setForm({ ...form, changelog: e.target.value })}
              rows={2}
              placeholder="Novas funcionalidades, correções..."
              className="input-field"
            />
          </Field>
        </div>
      </div>
      <SubmitButton saving={saving} editingId={editingId} labels={['Salvar Download', 'Atualizar Download']} />
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

function CheckboxField({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2 self-end pb-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-[#404857] bg-[#1e2329] text-[#ffd700] focus:ring-[#ffd700]"
      />
      <label htmlFor={id} className="text-sm text-[#dcdcdc]">{label}</label>
    </div>
  )
}

function SubmitButton({ saving, editingId, labels }: { saving: boolean; editingId: string | null; labels: [string, string] }) {
  return (
    <div>
      <button
        type="submit"
        disabled={saving}
        className="submit-btn"
      >
        {saving ? 'Salvando...' : editingId ? labels[1] : labels[0]}
      </button>
    </div>
  )
}
