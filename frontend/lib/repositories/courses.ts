import { createClient } from '@/app/lib/supabase/client'
import { logEvent } from '@/lib/logging'
import type { Module } from '../../app/cursos/CursosClient'

interface LessonRow {
  id: string
  title: string
  video_id: string
  thumbnail: string
  duration: string
  order_index: number
  is_published: boolean
}

interface ModuleRow {
  id: string
  title: string
  description: string
  order_index: number
  lessons: LessonRow[]
}

export async function loadModules(courseId: string): Promise<Module[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('modules')
    .select('*, lessons(id, title, video_id, thumbnail, duration, order_index, is_published)')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (error || !data) {
    logEvent('modules_load', 'error', 'Failed to load modules', { error: error?.message || 'Unknown error' })
    return []
  }

  return data.map((m: ModuleRow) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    order_index: m.order_index,
    lessons: m.lessons
      .filter((l) => l.is_published)
      .sort((a, b) => a.order_index - b.order_index)
      .map((l) => ({
        id: l.id,
        title: l.title,
        video_id: l.video_id,
        thumbnail: l.thumbnail,
        duration: l.duration ? Number(l.duration) : null,
        order_index: l.order_index,
      })),
  }))
}
