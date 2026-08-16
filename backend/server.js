const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');

const app = express();
const PORT = config.PORT;

app.use(cors({
  origin: config.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(config.DATA_DIR, 'data', 'videos.json');
const PLAYLISTS_FILE = path.join(config.DATA_DIR, 'data', 'playlists.json');

function ensureDataDir() {
  const dir = path.join(config.DATA_DIR, 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadJSON(filePath, fallback) {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    saveJSON(filePath, fallback);
    return fallback;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return fallback;
  }
}

function saveJSON(filePath, data) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function loadVideos() {
  return loadJSON(DATA_FILE, { videos: [] });
}

function loadPlaylists() {
  return loadJSON(PLAYLISTS_FILE, { playlists: [] });
}

function saveVideos(data) {
  saveJSON(DATA_FILE, data);
}

function savePlaylists(data) {
  saveJSON(PLAYLISTS_FILE, data);
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${config.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/api/videos', (req, res) => {
  const data = loadVideos();
  res.json(data.videos || []);
});

app.post('/api/videos', authenticate, (req, res) => {
  try {
    const data = loadVideos();
    const newVideo = {
      id: Date.now().toString(),
      videoId: req.body.videoId,
      title: req.body.title || '',
      description: req.body.description || '',
      module: req.body.module || '',
      createdAt: new Date().toISOString()
    };
    
    data.videos.push(newVideo);
    saveVideos(data);
    
    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ error: 'Failed to save video' });
  }
});

app.put('/api/videos/:id', authenticate, (req, res) => {
  try {
    const data = loadVideos();
    const index = data.videos.findIndex(v => v.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    data.videos[index] = {
      ...data.videos[index],
      ...req.body,
      id: data.videos[index].id,
      createdAt: data.videos[index].createdAt
    };
    
    saveVideos(data);
    res.json(data.videos[index]);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

app.delete('/api/videos/:id', authenticate, (req, res) => {
  try {
    const data = loadVideos();
    data.videos = data.videos.filter(v => v.id !== req.params.id);
    saveVideos(data);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

app.get('/api/playlists', (req, res) => {
  const data = loadPlaylists();
  res.json(data.playlists || []);
});

app.post('/api/playlists/sync', authenticate, async (req, res) => {
  if (!config.YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }
  try {
    const playlists = [];
    for (const playlistId of config.PLAYLIST_IDS) {
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
    const data = loadPlaylists();
    data.playlists = playlists;
    savePlaylists(data);
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Velociclos API running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin/index.html`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API docs: http://localhost:${PORT}/api/videos`);
});
