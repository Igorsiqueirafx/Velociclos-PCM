require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const { repositoryFactory } = require('./src/repositories');

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

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${config.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

if (!config.ADMIN_PASSWORD) {
  console.error('FATAL: ADMIN_PASSWORD environment variable is not set. Server startup aborted.');
  process.exit(1);
}

// Initialize repositories with in-memory fallback for local development
const useInMemory = process.env.USE_IN_MEMORY === 'true' || !process.env.VERCEL_KV_REST_API_URL;
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

// ============================================
// HEALTH
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// COURSES
// ============================================
app.get('/api/courses', async (req, res) => {
  try {
    const data = await coursesRepo.findAll({ orderBy: 'order_index', ascending: true });
    res.json(data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const data = await coursesRepo.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Course not found' });
    res.json(data);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

app.post('/api/courses', authenticate, async (req, res) => {
  try {
    const slug = req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '');
    const payload = {
      title: req.body.title || '',
      slug: slug || null,
      description: req.body.description || '',
      thumbnail: req.body.thumbnail || '',
      category: req.body.category || '',
      is_published: req.body.is_published || false,
      order_index: req.body.order_index || 0,
    };

    const data = await coursesRepo.create(payload);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.put('/api/courses/:id', authenticate, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      category: req.body.category,
      is_published: req.body.is_published,
      order_index: req.body.order_index,
      updated_at: new Date().toISOString(),
    };

    const data = await coursesRepo.update(req.params.id, payload);
    if (!data) return res.status(404).json({ error: 'Course not found' });
    res.json(data);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/api/courses/:id', authenticate, async (req, res) => {
  try {
    const result = await coursesRepo.delete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Course not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ============================================
// MODULES (course_modules)
// ============================================
app.get('/api/courses/:courseId/modules', async (req, res) => {
  try {
    const data = await modulesRepo.findByCourseId(req.params.courseId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

app.post('/api/courses/:courseId/modules', authenticate, async (req, res) => {
  try {
    const payload = {
      course_id: req.params.courseId,
      title: req.body.title || '',
      description: req.body.description || '',
      order_index: req.body.order_index || 0,
    };

    const data = await modulesRepo.create(payload);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ error: 'Failed to create module' });
  }
});

app.get('/api/modules/:id', async (req, res) => {
  try {
    const data = await modulesRepo.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Module not found' });
    res.json(data);
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

app.put('/api/modules/:id', authenticate, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      order_index: req.body.order_index,
      updated_at: new Date().toISOString(),
    };

    const data = await modulesRepo.update(req.params.id, payload);
    if (!data) return res.status(404).json({ error: 'Module not found' });
    res.json(data);
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ error: 'Failed to update module' });
  }
});

app.delete('/api/modules/:id', authenticate, async (req, res) => {
  try {
    const result = await modulesRepo.delete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Module not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

// ============================================
// LESSONS (course_lessons)
// ============================================
app.get('/api/modules/:moduleId/lessons', async (req, res) => {
  try {
    const data = await lessonsRepo.findByModuleId(req.params.moduleId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

app.get('/api/courses/:courseId/lessons', async (req, res) => {
  try {
    const data = await lessonsRepo.findByCourseId(req.params.courseId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

app.post('/api/modules/:moduleId/lessons', authenticate, async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const module = await modulesRepo.findById(moduleId);
    if (!module) return res.status(404).json({ error: 'Module not found' });

    const payload = {
      module_id: moduleId,
      course_id: module.course_id,
      title: req.body.title || '',
      description: req.body.description || '',
      video_id: req.body.video_id || req.body.videoId || '',
      thumbnail: req.body.thumbnail || '',
      duration: req.body.duration || null,
      order_index: req.body.order_index || 0,
      is_published: req.body.is_published || false,
    };

    const data = await lessonsRepo.create(payload);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

app.put('/api/lessons/:id', authenticate, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      video_id: req.body.video_id || req.body.videoId,
      thumbnail: req.body.thumbnail,
      duration: req.body.duration,
      order_index: req.body.order_index,
      is_published: req.body.is_published,
      updated_at: new Date().toISOString(),
    };

    const data = await lessonsRepo.update(req.params.id, payload);
    if (!data) return res.status(404).json({ error: 'Lesson not found' });
    res.json(data);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

app.delete('/api/lessons/:id', authenticate, async (req, res) => {
  try {
    const result = await lessonsRepo.delete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Lesson not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// ============================================
// ARTICLES
// ============================================
app.get('/api/articles', async (req, res) => {
  try {
    const data = await articlesRepo.findAll({ orderBy: 'created_at', ascending: false });
    res.json(data);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const data = await articlesRepo.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Article not found' });
    res.json(data);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

app.post('/api/articles', authenticate, async (req, res) => {
  try {
    const slug = req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '');
    const payload = {
      title: req.body.title || '',
      slug: slug || null,
      content: req.body.content || '',
      excerpt: req.body.excerpt || '',
      cover_image: req.body.cover_image || req.body.coverImage || '',
      category: req.body.category || '',
      tags: req.body.tags || [],
      author: req.body.author || '',
      is_published: req.body.is_published || false,
      published_at: req.body.is_published ? (req.body.published_at || new Date().toISOString()) : null,
      meta_title: req.body.meta_title || '',
      meta_description: req.body.meta_description || '',
    };

    const data = await articlesRepo.create(payload);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.put('/api/articles/:id', authenticate, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      excerpt: req.body.excerpt,
      cover_image: req.body.cover_image || req.body.coverImage,
      category: req.body.category,
      tags: req.body.tags,
      author: req.body.author,
      is_published: req.body.is_published,
      published_at: req.body.is_published ? (req.body.published_at || new Date().toISOString()) : null,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      updated_at: new Date().toISOString(),
    };

    const data = await articlesRepo.update(req.params.id, payload);
    if (!data) return res.status(404).json({ error: 'Article not found' });
    res.json(data);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', authenticate, async (req, res) => {
  try {
    const result = await articlesRepo.delete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Article not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// ============================================
// CERTIFICATES
// ============================================
app.get('/api/certificates', async (req, res) => {
  try {
    const data = await certificatesRepo.findAll({ orderBy: 'order_index', ascending: true });
    res.json(data);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

app.post('/api/certificates', authenticate, async (req, res) => {
  try {
    const payload = {
      title: req.body.title || '',
      description: req.body.description || '',
      image_url: req.body.image_url || req.body.imageUrl || '',
      issue_date: req.body.issue_date || req.body.issueDate || null,
      order_index: req.body.order_index || 0,
    };

    const data = await certificatesRepo.create(payload);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
});

app.put('/api/certificates/:id', authenticate, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      image_url: req.body.image_url || req.body.imageUrl,
      issue_date: req.body.issue_date || req.body.issueDate,
      order_index: req.body.order_index,
    };

    const data = await certificatesRepo.update(req.params.id, payload);
    if (!data) return res.status(404).json({ error: 'Certificate not found' });
    res.json(data);
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

app.delete('/api/certificates/:id', authenticate, async (req, res) => {
  try {
    const result = await certificatesRepo.delete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Certificate not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// ============================================
// LEADS (public - no auth required)
// ============================================
app.get('/api/leads', async (req, res) => {
  try {
    const data = await subscribersRepo.findAll({ orderBy: 'created_at', ascending: false });
    res.json(data);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const { email, name, phone, utm_campaign, utm_source, utm_medium, utm_content } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const existing = await subscribersRepo.findByEmail(email);
    if (existing) {
      const updated = await subscribersRepo.update(existing.id, {
        name: name || existing.name,
        phone: phone || existing.phone,
        utm_campaign: utm_campaign || existing.utm_campaign,
        utm_source: utm_source || existing.utm_source,
        utm_medium: utm_medium || existing.utm_medium,
        utm_content: utm_content || existing.utm_content,
        ip_address: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || null,
        user_agent: req.headers['user-agent'] || null,
      });
      return res.json(updated);
    }

    const data = await subscribersRepo.create({
      email,
      name: name || null,
      phone: phone || null,
      utm_campaign: utm_campaign || null,
      utm_source: utm_source || 'website',
      utm_medium: utm_medium || null,
      utm_content: utm_content || null,
      source: utm_source || 'lead-capture',
      ip_address: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || null,
      user_agent: req.headers['user-agent'] || null,
    });
    res.status(201).json({ success: true, message: 'Lead salvo com sucesso!', data });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

// ============================================
// SUBSCRIBERS
// ============================================
app.get('/api/subscribers', async (req, res) => {
  try {
    const data = await subscribersRepo.findAll({ orderBy: 'created_at', ascending: false });
    res.json(data);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

app.post('/api/subscribers', authenticate, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const existing = await subscribersRepo.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const data = await subscribersRepo.create({ email, source: 'website' });
    res.status(201).json(data);
  } catch (error) {
    console.error('Error saving subscriber:', error);
    res.status(500).json({ error: 'Failed to save subscriber' });
  }
});

// ============================================
// DOWNLOADS (EA - Expert Advisor)
// ============================================
app.get('/api/downloads', async (req, res) => {
  try {
    const data = await downloadsRepo.findAll({ orderBy: 'created_at', ascending: false });
    res.json(data);
  } catch (error) {
    console.error('Error fetching downloads:', error);
    res.status(500).json({ error: 'Failed to fetch downloads' });
  }
});

app.get('/api/downloads/:id', async (req, res) => {
  try {
    const data = await downloadsRepo.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Download not found' });
    res.json(data);
  } catch (error) {
    console.error('Error fetching download:', error);
    res.status(500).json({ error: 'Failed to fetch download' });
  }
});

app.post('/api/downloads', authenticate, async (req, res) => {
  try {
    const payload = {
      title: req.body.title || '',
      description: req.body.description || '',
      version: req.body.version || '',
      file_url: req.body.file_url || req.body.fileUrl || '',
      file_size: req.body.file_size || req.body.fileSize || '',
      changelog: req.body.changelog || '',
      is_published: req.body.is_published || false,
      download_count: req.body.download_count || 0,
    };

    const data = await downloadsRepo.create(payload);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating download:', error);
    res.status(500).json({ error: 'Failed to create download' });
  }
});

app.put('/api/downloads/:id', authenticate, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      version: req.body.version,
      file_url: req.body.file_url || req.body.fileUrl,
      file_size: req.body.file_size || req.body.fileSize,
      changelog: req.body.changelog,
      is_published: req.body.is_published,
      download_count: req.body.download_count,
      updated_at: new Date().toISOString(),
    };

    const data = await downloadsRepo.update(req.params.id, payload);
    if (!data) return res.status(404).json({ error: 'Download not found' });
    res.json(data);
  } catch (error) {
    console.error('Error updating download:', error);
    res.status(500).json({ error: 'Failed to update download' });
  }
});

app.delete('/api/downloads/:id', authenticate, async (req, res) => {
  try {
    const result = await downloadsRepo.delete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Download not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting download:', error);
    res.status(500).json({ error: 'Failed to delete download' });
  }
});

// ============================================
// PAGES (Manual, Sobre, Termos, Política, Método, etc.)
// ============================================
app.get('/api/pages', async (req, res) => {
  try {
    const data = await pagesRepo.findAll({ orderBy: 'sort_order', ascending: true });
    res.json(data);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

app.get('/api/pages/:id', async (req, res) => {
  try {
    const data = await pagesRepo.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Page not found' });
    res.json(data);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

app.get('/api/pages/slug/:slug', async (req, res) => {
  try {
    const data = await pagesRepo.findBySlug(req.params.slug);
    if (!data) return res.status(404).json({ error: 'Page not found' });
    res.json(data);
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

app.post('/api/pages', authenticate, async (req, res) => {
  try {
    const slug = req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '');
    const payload = {
      title: req.body.title || '',
      slug: slug || null,
      content: req.body.content || '',
      excerpt: req.body.excerpt || '',
      cover_image: req.body.cover_image || req.body.coverImage || '',
      is_published: req.body.is_published || false,
      sort_order: req.body.sort_order || 0,
      meta_title: req.body.meta_title || '',
      meta_description: req.body.meta_description || '',
    };

    const data = await pagesRepo.create(payload);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

app.put('/api/pages/:id', authenticate, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      excerpt: req.body.excerpt,
      cover_image: req.body.cover_image || req.body.coverImage,
      is_published: req.body.is_published,
      sort_order: req.body.sort_order,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      updated_at: new Date().toISOString(),
    };

    const data = await pagesRepo.update(req.params.id, payload);
    if (!data) return res.status(404).json({ error: 'Page not found' });
    res.json(data);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

app.delete('/api/pages/:id', authenticate, async (req, res) => {
  try {
    const result = await pagesRepo.delete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Page not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// ============================================
// YOUTUBE (mantido para backward compatibility)
// ============================================
app.get('/api/playlists', (req, res) => {
  const PLAYLISTS_FILE = path.join(config.DATA_DIR, 'data', 'playlists.json');
  const data = loadJSON(PLAYLISTS_FILE, { playlists: [] });
  res.json(data.playlists || []);
});

app.post('/api/playlists/sync', authenticate, async (req, res) => {
  if (!config.YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }
  try {
    const playlists = [];
    for (const playlistId of config.PLAYLIST_IDS || []) {
      const url = `${config.YOUTUBE_API_BASE}/playlists?key=${config.YOUTUBE_API_KEY}&id=${playlistId}&maxResults=1&part=snippet,contentDetails`;
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        const data = await response.json();
        for (const item of (data.items || [])) {
          const snippet = item.snippet || {};
          const contentDetails = item.contentDetails || {};
          playlists.push({
            id: item.id,
            title: snippet.title || 'Sem título',
            description: snippet.description || '',
            thumbnail: (snippet.thumbnails || {}).medium?.url || (snippet.thumbnails || {}).default?.url || '',
            videoCount: contentDetails.itemCount || 0
          });
        }
      } catch (e) {
        console.warn(`Failed to fetch playlist ${playlistId}:`, e.message);
        continue;
      }
    }

    const PLAYLISTS_FILE = path.join(config.DATA_DIR, 'data', 'playlists.json');
    const fileData = loadJSON(PLAYLISTS_FILE, { playlists: [] });
    fileData.playlists = playlists;
    saveJSON(PLAYLISTS_FILE, fileData);
    res.json({ synced: playlists.length, playlists });
  } catch (error) {
    console.error('Error syncing playlists:', error);
    res.status(500).json({ error: 'Failed to sync playlists' });
  }
});

app.get('/api/playlist/:id/items', async (req, res) => {
  const { id: playlistId } = req.params;
  if (!config.YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }
  try {
    const url = `${config.YOUTUBE_API_BASE}/playlistItems?key=${config.YOUTUBE_API_KEY}&playlistId=${encodeURIComponent(playlistId)}&maxResults=50&part=snippet,contentDetails`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
    const data = await response.json();
    const videos = (data.items || [])
      .filter(item => item.contentDetails?.videoId)
      .map(item => ({
        videoId: item.contentDetails.videoId,
        title: item.snippet?.title || '',
        description: item.snippet?.description || '',
        thumbnail: item.snippet?.thumbnails?.medium?.url || `https://img.youtube.com/vi/${item.contentDetails.videoId}/mqdefault.jpg`,
        publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt
      }));
    res.json(videos);
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    res.status(500).json({ error: error.message });
  }
});

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

app.post('/api/videos', authenticate, async (req, res) => {
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

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Velociclos API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = { app, repositoryFactory, coursesRepo, modulesRepo, lessonsRepo, articlesRepo, certificatesRepo, subscribersRepo, downloadsRepo, pagesRepo };