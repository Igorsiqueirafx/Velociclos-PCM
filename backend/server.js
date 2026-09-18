require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const { repositoryFactory } = require('./src/repositories');
const errorHandler = require('./src/middleware/errorHandler');
const { requestLogger } = require('./src/middleware/requestLogger');
const createCoursesRoutes = require('./src/routes/courses');
const createModulesRoutes = require('./src/routes/modules');
const createLessonsRoutes = require('./src/routes/lessons');
const createArticlesRoutes = require('./src/routes/articles');
const createCertificatesRoutes = require('./src/routes/certificates');
const createLeadsRoutes = require('./src/routes/leads');
const createSubscribersRoutes = require('./src/routes/subscribers');
const createDownloadsRoutes = require('./src/routes/downloads');
const createPagesRoutes = require('./src/routes/pages');
const createPlaylistsRoutes = require('./src/routes/playlists');

const app = express();
const PORT = config.PORT;

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));

function loadJSON(filePath, defaultValue) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('loadJSON error:', err.message);
  }
  return defaultValue;
}

function saveJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('saveJSON error:', err.message);
  }
}

// Initialize repositories with in-memory fallback for local development
const useInMemory = process.env.USE_IN_MEMORY === 'true';
repositoryFactory.initialize({ useInMemory });
const repos = repositoryFactory.getRepositories();

const coursesRepo = repos.courses;
const modulesRepo = repos.modules;
const lessonsRepo = repos.lessons;
const articlesRepo = repos.articles;
const certificatesRepo = repos.certificates;
const subscribersRepo = repos.subscribers;
const downloadsRepo = repos.downloads;
const pagesRepo = repos.pages;
const playlistsRepo = repos.playlists;

const seed = async () => {
  const existing = await coursesRepo.findAll({});
  if (existing.length === 0) {
    const course = await coursesRepo.create({
      title: 'Curso Fimathe Completo',
      slug: 'curso-fimathe-completo',
      description: 'Conteúdo completo do Método Fimathe aplicado ao mercado.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      category: 'forex',
      is_published: true,
      order_index: 1,
    });

    const module1 = await modulesRepo.create({
      course_id: course.id,
      title: 'Módulo 1 - Fundamentos',
      description: 'Introdução e fundamentos do método.',
      order_index: 1,
    });

    const module2 = await modulesRepo.create({
      course_id: course.id,
      title: 'Módulo 2 - Aplicação',
      description: 'Aplicação prática nas operações.',
      order_index: 2,
    });

    await lessonsRepo.create({
      module_id: module1.id,
      course_id: course.id,
      title: 'Aula 1 - Introdução',
      description: 'Introdução ao método.',
      video_id: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      duration: 600,
      order_index: 1,
      is_published: true,
    });

    await lessonsRepo.create({
      module_id: module1.id,
      course_id: course.id,
      title: 'Aula 2 - Conceitos básicos',
      description: 'Conceitos básicos.',
      video_id: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      duration: 800,
      order_index: 2,
      is_published: true,
    });

    await lessonsRepo.create({
      module_id: module2.id,
      course_id: course.id,
      title: 'Aula 3 - Prática',
      description: 'Aplicação prática.',
      video_id: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      duration: 900,
      order_index: 1,
      is_published: true,
    });
  }
};

seed().catch((e) => console.error('Seed error:', e));

// ============================================
// HEALTH
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// COURSES
// ============================================
app.use('/api/courses', createCoursesRoutes(coursesRepo));

// ============================================
// MODULES (course_modules)
// ============================================
app.use('/api', createModulesRoutes(modulesRepo));

// ============================================
// LESSONS (course_lessons)
// ============================================
app.use('/api', createLessonsRoutes(lessonsRepo, modulesRepo));

// ============================================
// ARTICLES
// ============================================
app.use('/api/articles', createArticlesRoutes(articlesRepo));

// ============================================
// CERTIFICATES
// ============================================
app.use('/api/certificates', createCertificatesRoutes(certificatesRepo));

// ============================================
// LEADS (public - no auth required)
// ============================================
app.use('/api/leads', createLeadsRoutes(subscribersRepo));

// ============================================
// SUBSCRIBERS
// ============================================
app.use('/api/subscribers', createSubscribersRoutes(subscribersRepo));

// ============================================
// DOWNLOADS (EA - Expert Advisor)
// ============================================
app.use('/api/downloads', createDownloadsRoutes(downloadsRepo));

// ============================================
// PAGES (Manual, Sobre, Termos, Política, Método, etc.)
// ============================================
app.use('/api/pages', createPagesRoutes(pagesRepo));

// ============================================
// YOUTUBE (mantido para backward compatibility)
// ============================================
app.use('/api', createPlaylistsRoutes(playlistsRepo));

// Legacy /api/videos kept for backward compatibility during migration
app.get('/api/videos', async (req, res) => {
  try {
    const data = await lessonsRepo.findAll({ orderBy: 'created_at', ascending: false });
    res.json(data);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    const payload = {
      title: req.body.title || '',
      description: req.body.description || '',
      video_id: req.body.videoId || '',
      thumbnail: '',
      is_published: true,
      order_index: req.body.order_index || 0,
    };
    const data = await lessonsRepo.create(payload);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to save video' });
  }
});

app.use(errorHandler);

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Velociclos API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = { app, repositoryFactory, coursesRepo, modulesRepo, lessonsRepo, articlesRepo, certificatesRepo, subscribersRepo, downloadsRepo, pagesRepo };
