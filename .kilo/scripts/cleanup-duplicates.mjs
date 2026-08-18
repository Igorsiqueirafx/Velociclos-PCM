import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://setpkdjcgmlfwubacjlg.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function cleanup() {
  // Delete duplicate certificates
  const { data: certs } = await supabase.from('certificates').select('*')
  const seenCerts = {}
  for (const c of certs) {
    const key = c.title + '|' + c.image_url
    if (seenCerts[key]) {
      await supabase.from('certificates').delete().eq('id', c.id)
      console.log('Deleted duplicate certificate:', c.title)
    } else {
      seenCerts[key] = c.id
    }
  }

  // Delete duplicate lessons
  const { data: lessons } = await supabase.from('lessons').select('*')
  const seenLessons = {}
  for (const l of lessons) {
    const key = l.video_id
    if (seenLessons[key]) {
      await supabase.from('lessons').delete().eq('id', l.id)
      console.log('Deleted duplicate lesson:', l.title)
    } else {
      seenLessons[key] = l.id
    }
  }

  // Delete duplicate modules
  const { data: modules } = await supabase.from('modules').select('*')
  const seenModules = {}
  for (const m of modules) {
    const key = m.course_id + '|' + m.title
    if (seenModules[key]) {
      await supabase.from('modules').delete().eq('id', m.id)
      console.log('Deleted duplicate module:', m.title)
    } else {
      seenModules[key] = m.id
    }
  }

  // Delete duplicate courses
  const { data: courses } = await supabase.from('courses').select('*')
  const seenCourses = {}
  for (const c of courses) {
    const key = c.title
    if (seenCourses[key]) {
      await supabase.from('courses').delete().eq('id', c.id)
      console.log('Deleted duplicate course:', c.title)
    } else {
      seenCourses[key] = c.id
    }
  }

  // Validate counts
  for (const table of ['courses', 'modules', 'lessons', 'certificates']) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
    console.log(table + ': ' + count + ' records')
  }
}

cleanup().catch(console.error)
