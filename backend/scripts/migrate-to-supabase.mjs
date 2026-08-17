import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://setpkdjcgmlfwubacjlg.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_j32eOhUnDPZQqEg7r0Lt0A_DXSzztXc'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function migrate() {
  console.log('Starting migration...\n')

  const videosPath = new URL('../data/videos.json', import.meta.url).pathname
  const fs = await import('fs')
  const path = await import('path')
  const videosFile = path.join(process.cwd(), 'data', 'videos.json')

  if (fs.existsSync(videosFile)) {
    const videosData = JSON.parse(fs.readFileSync(videosFile, 'utf8'))
    const videos = videosData.videos || []

    if (videos.length > 0) {
      console.log(`Migrating ${videos.length} videos...`)

      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert([{ title: 'Método Fimathe', description: 'Curso completo do Método Fimathe', thumbnail: '', is_published: true, order_index: 0 }])
        .select()
        .single()

      if (courseError) {
        console.error('Error creating course:', courseError.message)
        return
      }

      const { data: module, error: moduleError } = await supabase
        .from('modules')
        .insert([{ course_id: course.id, title: 'Aulas', description: 'Aulas do Método Fimathe', order_index: 0 }])
        .select()
        .single()

      if (moduleError) {
        console.error('Error creating module:', moduleError.message)
        return
      }

      for (const video of videos) {
        const { error } = await supabase.from('lessons').insert([{
          module_id: module.id,
          course_id: course.id,
          title: video.title || 'Sem título',
          description: video.description || '',
          video_id: video.videoId || video.video_id,
          thumbnail: '',
          duration: null,
          order_index: 0,
          is_published: true,
        }])

        if (error) {
          console.error(`Error inserting lesson ${video.title}:`, error.message)
        } else {
          console.log(`  ✓ ${video.title}`)
        }
      }
    }
  } else {
    console.log('No videos.json found, skipping course migration.')
  }

  const certsPath = path.join(process.cwd(), 'public', 'certificados')
  if (fs.existsSync(certsPath)) {
    const files = fs.readdirSync(certsPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
    console.log(`\nMigrating ${files.length} certificates...`)

    for (const file of files) {
      const { error } = await supabase.from('certificates').insert([{
        title: file.replace(/\.[^/.]+$/, ''),
        description: '',
        image_url: `/certificados/${file}`,
        issue_date: null,
        order_index: 0,
      }])

      if (error) {
        console.error(`Error inserting certificate ${file}:`, error.message)
      } else {
        console.log(`  ✓ ${file}`)
      }
    }
  } else {
    console.log('\nNo certificados folder found, skipping certificate migration.')
  }

  console.log('\nMigration completed!')
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
