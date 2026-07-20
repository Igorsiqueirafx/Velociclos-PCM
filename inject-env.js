const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const jsPath = path.join(__dirname, 'js.js');

const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/YOUTUBE_API_KEY=(.+)/);

if (!apiKeyMatch) {
  console.error('YOUTUBE_API_KEY not found in .env');
  process.exit(1);
}

const apiKey = apiKeyMatch[1].trim();
let jsContent = fs.readFileSync(jsPath, 'utf8');

jsContent = jsContent.replace(
  /__YOUTUBE_API_KEY__/g,
  apiKey
);

fs.writeFileSync(jsPath, jsContent);
console.log('YouTube API key injected into js.js');
