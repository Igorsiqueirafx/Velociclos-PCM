'use client'

interface VideoFormData {
  videoId: string
  title: string
  description: string
  module: string
}

interface VideoFormProps {
  formData: VideoFormData
  setFormData: React.Dispatch<React.SetStateAction<VideoFormData>>
  showAddForm: boolean
  saving: boolean
  onSubmit: (e: React.FormEvent) => void
}

export default function VideoForm({ formData, setFormData, showAddForm, saving, onSubmit }: VideoFormProps) {
  if (!showAddForm) return null

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-[#dcdcdc] mb-4">Adicionar Novo Vídeo</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Video ID (YouTube)" required>
          <input
            type="text"
            value={formData.videoId}
            onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
            placeholder="Ex: dQw4w9WgXcQ"
            required
            className="input-field"
          />
        </Field>
        <Field label="Título" required>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Título do vídeo"
            required
            className="input-field"
          />
        </Field>
        <Field label="Módulo">
          <input
            type="text"
            value={formData.module}
            onChange={(e) => setFormData({ ...formData, module: e.target.value })}
            placeholder="Ex: Método Fimathe"
            className="input-field"
          />
        </Field>
        <Field label="Descrição">
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrição do vídeo"
            className="input-field"
          />
        </Field>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="submit-btn"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <i className="fas fa-circle-notch fa-spin"></i>
                Salvando...
              </span>
            ) : (
              'Salvar Vídeo'
            )}
          </button>
        </div>
      </form>
    </div>
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
