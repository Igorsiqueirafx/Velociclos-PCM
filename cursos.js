(() => {
  'use strict';

  const API_BASE = '';
  const CHANNEL_ID = 'UCwk7RuafgXHRqSmS3qO8qQQ';
  const GRID_SELECTOR = '.playlists-grid';
  const CARD_TEMPLATE = (playlist) => `
    <button class="playlist-card" data-playlist-id="${playlist.id}" type="button">
      <div class="playlist-thumb">
        <img src="${playlist.thumbnail}" alt="${playlist.title}" loading="lazy">
        <span class="playlist-play-icon"><i class="fas fa-play" aria-hidden="true"></i></span>
      </div>
      <div class="playlist-content">
        <h3>${playlist.title}</h3>
        <span class="playlist-video-count"><i class="fas fa-video" aria-hidden="true"></i> ${playlist.videoCount || 0} vídeos</span>
      </div>
    </button>
  `;

  const once = (fn) => {
    let called = false;
    return async (...args) => {
      if (called) return;
      called = true;
      await fn(...args);
    };
  };

  const fetchJSON = async (url) => {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  };

  const resolveBackendBase = () => {
    const meta = document.querySelector('meta[name="api-base"]');
    if (meta && meta.content) return meta.content.replace(/\/$/, '');
    const origin = window.location.origin;
    return origin;
  };

  const backendPlaylistsUrl = () => `${resolveBackendBase()}/api/youtube/playlists`;
  const backendPlaylistItemsUrl = (playlistId) => `${resolveBackendBase()}/api/youtube/playlist/${playlistId}`;

  const fetchAllPlaylistsFromChannel = async () => {
    const data = await fetchJSON(backendPlaylistsUrl());
    return data.items || data || [];
  };

  const fetchPlaylistItems = async (playlistId) => {
    const data = await fetchJSON(backendPlaylistItemsUrl(playlistId));
    return (data.items || []).map(item => {
      const contentDetails = item.contentDetails || {};
      const snippet = item.snippet || {};
      return {
        videoId: contentDetails.videoId || item.id || '',
        title: snippet.title || 'Sem título',
        description: snippet.description || '',
        thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || `https://img.youtube.com/vi/${contentDetails.videoId || item.id}/mqdefault.jpg`,
        publishedAt: contentDetails.videoPublishedAt || snippet.publishedAt || ''
      };
    });
  };

  const buildVideoItem = (video) => {
    const videoId = video.videoId || video.id;
    const title = video.title || 'Sem título';
    const thumb = video.thumbnail || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    return `
      <div class="video-item" data-video-id="${videoId}">
        <div class="video-thumb">
          <img src="${thumb}" alt="" loading="lazy">
          <span class="play-icon"><i class="fas fa-play" aria-hidden="true"></i></span>
        </div>
        <div class="video-info">
          <h4>${title}</h4>
          <span class="duration">Vídeo</span>
        </div>
      </div>
    `;
  };

  const openDynamicModal = async (playlistId, playlistTitle) => {
    const modal = document.getElementById('video-modal');
    const overlay = document.getElementById('video-modal-overlay');
    const closeBtn = document.getElementById('video-modal-close');
    const playerContainer = document.getElementById('video-player-container');
    const videoPlaylist = document.getElementById('video-playlist');

    if (!modal || !playerContainer || !videoPlaylist) return;

    playerContainer.innerHTML = '<p style="color:#fff;padding:20px;">Carregando vídeos...</p>';
    videoPlaylist.innerHTML = '';

    let videos = [];
    try {
      videos = await fetchPlaylistItems(playlistId);
    } catch (e) {
      playerContainer.innerHTML = `<p style="color:#fff;padding:20px;">Erro ao carregar vídeos: ${e.message}</p>`;
    }

    if (videos.length > 0) {
      const first = videos[0];
      const firstId = first.videoId || first.id;
      playerContainer.innerHTML = `
        <div class="video-player-main" id="video-player-main">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${firstId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&fs=0&disablekb=1" title="${first.title || 'Video'}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      `;
    } else {
      playerContainer.innerHTML = '<p style="color:#fff;padding:20px;">Nenhum vídeo encontrado.</p>';
    }

    const listHtml = videos.map(buildVideoItem).join('');
    videoPlaylist.innerHTML = `<h3><i class="fas fa-list" aria-hidden="true"></i> ${playlistTitle}</h3><div class="video-list">${listHtml}</div>`;

    const videoItems = videoPlaylist.querySelectorAll('.video-item');
    const videoPlayerMain = playerContainer.querySelector('.video-player-main');

    videoItems.forEach((item) => {
      item.addEventListener('click', () => {
        const videoId = item.getAttribute('data-video-id');
        if (!videoId || !videoPlayerMain) return;
        videoPlayerMain.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&fs=0&disablekb=1" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        videoItems.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        playerContainer.scrollTop = 0;
      });
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  const fetchPlaylists = async () => {
    const items = await fetchAllPlaylistsFromChannel();
    return items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      thumbnail: item.thumbnail || '',
      videoCount: item.videoCount || 0
    }));
  };

  const render = once(async () => {
    const grid = document.querySelector(GRID_SELECTOR);
    if (!grid) return;

    grid.innerHTML = '';

    let playlists = [];
    try {
      playlists = await fetchPlaylists();
    } catch (e) {
      console.warn('Falling back to static playlists:', e);
    }

    if (playlists.length > 0) {
      playlists.forEach((pl) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = CARD_TEMPLATE(pl);
        const card = wrapper.firstElementChild;
        card.addEventListener('click', (e) => {
          e.preventDefault();
          openDynamicModal(pl.id, pl.title);
        });
        grid.appendChild(card);
      });
    }
  });

  const init = () => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', render);
    } else {
      render();
    }
  };

  init();
})();
