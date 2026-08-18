const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables');
  console.error('   Set them in frontend/.env.local or backend/.env or as environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== Testing anon access ===');
  
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true);
  
  console.log('Courses:', courses?.length || 0);
  console.log('Courses error:', coursesError?.message);

  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('*');
  
  console.log('Modules:', modules?.length || 0);
  console.log('Modules error:', modulesError?.message);

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*');
  
  console.log('Lessons:', lessons?.length || 0);
  console.log('Lessons error:', lessonsError?.message);
}

main();
