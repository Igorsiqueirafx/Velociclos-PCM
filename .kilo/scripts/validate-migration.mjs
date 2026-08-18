import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://setpkdjcgmlfwubacjlg.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function validate() {
  console.log('=== Contagens ===')
  console.log()

  const tables = ['courses', 'modules', 'lessons', 'certificates']
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    console.log(table + ': ' + count + ' registros')
  }

  console.log()
  console.log('=== Relações course => module => lesson ===')
  console.log()

  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*, modules(*, lessons(*))')

  if (coursesError) {
    console.error('Error:', coursesError.message)
    return
  }

  for (const course of courses) {
    console.log('Curso: ' + course.title)
    console.log('  Descricao: ' + course.description)
    console.log('  Publicado: ' + course.is_published)
    console.log('  Modules: ' + (course.modules?.length || 0))

    for (const module of course.modules || []) {
      console.log('  Modulo: ' + module.title)
      console.log('    Aulas: ' + (module.lessons?.length || 0))

      for (const lesson of module.lessons || []) {
        console.log('    -> ' + lesson.title + ' | video_id: ' + lesson.video_id + ' | order: ' + lesson.order_index)
      }
    }
  }

  console.log()
  console.log('=== Certificados ===')
  console.log()
  const { data: certs, error: certsError } = await supabase
    .from('certificates')
    .select('*')
    .order('order_index', { ascending: true })

  if (certsError) {
    console.error('Error:', certsError.message)
    return
  }

  for (const cert of certs) {
    console.log(cert.title + ' | image: ' + cert.image_url + ' | order: ' + cert.order_index)
  }
}

validate().catch(console.error)
