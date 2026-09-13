'use client'

import { useState } from 'react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  category: string
  is_published: boolean
  order_index: number
}

export function useCourseForms() {
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [courseForm, setCourseForm] = useState({ title: '', slug: '', description: '', thumbnail: '', category: '', is_published: false, order_index: 0 })
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', order_index: 0 })
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', video_id: '', video_url: '', duration: '', order_index: 0, is_published: false })

  const resetCourseForm = () => {
    setCourseForm({ title: '', slug: '', description: '', thumbnail: '', category: '', is_published: false, order_index: 0 })
    setEditingCourseId(null)
    setShowCourseForm(false)
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
  }

  const resetModuleForm = () => {
    setModuleForm({ title: '', description: '', order_index: 0 })
    setEditingModuleId(null)
    setShowModuleForm(false)
  }

  const startEditModule = (mod: { title: string; description: string; order_index: number; id: string }) => {
    setModuleForm({
      title: mod.title,
      description: mod.description || '',
      order_index: mod.order_index,
    })
    setEditingModuleId(mod.id)
    setShowModuleForm(true)
  }

  const resetLessonForm = () => {
    setLessonForm({ title: '', description: '', video_id: '', video_url: '', duration: '', order_index: 0, is_published: false })
    setEditingLessonId(null)
    setShowLessonForm(false)
  }

  const startEditLesson = (lesson: { title: string; description: string; video_id: string; video_url: string; duration: number | null; order_index: number; is_published: boolean; id: string }) => {
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

  return {
    showCourseForm, setShowCourseForm,
    showModuleForm, setShowModuleForm,
    showLessonForm, setShowLessonForm,
    editingCourseId, editingModuleId, editingLessonId,
    setEditingCourseId, setEditingModuleId, setEditingLessonId,
    courseForm, setCourseForm,
    moduleForm, setModuleForm,
    lessonForm, setLessonForm,
    resetCourseForm, startEditCourse,
    resetModuleForm, startEditModule,
    resetLessonForm, startEditLesson,
  }
}
