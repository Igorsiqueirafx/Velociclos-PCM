const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iskzakpvxuowkbzovjxw.supabase.co';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_SECRET_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SUPABASE_SECRET_KEY,
      'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
    },
  });
  const spec = await res.json();
  const ref = '$ref';

  function extractTableSchema(tableName) {
    const path = spec.paths['/' + tableName];
    if (!path) return null;
    const getOp = path.get;
    if (!getOp) return null;

    const props = {};
    const definitions = spec.definitions || {};
    const resp200 = getOp.responses && getOp.responses['200'];
    if (resp200 && resp200.schema && resp200.schema.items && resp200.schema.items[ref]) {
      const refName = resp200.schema.items[ref].replace('#/definitions/', '');
      const def = definitions[refName];
      if (def && def.properties) {
        for (const [col, info] of Object.entries(def.properties)) {
          props[col] = info.format || info.type || 'unknown';
        }
      }
    }
    return props;
  }

  for (const table of ['modules', 'lessons', 'courses', 'articles', 'pages', 'downloads', 'certificates', 'subscribers', 'profiles', 'leads']) {
    const schema = extractTableSchema(table);
    if (schema) {
      console.log('\n' + table + ' columns:', Object.keys(schema));
      console.log('  types:', JSON.stringify(schema, null, 2));
    } else {
      console.log('\n' + table + ': NOT FOUND in API');
    }
  }

  console.log('\n--- All definitions ---');
  console.log(Object.keys(spec.definitions || {}));

  console.log('\n--- All RPC paths ---');
  const rpcPaths = Object.keys(spec.paths || {}).filter(p => p.includes('/rpc/'));
  console.log(rpcPaths);

  console.log('\n--- Testing rls_auto_enable RPC ---');
  const { data, error } = await supabase.rpc('rls_auto_enable', {});
  console.log('Result:', { data, error: error?.message });
}

main().catch(err => console.error('Error:', err.message));
