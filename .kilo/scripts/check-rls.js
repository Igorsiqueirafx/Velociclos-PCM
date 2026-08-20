const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://iskzakpvxuowkbzovjxw.supabase.co';
const SUPABASE_SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza3pha3B2eHVvd2tiem92anh3Iiwicm9sZSI6InNlcnZpY2VfY2xvZSIsImlhdCI6MTc4NjA1Mzg5NSwiZXhwIjoyMTAxNjI5ODk1fQ.k1--XG7OjAaFAaF3tNmzX6WWP5v3PDF6af2aUIxmyY4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Test: verify anon user can read profiles (shouldn't be able to after fix)
async function test() {
  console.log('=== Testing current RLS state ===\n');

  // Test 1: Anon access to profiles
  const anonKey = 'sb_publishable_Pl4MxK843e3BfMtCmwCNHQ_pFNRvA5M';
  const supabaseAnon = createClient(SUPABASE_URL, anonKey);

  const { data: anonProfiles, error: anonError } = await supabaseAnon
    .from('profiles')
    .select('*');

  console.log('1. Anon can read profiles:', anonError ? `NO (${anonError.message})` : `YES - LEAK (${anonProfiles.length} rows)`);

  const { data: anonLeads, error: anonLeadsError } = await supabaseAnon
    .from('leads')
    .select('*');

  console.log('2. Anon can read leads:', anonLeadsError ? `NO (${anonLeadsError.message})` : `YES - LEAK (${anonLeads.length} rows)`);

  // Test 3: Service role can still write
  const { data: leadData, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .limit(1);

  console.log('3. Service role can read leads:', leadError ? 'NO' : 'YES');
  console.log('\n=== Status: profiles table is publicly readable (SECURITY ISSUE) ===');
}

test().catch(console.error);
