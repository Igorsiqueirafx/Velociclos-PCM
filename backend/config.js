module.exports = {
  PORT: process.env.PORT || 3001,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'velociclos2024',
  DATA_DIR: process.env.DATA_DIR || __dirname,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
  YOUTUBE_API_BASE: 'https://www.googleapis.com/youtube/v3',
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*',
  PLAYLIST_IDS: (process.env.PLAYLIST_IDS || 'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I,PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9,PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh,PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK,PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5,PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV,PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ,PLWhqc48nlRWLahmd1buhzix23XcAFJkqD,PLWhqc48nlRWIKhZTuRMMy4vtOhN_HANlw,PLWhqc48nlRWIuwZkiaLAfDfFKWWndWUxO').split(',').filter(Boolean),
  BACKEND_URL: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`
};
