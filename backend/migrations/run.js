const fs = require('fs');
const path = require('path');

function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration(s)`);
  console.log('Run these SQL files in the Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/_/sql/new');
  console.log('');

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`--- ${file} ---`);
    console.log(sql);
    console.log('');
  }

  console.log('All migrations listed above.');
}

runMigrations();
