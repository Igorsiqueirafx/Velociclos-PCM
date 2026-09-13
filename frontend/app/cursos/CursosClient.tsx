'use client'

import { useEffect } from 'react'
import { fetchPlaylists } from '@/lib/youtube'
import { logEvent } from '@/lib/logging'
import { useCourseData } from './use-course-data'
import PlaylistCard from './PlaylistCard'
import CourseModal from './CourseModal'

export interface Lesson {
  id: string
  title: string
  video_id: string | null
  thumbnail: string | null
  duration: number | null
  order_index: number
}

export interface Module {
  id: string
  title: string
  description: string | null
  order_index: number
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  order_index: number
  playlist_id: string | null
  lessons?: Lesson[]
}

interface CursosClientProps {
  initialCourses: Course[]
}

export default function CursosClient({ initialCourses }: CursosClientProps) {
  const h = useCourseData(initialCourses)
  const {
    courses, playlists, playlistVideos, selectedCourse, modules, loading, currentLesson,
    loadingPlaylists,
    loadModules, closeModal,
  } = h

  useEffect(() => {
    if (courses.length === 0 && playlists.length === 0 && !loadingPlaylists) {
      h.setLoadingPlaylists(true)
      fetchPlaylists()
        .then((result) => h.setPlaylists(result))
        .catch((e) => logEvent('playlists_discover', 'error', 'Failed to discover playlists', { error: e instanceof Error ? e.message : String(e) }))
        .finally(() => h.setLoadingPlaylists(false))
    }
  }, [courses.length, playlists.length, loadingPlaylists])

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
              Conteúdo organizado em playlists do canal oficial.
            </p>
          </div>

          {courses.length === 0 && loadingPlaylists ? (
            <div className="text-center py-16">
              <p className="text-[#a0a0a0] text-lg">Descobrindo playlists do canal...</p>
            </div>
          ) : courses.length === 0 && playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  videos={playlistVideos[playlist.id] || []}
                  index={0}
                />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#a0a0a0] text-lg">
                Nenhum curso disponível no momento.
              </p>
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
          onSelectLesson={h.setCurrentLesson}
          onClose={closeModal}
        />
      )}
    </>
  )
}
