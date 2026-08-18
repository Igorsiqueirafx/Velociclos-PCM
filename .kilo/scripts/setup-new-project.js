const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables');
  console.error('   Set them in backend/.env or as environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('=== Checking new project iskzakpvxuowkbzovjxw ===\n');

  // Check if tables already exist
  const tables = ['courses', 'modules', 'lessons', 'articles', 'certificates', 'subscribers'];
  let needsSchema = false;

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('count').limit(1);
    const exists = !error;
    console.log(`${table}: ${exists ? 'EXISTS' : 'MISSING'}`);
    if (!exists) needsSchema = true;
  }

  if (needsSchema) {
    console.log('\n⚠️  Schema not yet applied. Please run the following SQL in Supabase SQL Editor:');
    console.log('   File: .kilo/queries/setup-new-project.sql');
    console.log('   Project: iskzakpvxuowkbzovjxw');
    console.log('\n   Copy the contents of setup-new-project.sql and paste into:');
    console.log('   https://supabase.com/dashboard/project/iskzakpvxuowkbzovjxw/sql/new');
  } else {
    console.log('\n✅ Schema already applied. Verifying data...');

    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true);
    console.log('Courses:', JSON.stringify(courses, null, 2));
    if (coursesError) console.log('Courses error:', coursesError.message);

    const { data: certificates, error: certError } = await supabase
      .from('certificates')
      .select('*');
    console.log('Certificates:', JSON.stringify(certificates, null, 2));
    if (certError) console.log('Certificates error:', certError.message);

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('is_published', true);
    console.log('Lessons:', JSON.stringify(lessons, null, 2));
    if (lessonsError) console.log('Lessons error:', lessonsError.message);
  }
}

main().catch(console.error);
