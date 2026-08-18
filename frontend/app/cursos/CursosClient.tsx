'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase/client'

interface Lesson {
  id: string
  title: string
  video_id: string | null
  thumbnail: string | null
  duration: number | null
  order_index: number
}

interface Module {
  id: string
  title: string
  description: string | null
  order_index: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  order_index: number
}

interface CursosClientProps {
  initialCourses: Course[]
}

export default function CursosClient({ initialCourses }: CursosClientProps) {
  const [courses] = useState<Course[]>(initialCourses)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)

  const loadModules = async (courseId: string) => {
    setLoading(true)
    setSelectedCourse(courses.find((c) => c.id === courseId) || null)
    setModules([])
    setCurrentLesson(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('modules')
          .select(`
            *,
            lessons(id, title, video_id, thumbnail, duration, order_index, is_published)
          `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

      if (!error && data) {
        const mappedModules = data.map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          order_index: m.order_index,
          lessons: (m.lessons || [])
            .filter((l: any) => l.is_published)
            .sort((a: any, b: any) => a.order_index - b.order_index),
        }))
        setModules(mappedModules)
        const firstLesson = mappedModules[0]?.lessons[0]
        if (firstLesson) setCurrentLesson(firstLesson)
      }
    } catch (e) {
      console.error('Failed to load modules:', e)
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedCourse(null)
    setModules([])
    setCurrentLesson(null)
  }

  return (
    <>
      <section className="py-12 sm:py-16 lg:py-20 bg-[#1e2329]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-4">
              Cursos Fimathe
            </h1>
            <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
              Aprofunde-se no Método Fimathe com nossos cursos completos de trading.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#a0a0a0] text-lg">Nenhum curso disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => loadModules(course.id)}
                  className="group bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden text-left transition-all duration-300 hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
                >
                  <div className="relative aspect-video">
                    <img
                      src={course.thumbnail || '/placeholder-course.jpg'}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://via.placeholder.com/320x180/343a47/ffffff?text=Sem+thumbnail'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="fas fa-play text-3xl text-white" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#dcdcdc] mb-1 group-hover:text-[#ffd700] transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-[#a0a0a0] line-clamp-2">
                      {course.description || 'Curso completo do Método Fimathe.'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          modules={modules}
          loading={loading}
          currentLesson={currentLesson}
          onSelectLesson={setCurrentLesson}
          onClose={closeModal}
        />
      )}
    </>
  )
}

function CourseModal({
  course,
  modules,
  loading,
  currentLesson,
  onSelectLesson,
  onClose,
}: {
  course: Course
  modules: Module[]
  loading: boolean
  currentLesson: Lesson | null
  onSelectLesson: (lesson: Lesson) => void
  onClose: () => void
}) {
  const videoId = currentLesson?.video_id || ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-5xl mx-4 bg-[#2a2e39] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#1e2329] text-[#a0a0a0] hover:text-[#ffd700] rounded-full flex items-center justify-center focus:ring-2 focus:ring-[#ffd700] transition-colors"
          aria-label="Fechar"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>

        <div className="aspect-video bg-[#1e2329]">
          {currentLesson && videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&fs=0&disablekb=1`}
              title={currentLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#a0a0a0]">
              {loading ? 'Carregando aulas...' : 'Selecione uma aula para começar.'}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#404857]">
          <h3 id="modal-title" className="text-lg font-bold text-[#dcdcdc] mb-3 flex items-center gap-2">
            <i className="fas fa-list text-[#ffd700]" aria-hidden="true"></i>
            Módulos e Aulas
          </h3>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-5 bg-[#343a47] rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-[#343a47] rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {modules.map((mod) => (
                <div key={mod.id} className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#ffd700]">{mod.title}</h4>
                   {mod.lessons.map((lesson) => (
                     <button
                       key={lesson.id}
                       onClick={() => onSelectLesson(lesson)}
                       className={`w-full flex gap-3 p-2 rounded-lg text-left transition-all ${
                         currentLesson?.id === lesson.id
                           ? 'bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700]'
                           : 'bg-[#1e2329] hover:bg-[#343a47] text-[#dcdcdc]'
                       } focus:outline-none focus:ring-1 focus:ring-[#ffd700]`}
                     >
                       {lesson.thumbnail ? (
                         <img
                           src={lesson.thumbnail}
                           alt={lesson.title}
                           className="w-20 h-12 object-cover rounded flex-shrink-0"
                           loading="lazy"
                         />
                       ) : (
                         <div className="w-20 h-12 bg-[#343a47] rounded flex-shrink-0 flex items-center justify-center">
                           <i className="fas fa-play text-[#a0a0a0]" aria-hidden="true"></i>
                         </div>
                       )}
                       <div className="flex-1">
                         <p className="text-sm font-medium line-clamp-2">{lesson.title}</p>
                         {lesson.duration && (
                           <p className="text-xs text-[#a0a0a0] mt-1">
                             {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                           </p>
                         )}
                       </div>
                     </button>
                   ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
