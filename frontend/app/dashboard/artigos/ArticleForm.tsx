'use client'

interface ArticleFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  tags: string
  author: string
  is_published: boolean
  published_at: string
}

interface ArticleFormProps {
  form: ArticleFormData
  setForm: React.Dispatch<React.SetStateAction<ArticleFormData>>
  showForm: boolean
  saving: boolean
  editingId: string | null
  onSubmit: (e: React.FormEvent) => void
}

export default function ArticleForm({ form, setForm, showForm, saving, editingId, onSubmit }: ArticleFormProps) {
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
            required
            className="input-field"
          />
        </Field>
        <Field label="Categoria">
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Ex: Forex, Método Fimathe"
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
      <Field label="Conteúdo">
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={4}
          className="input-field"
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Capa URL">
          <input
            type="text"
            value={form.cover_image}
            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
            className="input-field"
          />
        </Field>
        <Field label="Data de publicação">
          <input
            type="datetime-local"
            value={form.published_at}
            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            className="input-field"
          />
        </Field>
        <Field label="Tags">
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Ex: forex, fimathe, trading"
            className="input-field"
          />
        </Field>
        <Field label="Autor">
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            placeholder="Ex: Marcelo Ferreira"
            className="input-field"
          />
        </Field>
      </div>
      <CheckboxField
        id="published"
        label="Publicado"
        checked={form.is_published}
        onChange={(checked) => setForm({ ...form, is_published: checked })}
      />
      <SubmitButton saving={saving} editingId={editingId} labels={['Publicar Artigo', 'Atualizar Artigo']} />
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
