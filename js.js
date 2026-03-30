
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js');

  // ============================================
  // Lazy Load de APIs externas
  // ============================================
  const loadedScripts = {};

  const loadScript = (src) => {
    if (loadedScripts[src]) return loadedScripts[src];
    loadedScripts[src] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return loadedScripts[src];
  };

  const loadYouTubeAPI = () => loadScript('https://www.youtube.com/iframe_api');
  const loadVimeoAPI = () => loadScript('https://player.vimeo.com/api/player.js');

  // ============================================
  // Video Background - Fallback e Controle
  // ============================================
  const heroVideoBg = document.querySelector('.hero-video-bg');
  if (heroVideoBg) {
    heroVideoBg.addEventListener('error', () => {
      heroVideoBg.style.display = 'none';
    });
    const playVideo = () => {
      heroVideoBg.play().catch(() => {
        heroVideoBg.style.display = 'none';
      });
    };
    playVideo();
    document.addEventListener('click', () => {
      if (heroVideoBg.paused && heroVideoBg.style.display !== 'none') {
        heroVideoBg.play().catch(() => {});
      }
    }, { once: true });
  }

  // ============================================
  // EA Video Modal
  // ============================================
  const eaVideoModal = document.getElementById('ea-video-modal');
  if (eaVideoModal) {
    const eaOverlay = document.getElementById('ea-video-modal-overlay');
    const eaClose = document.getElementById('ea-video-modal-close');
    const eaPlayer = document.getElementById('ea-video-modal-player');
    const eaPlayBtn = document.querySelector('.hero-play-btn');
    const VIDEO_URL = 'https://www.youtube.com/embed/_BaLT-9zzwU?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&fs=0&disablekb=1';

    const openEaModal = () => {
      const iframe = eaPlayer.querySelector('iframe');
      if (iframe) iframe.src = VIDEO_URL;
      eaVideoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeEaModal = () => {
      const iframe = eaPlayer.querySelector('iframe');
      if (iframe) iframe.src = '';
      eaVideoModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (eaPlayBtn) eaPlayBtn.addEventListener('click', (e) => { e.stopPropagation(); openEaModal(); });
    if (eaOverlay) eaOverlay.addEventListener('click', closeEaModal);
    if (eaClose) eaClose.addEventListener('click', closeEaModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && eaVideoModal.classList.contains('active')) closeEaModal();
    });
  }

  // ============================================
  // Menu Mobile
  // ============================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('primary-navigation');

  if (mobileMenuToggle && navMenu) {
    const closeMobileMenu = () => {
      navMenu.classList.remove('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    };

    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(event.target) &&
        !mobileMenuToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  }

  // ============================================
  // Lazy loading de imagens
  // ============================================
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // ============================================
  // Filtro de Cursos e Animações
  // ============================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card-modern');
  const TRANSITION_MS = 400;

  const animateCardsIn = () => {
    if (!courseCards || courseCards.length === 0) return;
    courseCards.forEach((card, index) => {
      card.style.display = 'flex';
      setTimeout(() => {
        card.classList.add('show');
      }, index * 100);
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
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.classList.add('show');
            });
          } else {
            card.style.display = 'none';
          }
        }, TRANSITION_MS);
      });
    });
  });

  // ============================================
  // MODAL DE ARTIGOS
  // ============================================
  const modal = document.getElementById('article-modal');
  if (modal) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const articleContent = document.getElementById('article-content');

    const openArticleModal = (articleId) => {
      const template = document.getElementById(`template-${articleId}`);
      if (template && articleContent) {
        articleContent.innerHTML = '';
        const clonedContent = template.content.cloneNode(true);
        articleContent.appendChild(clonedContent);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalClose.focus();
      }
    };

    const closeArticleModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    courseCards.forEach((card) => {
      const articleId = card.getAttribute('data-article');
      if (articleId) {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          openArticleModal(articleId);
        });
        const readBtn = card.querySelector('.btn-primary');
        if (readBtn) {
          readBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openArticleModal(articleId);
          });
        }
      }
    });

    if (modalOverlay) modalOverlay.addEventListener('click', closeArticleModal);
    if (modalClose) modalClose.addEventListener('click', closeArticleModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeArticleModal();
    });
  }

  // ============================================
  // MODAL DE VÍDEOS
  // ============================================
  const videoModal = document.getElementById('video-modal');
  if (videoModal) {
    const videoModalOverlay = document.getElementById('video-modal-overlay');
    const videoModalClose = document.getElementById('video-modal-close');
    const videoPlayerContainer = document.getElementById('video-player-container');

    // Controle de qualidade YouTube
    let qualityInterval = null;

    const startQualityCheck = (player) => {
      if (qualityInterval) clearInterval(qualityInterval);
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
          if (player && player.getPlayerState && player.getPlayerState() === 1) {
            const cq = player.getPlaybackQuality();
            if (cq !== 'hd1080' && cq !== 'hd2160' && cq !== 'hd1440') tryQuality(0);
          }
        } catch (e) { /* silenciar */ }
      }, 2000);
    };

    const stopQualityCheck = () => {
      if (qualityInterval) { clearInterval(qualityInterval); qualityInterval = null; }
    };

    const openVideoModal = (videoTemplateId) => {
      const template = document.getElementById(`template-${videoTemplateId}`);
      if (!template || !videoPlayerContainer) return;

      const templateContent = template.content.cloneNode(true);
      videoPlayerContainer.innerHTML = '';
      videoPlayerContainer.appendChild(templateContent);

      const videoItems = videoPlayerContainer.querySelectorAll('.video-item');
      const videoPlayerMain = videoPlayerContainer.querySelector('.video-player-main');

      videoItems.forEach((item) => {
        item.addEventListener('click', () => {
          const videoId = item.getAttribute('data-video-id');
          const videoSource = item.getAttribute('data-video-source') || 'youtube';
          if (videoId && videoPlayerMain) {
            const sanitizeVideoId = (str) => {
              if (!str) return null;
              const sanitized = str.replace(/[<>"'&]/g, '');
              if (/^[a-zA-Z0-9_-]{11}$/.test(sanitized) || /^\d+$/.test(sanitized)) return sanitized;
              return null;
            };
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
                      new YT.Player(playerId, {
                        events: {
                          'onReady': (event) => startQualityCheck(event.target),
                          'onStateChange': (event) => {
                            if (event.data === YT.PlayerState.PLAYING) startQualityCheck(event.target);
                            if (event.data === YT.PlayerState.ENDED) stopQualityCheck();
                          }
                        }
                      });
                    } catch (e) { /* silenciar */ }
                  } else {
                    setTimeout(waitForIframe, 500);
                  }
                };
                waitForIframe();
              }).catch(() => {});
            }

            videoItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            videoPlayerContainer.scrollTop = 0;
          }
        });
      });

      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (videoModalClose) videoModalClose.focus();
    };

    const closeVideoModal = () => {
      stopQualityCheck();
      const activeIframe = videoPlayerContainer?.querySelector('iframe');
      if (activeIframe) activeIframe.src = '';
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
      if (videoPlayerContainer) videoPlayerContainer.innerHTML = '';
    };

    // Eventos em cards de curso com vídeos
    courseCards.forEach((card) => {
      const videoId = card.getAttribute('data-video');
      const btn = card.querySelector('.btn-primary');
      if (videoId && btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openVideoModal(videoId);
        });
        card.addEventListener('click', (e) => {
          e.preventDefault();
          openVideoModal(videoId);
        });
      }
    });

    // Cards de playlist
    document.querySelectorAll('.playlist-card[data-video]').forEach((card) => {
      const videoTemplateId = card.getAttribute('data-video');
      card.addEventListener('click', (e) => {
        e.preventDefault();
        if (videoTemplateId) openVideoModal(videoTemplateId);
      });
    });

    if (videoModalOverlay) videoModalOverlay.addEventListener('click', closeVideoModal);
    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) closeVideoModal();
    });
  }

  // ============================================
  // VIVER DE TRADE - Video Cover (só na página cursos)
  // ============================================
  const viverDeTradeCard = document.getElementById('viver-de-trade-card');
  if (viverDeTradeCard) {
    const viverDeTradeIframe = document.getElementById('viver-de-trade-iframe');
    const PLAY_VIDEO_ID = '835469062';
    const PLAY_VIDEO_HASH = 'b0444bdea2';
    let modalAberto = false;

    const criarModalVideo = () => {
      const modal = document.createElement('div');
      modal.id = 'viver-de-trade-modal';
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
      document.body.appendChild(modal);

      const pularBtn = document.createElement('button');
      pularBtn.innerHTML = 'Pular <i class="fas fa-forward"></i>';
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

    const fecharModal = (modal) => {
      modal.style.opacity = '0';
      setTimeout(() => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
        modalAberto = false;
      }, 300);
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
          } catch (e) { /* fallback */ }
        }, 500);
      }).catch(() => {});

      // Fallback: 5 minutos
      setTimeout(() => {
        if (modalAberto) fecharModal(modal);
      }, 300000);
    };

    // Overlay para capturar cliques
    if (!document.getElementById('viver-de-trade-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'viver-de-trade-overlay';
      overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;cursor:pointer;';
      viverDeTradeCard.style.position = 'relative';
      viverDeTradeCard.appendChild(overlay);
    }

    document.getElementById('viver-de-trade-overlay').addEventListener('click', (e) => {
      e.preventDefault();
      loadMainVideo();
    });

    // Pré-carregar Vimeo em background com Intersection Observer
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadVimeoAPI().catch(() => {});
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });
      observer.observe(viverDeTradeCard);
    }
  }

  // ============================================
  // MODAL DE CERTIFICADOS
  // ============================================
  const certificateModal = document.getElementById('certificate-modal');
  if (certificateModal) {
    const certificateModalOverlay = document.getElementById('certificate-modal-overlay');
    const certificateModalClose = document.getElementById('certificate-modal-close');
    const certificateViewer = document.getElementById('certificate-viewer');

    const certificates = {
      'laboratorio-fimathe': 'certificados/Laboratorio Fimathe.png',
      'masterclass-fimathe': 'certificados/MasterClass Fimathe.png',
      'metodo-fimathe': 'certificados/Metodo Fimathe.png',
      'scalper': 'certificados/Scalper.png',
      'formula-ouro': 'certificados/Formula do Ouro.png'
    };

    const openCertificateModal = (certId) => {
      const imgPath = certificates[certId];
      if (imgPath && certificateViewer) {
        certificateViewer.innerHTML = `<img src="${imgPath}" style="width:100%;height:auto;max-height:90vh;object-fit:contain;" alt="Certificado" />`;
        certificateModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (certificateModalClose) certificateModalClose.focus();
      }
    };

    const closeCertificateModal = () => {
      certificateModal.classList.remove('active');
      document.body.style.overflow = '';
      if (certificateViewer) certificateViewer.innerHTML = '';
    };

    document.querySelectorAll('.certificate-slide').forEach((slide) => {
      slide.addEventListener('click', () => {
        const certId = slide.getAttribute('data-certificado');
        if (certId) openCertificateModal(certId);
      });
    });

    document.querySelectorAll('.cert-card').forEach((card) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.cert-card-image');
        if (img && certificateViewer) {
          certificateViewer.innerHTML = `<img src="${img.src}" style="width:100%;height:auto;max-height:90vh;object-fit:contain;" />`;
          certificateModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    if (certificateModalOverlay) certificateModalOverlay.addEventListener('click', closeCertificateModal);
    if (certificateModalClose) certificateModalClose.addEventListener('click', closeCertificateModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certificateModal.classList.contains('active')) closeCertificateModal();
    });
  }

  // ============================================
  // CARROSSEL DE CERTIFICADOS
  // ============================================
  const carouselTrack = document.querySelector('.certificates-inner');
  if (carouselTrack) {
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    const totalSlides = indicators.length;

    const updateCarousel = (newIndex) => {
      if (newIndex < 0) newIndex = totalSlides - 1;
      else if (newIndex >= totalSlides) newIndex = 0;
      currentSlide = newIndex;
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentSlide));
    };

    if (carouselPrev) carouselPrev.addEventListener('click', () => updateCarousel(currentSlide - 1));
    if (carouselNext) carouselNext.addEventListener('click', () => updateCarousel(currentSlide + 1));
    indicators.forEach((ind, i) => ind.addEventListener('click', () => updateCarousel(i)));

    // Swipe touch
    let touchStartX = 0;
    const certificatesCarousel = document.querySelector('.certificates-carousel');
    if (certificatesCarousel) {
      certificatesCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      certificatesCarousel.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (diff < -50) updateCarousel(currentSlide + 1);
        if (diff > 50) updateCarousel(currentSlide - 1);
      }, { passive: true });
    }
  }

  // ============================================
  // Método Fimathe - Página de Módulos
  // ============================================
  const modulosSection = document.querySelector('.modulos-section');
  const videoPlayerSection = document.getElementById('video-player-section');

  if (modulosSection && videoPlayerSection) {
    const mainIframe = document.getElementById('main-video-iframe');
    const currentModuloTitle = document.getElementById('current-modulo-title');
    const moduloVideoList = document.getElementById('modulo-video-list');
    const backToModulos = document.getElementById('back-to-modulos');
    const modulosGrid = document.querySelector('.modulos-grid');
    const sectionHeader = document.querySelector('.modulos-section .section-header');

    if (backToModulos) {
      backToModulos.addEventListener('click', () => {
        videoPlayerSection.classList.add('hidden');
        if (modulosGrid) modulosGrid.style.display = 'grid';
        if (sectionHeader) sectionHeader.style.display = 'block';
        if (mainIframe) mainIframe.src = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    document.querySelectorAll('.modulo-card').forEach((card) => {
      card.addEventListener('click', () => {
        const moduloId = card.dataset.modulo;
        const videoId = card.dataset.videoId;
        if (!videoId) return;
        const title = card.querySelector('.modulo-content h3').textContent;
        openModuloPlayer(moduloId, videoId, title);
      });
    });

    function openModuloPlayer(moduloId, videoId, title) {
      if (currentModuloTitle) currentModuloTitle.textContent = title;
      if (mainIframe) {
        mainIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&modestbranding=1&showinfo=0&rel=0&controls=1&iv_load_policy=3&disablekb=1&fs=0`;
      }
      loadModuloPlaylist(moduloId);
      if (modulosGrid) modulosGrid.style.display = 'none';
      if (sectionHeader) sectionHeader.style.display = 'none';
      videoPlayerSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function loadModuloPlaylist(moduloId) {
      const videoDataContainer = document.querySelector(`#video-data [data-modulo="${moduloId}"]`);
      if (!videoDataContainer || !moduloVideoList) return;
      moduloVideoList.innerHTML = '';

      videoDataContainer.querySelectorAll('.video-item').forEach((item) => {
        const clonedItem = item.cloneNode(true);
        clonedItem.classList.remove('active');
        clonedItem.addEventListener('click', function() {
          const newVideoId = this.dataset.videoId;
          if (mainIframe) {
             mainIframe.src = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&mute=0&modestbranding=1&showinfo=0&rel=0&controls=1&iv_load_policy=3&disablekb=1&fs=0`;
          }
          document.querySelectorAll('.video-list .video-item').forEach((el) => el.classList.remove('active'));
          this.classList.add('active');
        });
        moduloVideoList.appendChild(clonedItem);
      });
    }
  }

  // ============================================
  // Touch-friendly: melhorar interação em mobile
  // ============================================
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('touch-device');

    // Prevenir zoom em double-tap para botões
    document.querySelectorAll('.btn, .filter-btn, .playlist-card, .modulo-card').forEach(el => {
      el.style.touchAction = 'manipulation';
    });
  }
});
