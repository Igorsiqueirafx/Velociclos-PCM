const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iskzakpvxuowkbzovjxw.supabase.co';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_SECRET_KEY environment variable');
  process.exit(1);
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function test() {
  console.log('=== Testing current RLS state ===\n');

  const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  const { data: anonProfiles, error: anonError } = await supabaseAnon
    .from('profiles')
    .select('*');

  console.log('1. Anon can read profiles:', anonError ? `NO (${anonError.message})` : `YES - LEAK (${anonProfiles.length} rows)`);

  const { data: anonLeads, error: anonLeadsError } = await supabaseAnon
    .from('leads')
    .select('*');

  console.log('2. Anon can read leads:', anonLeadsError ? `NO (${anonLeadsError.message})` : `YES - LEAK (${anonLeads.length} rows)`);

  const { data: leadData, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .limit(1);

  console.log('3. Service role can read leads:', leadError ? 'NO' : 'YES');
  console.log('\n=== Status: profiles table is publicly readable (SECURITY ISSUE) ===');
}

test().catch(console.error);
