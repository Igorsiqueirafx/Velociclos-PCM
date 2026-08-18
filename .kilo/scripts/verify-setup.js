const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabasePubKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables');
  console.error('   Set them in backend/.env or as environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`Projects: ${supabaseUrl.replace(/^https:\/\//, '')}`);

  // Count all tables
  const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact' });
  const { count: moduleCount } = await supabase.from('modules').select('*', { count: 'exact' });
  const { count: lessonCount } = await supabase.from('lessons').select('*', { count: 'exact' });
  const { count: certCount } = await supabase.from('certificates').select('*', { count: 'exact' });
  const { count: articleCount } = await supabase.from('articles').select('*', { count: 'exact' });

  console.log('=== Contagens ===');
  console.log(`courses:       ${courseCount} registros`);
  console.log(`modules:       ${moduleCount} registros`);
  console.log(`lessons:       ${lessonCount} registros`);
  console.log(`certificates:  ${certCount} registros`);
  console.log(`articles:      ${articleCount} registros`);

  // Verify data integrity
  console.log('\n=== Integridade dos Dados ===');

  // Check all video IDs are valid (11 chars)
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('video_id');

  let validIds = 0;
  let invalidIds = 0;
  const invalidExamples = [];

  for (const lesson of allLessons) {
    if (/^[A-Za-z0-9_-]{11}$/.test(lesson.video_id)) {
      validIds++;
    } else {
      invalidIds++;
      if (invalidExamples.length < 3) invalidExamples.push(lesson.video_id);
    }
  }

  console.log(`Video IDs validos:     ${validIds}/${allLessons.length}`);
  console.log(`Video IDs invalidos:   ${invalidIds}`);
  if (invalidExamples.length > 0) {
    console.log(`Exemplos inválidos: ${invalidExamples.join(', ')}`);
  }

  // Check all courses have playlist_id
  const { data: allCourses } = await supabase
    .from('courses')
    .select('title, playlist_id, thumbnail, is_published');

  const coursesWithPlaylist = allCourses.filter(c => c.playlist_id && c.playlist_id.length > 0);
  const coursesWithoutThumbnail = allCourses.filter(c => !c.thumbnail);

  console.log(`\nCursos com playlist_id: ${coursesWithPlaylist.length}/${allCourses.length}`);
  console.log(`Cursos sem thumbnail: ${coursesWithoutThumbnail.length}`);

  console.log('\n--- Todos os Cursos ---');
  allCourses.forEach((c, i) => {
    const dur = c.is_published ? '✅' : '❌';
    const thumb = c.thumbnail ? '🖼️' : '❌';
    const pl = c.playlist_id ? '🔗' : '❌';
    console.log(`  ${i+1}. ${dur} ${thumb} ${pl} ${c.title}`);
  });

  // Test anon (publishable key) access
  console.log('\n=== Acesso Anon (Publishable Key) ===');
  const supabaseAnon = createClient(supabaseUrl, supabasePubKey);

  const { data: anonCourses, error: anonCoursesError } = await supabaseAnon
    .from('courses')
    .select('title, thumbnail, playlist_id')
    .eq('is_published', true)
    .order('order_index');

  console.log(`Courses (anon): ${anonCourses ? anonCourses.length : 0} ${anonCoursesError ? '(error: ' + anonCoursesError.message + ')' : '✅'}`);

  const { data: anonCerts, error: anonCertsError } = await supabaseAnon
    .from('certificates')
    .select('title, image_url');

  console.log(`Certificates (anon): ${anonCerts ? anonCerts.length : 0} ${anonCertsError ? '(error: ' + anonCertsError.message + ')' : '✅'}`);

  if (anonCourses && anonCourses[0]) {
    const firstCourseId = allCourses[0]?.id;
    if (firstCourseId) {
      const { data: firstModule } = await supabaseAnon
        .from('modules')
        .select('lessons!inner(title, video_id, thumbnail, duration)')
        .eq('course_id', anonCourses[0]?.id || firstCourseId)
        .limit(1);
      
      const lessonCount = firstModule?.[0]?.lessons?.length || 0;
      console.log(`Lessons (first course, anon): ${lessonCount} ✅`);
    }
  }

  console.log('\n=== Summary ===');
  const allGood = courseCount > 0
    && moduleCount > 0
    && lessonCount > 0
    && certCount > 0
    && invalidIds === 0
    && coursesWithPlaylist.length === allCourses.length;

  console.log(allGood ? '✅ Tudo validado! O projeto está pronto.' : '❌ Falhas encontradas.');
}

main().catch(console.error);
