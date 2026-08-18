import { Metadata } from 'next'
import { createClient } from '@/app/lib/supabase/server'
import CursosClient from './CursosClient'

export const metadata: Metadata = {
  title: 'Cursos - Velociclos PCM | Método Fimathe',
  description: 'Aprofunde-se no Método Fimathe com nossos cursos de trading. Aulas completas sobre Forex, Ouro, Análise Técnica e mais.',
}

interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  playlist_id: string | null
  is_published: boolean
  order_index: number
}

interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  lessons: Lesson[]
}

interface Lesson {
  id: string
  module_id: string
  course_id: string
  title: string
  description: string | null
  video_id: string | null
  thumbnail: string | null
  duration: number | null
  order_index: number
  is_published: boolean
}

export default async function CursosPage() {
  const supabase = await createClient()
  let courses: Course[] = []

  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (!error) courses = data || []
  } catch (e) {
    console.error('Failed to load courses:', e)
  }

  return <CursosClient initialCourses={courses} />
}
