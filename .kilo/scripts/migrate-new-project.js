const https = require('https');

const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const projectId = 'iskzakpvxuowkbzovjxw';

if (!accessToken) {
  console.error('❌ Missing SUPABASE_ACCESS_TOKEN environment variable');
  console.error('   Set it in backend/.env or as an environment variable.');
  process.exit(1);
}

const sql = `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`;
const data = JSON.stringify({ query: sql });

const options = {
  hostname: 'api.supabase.com',
  path: '/v1/projects/' + projectId + '/sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken,
    'apikey': accessToken,
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(body);
      console.log('Response:', JSON.stringify(json, null, 2));
    } catch(e) {
      console.log('Response:', body);
    }
  });
});

req.on('error', e => console.error('Error:', e.message));
req.write(data);
req.end();
