import { apiGet } from '@/lib/api'

export interface MonitoringCounts {
  courseCount: number | null
  lessonCount: number | null
  articleCount: number | null
  subscriberCount: number | null
}

export async function getMonitoringCounts(): Promise<MonitoringCounts> {
  try {
    const safeCount = async (endpoint: string): Promise<number> => {
      try {
        const data = await apiGet<any[]>(endpoint)
        return Array.isArray(data) ? data.length : 0
      } catch {
        return 0
      }
    }

    const [courseCount, lessonCount, articleCount, subscriberCount] = await Promise.all([
      safeCount('/api/courses'),
      safeCount('/api/videos'),
      safeCount('/api/articles'),
      safeCount('/api/subscribers'),
    ])

    return {
      courseCount,
      lessonCount: lessonCount,
      articleCount,
      subscriberCount,
    }
  } catch (error) {
    console.error('Error fetching monitoring counts:', error)
    return {
      courseCount: null,
      lessonCount: null,
      articleCount: null,
      subscriberCount: null,
    }
  }
}