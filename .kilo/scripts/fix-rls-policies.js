/**
 * fix-rls-policies.js
 *
 * Fixes RLS policies to prevent anonymous users from reading profiles and leads.
 * Uses the Supabase Management API (requires SUPABASE_SECRET_KEY with admin privileges).
 */

const https = require('https');

const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_SECRET_KEY) {
  console.error('❌ Missing SUPABASE_SECRET_KEY');
  process.exit(1);
}

const sql = `
-- Fix RLS policies to prevent anon from reading profiles and leads
drop policy if exists "Allow individual read access on profiles" on profiles;
create policy "Allow read own profile only" on profiles for select using (auth.uid() = id);

drop policy if exists "Allow read own leads" on leads;
create policy "Allow read own leads" on leads for select using (
  profile_id = auth.uid() or email = (select email from profiles where id = auth.uid())
);

-- Also ensure anon can still insert leads (for lead capture)
drop policy if exists "Allow insert leads" on leads;
create policy "Allow insert leads" on leads for insert with check (true);
`;

const data = JSON.stringify({ query: sql });

const req = https.request('https://api.supabase.com/v1/projects/iskzakpvxuowkbzovjxw/sql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + SUPABASE_SECRET_KEY,
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body.substring(0, 2000));
  });
});

req.on('error', console.error);
req.write(data);
req.end();
