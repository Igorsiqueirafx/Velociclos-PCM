(() => {
  'use strict';

  const YOUTUBE_API_KEY = 'AIzaSyCciJjxi6ULJH2X0L4G4g3wdbYkI_H-kv0';
  const API_BASE = 'https://www.googleapis.com/youtube/v3';
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

  const PLAYLIST_MAP = {
    'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I': 'Fimathe Checkpoint | FOREX',
    'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9': 'Primórdios da Fimathe',
    'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh': 'Marcelão in London [2024]',
    'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK': 'As melhores do XAUUSD',
    'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ': 'FOREX SCALPER FIMATHE',
    'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD': 'IMERSÃO MÉTODO FIMATHE',
    'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5': 'ESTUDOS EM EUR/USD',
    'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV': 'FIMATHE NO OURO',
    'PLWhqc48nlRWJpjKnjSaJpq4jMRE_ukg6V': 'FIMATHE EM CRIPTOMOEDA',
    'PLWhqc48nlRWJZyYdEi3gcSIHx6cy0Hxlb': 'TRADE PARA INICIANTES',
    'PLWhqc48nlRWLqE-RBi_RTBjKit-xFWeOC': 'VLOG',
    'PLWhqc48nlRWKu17t5xqL6Sr3T6Pwn1DcL': 'COLLABS',
    'PLWhqc48nlRWIKhZTuRMMy4vtOhN_HANlw': 'MEU PORTFÓLIO NO DAYTRADE É A BOLETA',
    'PLWhqc48nlRWITJy0wfqGdXprKLkEecXIv': 'FOREX DO ZERO? COMECE AQUI',
    'PLWhqc48nlRWLfbiLKYI63BqG3uZ5lmIA_': 'JORNADA AO OURO',
    'PLWhqc48nlRWIuwZkiaLAfDfFKWWndWUxO': 'ESTUDOS EM USD/JPY',
    'PLWhqc48nlRWJpFxTUEauhNUHtn5IusjLX': 'SETUP FOREX',
    'PLWhqc48nlRWLI2vWKSAYFrQZojYgspGWk': 'PROGRAMANDO FOREX',
    'PLWhqc48nlRWKTthiyPz1AFGdgGbkX4cKw': 'Robô Fimathe 2.0',
    'PLWhqc48nlRWIXfB8VI95LOP5Mzvcyigbc': 'Mesa Proprietária Hantec',
    'PLWhqc48nlRWIe1dcRPpZ49jGq6ntXSF83': 'React do Marcelão!',
    'PLWhqc48nlRWLR2OlwR3y2BgyUvuaD2oLy': 'Negociações Automatizadas',
    'PLWhqc48nlRWKyNufKr64xPOpKmzeXvGbh': 'ESTUDOS EM EUR/JPY'
  };

  const CHANNEL_ID = 'UCwk7RuafgXHRqSmS3qO8qQQ';

  const fetchJSON = async (url) => {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  };

  const fetchAllPlaylistsFromChannel = async () => {
    const playlists = [];
    let nextPageToken = '';
    while (true) {
      const url = `${API_BASE}/playlists?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&maxResults=50&part=snippet,contentDetails&pageToken=${nextPageToken}`;
      const data = await fetchJSON(url);
      playlists.push(...(data.items || []));
      nextPageToken = data.nextPageToken || '';
      if (!nextPageToken) break;
    }
    return playlists;
  };

  const fetchPlaylistItems = async (playlistId) => {
    const url = `${API_BASE}/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=${encodeURIComponent(playlistId)}&maxResults=50&part=snippet,contentDetails`;
    const data = await fetchJSON(url);
    return (data.items || [])
      .filter(item => item.contentDetails?.videoId)
      .map(item => ({
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: item.snippet.thumbnails?.medium?.url || `https://img.youtube.com/vi/${item.contentDetails.videoId}/mqdefault.jpg`,
        publishedAt: item.contentDetails.videoPublishedAt || item.snippet.publishedAt
      }));
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
    try {
      const items = await fetchAllPlaylistsFromChannel();
      return items.map(item => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
        videoCount: item.contentDetails?.itemCount || 0
      }));
    } catch (e) {
      console.warn('Falling back to PLAYLIST_MAP:', e);
      const ids = Object.keys(PLAYLIST_MAP).join(',');
      const url = `${API_BASE}/playlists?key=${YOUTUBE_API_KEY}&id=${ids}&maxResults=${Object.keys(PLAYLIST_MAP).length}&part=snippet,contentDetails`;
      const data = await fetchJSON(url);
      return (data.items || []).map(item => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
        videoCount: item.contentDetails?.itemCount || 0
      }));
    }
  };

  const initDynamicPlaylists = async () => {
    const grid = document.querySelector(GRID_SELECTOR);
    if (!grid) return;

    let playlists = [];
    try {
      playlists = await fetchPlaylists();
    } catch (e) {
      console.warn('Falling back to static playlists:', e);
    }

    if (playlists.length > 0) {
      const staticCards = grid.querySelectorAll('.playlist-card');
      staticCards.forEach((card) => card.remove());

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
  };

  const init = () => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDynamicPlaylists);
    } else {
      initDynamicPlaylists();
    }
  };

  init();
})();
