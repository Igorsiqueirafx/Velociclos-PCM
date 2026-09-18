const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

module.exports = (playlistsRepo) => {
  router.get('/playlists', async (req, res) => {
    try {
      const data = await playlistsRepo.findAll({});
      res.json(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      res.status(500).json({ error: 'Failed to fetch playlists' });
    }
  });

  router.post('/playlists/sync', authMiddleware, async (req, res) => {
    try {
      const config = require('../config');
      const playlists = [];
      const playlistIds = config.PLAYLIST_IDS || [];

      for (const playlistId of playlistIds) {
        const url = `${config.YOUTUBE_API_BASE}/playlists?key=${config.YOUTUBE_API_KEY}&id=${playlistId}&maxResults=1&part=snippet,contentDetails`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items[0]) {
          const item = data.items[0];
          playlists.push({
            id: item.id,
            title: item.snippet?.title || '',
            description: item.snippet?.description || '',
            thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
            videoCount: item.contentDetails?.itemCount || 0,
          });
        }
      }

      for (const playlist of playlists) {
        await playlistsRepo.upsert(playlist);
      }

      res.json({ synced: playlists.length, playlists });
    } catch (error) {
      console.error('Error syncing playlists:', error);
      res.status(500).json({ error: 'Failed to sync playlists' });
    }
  });

  router.get('/playlist/:id/items', async (req, res) => {
    try {
      const config = require('../config');
      const playlistId = req.params.id;
      const url = `${config.YOUTUBE_API_BASE}/playlistItems?key=${config.YOUTUBE_API_KEY}&playlistId=${encodeURIComponent(playlistId)}&maxResults=50&part=snippet,contentDetails`;
      const response = await fetch(url);
      const data = await response.json();

      const videos = (data.items || []).map((item) => ({
        videoId: item.contentDetails?.videoId || item.snippet?.resourceId?.videoId || '',
        title: item.snippet?.title || '',
        description: item.snippet?.description || '',
        thumbnail: item.snippet?.thumbnails?.medium?.url || `https://img.youtube.com/vi/${item.contentDetails?.videoId}/mqdefault.jpg`,
        publishedAt: item.snippet?.publishedAt || '',
      }));

      res.json(videos);
    } catch (error) {
      console.error('Error fetching playlist items:', error);
      res.status(500).json({ error: 'Failed to fetch playlist items' });
    }
  });

  return router;
};
