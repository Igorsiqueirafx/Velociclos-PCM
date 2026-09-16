'use client'

interface LessonFormData {
  title: string
  description: string
  video_id: string
  video_url: string
  duration: string
  order_index: number
  is_published: boolean
}

interface LessonFormProps {
  lessonForm: LessonFormData
  setLessonForm: React.Dispatch<React.SetStateAction<LessonFormData>>
  showLessonForm: boolean
  saving: boolean
  editingLessonId: string | null
  onSubmit: (e: React.FormEvent) => void
}

export default function LessonForm({ lessonForm, setLessonForm, showLessonForm, saving, editingLessonId, onSubmit }: LessonFormProps) {
  if (!showLessonForm) return null

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Título da Aula" required>
          <input
            type="text"
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            required
            className="input-field"
          />
        </Field>
        <Field label="YouTube Video ID">
          <input
            type="text"
            value={lessonForm.video_id}
            onChange={(e) => setLessonForm({ ...lessonForm, video_id: e.target.value })}
            placeholder="Ex: dQw4w9WgXcQ"
            className="input-field"
          />
        </Field>
      </div>
      <div>
        <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
        <textarea
          value={lessonForm.description}
          onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
          rows={2}
          className="input-field"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="URL do Vídeo">
          <input
            type="text"
            value={lessonForm.video_url}
            onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
            placeholder="https://..."
            className="input-field"
          />
        </Field>
        <Field label="Duração (minutos)">
          <input
            type="text"
            value={lessonForm.duration}
            onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
            placeholder="Ex: 15"
            className="input-field"
          />
        </Field>
        <Field label="Ordem">
          <input
            type="number"
            value={lessonForm.order_index}
            onChange={(e) => setLessonForm({ ...lessonForm, order_index: parseInt(e.target.value) || 0 })}
            className="input-field"
          />
        </Field>
      </div>
      <CheckboxField
        id="lesson-published"
        label="Publicada"
        checked={lessonForm.is_published}
        onChange={(checked) => setLessonForm({ ...lessonForm, is_published: checked })}
      />
      <button
        type="submit"
        disabled={saving}
        className="submit-btn"
      >
        {saving ? 'Salvando...' : editingLessonId ? 'Atualizar Aula' : 'Salvar Aula'}
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
        className="w-4 h-4 rounded border-[#3a3a3c] bg-[#1e1e1e] text-[#0071e3] focus:ring-[#0071e3]"
      />
      <label htmlFor={id} className="text-sm text-[#dcdcdc]">{label}</label>
    </div>
  )
}
