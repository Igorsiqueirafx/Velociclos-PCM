'use client'

interface CourseFormData {
  title: string
  slug: string
  description: string
  thumbnail: string
  category: string
  is_published: boolean
  order_index: number
}

interface CourseFormProps {
  courseForm: CourseFormData
  setCourseForm: React.Dispatch<React.SetStateAction<CourseFormData>>
  showCourseForm: boolean
  saving: boolean
  editingCourseId: string | null
  onSubmit: (e: React.FormEvent) => void
}

export default function CourseForm({ courseForm, setCourseForm, showCourseForm, saving, editingCourseId, onSubmit }: CourseFormProps) {
  if (!showCourseForm) return null

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Título" required>
          <input
            type="text"
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            required
            className="input-field"
          />
        </Field>
        <Field label="Slug" required>
          <input
            type="text"
            value={courseForm.slug}
            onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
            required
            className="input-field"
          />
        </Field>
        <Field label="Categoria">
          <input
            type="text"
            value={courseForm.category}
            onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
            placeholder="Ex: Forex"
            className="input-field"
          />
        </Field>
      </div>
      <div>
        <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
        <textarea
          value={courseForm.description}
          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
          rows={3}
          className="input-field"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Thumbnail URL">
          <input
            type="text"
            value={courseForm.thumbnail}
            onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
            className="input-field"
          />
        </Field>
        <Field label="Ordem">
          <input
            type="number"
            value={courseForm.order_index}
            onChange={(e) => setCourseForm({ ...courseForm, order_index: parseInt(e.target.value) || 0 })}
            className="input-field"
          />
        </Field>
      </div>
      <CheckboxField
        id="course-published"
        label="Publicado"
        checked={courseForm.is_published}
        onChange={(checked) => setCourseForm({ ...courseForm, is_published: checked })}
      />
      <button
        type="submit"
        disabled={saving}
        className="submit-btn"
      >
        {saving ? 'Salvando...' : editingCourseId ? 'Atualizar Curso' : 'Salvar Curso'}
      </button>
    </form>
  )
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm text-[#a0a0a0] mb-2">{label}{required ? ' *' : ''}</label>
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
