const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.');
}

module.exports = {
  admin: createClient(
    supabaseUrl || 'https://iskzakpvxuowkbzovjxw.supabase.co',
    supabaseKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  ),
};
