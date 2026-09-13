import { createClient } from '@/app/lib/supabase/client'

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
  const supabase = createClient()

  const safeCount = async (table: string): Promise<number> => {
    try {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
      return count || 0
    } catch {
      return 0
    }
  }

  const [subscribersRes, coursesRes, lessonsRes, articlesRes, certificatesRes, downloads] =
    await Promise.all([
      supabase.from('subscribers').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('lessons').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('certificates').select('*', { count: 'exact', head: true }),
      safeCount('downloads'),
    ])

  return {
    subscriberCount: subscribersRes.count || 0,
    recentSubscribers: subscribersRes.data || [],
    courseCount: coursesRes.count || 0,
    lessonCount: lessonsRes.count || 0,
    articleCount: articlesRes.count || 0,
    downloadCount: downloads,
    certificateCount: certificatesRes.count || 0,
  }
}
