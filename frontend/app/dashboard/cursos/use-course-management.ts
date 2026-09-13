'use client'

import { useState, useCallback } from 'react'
import { useCourseState } from './use-course-state'
import { useCourseForms } from './use-course-forms'

export function useCourseManagement() {
  const state = useCourseState()
  const forms = useCourseForms()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmitCourse = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const url = forms.editingCourseId ? `/api/admin/courses/${forms.editingCourseId}` : '/api/admin/courses'
      const method = forms.editingCourseId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forms.courseForm),
      })
      if (!res.ok) throw new Error('Failed to save course')
      forms.resetCourseForm()
      await state.fetchCourses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar curso')
    } finally {
      setSaving(false)
    }
  }, [forms, state.fetchCourses])

  const handleSubmitModule = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!state.selectedCourseId) return
    setSaving(true)
    setError(null)
    try {
      const url = forms.editingModuleId ? `/api/admin/modules/${forms.editingModuleId}` : `/api/admin/courses/${state.selectedCourseId}/modules`
      const method = forms.editingModuleId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forms.moduleForm),
      })
      if (!res.ok) throw new Error('Failed to save module')
      forms.resetModuleForm()
      await state.fetchModules(state.selectedCourseId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar módulo')
    } finally {
      setSaving(false)
    }
  }, [forms, state.selectedCourseId, state.fetchModules])

  const handleSubmitLesson = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!state.selectedModuleId) return
    setSaving(true)
    setError(null)
    try {
      const url = forms.editingLessonId ? `/api/admin/lessons/${forms.editingLessonId}` : `/api/admin/modules/${state.selectedModuleId}/lessons`
      const method = forms.editingLessonId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forms.lessonForm),
      })
      if (!res.ok) throw new Error('Failed to save lesson')
      forms.resetLessonForm()
      await state.fetchLessons(state.selectedModuleId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar aula')
    } finally {
      setSaving(false)
    }
  }, [forms, state.selectedModuleId, state.fetchLessons])

  const handleDeleteCourse = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete course')
      state.setCourses(state.courses.filter((c) => c.id !== id))
      state.setSelectedCourseId(null)
      state.setModules([])
      state.setLessons([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir curso')
    }
  }, [state])

  const handleDeleteModule = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return
    try {
      const res = await fetch(`/api/admin/modules/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete module')
      state.setModules(state.modules.filter((m) => m.id !== id))
      state.setSelectedModuleId(null)
      state.setLessons([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir módulo')
    }
  }, [state])

  const handleDeleteLesson = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete lesson')
      state.setLessons(state.lessons.filter((l) => l.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir aula')
    }
  }, [state])

  return {
    ...state,
    ...forms,
    saving,
    error,
    handleSubmitCourse,
    handleSubmitModule,
    handleSubmitLesson,
    handleDeleteCourse,
    handleDeleteModule,
    handleDeleteLesson,
  }
}
