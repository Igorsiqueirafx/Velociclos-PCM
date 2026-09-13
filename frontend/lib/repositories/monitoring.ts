import { createClient } from '@/app/lib/supabase/client'

export interface MonitoringCounts {
  courseCount: number | null
  lessonCount: number | null
  articleCount: number | null
  subscriberCount: number | null
}

export async function getMonitoringCounts(): Promise<MonitoringCounts> {
  const supabase = createClient()

  const [coursesResult, lessonsResult, articlesResult, subscribersResult] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('lessons').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }),
  ])

  return {
    courseCount: coursesResult.count ?? 0,
    lessonCount: lessonsResult.count ?? 0,
    articleCount: articlesResult.count ?? 0,
    subscriberCount: subscribersResult.count ?? 0,
  }
}
