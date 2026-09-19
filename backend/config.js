module.exports = {
  PORT: process.env.PORT || 3001,
  DATA_DIR: process.env.DATA_DIR || __dirname,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
  YOUTUBE_API_BASE: 'https://www.googleapis.com/youtube/v3',
  YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID || 'UCwk7RuafgXHRqSmS3qO8qQQ',
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*',
  PLAYLIST_IDS: process.env.PLAYLIST_IDS
    ? process.env.PLAYLIST_IDS.split(',').filter(Boolean)
    : null,
  BACKEND_URL: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`,
  USE_IN_MEMORY: process.env.USE_IN_MEMORY === 'true',
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || '',
};
