const fs = require('fs');

const filePath = 'backend/server.js';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
const result = [];

let skip = 0;
for (let i = 0; i < lines.length; i++) {
  if (skip > 0) {
    skip--;
    continue;
  }
  const line = lines[i];

  // Remove pg import
  if (line.includes("const pg = require('pg');")) {
    continue;
  }

  // Remove /api/test-deploy route
  if (line.includes("app.get('/api/test-deploy'")) {
    skip = 12; // skip next 12 lines (the route body + closing });
    continue;
  }

  // Remove /api/migrate route
  if (line.includes("app.post('/api/migrate'")) {
    // Count lines until closing });
    let braceCount = 0;
    let j = i;
    while (j < lines.length) {
      braceCount += (lines[j].match(/{/g) || []).length;
      braceCount -= (lines[j].match(/}/g) || []).length;
      if (braceCount <= 0 && lines[j].includes('});')) {
        skip = j - i;
        break;
      }
      j++;
    }
    continue;
  }

  result.push(line);
}

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Cleanup complete. Lines:', result.length);
