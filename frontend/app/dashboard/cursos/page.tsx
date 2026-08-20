'use client'

import { useState, useEffect } from 'react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  category: string
  is_published: boolean
  order_index: number
  created_at: string
  updated_at: string
}

interface Module {
  id: string
  course_id: string
  title: string
  description: string
  order_index: number
  created_at: string
  updated_at: string
}

interface Lesson {
  id: string
  module_id: string
  course_id: string
  title: string
  description: string
  video_id: string
  video_url: string
  duration: number | null
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
}

type Tab = 'courses' | 'modules' | 'lessons'

export default function CursosPage() {
  const [tab, setTab] = useState<Tab>('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [courseForm, setCourseForm] = useState({ title: '', slug: '', description: '', thumbnail: '', category: '', is_published: false, order_index: 0 })
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', order_index: 0 })
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', video_id: '', video_url: '', duration: '', order_index: 0, is_published: false })

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses', { cache: 'no-store' })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setCourses(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cursos')
    }
  }

  const fetchModules = async (courseId: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setModules(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar módulos')
    }
  }

  const fetchLessons = async (moduleId: string) => {
    try {
      const res = await fetch(`/api/admin/modules/${moduleId}/lessons`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setLessons(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar aulas')
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await fetchCourses()
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId)
      setSelectedModuleId(null)
      setLessons([])
    }
  }, [selectedCourseId])

  useEffect(() => {
    if (selectedModuleId) {
      fetchLessons(selectedModuleId)
    }
  }, [selectedModuleId])

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const url = editingCourseId ? `/api/admin/courses/${editingCourseId}` : '/api/admin/courses'
      const method = editingCourseId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm),
      })
      if (!res.ok) throw new Error('Failed to save course')
      setShowCourseForm(false)
      setEditingCourseId(null)
      setCourseForm({ title: '', slug: '', description: '', thumbnail: '', category: '', is_published: false, order_index: 0 })
      await fetchCourses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar curso')
    } finally {
      setSaving(false)
    }
  }

  const startEditCourse = (course: Course) => {
    setCourseForm({
      title: course.title,
      slug: course.slug || '',
      description: course.description || '',
      thumbnail: course.thumbnail || '',
      category: course.category || '',
      is_published: course.is_published,
      order_index: course.order_index,
    })
    setEditingCourseId(course.id)
    setShowCourseForm(true)
    setTab('courses')
  }

  const handleSubmitModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourseId) return
    setSaving(true)
    setError(null)
    try {
      const url = editingModuleId ? `/api/admin/modules/${editingModuleId}` : `/api/admin/courses/${selectedCourseId}/modules`
      const method = editingModuleId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleForm),
      })
      if (!res.ok) throw new Error('Failed to save module')
      setShowModuleForm(false)
      setEditingModuleId(null)
      setModuleForm({ title: '', description: '', order_index: 0 })
      await fetchModules(selectedCourseId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar módulo')
    } finally {
      setSaving(false)
    }
  }

  const startEditModule = (mod: Module) => {
    setModuleForm({
      title: mod.title,
      description: mod.description || '',
      order_index: mod.order_index,
    })
    setEditingModuleId(mod.id)
    setShowModuleForm(true)
    setTab('modules')
  }

  const handleSubmitLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModuleId) return
    setSaving(true)
    setError(null)
    try {
      const url = editingLessonId ? `/api/admin/lessons/${editingLessonId}` : `/api/admin/modules/${selectedModuleId}/lessons`
      const method = editingLessonId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm),
      })
      if (!res.ok) throw new Error('Failed to save lesson')
      setShowLessonForm(false)
      setEditingLessonId(null)
      setLessonForm({ title: '', description: '', video_id: '', video_url: '', duration: '', order_index: 0, is_published: false })
      if (selectedModuleId) await fetchLessons(selectedModuleId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar aula')
    } finally {
      setSaving(false)
    }
  }

  const startEditLesson = (lesson: Lesson) => {
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      video_id: lesson.video_id || '',
      video_url: lesson.video_url || '',
      duration: lesson.duration ? String(lesson.duration) : '',
      order_index: lesson.order_index,
      is_published: lesson.is_published,
    })
    setEditingLessonId(lesson.id)
    setShowLessonForm(true)
  }

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete course')
      setCourses(courses.filter((c) => c.id !== id))
      setSelectedCourseId(null)
      setModules([])
      setLessons([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir curso')
    }
  }

  const handleDeleteModule = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return
    try {
      const res = await fetch(`/api/admin/modules/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete module')
      setModules(modules.filter((m) => m.id !== id))
      setSelectedModuleId(null)
      setLessons([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir módulo')
    }
  }

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete lesson')
      setLessons(lessons.filter((l) => l.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir aula')
    }
  }

  if (loading) {
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

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#404857]">
        {(['courses', 'modules', 'lessons'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-[#ffd700] text-[#ffd700]' : 'border-transparent text-[#a0a0a0] hover:text-[#dcdcdc]'
            }`}
          >
            {t === 'courses' ? 'Cursos' : t === 'modules' ? 'Módulos' : 'Aulas'}
          </button>
        ))}
      </div>

      {/* Courses Tab */}
      {tab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#dcdcdc]">Cursos ({courses.length})</h2>
                <button
                  onClick={() => { setShowCourseForm(!showCourseForm); setEditingCourseId(null); setCourseForm({ title: '', slug: '', description: '', thumbnail: '', category: '', is_published: false, order_index: 0 }) }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
                >
                  <i className={`fas ${showCourseForm ? 'fa-times' : 'fa-plus'}`}></i>
                  {showCourseForm ? 'Cancelar' : 'Novo Curso'}
                </button>
          </div>

            {showCourseForm && (
              <form onSubmit={handleSubmitCourse} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Título</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Slug</label>
                  <input
                    type="text"
                    value={courseForm.slug}
                    onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                    placeholder="Ex: metodo-fimathe"
                    className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Thumbnail URL</label>
                  <input
                    type="text"
                    value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Categoria</label>
                  <input
                    type="text"
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    placeholder="Ex: Forex, Método Fimathe"
                    className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                  />
                </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="published"
                  type="checkbox"
                  checked={courseForm.is_published}
                  onChange={(e) => setCourseForm({ ...courseForm, is_published: e.target.checked })}
                  className="w-4 h-4 rounded border-[#404857] bg-[#1e2329] text-[#ffd700] focus:ring-[#ffd700]"
                />
                <label htmlFor="published" className="text-sm text-[#dcdcdc]">Publicado</label>
              </div>
              <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {saving ? 'Salvando...' : editingCourseId ? 'Atualizar Curso' : 'Salvar Curso'}
                  </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-[#dcdcdc]">{course.title}</h3>
                    <p className="text-xs text-[#707070] mt-1 line-clamp-2">{course.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${course.is_published ? 'bg-[#00ff7f]/10 text-[#00ff7f]' : 'bg-[#ff4444]/10 text-[#ff4444]'}`}>
                    {course.is_published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                   <div className="flex gap-2 mt-3">
                     <button
                       onClick={() => { setSelectedCourseId(course.id); setTab('modules'); setEditingCourseId(null); setShowCourseForm(false) }}
                       className="flex-1 px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors"
                     >
                       <i className="fas fa-layer-group mr-1"></i> Módulos
                     </button>
                     <button
                       onClick={() => startEditCourse(course)}
                       className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors"
                     >
                       <i className="fas fa-edit"></i>
                     </button>
                     <button
                       onClick={() => handleDeleteCourse(course.id)}
                       className="px-3 py-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg text-sm hover:bg-[#ff4444]/20 transition-colors"
                     >
                       <i className="fas fa-trash-alt"></i>
                     </button>
                   </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modules Tab */}
      {tab === 'modules' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#dcdcdc]">
              {selectedCourseId ? 'Módulos do Curso' : 'Selecione um curso primeiro'}
            </h2>
            {selectedCourseId && (
                <button
                  onClick={() => { setShowModuleForm(!showModuleForm); setEditingModuleId(null); setModuleForm({ title: '', description: '', order_index: 0 }) }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
                >
                  <i className={`fas ${showModuleForm ? 'fa-times' : 'fa-plus'}`}></i>
                  {showModuleForm ? 'Cancelar' : 'Novo Módulo'}
                </button>
            )}
          </div>

          {!selectedCourseId ? (
            <div className="card">
              <p className="text-[#a0a0a0]">Clique em "Módulos" em um curso para gerenciar seus módulos.</p>
            </div>
          ) : (
            <>
              {showModuleForm && (
                <form onSubmit={handleSubmitModule} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-2">Título</label>
                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-2">Ordem</label>
                    <input
                      type="number"
                      value={moduleForm.order_index}
                      onChange={(e) => setModuleForm({ ...moduleForm, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
                    <textarea
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {saving ? 'Salvando...' : editingModuleId ? 'Atualizar Módulo' : 'Salvar Módulo'}
                      </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((mod) => (
                  <div key={mod.id} className="card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-[#dcdcdc]">{mod.title}</h3>
                        <p className="text-xs text-[#707070] mt-1 line-clamp-2">{mod.description}</p>
                      </div>
                      <span className="text-xs text-[#707070]">#{mod.order_index}</span>
                    </div>
                     <div className="flex gap-2 mt-3">
                       <button
                         onClick={() => { setSelectedModuleId(mod.id); setTab('lessons') }}
                         className="flex-1 px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors"
                       >
                         <i className="fas fa-play mr-1"></i> Aulas
                       </button>
                       <button
                         onClick={() => startEditModule(mod)}
                         className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors"
                       >
                         <i className="fas fa-edit"></i>
                       </button>
                       <button
                         onClick={() => handleDeleteModule(mod.id)}
                         className="px-3 py-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg text-sm hover:bg-[#ff4444]/20 transition-colors"
                       >
                         <i className="fas fa-trash-alt"></i>
                       </button>
                     </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Lessons Tab */}
      {tab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#dcdcdc]">
              {selectedModuleId ? 'Aulas do Módulo' : 'Selecione um módulo primeiro'}
            </h2>
            {selectedModuleId && (
                <button
                  onClick={() => { setShowLessonForm(!showLessonForm); setEditingLessonId(null); setLessonForm({ title: '', description: '', video_id: '', video_url: '', duration: '', order_index: 0, is_published: false }) }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
                >
                  <i className={`fas ${showLessonForm ? 'fa-times' : 'fa-plus'}`}></i>
                  {showLessonForm ? 'Cancelar' : 'Nova Aula'}
                </button>
            )}
          </div>

          {!selectedModuleId ? (
            <div className="card">
              <p className="text-[#a0a0a0]">Clique em "Aulas" em um módulo para gerenciar suas aulas.</p>
            </div>
          ) : (
            <>
              {showLessonForm && (
                <form onSubmit={handleSubmitLesson} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-2">Título</label>
                    <input
                      type="text"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-2">YouTube Video ID</label>
                    <input
                      type="text"
                      value={lessonForm.video_id}
                      onChange={(e) => setLessonForm({ ...lessonForm, video_id: e.target.value })}
                      placeholder="Ex: dQw4w9WgXcQ"
                      className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-2">URL do Vídeo (YouTube)</label>
                    <input
                      type="text"
                      value={lessonForm.video_url}
                      onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                      placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-2">Duração (segundos)</label>
                    <input
                      type="number"
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-2">Ordem</label>
                    <input
                      type="number"
                      value={lessonForm.order_index}
                      onChange={(e) => setLessonForm({ ...lessonForm, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
                    <textarea
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="lesson-published"
                      type="checkbox"
                      checked={lessonForm.is_published}
                      onChange={(e) => setLessonForm({ ...lessonForm, is_published: e.target.checked })}
                      className="w-4 h-4 rounded border-[#404857] bg-[#1e2329] text-[#ffd700] focus:ring-[#ffd700]"
                    />
                    <label htmlFor="lesson-published" className="text-sm text-[#dcdcdc]">Publicado</label>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {saving ? 'Salvando...' : editingLessonId ? 'Atualizar Aula' : 'Salvar Aula'}
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto card">
                <table className="w-full text-sm">
                  <thead>
                     <tr className="text-left border-b border-[#404857]">
                      <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
                      <th className="pb-3 text-[#a0a0a0] font-medium">YouTube ID</th>
                      <th className="pb-3 text-[#a0a0a0] font-medium">URL do Vídeo</th>
                      <th className="pb-3 text-[#a0a0a0] font-medium">Status</th>
                      <th className="pb-3 text-[#a0a0a0] font-medium text-right">Ações</th>
                    </tr>
                   </thead>
                   <tbody>
                     {lessons.map((lesson) => (
                       <tr key={lesson.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                         <td className="py-3 text-[#dcdcdc]">{lesson.title}</td>
                         <td className="py-3 text-[#a0a0a0] font-mono text-xs">{lesson.video_id || '-'}</td>
                         <td className="py-3 text-[#a0a0a0] font-mono text-xs truncate max-w-[200px]">{lesson.video_url || '-'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${lesson.is_published ? 'bg-[#00ff7f]/10 text-[#00ff7f]' : 'bg-[#ff4444]/10 text-[#ff4444]'}`}>
                            {lesson.is_published ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>
                         <td className="py-3 text-right">
                           <button
                             onClick={() => startEditLesson(lesson)}
                             className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors mr-2"
                           >
                             <i className="fas fa-edit"></i>
                           </button>
                           <button
                             onClick={() => handleDeleteLesson(lesson.id)}
                             className="px-3 py-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg text-sm hover:bg-[#ff4444]/20 transition-colors"
                           >
                             <i className="fas fa-trash-alt"></i>
                           </button>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
