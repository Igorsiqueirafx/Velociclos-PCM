'use client'

import { CourseProvider, useCourse } from './course-context'
import CoursesTab from './CoursesTab'
import ModulesTab from './ModulesTab'
import LessonsTab from './LessonsTab'

export default function CursosPage() {
  return (
    <CourseProvider>
      <CursosPageInner />
    </CourseProvider>
  )
}

function CursosPageInner() {
  const h = useCourse()

  if (!h) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando cursos...</div>
      </div>
    )
  }

  if (h.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando cursos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Cursos</h1>
        <p className="text-[#a0a0a0]">Gerenciamento de cursos, módulos e aulas</p>
      </div>

      {h.error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {h.error}
        </div>
      )}

      <div className="flex gap-2 border-b border-[#404857]">
        {(['courses', 'modules', 'lessons'] as const).map((t) => (
          <button
            key={t}
            onClick={() => h.setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              h.tab === t ? 'border-[#ffd700] text-[#ffd700]' : 'border-transparent text-[#a0a0a0] hover:text-[#dcdcdc]'
            }`}
          >
            {t === 'courses' ? 'Cursos' : t === 'modules' ? 'Módulos' : 'Aulas'}
          </button>
        ))}
      </div>

      {h.tab === 'courses' && <CoursesTab />}
      {h.tab === 'modules' && <ModulesTab />}
      {h.tab === 'lessons' && <LessonsTab />}
    </div>
  )
}
