import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log("Fix RLS function");

Deno.serve(async (req) => {
  try {
    // Verify secret key
    const apiKey = req.headers.get("apiKey") || req.headers.get("x-api-key");
    if (apiKey !== supabaseKey) {
      return new Response("Unauthorized", { status: 401 });
    }

    const sqlStatements = [
      `drop policy if exists "Allow individual read access on profiles" on profiles`,
      `create policy "Allow read own profile only" on profiles for select using (auth.uid() = id)`,
      `drop policy if exists "Allow read own leads" on leads`,
      `create policy "Allow read own leads" on leads for select using (profile_id = auth.uid() or email = (select email from profiles where id = auth.uid()))`,
      `drop policy if exists "Allow insert leads" on leads`,
      `create policy "Allow insert leads" on leads for insert with check (true)`,
    ];

    const results = [];

    // Use supabaseAdmin.rpc to call a SQL execution function
    // Supabase doesn't expose exec_sql directly, so we need another approach
    // We'll use the PostgREST exec via a raw HTTP connection to the database

    for (const stmt of sqlStatements) {
      try {
        // Use from('_exec') or create a temporary function
        // Actually we can use supabaseAdmin.rpc to call existing functions
        
        // Alternative: Use a raw query via the REST API with Prefer: return=minimal
        // But that won't work for DDL...
        
        // The correct approach: use pg_net or the database connection
        // Since we can't, let's just return the statements for logging
        
        results.push({ statement: stmt.substring(0, 80), status: "prepared" });
      } catch (e) {
        results.push({ statement: stmt.substring(0, 80), error: e.message });
      }
    }

    return Response.json({
      message: "SQL statements prepared (need to run in SQL Editor)",
      statements: sqlStatements,
      results,
    });
  } catch (err) {
    const e = err as Error;
    return Response.json({ error: e.message }, { status: 500 });
  }
});
