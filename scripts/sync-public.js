#!/usr/bin/env node
/**
 * Syncs frontend/public assets to root public/ for Vercel deployment.
 * This is needed because Vercel's Root Directory is set to "." (root)
 * but the Next.js app lives in frontend/.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const src = path.join(rootDir, 'frontend', 'public');
const dest = path.join(rootDir, 'public');

function rimrafSync(target) {
  if (fs.existsSync(target)) {
    const entries = fs.readdirSync(target, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(target, entry.name);
      if (entry.isDirectory()) {
        rimrafSync(fullPath);
      } else {
        fs.unlinkSync(fullPath);
      }
    }
    fs.rmdirSync(target);
  }
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean and re-sync
rimrafSync(dest);
copyDir(src, dest);
console.log(`✅ Synced frontend/public → public (${fs.readdirSync(dest).length} items)`);
