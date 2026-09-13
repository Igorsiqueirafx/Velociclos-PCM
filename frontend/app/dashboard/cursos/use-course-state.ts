'use client'

import { useState, useEffect } from 'react'

export interface Course {
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

export interface Module {
  id: string
  course_id: string
  title: string
  description: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Lesson {
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

export function useCourseState() {
  const [tab, setTab] = useState<Tab>('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

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

  return {
    tab, setTab,
    courses, setCourses, modules, setModules, lessons, setLessons,
    loading, setLoading, error, setError,
    selectedCourseId, setSelectedCourseId,
    selectedModuleId, setSelectedModuleId,
    saving, setSaving,
    fetchCourses, fetchModules, fetchLessons,
  }
}
