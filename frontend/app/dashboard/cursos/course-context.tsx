import { createContext, useContext } from 'react'
import { useCourseManagement } from './use-course-management'

type CourseContextType = ReturnType<typeof useCourseManagement>

const CourseContext = createContext<CourseContextType | null>(null)

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const course = useCourseManagement()
  return <CourseContext.Provider value={course}>{children}</CourseContext.Provider>
}

export function useCourse() {
  return useContext(CourseContext)
}
