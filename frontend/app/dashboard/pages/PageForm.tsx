'use client'

interface PageFormData {
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string
  is_published: boolean
  sort_order: number
  meta_title: string
  meta_description: string
}

interface PageFormProps {
  form: PageFormData
  setForm: React.Dispatch<React.SetStateAction<PageFormData>>
  showForm: boolean
  saving: boolean
  editingId: string | null
  onSubmit: (e: React.FormEvent) => void
}

export default function PageForm({ form, setForm, showForm, saving, editingId, onSubmit }: PageFormProps) {
  if (!showForm) return null

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Título" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="input-field"
          />
        </Field>
        <Field label="Slug" required>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="Ex: manual"
            required
            className="input-field"
          />
        </Field>
        <Field label="Ordem">
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
            className="input-field"
          />
        </Field>
      </div>
      <Field label="Resumo">
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
          className="input-field"
        />
      </Field>
      <Field label="Conteúdo (Rich Text)">
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={6}
          className="input-field font-mono text-sm"
        />
      </Field>
      <Field label="Capa URL">
        <input
          type="text"
          value={form.cover_image}
          onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
          className="input-field"
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Meta Title">
          <input
            type="text"
            value={form.meta_title}
            onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
            className="input-field"
          />
        </Field>
        <Field label="Meta Description">
          <input
            type="text"
            value={form.meta_description}
            onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
            className="input-field"
          />
        </Field>
      </div>
      <CheckboxField
        id="page-published"
        label="Publicado"
        checked={form.is_published}
        onChange={(checked) => setForm({ ...form, is_published: checked })}
      />
      <SubmitButton saving={saving} editingId={editingId} labels={['Salvar Página', 'Atualizar Página']} />
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
    <div className="flex items-center gap-2">
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
    <button
      type="submit"
      disabled={saving}
      className="submit-btn"
    >
      {saving ? 'Salvando...' : editingId ? labels[1] : labels[0]}
    </button>
  )
}
