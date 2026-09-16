import { apiGet } from '@/lib/api'
import { logEvent } from '@/lib/logging'

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
    const [subscribers, courses, lessons, articles, certificates, downloads] =
      await Promise.all([
        apiGet<unknown[]>('/api/subscribers').catch(() => []),
        apiGet<unknown[]>('/api/courses').catch(() => []),
        apiGet<unknown[]>('/api/videos').catch(() => []), // Uses lessons table
        apiGet<unknown[]>('/api/articles').catch(() => []),
        apiGet<unknown[]>('/api/certificates').catch(() => []),
        apiGet<unknown[]>('/api/downloads').catch(() => []),
      ])

    const getRecords = (value: unknown): Array<Record<string, unknown>> =>
      Array.isArray(value) ? value as Array<Record<string, unknown>> : []

    const subscriberRecords = getRecords(subscribers)
    const courseRecords = getRecords(courses)
    const lessonRecords = getRecords(lessons)
    const articleRecords = getRecords(articles)
    const certificateRecords = getRecords(certificates)
    const downloadRecords = getRecords(downloads)

    return {
      subscriberCount: subscriberRecords.length,
      recentSubscribers: subscriberRecords.slice(0, 5).map((subscriber) => ({
        id: String(subscriber.id),
        email: String(subscriber.email),
        source: String(subscriber.source || ''),
        created_at: String(subscriber.created_at || new Date().toISOString()),
      })),
      courseCount: courseRecords.length,
      lessonCount: lessonRecords.length,
      articleCount: articleRecords.length,
      downloadCount: downloadRecords.length,
      certificateCount: certificateRecords.length,
    }
  } catch (error) {
    logEvent('dashboard_stats', 'error', 'Error fetching dashboard stats', { error: error instanceof Error ? error.message : String(error) })
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