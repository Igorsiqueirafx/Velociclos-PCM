'use client'

import { useEffect, useMemo } from 'react'
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
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const flatLessons = useMemo(() => modules.flatMap((mod) => mod.lessons), [modules])
  const currentIndex = useMemo(
    () => flatLessons.findIndex((lesson) => lesson.id === currentLesson?.id),
    [flatLessons, currentLesson]
  )
  const videoId = currentLesson?.video_id || ''

  useEffect(() => {
    if (!videoId || typeof window === 'undefined') return

    const loadPlayer = () => {
      const container = document.getElementById('fimathe-course-player')
      if (!container) return

      const ytWindow = window as typeof window & {
        YT?: {
          Player: new (id: string, config: {
            videoId: string
            playerVars: Record<string, string | number>
            events: {
              onReady: () => void
              onStateChange: (event: { data: number }) => void
            }
          }) => {
            addEventListener: (arg0: string, arg1: (event: { data: number }) => void) => void
          }
        }
        onYouTubeIframeAPIReady?: () => void
      }
      if (!ytWindow.YT) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(script)
      }

      const advance = () => {
        const next = flatLessons[currentIndex + 1]
        if (next) onSelectLesson(next)
      }

      const createPlayer = () => {
        const YTConstructor = ytWindow.YT
        if (!YTConstructor) return
        new YTConstructor.Player('fimathe-course-player', {
          videoId,
          playerVars: {
            rel: '0',
            modestbranding: '1',
            showinfo: '0',
            iv_load_policy: '3',
            controls: '1',
            fs: '0',
            disablekb: '1',
            autoplay: '1',
            mute: '0',
            enablejsapi: '1',
            origin: origin,
          },
          events: {
            onReady: () => {},
            onStateChange: (event) => {
              if (event.data === 0) advance()
            },
          },
        })
      }

      if (ytWindow.YT) {
        createPlayer()
      } else {
        ytWindow.onYouTubeIframeAPIReady = createPlayer
      }
    }

    loadPlayer()
  }, [videoId, flatLessons, currentIndex, onSelectLesson, origin])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-5xl mx-4 bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#121212] text-[#8a8a8d] hover:text-white rounded-full flex items-center justify-center focus:ring-2 focus:ring-[#0071e3] transition-colors"
          aria-label="Fechar"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>

        <div className="aspect-video bg-[#121212]">
          {currentLesson && videoId ? (
            <div id="fimathe-course-player" className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8a8a8d]">
              {loading ? 'Carregando aulas...' : 'Selecione uma aula para começar.'}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#3a3a3c]">
          <h3 id="modal-title" className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <i className="fas fa-list text-[#0071e3]" aria-hidden="true"></i>
            {course.title} — Módulos e Aulas
          </h3>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-5 bg-[#2a2a2e] rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-[#2a2a2e] rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {modules.map((mod) => (
                <div key={mod.id} className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#0071e3]">{mod.title}</h4>
                  {mod.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className={`w-full flex gap-3 p-2 rounded-lg text-left transition-all ${
                        currentLesson?.id === lesson.id
                          ? 'bg-[#0071e3]/10 border border-[#0071e3]/30 text-[#0071e3]'
                          : 'bg-[#1e1e1e] hover:bg-[#2a2a2e] text-white'
                      } focus:outline-none focus:ring-1 focus:ring-[#0071e3]`}
                    >
                      {lesson.thumbnail ? (
                        <img
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          className="w-20 h-12 object-cover rounded flex-shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-20 h-12 bg-[#2a2a2e] rounded flex-shrink-0 flex items-center justify-center">
                          <i className="fas fa-play text-[#8a8a8d]" aria-hidden="true"></i>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{lesson.title}</p>
                        {lesson.duration && (
                          <p className="text-xs text-[#8a8a8d] mt-1">
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