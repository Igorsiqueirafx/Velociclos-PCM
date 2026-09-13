'use client'

import type { Course, Module, Lesson } from './CursosClient'

interface CourseModalProps {
  course: Course
  modules: Module[]
  loading: boolean
  currentLesson: Lesson | null
  onSelectLesson: (lesson: Lesson) => void
  onClose: () => void
}

export default function CourseModal({
  course, modules, loading, currentLesson, onSelectLesson, onClose,
}: CourseModalProps) {
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
            {course.title} — Módulos e Aulas
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
