import { Metadata } from 'next'
import { logEvent } from '@/lib/logging'
import type { Course } from './CursosClient'
import CursosHero from './CursosHero'
import CursosClient from './CursosClient'
import CursosCtaSection from './CursosCtaSection'

export const metadata: Metadata = {
  title: 'Cursos e Aulas - Velociclos PCM',
  description: 'Acesse todas as aulas sobre o Método Fimathe. Cursos organizados por tema: Forex, Ouro, Análise Técnica e mais.',
}

async function getCourses() {
  try {
    const { apiGet } = await import('@/lib/api')
    return await apiGet<Course[]>('/api/courses')
  } catch (error) {
    logEvent('courses_load', 'error', 'Failed to load courses', { error: error instanceof Error ? error.message : String(error) })
    return []
  }
}

export default async function CursosPage() {
  const courses = await getCourses()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0f0f19] to-[#1a1f25]">
      <CursosHero />

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Cursos Disponíveis</h2>
              <p className="text-[#a0a0a0]">Conteúdo direto do backend</p>
            </div>
          </div>

          <CursosClient initialCourses={courses} />
        </div>
      </section>

      <CursosCtaSection />
    </main>
  )
}
