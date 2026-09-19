import { apiGet } from '@/lib/api'
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

const FALLBACK_COURSES: Module[] = [
  {
    id: 'curso-fimathe-completo',
    title: 'Curso Fimathe Completo',
    description: 'Conteúdo completo do Método Fimathe aplicado ao mercado.',
    order_index: 1,
    lessons: [
      {
        id: 'aula-1',
        title: 'Aula 1 - Introdução',
        video_id: 'dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: 600,
        order_index: 1,
      },
      {
        id: 'aula-2',
        title: 'Aula 2 - Conceitos básicos',
        video_id: 'dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: 800,
        order_index: 2,
      },
      {
        id: 'aula-3',
        title: 'Aula 3 - Prática',
        video_id: 'dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: 900,
        order_index: 3,
      },
    ],
  },
]

export async function loadModules(courseId: string, signal?: AbortSignal): Promise<Module[]> {
  try {
    const data = await apiGet<ModuleRow[]>(`/api/courses/${courseId}/modules`, { signal })

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
  } catch (error) {
    if ((error as Error)?.name !== 'AbortError') {
      logEvent('modules_load', 'error', 'Failed to load modules', { error: error instanceof Error ? error.message : 'Unknown error' })
    }
    return FALLBACK_COURSES
  }
}
