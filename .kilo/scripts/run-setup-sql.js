/**
 * run-setup-sql.js
 *
 * Runs the auth + leads SQL setup against Supabase via pg driver.
 *
 * Environment variables:
 *   SUPABASE_URL        – e.g. https://iskzakpvxuowkbzovjxw.supabase.co
 *   SUPABASE_SECRET_KEY – service_role key (sb_secret_...)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pg = require('pg');

const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_SECRET_KEY) {
  console.error('❌ Missing SUPABASE_SECRET_KEY environment variable');
  process.exit(1);
}

const sqlPath = path.join(__dirname, '..', '..', 'scripts', 'setup-auth-leads.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const host = 'aws-0-sa-east-1.pooler.supabase.com';
const port = 5432;
const database = 'postgres';
const user = 'postgres.iskzakpvxuowkbzovjxw';
const password = SUPABASE_SECRET_KEY;

async function runSql() {
  console.log('=== Running auth + leads SQL setup ===\n');
  console.log(`Host: ${host}`);

  const client = new pg.Client({
    host,
    port,
    database,
    user,
    password,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase');

    // Wrap in transaction
    const transactionSql = `BEGIN;\n${sql}\nCOMMIT;`;

    try {
      await client.query(transactionSql);
      console.log('✅ SQL setup complete! All statements executed successfully.');
    } catch (err) {
      console.error('❌ SQL execution failed:', err.message);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSql();
