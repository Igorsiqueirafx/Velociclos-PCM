'use client'

import { useEffect } from 'react'
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
      import('@/lib/youtube')
        .then(({ fetchPlaylists }) => fetchPlaylists())
        .then((result) => h.setPlaylists(result))
        .catch((e) => logEvent('playlists_discover', 'error', 'Failed to discover playlists', { error: e instanceof Error ? e.message : String(e) }))
        .finally(() => h.setLoadingPlaylists(false))
    }
  }, [courses.length, playlists.length, loadingPlaylists])

  return (
    <>
      {courses.length === 0 && loadingPlaylists ? (
        <div className="text-center py-16">
          <p className="text-[#8a8a8d] text-lg">Descobrindo playlists do canal...</p>
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
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2a2e39] flex items-center justify-center">
            <i className="fas fa-video-slash text-3xl text-[#404857]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum curso disponível</h3>
          <p className="text-[#a0a0a0]">Em breve novos conteúdos serão adicionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => loadModules(course.id)}
              className="group bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl overflow-hidden text-left transition-all duration-300 hover:border-[#0071e3] hover:shadow-[0_0_25px_rgba(0,113,227,0.15)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2"
            >
              <div className="relative aspect-video">
                <img
                  src={course.thumbnail || '/placeholder-course.jpg'}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/320x180/1e1e1e/8a8a8d?text=Sem+thumbnail'
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-play text-3xl text-white" aria-hidden="true"></i>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#0071e3] transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-[#8a8a8d] line-clamp-2">
                  {course.description || 'Curso completo do Método Fimathe.'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

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
