require('fs').cpSync('frontend/dist', 'dist', { recursive: true });
console.log('copied');
