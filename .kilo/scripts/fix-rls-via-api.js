const https = require('https');

// Direct key for iskzakpvxuowkbzovjxw
const SUPABASE_SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza3pha3B2eHVvd2tiem92anh3Iiwicm9sZSI6InNlcnZpY2VfY2xvZSIsImlhdCI6MTc4NjA1Mzg5NSwiZXhwIjoyMTAxNjI5ODk1fQ.k1--XG7OjAaFAaF3tNmzX6WWP5v3PDF6af2aUIxmyY4';

const sql = `
do $$
declare
  r record;
begin
  -- Drop and recreate profiles policy to only allow self-read
  drop policy if exists "Allow individual read access on profiles" on profiles;
  create policy "Allow read own profile only" on profiles for select using (auth.uid() = id);

  -- Drop and recreate leads select policy
  drop policy if exists "Allow read own leads" on leads;
  create policy "Allow read own leads" on leads for select using (
    profile_id = auth.uid() or email = (select email from profiles where id = auth.uid())
  );

  -- Keep insert policy for leads
  drop policy if exists "Allow insert leads" on leads;
  create policy "Allow insert leads" on leads for insert with check (true);
end $$;
`;

// Try Management API first
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
    console.log('Management API Status:', res.statusCode);
    console.log('Response:', body);

    // Try alternative endpoint: pg_meta
    const sqlData = JSON.stringify({ query: sql });
    const req2 = https.request('https://api.supabase.com/v1/taild/project/iskzakpvxuowkbzovjxw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SUPABASE_SECRET_KEY,
        'Content-Length': sqlData.length
      }
    }, (res2) => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
        console.log('Taild API Status:', res2.statusCode);
        console.log('Response:', body2);
      });
    });
    req2.on('error', e => console.error('Taild error:', e.message));
    req2.write(sqlData);
    req2.end();
  });
});

req.on('error', console.error);
req.write(data);
req.end();
