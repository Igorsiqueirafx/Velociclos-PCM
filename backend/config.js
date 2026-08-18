module.exports = {
  PORT: process.env.PORT || 3001,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'velociclos2024',
  DATA_DIR: process.env.DATA_DIR || __dirname,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
  YOUTUBE_API_BASE: 'https://www.googleapis.com/youtube/v3',
  YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID || 'UCwk7RuafgXHRqSmS3qO8qQQ',
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*',
  // Optional: override playlists to sync. If not set, all playlists from the
  // channel are discovered dynamically via YouTube Data API v3.
  PLAYLIST_IDS: process.env.PLAYLIST_IDS
    ? process.env.PLAYLIST_IDS.split(',').filter(Boolean)
    : null,
  BACKEND_URL: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`,
};
