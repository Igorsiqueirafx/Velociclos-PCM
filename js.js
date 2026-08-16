// @ts-check

/**
 * Velociclos PCM - Main JavaScript
 * @description Core interactions: modals, mobile menu, video players, lazy loading, carousels
 */

(() => {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    YOUTUBE_API: 'https://www.youtube.com/iframe_api?key=AIzaSyCciJjxi6ULJH2X0L4G4g3wdbYkI_H-kv0',
    VIMEO_API: 'https://player.vimeo.com/api/player.js',
    TRANSITION_MS: 400,
    DESKTOP_BREAKPOINT: 768,
    TOUCH_DELAY: 100,
    CAROUSEL_SWIPE_THRESHOLD: 50,
    QUALITY_CHECK_INTERVAL: 2000,
    VIMEO_FALLBACK_MS: 300000,
    RESIZE_DEBOUNCE_MS: 150
  };

  const VIDEO_URLS = {
    EA_DEMO: 'https://www.youtube.com/embed/_BaLT-9zzwU?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&fs=0&disablekb=1',
    VIVER_DE_TRADE: {
      id: '835469062',
      hash: 'b0444bdea2'
    }
  };

  const CERTIFICATES = {
    'laboratorio-fimathe': 'certificados/Laboratorio Fimathe.png',
    'masterclass-fimathe': 'certificados/MasterClass Fimathe.png',
    'metodo-fimathe': 'certificados/Metodo Fimathe.png',
    'scalper': 'certificados/Scalper.png',
    'formula-ouro': 'certificados/Formula do Ouro.png'
  };

  // ============================================
  // UTILITIES
  // ============================================
  const loadedScripts = {};

  const loadScript = (src) => {
    if (loadedScripts[src]) return loadedScripts[src];
    loadedScripts[src] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return loadedScripts[src];
  };

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const sanitizeVideoId = (str) => {
    if (!str) return null;
    const sanitized = str.replace(/[<>"'&]/g, '');
    if (/^[a-zA-Z0-9_-]{11}$/.test(sanitized) || /^\d+$/.test(sanitized)) return sanitized;
    return null;
  };

  // ============================================
  // LAZY LOADING
  // ============================================
  const initLazyLoading = () => {
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  };

  // ============================================
  // MOBILE MENU
  // ============================================
  const initMobileMenu = () => {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('primary-navigation');
    if (!toggle || !nav) return;

    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
      if (nav.classList.contains('open') &&
          !nav.contains(event.target) &&
          !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    const debouncedResize = debounce(() => {
      if (window.innerWidth >= CONFIG.DESKTOP_BREAKPOINT) closeMenu();
    }, CONFIG.RESIZE_DEBOUNCE_MS);

    window.addEventListener('resize', debouncedResize);
  };

  // ============================================
  // EXTERNAL APIs
  // ============================================
  const loadYouTubeAPI = () => loadScript(CONFIG.YOUTUBE_API);
  const loadVimeoAPI = () => loadScript(CONFIG.VIMEO_API);

  // ============================================
  // VIDEO BACKGROUND
  // ============================================
  const initVideoBackground = () => {
    const heroVideoBg = document.querySelector('.hero-video-bg');
    if (!heroVideoBg) return;

    const hideVideo = () => {
      heroVideoBg.style.display = 'none';
    };

    heroVideoBg.addEventListener('error', hideVideo);

    const playVideo = () => {
      heroVideoBg.play().catch(hideVideo);
    };

    playVideo();

    document.addEventListener('click', () => {
      if (heroVideoBg.paused && heroVideoBg.style.display !== 'none') {
        heroVideoBg.play().catch(() => {});
      }
    }, { once: true });
  };

  // ============================================
  // MODALS - Base
  // ============================================
  const createModalController = ({ overlayId, closeId, onClose }) => {
    const overlay = document.getElementById(overlayId);
    const closeBtn = document.getElementById(closeId);
    if (!overlay) return null;

    const close = () => {
      if (onClose) onClose();
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (overlay) overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        close();
      }
    });

    return { close };
  };

  // ============================================
  // EA VIDEO MODAL
  // ============================================
  const initEaVideoModal = () => {
    const modal = document.getElementById('ea-video-modal');
    if (!modal) return;

    const overlay = document.getElementById('ea-video-modal-overlay');
    const closeBtn = document.getElementById('ea-video-modal-close');
    const player = document.getElementById('ea-video-modal-player');
    const playBtn = document.querySelector('.hero-play-btn');

    const open = () => {
      const iframe = player?.querySelector('iframe');
      if (iframe) iframe.src = VIDEO_URLS.EA_DEMO;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      const iframe = player?.querySelector('iframe');
      if (iframe) iframe.src = '';
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    playBtn?.addEventListener('click', (e) => { e.stopPropagation(); open(); });
    overlay?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
  };

  // ============================================
  // ARTICLE MODAL
  // ============================================
  const initArticleModal = () => {
    const modal = document.getElementById('article-modal');
    if (!modal) return;

    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    const content = document.getElementById('article-content');

    const open = (articleId) => {
      const template = document.getElementById(`template-${articleId}`);
      if (!template || !content) return;

      content.innerHTML = '';
      content.appendChild(template.content.cloneNode(true));
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
    };

    const close = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.course-card-modern').forEach((card) => {
      const articleId = card.getAttribute('data-article');
      if (!articleId) return;

      const handler = (e) => {
        e.preventDefault();
        open(articleId);
      };

      card.addEventListener('click', handler);
      const btn = card.querySelector('.btn-primary');
      btn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        open(articleId);
      });
    });

    overlay?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
  };

  // ============================================
  // VIDEO MODAL (YouTube/Vimeo)
  // ============================================
  const initVideoModal = () => {
    const modal = document.getElementById('video-modal');
    if (!modal) return;

    const overlay = document.getElementById('video-modal-overlay');
    const closeBtn = document.getElementById('video-modal-close');
    const playerContainer = document.getElementById('video-player-container');

    let qualityInterval = null;

    const stopQualityCheck = () => {
      if (qualityInterval) {
        clearInterval(qualityInterval);
        qualityInterval = null;
      }
    };

    const startQualityCheck = (player) => {
      stopQualityCheck();
      const qualities = ['hd2160', 'hd1440', 'hd1080', 'hd720'];

      const tryQuality = (index) => {
        if (index >= qualities.length) return;
        try {
          const q = qualities[index];
          if (typeof player.setPlaybackQualityRange === 'function') player.setPlaybackQualityRange(q, q);
          if (typeof player.setPlaybackQuality === 'function') player.setPlaybackQuality(q);
        } catch (e) {
          tryQuality(index + 1);
        }
      };

      tryQuality(0);

      qualityInterval = setInterval(() => {
        try {
          if (player?.getPlayerState?.() === 1) {
            const currentQuality = player.getPlaybackQuality();
            if (!['hd1080', 'hd2160', 'hd1440'].includes(currentQuality)) {
              tryQuality(0);
            }
          }
        } catch (e) {
          // Silently ignore
        }
      }, CONFIG.QUALITY_CHECK_INTERVAL);
    };

    const open = (videoTemplateId) => {
      const template = document.getElementById(`template-${videoTemplateId}`);
      if (!template || !playerContainer) return;

      const templateContent = template.content.cloneNode(true);
      playerContainer.innerHTML = '';
      playerContainer.appendChild(templateContent);

      const videoItems = playerContainer.querySelectorAll('.video-item');
      const videoPlayerMain = playerContainer.querySelector('.video-player-main');

      videoItems.forEach((item) => {
        item.addEventListener('click', () => {
          const videoId = item.getAttribute('data-video-id');
          const videoSource = item.getAttribute('data-video-source') || 'youtube';
          if (!videoId || !videoPlayerMain) return;

          const safeVideoId = sanitizeVideoId(videoId);
          if (!safeVideoId) return;

          let videoUrl = '';
          if (videoSource === 'vimeo') {
            videoUrl = `https://player.vimeo.com/video/${safeVideoId}?autoplay=1&rel=0`;
          } else {
            videoUrl = `https://www.youtube.com/embed/${safeVideoId}?autoplay=1&mute=0&rel=0&enablejsapi=1&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&fs=0&disablekb=1`;
          }

          videoPlayerMain.innerHTML = `<iframe id="youtube-player-${safeVideoId}" width="100%" height="100%" src="${videoUrl}" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

          if (videoSource !== 'vimeo') {
            const playerId = `youtube-player-${safeVideoId}`;
            loadYouTubeAPI().then(() => {
              const waitForIframe = () => {
                const iframe = document.getElementById(playerId);
                if (iframe) {
                  try {
                    const ytPlayer = new YT.Player(playerId, {
                      events: {
                        onReady: (event) => startQualityCheck(event.target),
                        onStateChange: (event) => {
                          if (event.data === YT.PlayerState.PLAYING) startQualityCheck(event.target);
                          if (event.data === YT.PlayerState.ENDED) stopQualityCheck();
                        }
                      }
                    });
                  } catch (e) {
                    // Silently ignore
                  }
                } else {
                  setTimeout(waitForIframe, 500);
                }
              };
              waitForIframe();
            }).catch(() => {});
          }

          videoItems.forEach((i) => i.classList.remove('active'));
          item.classList.add('active');
          playerContainer.scrollTop = 0;
        });
      });

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
    };

    const close = () => {
      stopQualityCheck();
      const activeIframe = playerContainer?.querySelector('iframe');
      if (activeIframe) activeIframe.src = '';
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (playerContainer) playerContainer.innerHTML = '';
    };

    document.querySelectorAll('.course-card-modern[data-video], .playlist-card[data-video]').forEach((card) => {
      const videoTemplateId = card.getAttribute('data-video');
      if (!videoTemplateId) return;

      const openHandler = (e) => {
        e.preventDefault();
        open(videoTemplateId);
      };

      card.addEventListener('click', openHandler);
      const btn = card.querySelector('.btn-primary');
      btn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        open(videoTemplateId);
      });
    });

    overlay?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
  };

  // ============================================
  // VIVER DE TRADE VIDEO COVER
  // ============================================
  const initViverDeTrade = () => {
    const card = document.getElementById('viver-de-trade-card');
    if (!card) return;

    const PLAY_VIDEO_ID = VIDEO_URLS.VIVER_DE_TRADE.id;
    const PLAY_VIDEO_HASH = VIDEO_URLS.VIVER_DE_TRADE.hash;
    let modalAberto = false;

    const fecharModal = (modal) => {
      modal.style.opacity = '0';
      setTimeout(() => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
        modalAberto = false;
      }, 300);
    };

    const criarModalVideo = () => {
      const modal = document.createElement('div');
      modal.id = 'viver-de-trade-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'VÃ­deo Viver de Trade');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s ease;';

      const containerVideo = document.createElement('div');
      containerVideo.style.cssText = 'width:100%;height:100%;max-width:100vw;max-height:100vh;background:#000;overflow:hidden;';

      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${PLAY_VIDEO_ID}?h=${PLAY_VIDEO_HASH}&autoplay=1&muted=0&controls=0&background=0&dnt=1&loop=0&playsinline=1`;
      iframe.style.cssText = 'width:100%;height:100%;border:none;';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
      iframe.setAttribute('playsinline', '');
      iframe.setAttribute('webkit-playsinline', '');

      containerVideo.appendChild(iframe);
      modal.appendChild(containerVideo);

      const pularBtn = document.createElement('button');
      pularBtn.innerHTML = 'Pular <i class="fas fa-forward"></i>';
      pularBtn.setAttribute('aria-label', 'Pular vÃ­deo');
      pularBtn.style.cssText = 'position:absolute;bottom:40px;right:20px;background:rgba(0,0,0,0.7);color:#fff;border:1px solid rgba(255,255,255,0.3);padding:14px 24px;border-radius:30px;cursor:pointer;font-size:15px;font-weight:600;opacity:0.6;transition:opacity 0.3s ease;z-index:10000;-webkit-tap-highlight-color:transparent;touch-action:manipulation;min-height:48px;min-width:100px;';
      pularBtn.onmouseover = () => pularBtn.style.opacity = '1';
      pularBtn.onmouseout = () => pularBtn.style.opacity = '0.6';

      pularBtn.onclick = () => {
        fecharModal(modal);
        const videoModal = document.getElementById('video-modal');
        if (videoModal) {
          const videoModalOverlay = document.getElementById('video-modal-overlay');
          const videoModalClose = document.getElementById('video-modal-close');
          const videoPlayerContainer = document.getElementById('video-player-container');
          const template = document.getElementById('template-viver-de-trade');
          if (template && videoPlayerContainer) {
            videoPlayerContainer.innerHTML = '';
            videoPlayerContainer.appendChild(template.content.cloneNode(true));
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        }
      };
      modal.appendChild(pularBtn);

      requestAnimationFrame(() => { modal.style.opacity = '1'; });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal(modal);
      });

      return { modal, iframe };
    };

    const loadMainVideo = () => {
      if (modalAberto) return;
      modalAberto = true;
      const { modal } = criarModalVideo();

      loadVimeoAPI().then(() => {
        setTimeout(() => {
          try {
            const iframe = modal.querySelector('iframe');
            const vimeoPlayer = new Vimeo.Player(iframe);
            vimeoPlayer.on('ended', () => fecharModal(modal));
          } catch (e) {
            // fallback
          }
        }, 500);
      }).catch(() => {});

      setTimeout(() => {
        if (modalAberto) fecharModal(modal);
      }, CONFIG.VIMEO_FALLBACK_MS);
    };

    if (!document.getElementById('viver-de-trade-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'viver-de-trade-overlay';
      overlay.setAttribute('role', 'button');
      overlay.setAttribute('aria-label', 'Reproduzir vÃ­deo Viver de Trade');
      overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;cursor:pointer;';
      card.style.position = 'relative';
      card.appendChild(overlay);
    }

    document.getElementById('viver-de-trade-overlay').addEventListener('click', (e) => {
      e.preventDefault();
      loadMainVideo();
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadVimeoAPI().catch(() => {});
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });
      observer.observe(card);
    }
  };

  // ============================================
  // CERTIFICATE MODAL
  // ============================================
  const initCertificateModal = () => {
    const modal = document.getElementById('certificate-modal');
    if (!modal) return;

    const overlay = document.getElementById('certificate-modal-overlay');
    const closeBtn = document.getElementById('certificate-modal-close');
    const viewer = document.getElementById('certificate-viewer');

    const open = (imgPath) => {
      if (!viewer) return;
      viewer.innerHTML = `<img src="${imgPath}" style="width:100%;height:auto;max-height:90vh;object-fit:contain;" alt="Certificado" />`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
    };

    const close = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (viewer) viewer.innerHTML = '';
    };

    document.querySelectorAll('.certificate-slide').forEach((slide) => {
      slide.addEventListener('click', () => {
        const certId = slide.getAttribute('data-certificado');
        if (certId && CERTIFICATES[certId]) {
          open(CERTIFICATES[certId]);
        }
      });
    });

    document.querySelectorAll('.cert-card').forEach((card) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.cert-card-image');
        if (img && viewer) {
          viewer.innerHTML = `<img src="${img.src}" style="width:100%;height:auto;max-height:90vh;object-fit:contain;" alt="Certificado" />`;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    overlay?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
  };

  // ============================================
  // CERTIFICATES CAROUSEL
  // ============================================
  const initCertificatesCarousel = () => {
    const track = document.querySelector('.certificates-inner');
    if (!track) return;

    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    const carousel = document.querySelector('.certificates-carousel');

    if (!indicators.length) return;

    let currentSlide = 0;
    const totalSlides = indicators.length;

    const updateCarousel = (newIndex) => {
      if (newIndex < 0) newIndex = totalSlides - 1;
      else if (newIndex >= totalSlides) newIndex = 0;
      currentSlide = newIndex;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentSlide));
    };

    prevBtn?.addEventListener('click', () => updateCarousel(currentSlide - 1));
    nextBtn?.addEventListener('click', () => updateCarousel(currentSlide + 1));
    indicators.forEach((ind, i) => ind.addEventListener('click', () => updateCarousel(i)));

    let touchStartX = 0;
    carousel?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel?.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (diff < -CONFIG.CAROUSEL_SWIPE_THRESHOLD) updateCarousel(currentSlide + 1);
      if (diff > CONFIG.CAROUSEL_SWIPE_THRESHOLD) updateCarousel(currentSlide - 1);
    }, { passive: true });
  };

  // ============================================
  // MÃ‰TODO FIMATHE - MÃ³dulos
  // ============================================
  const initMetodoFimathe = () => {
    const modulosSection = document.querySelector('.modulos-section');
    const videoPlayerSection = document.getElementById('video-player-section');

    if (!modulosSection || !videoPlayerSection) return;

    const mainIframe = document.getElementById('main-video-iframe');
    const currentModuloTitle = document.getElementById('current-modulo-title');
    const moduloVideoList = document.getElementById('modulo-video-list');
    const backToModulos = document.getElementById('back-to-modulos');
    const modulosGrid = document.querySelector('.modulos-grid');
    const sectionHeader = modulosSection.querySelector('.section-header');

    const getYouTubeEmbedUrl = (videoId) =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&modestbranding=1&showinfo=0&rel=0&controls=1&iv_load_policy=3&disablekb=1&fs=0`;

    const openModuloPlayer = (moduloId, videoId, title) => {
      if (currentModuloTitle) currentModuloTitle.textContent = title;
      if (mainIframe) mainIframe.src = getYouTubeEmbedUrl(videoId);
      loadModuloPlaylist(moduloId);
      if (modulosGrid) modulosGrid.style.display = 'none';
      if (sectionHeader) sectionHeader.style.display = 'none';
      videoPlayerSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const loadModuloPlaylist = (moduloId) => {
      const videoDataContainer = document.querySelector(`#video-data [data-modulo="${moduloId}"]`);
      if (!videoDataContainer || !moduloVideoList) return;
      moduloVideoList.innerHTML = '';

      videoDataContainer.querySelectorAll('.video-item').forEach((item) => {
        const clonedItem = item.cloneNode(true);
        clonedItem.classList.remove('active');
        clonedItem.addEventListener('click', function () {
          const newVideoId = this.dataset.videoId;
          if (mainIframe) {
            mainIframe.src = getYouTubeEmbedUrl(newVideoId);
          }
          moduloVideoList.querySelectorAll('.video-item').forEach((el) => el.classList.remove('active'));
          this.classList.add('active');
        });
        moduloVideoList.appendChild(clonedItem);
      });
    };

    backToModulos?.addEventListener('click', () => {
      videoPlayerSection.classList.add('hidden');
      if (modulosGrid) modulosGrid.style.display = 'grid';
      if (sectionHeader) sectionHeader.style.display = 'block';
      if (mainIframe) mainIframe.src = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('.modulo-card').forEach((card) => {
      card.addEventListener('click', () => {
        const moduloId = card.dataset.modulo;
        const videoId = card.dataset.videoId;
        if (!videoId) return;
        const title = card.querySelector('.modulo-content h3')?.textContent || '';
        openModuloPlayer(moduloId, videoId, title);
      });
    });
  };

  // ============================================
  // COURSE FILTERS & ANIMATIONS
  // ============================================
  const initCourseFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card-modern');

    if (!filterButtons.length || !courseCards.length) return;

    const animateCardsIn = () => {
      courseCards.forEach((card, index) => {
        card.style.display = 'flex';
        setTimeout(() => card.classList.add('show'), index * CONFIG.TOUCH_DELAY);
      });
    };

    animateCardsIn();

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        courseCards.forEach((card) => {
          card.classList.remove('show');
          setTimeout(() => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || cardCategory === filterValue;
            card.style.display = shouldShow ? 'flex' : 'none';
            if (shouldShow) {
              requestAnimationFrame(() => card.classList.add('show'));
            }
          }, CONFIG.TRANSITION_MS);
        });
      });
    });
  };

  // ============================================
  // TOUCH DEVICE
  // ============================================
  const initTouchDevice = () => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    document.documentElement.classList.add('touch-device');
    document.querySelectorAll('.btn, .filter-btn, .playlist-card, .modulo-card').forEach((el) => {
      el.style.touchAction = 'manipulation';
    });
  };

  // ============================================
  // INIT
  // ============================================
  const init = () => {
    document.documentElement.classList.add('js');
    initLazyLoading();
    initMobileMenu();
    initVideoBackground();
    initEaVideoModal();
    initArticleModal();
    initVideoModal();
    initViverDeTrade();
    initCertificateModal();
    initCertificatesCarousel();
    initMetodoFimathe();
    initCourseFilters();
    initTouchDevice();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

