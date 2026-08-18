const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the schema + migration SQL
const setupSql = fs.readFileSync(path.join(__dirname, '../queries/setup-new-project.sql'), 'utf-8');

// Write to a temp file for the CLI
const tempFile = path.join(__dirname, 'temp-setup.sql');
fs.writeFileSync(tempFile, setupSql);

try {
  // Use supabase CLI to run SQL on the linked project
  // Project ref: iskzakpvxuowkbzovjxw
  const result = execSync(
    `npx supabase db query --linked --file "${tempFile}"`,
    {
      cwd: process.cwd(),
      encoding: 'utf-8',
      env: {
        ...process.env,
      },
      timeout: 60000,
    }
  );
  console.log('Result:', result);
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stderr:', error.stderr);
  console.error('Stdout:', error.stdout);
} finally {
  fs.unlinkSync(tempFile);
}
