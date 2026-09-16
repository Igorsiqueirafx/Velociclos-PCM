import { apiGet } from '@/lib/api'

export interface DashboardStats {
  subscriberCount: number
  recentSubscribers: Array<{ id: string; email: string; source: string; created_at: string }>
  courseCount: number
  lessonCount: number
  articleCount: number
  downloadCount: number
  certificateCount: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const safeCount = async (endpoint: string): Promise<number> => {
      try {
        const data = await apiGet<any[]>(endpoint)
        return Array.isArray(data) ? data.length : 0
      } catch {
        return 0
      }
    }

    const [subscribers, courses, lessons, articles, certificates, downloads] =
      await Promise.all([
        apiGet<any[]>('/api/subscribers').catch(() => []),
        apiGet<any[]>('/api/courses').catch(() => []),
        apiGet<any[]>('/api/videos').catch(() => []), // Uses lessons table
        apiGet<any[]>('/api/articles').catch(() => []),
        apiGet<any[]>('/api/certificates').catch(() => []),
        apiGet<any[]>('/api/downloads').catch(() => []),
      ])

    return {
      subscriberCount: subscribers.length,
      recentSubscribers: subscribers.slice(0, 5).map(s => ({
        id: s.id,
        email: s.email,
        source: s.source || '',
        created_at: s.created_at || new Date().toISOString(),
      })),
      courseCount: courses.length,
      lessonCount: lessons.length,
      articleCount: articles.length,
      downloadCount: downloads.length,
      certificateCount: certificates.length,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      subscriberCount: 0,
      recentSubscribers: [],
      courseCount: 0,
      lessonCount: 0,
      articleCount: 0,
      downloadCount: 0,
      certificateCount: 0,
    }
  }
}