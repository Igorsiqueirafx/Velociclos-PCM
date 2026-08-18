const https = require('https');

const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
if (!accessToken) {
  console.error('❌ Missing SUPABASE_ACCESS_TOKEN environment variable');
  console.error('   Set it in backend/.env or as an environment variable.');
  process.exit(1);
}
const sql = `SELECT 1 as test;`;
const data = JSON.stringify({ query: sql });

const paths = [
  '/rest/v1/sql',
  '/rest/v1/rpc',
  '/rest/v1/rpc/postgres_query',
  '/rest/v1/rpc/run_sql',
  '/rest/v1/rpc/pgsql',
  '/rest/v1/rpc/pgsql_query',
  '/functions/v1/sql',
  '/rest/v1/rpc/supabase_admin',
];

async function tryPath(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'iskzakpvxuowkbzovjxw.supabase.co',
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        'apikey': accessToken,
        'x-api-key': accessToken,
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        console.log(`${path}: ${res.statusCode}`);
        if (res.statusCode !== 404 && res.statusCode !== 401) {
          console.log('  Body:', body.substring(0, 200));
        } else {
          console.log('  Body:', body.substring(0, 100));
        }
      });
    });

    req.on('error', e => console.log(`${path}: Error - ${e.message}`));
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  for (const path of paths) {
    await tryPath(path);
  }
}

main();
