'use client'

interface ModuleFormData {
  title: string
  description: string
  order_index: number
}

interface ModuleFormProps {
  moduleForm: ModuleFormData
  setModuleForm: React.Dispatch<React.SetStateAction<ModuleFormData>>
  showModuleForm: boolean
  saving: boolean
  editingModuleId: string | null
  onSubmit: (e: React.FormEvent) => void
}

export default function ModuleForm({ moduleForm, setModuleForm, showModuleForm, saving, editingModuleId, onSubmit }: ModuleFormProps) {
  if (!showModuleForm) return null

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Título do Módulo" required>
          <input
            type="text"
            value={moduleForm.title}
            onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
            required
            className="input-field"
          />
        </Field>
        <Field label="Ordem">
          <input
            type="number"
            value={moduleForm.order_index}
            onChange={(e) => setModuleForm({ ...moduleForm, order_index: parseInt(e.target.value) || 0 })}
            className="input-field"
          />
        </Field>
      </div>
      <Field label="Descrição">
        <textarea
          value={moduleForm.description}
          onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
          rows={2}
          className="input-field"
        />
      </Field>
      <button
        type="submit"
        disabled={saving}
        className="submit-btn"
      >
        {saving ? 'Salvando...' : editingModuleId ? 'Atualizar Módulo' : 'Salvar Módulo'}
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
