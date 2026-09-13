'use client'

interface AdminPageHeaderProps {
  title: string
  subtitle: string
  showForm: boolean
  buttonLabel?: string
  buttonIcon?: string
  onToggle: () => void
}

export default function AdminPageHeader({ title, subtitle, showForm, buttonLabel, buttonIcon, onToggle }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">{title}</h1>
        <p className="text-[#a0a0a0]">{subtitle}</p>
      </div>
      {buttonLabel && (
        <button
          onClick={onToggle}
          className="admin-toggle-btn"
        >
          <i className={`fas ${showForm ? (buttonIcon ?? 'fa-plus').replace('fa-plus', 'fa-times') : (buttonIcon ?? 'fa-plus')}`}></i>
          {showForm ? 'Cancelar' : buttonLabel}
        </button>
      )}
    </div>
  )
}
