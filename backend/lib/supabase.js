const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

module.exports = {
  admin: createClient(
    supabaseUrl || 'https://setpkdjcgmlfwubacjlg.supabase.co',
    supabaseKey || 'sb_publishable_j32eOhUnDPZQqEg7r0Lt0A_DXSzztXc',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  ),
};
