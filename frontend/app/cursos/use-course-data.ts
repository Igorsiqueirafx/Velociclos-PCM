'use client'

import { useState, useCallback, useRef } from 'react'
import { fetchPlaylistItems } from '@/lib/youtube'
import { logEvent } from '@/lib/logging'
import type { Lesson, Module, Course } from './CursosClient'
import type { YouTubePlaylist, YouTubeVideo } from '@/lib/youtube-types'
import { loadModules as loadModulesFromRepo } from '@/lib/repositories/courses'

interface CourseDataState {
  courses: Course[]
  playlists: YouTubePlaylist[]
  playlistVideos: Record<string, YouTubeVideo[]>
  selectedCourse: Course | null
  modules: Module[]
  loading: boolean
  currentLesson: Lesson | null
  loadingPlaylists: boolean
  loadingPlaylistVideos: Record<string, boolean>
  coursesError: Error | null
}

export function useCourseData(initialCourses: Course[]): CourseDataState & {
  loadModules: (courseId: string) => Promise<void>
  loadPlaylistVideos: (playlistId: string) => Promise<void>
  closeModal: () => void
  setCourses: (c: Course[]) => void
  setSelectedCourse: (c: Course | null) => void
  setCurrentLesson: (l: Lesson | null) => void
  setPlaylists: (p: YouTubePlaylist[]) => void
  setLoadingPlaylists: (v: boolean) => void
  retryCourses: () => Promise<void>
} {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([])
  const [playlistVideos, setPlaylistVideos] = useState<Record<string, YouTubeVideo[]>>({})
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loadingPlaylists, setLoadingPlaylists] = useState(false)
  const [loadingPlaylistVideos, setLoadingPlaylistVideos] = useState<Record<string, boolean>>({})
  const [coursesError, setCoursesError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const loadModules = useCallback(async (courseId: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setSelectedCourse(courses.find((c) => c.id === courseId) || null)
    setModules([])
    setCurrentLesson(null)

    try {
      const mappedModules = await loadModulesFromRepo(courseId, controller.signal)
      setModules(mappedModules)
      const firstLesson = mappedModules[0]?.lessons[0]
      if (firstLesson) setCurrentLesson(firstLesson)
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') {
        logEvent('modules_load', 'error', 'Failed to load modules', { error: e instanceof Error ? e.message : String(e) })
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [courses])

  const loadPlaylistVideos = useCallback(async (playlistId: string) => {
    setLoadingPlaylistVideos((prev) => ({ ...prev, [playlistId]: true }))
    try {
      const videos = await fetchPlaylistItems(playlistId)
      setPlaylistVideos((prev) => ({ ...prev, [playlistId]: videos }))
    } catch (e) {
      logEvent('playlist_videos_load', 'error', 'Failed to load playlist videos', { error: e instanceof Error ? e.message : String(e) })
    } finally {
      setLoadingPlaylistVideos((prev) => ({ ...prev, [playlistId]: false }))
    }
  }, [])

  const closeModal = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setSelectedCourse(null)
    setModules([])
    setCurrentLesson(null)
  }, [])

  const retryCourses = useCallback(async () => {
    setCoursesError(null)
    setCourses(initialCourses)
  }, [initialCourses])

  return {
    courses, playlists, playlistVideos, selectedCourse, modules,
    loading, currentLesson, loadingPlaylists, loadingPlaylistVideos, coursesError,
    loadModules, loadPlaylistVideos, closeModal,
    setCourses, setSelectedCourse, setCurrentLesson, setPlaylists, setLoadingPlaylists,
    retryCourses,
  }
}
