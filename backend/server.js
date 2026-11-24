require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const { repositoryFactory } = require('./src/repositories');
const errorHandler = require('./src/middleware/errorHandler');
const { requestLogger } = require('./src/middleware/requestLogger');
const { logError, logWarn } = require('./src/middleware/logger');
const { authMiddleware } = require('./src/middleware/auth');
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
    logWarn('server:loadJSON', err.message);
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
    logError('server:saveJSON', err);
  }
}

// Initialize repositories with in-memory fallback for local development
const useInMemory = process.env.USE_IN_MEMORY !== 'false';
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
      video_id: 'L3XbYm_WOQA',
      thumbnail: 'https://img.youtube.com/vi/L3XbYm_WOQA/mqdefault.jpg',
      duration: 600,
      order_index: 1,
      is_published: true,
    });

    await lessonsRepo.create({
      module_id: module1.id,
      course_id: course.id,
      title: 'Aula 2 - Conceitos básicos',
      description: 'Conceitos básicos.',
      video_id: 'tgH0fjnGOlk',
      thumbnail: 'https://img.youtube.com/vi/tgH0fjnGOlk/mqdefault.jpg',
      duration: 800,
      order_index: 2,
      is_published: true,
    });

    await lessonsRepo.create({
      module_id: module2.id,
      course_id: course.id,
      title: 'Aula 3 - Prática',
      description: 'Aplicação prática.',
      video_id: 'zlx26zrcDOg',
      thumbnail: 'https://img.youtube.com/vi/zlx26zrcDOg/mqdefault.jpg',
      duration: 900,
      order_index: 1,
      is_published: true,
    });

    const course2 = await coursesRepo.create({
      title: 'Método Fimathe - Análise de Ouro',
      slug: 'metodo-fimathe-ouro',
      description: 'Análise técnica aplicada ao ouro (XAUUSD) usando o método Fimathe.',
      thumbnail: 'https://img.youtube.com/vi/SaR-4Dp_0AI/maxresdefault.jpg',
      category: 'ouro',
      is_published: true,
      order_index: 2,
    });

    const module3 = await modulesRepo.create({
      course_id: course2.id,
      title: 'Módulo 1 - Ouro',
      description: 'Fundamentos da análise de ouro com Fimathe.',
      order_index: 1,
    });

    await lessonsRepo.create({
      module_id: module3.id,
      course_id: course2.id,
      title: 'Aula 1 - Estrutura do Ouro',
      description: 'Como ler a estrutura de preços do XAUUSD.',
      video_id: 'ynkO0RpRrVo',
      thumbnail: 'https://img.youtube.com/vi/ynkO0RpRrVo/mqdefault.jpg',
      duration: 750,
      order_index: 1,
      is_published: true,
    });

    await lessonsRepo.create({
      module_id: module3.id,
      course_id: course2.id,
      title: 'Aula 2 - Zona Neutra no Ouro',
      description: 'Identificando a zona neutra no mercado de ouro.',
      video_id: 'rYd_oE_z7vo',
      thumbnail: 'https://img.youtube.com/vi/rYd_oE_z7vo/mqdefault.jpg',
      duration: 850,
      order_index: 2,
      is_published: true,
    });
  }

  const existingArticles = await articlesRepo.findAll({});
  if (existingArticles.length === 0) {
    const articles = [
      { title: 'Como a Fimathe simplificou a análise gráfica', slug: 'fimathe-simplificou-analise', excerpt: 'A Fimathe nasceu da união de Fibonacci e matemática para corrigir falhas da análise clássica.', category: 'metodo', is_published: true },
      { title: 'Zona Neutra e Canal de Referência: o coração da Fimathe', slug: 'zona-neutra-canal', excerpt: 'Entenda a zona neutra, o canal de referência e o stop fora da caixinha.', category: 'metodo', is_published: true },
      { title: '5 Mitos sobre Mesas Proprietárias no Forex', slug: 'mitos-prop-firms', excerpt: 'Existem muitos mitos sobre mesas proprietárias circulando no mercado.', category: 'forex', is_published: true },
      { title: 'Operar em Notícias: quando evitar e quando aproveitar a volatilidade', slug: 'noticias-volatility', excerpt: 'Muitos evitam notícias por medo; a volatilidade pode ser aliada.', category: 'estrategia', is_published: true },
      { title: 'Gestão de Risco: o pilar que separa traders consistentes dos que perdem', slug: 'gestao-risco-trader', excerpt: 'Sem gestão de risco, a melhor estratégia do mundo não salva sua conta.', category: 'estrategia', is_published: true },
      { title: 'Análise de Múltiplos Timeframes: como alinhar tendência e entrada', slug: 'multitimeframe-entrada', excerpt: 'Aprenda a usar timeframes superiores para filtrar sinais e aumentar a assertividade.', category: 'metodo', is_published: true },
      { title: 'Psicologia do Trading: controle emocional em momentos de volatilidade', slug: 'psicologia-trading', excerpt: 'A mente do trader é o maior ativo ou o maior risco. Aprenda a dominar suas emoções.', category: 'psicologia', is_published: true },
      { title: 'Backtesting Manual: como validar sua estratégia antes de operar', slug: 'backtesting-manual', excerpt: 'Valide sua estratégia com dados históricos antes de arriscar capital real.', category: 'estrategia', is_published: true },
    ];
    for (const a of articles) {
      await articlesRepo.create({ ...a, content: '', cover_image: '', tags: [], author: 'Marcelo Ferreira', published_at: new Date().toISOString() });
    }
  }

  const existingPages = await pagesRepo.findAll({});
  if (existingPages.length === 0) {
    const pages = [
      { title: 'Manual do Expert Advisor', slug: 'manual', excerpt: 'Guia completo de instalação e configuração do EA Velociclos.', content: 'Conteúdo do manual do EA.', is_published: true },
      { title: 'Sobre o Velociclos', slug: 'sobre', excerpt: 'Conheça o projeto Velociclos PCM.', content: 'Sobre o projeto.', is_published: true },
    ];
    for (const p of pages) {
      await pagesRepo.create({ ...p, cover_image: '', sort_order: 0, meta_title: p.title, meta_description: p.excerpt });
    }
  }
};

seed().catch((e) => logError('server:seed', e));

// ============================================
// HEALTH
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// ADMIN STATUS
// ============================================
app.get('/api/admin/status', authMiddleware, async (req, res) => {
  try {
    const repos = repositoryFactory.getRepositories();
    const counts = {
      courses: await repos.courses.count(),
      modules: await repos.modules.count(),
      lessons: await repos.lessons.count(),
      articles: await repos.articles.count(),
      certificates: await repos.certificates.count(),
      subscribers: await repos.subscribers.count(),
      downloads: await repos.downloads.count(),
      pages: await repos.pages.count(),
      playlists: await repos.playlists.count(),
    };

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      counts,
      persistence: process.env.USE_IN_MEMORY !== 'false' ? 'in-memory' : 'supabase',
    });
  } catch (error) {
    logError('admin:status', error);
    res.status(500).json({ error: 'Failed to fetch admin status' });
  }
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
    logError('legacy:videos:list', error);
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
    logError('legacy:videos:create', error);
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
