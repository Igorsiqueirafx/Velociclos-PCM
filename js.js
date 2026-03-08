
document.addEventListener('DOMContentLoaded', () => {
    // 1. ALTERNAR TEMA CLARO/ESCURO (COM LOCALSTORAGE + ACESSIBILIDADE)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const getSystemPrefersDark = () =>
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const getStoredTheme = () => localStorage.getItem('theme');

    const applyTheme = (theme) => {
      htmlElement.setAttribute('data-theme', theme);
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute(
          'aria-pressed',
          theme === 'dark' ? 'true' : 'false'
        );
      }
    };

    // Tema inicial: respeitar HTML primeiro > localStorage > sistema > light
    const getInitialTheme = () => {
      // Primeiro verifica se já existe um tema no HTML (definido no servidor ou HTML estático)
      const htmlTheme = htmlElement.getAttribute('data-theme');
      if (htmlTheme && (htmlTheme === 'light' || htmlTheme === 'dark')) {
        return htmlTheme;
      }
      // Depois verifica localStorage
      const stored = getStoredTheme();
      if (stored) return stored;
      // Depois verifica preferência do sistema
      return getSystemPrefersDark() ? 'dark' : 'light';
    };

    applyTheme(getInitialTheme());

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }

    // 2. LÓGICA DO FILTRO DE CURSOS E ANIMAÇÕES
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card-modern');
    const TRANSITION_MS = 400; // deve bater com o tempo do CSS

    // Animação inicial dos cartões
    const animateCardsIn = () => {
      courseCards.forEach((card, index) => {
        // garante que estão visíveis antes da animação
        card.style.display = 'flex';
        setTimeout(() => {
          card.classList.add('show');
        }, index * 100);
      });
    };

    animateCardsIn();

    // Clique nos botões de filtro
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');

        // Atualizar estado ativo do botão
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        // Aplicar filtro nos cartões
        courseCards.forEach((card) => {
          // remove show para animator saída
          card.classList.remove('show');

          setTimeout(() => {
            const cardCategory = card.getAttribute('data-category');

            if (filterValue === 'all' || cardCategory === filterValue) {
              card.style.display = 'flex';
              // pequeno delay para garantir que o display foi aplicado
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

    // 3. MODAL DE ARTIGOS
    const modal = document.getElementById('article-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const articleContent = document.getElementById('article-content');

    // Função para abrir o modal com conteúdo do artigo
    const openArticleModal = (articleId) => {
      const template = document.getElementById(`template-${articleId}`);
      
      if (template && articleContent) {
        articleContent.innerHTML = '';
        articleContent.appendChild(template.content.cloneNode(true));
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focar no botão de fechar para acessibilidade
        modalClose.focus();
      } else {
        console.warn(`Template '${articleId}' não encontrado.`);
        alert('Artigo não disponível no momento.');
      }
    };

    // Função para fechar o modal
    const closeArticleModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Adicionar evento de clique nos cartões de artigo
    courseCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = card.getAttribute('data-article');
        if (articleId) {
          openArticleModal(articleId);
        }
      });

      // Também permitir clique no botão "Ler Artigo"
      const readBtn = card.querySelector('.btn-primary');
      if (readBtn) {
        readBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const articleId = card.getAttribute('data-article');
          if (articleId) {
            openArticleModal(articleId);
          }
        });
      }
    });

    // Fechar modal ao clicar no overlay
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeArticleModal);
    }

    // Fechar modal ao clicar no botão de fechar
    if (modalClose) {
      modalClose.addEventListener('click', closeArticleModal);
    }

    // Fechar modal ao pressionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeArticleModal();
      }
    });

    // 4. MODAL DE VÍDEOS
    const videoModal = document.getElementById('video-modal');
    const videoModalOverlay = document.getElementById('video-modal-overlay');
    const videoModalClose = document.getElementById('video-modal-close');
    const videoPlayerContainer = document.getElementById('video-player-container');
    const videoPlaylist = document.getElementById('video-playlist');

    // Função para abrir o modal de vídeo
    const openVideoModal = (videoTemplateId) => {
      const template = document.getElementById(`template-${videoTemplateId}`);
      
      if (template && videoPlayerContainer) {
        // Clonar o conteúdo do template
        const templateContent = template.content.cloneNode(true);
        
        // Inserir o conteúdo no modal
        videoPlayerContainer.innerHTML = '';
        videoPlayerContainer.appendChild(templateContent);
        
        // Adicionar eventos aos itens da playlist
        const videoItems = videoPlayerContainer.querySelectorAll('.video-item');
        const videoPlayerMain = videoPlayerContainer.querySelector('.video-player-main');
        
        videoItems.forEach((item) => {
          item.addEventListener('click', () => {
            const videoId = item.getAttribute('data-video-id');
            if (videoId && videoPlayerMain) {
              // Sanitizar o ID do vídeo para prevenir XSS
              const sanitizeString = (str) => str.replace(/[<>"'&]/g, '');
              const safeVideoId = sanitizeString(videoId);
              
              // Atualizar o iframe com o novo vídeo
              videoPlayerMain.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${safeVideoId}?autoplay=1&rel=0" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
              
              // Atualizar item ativo
              videoItems.forEach(i => i.classList.remove('active'));
              item.classList.add('active');
              
              // Rolar para o topo
              videoPlayerContainer.scrollTop = 0;
            }
          });
        });
        
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (videoModalClose) {
          videoModalClose.focus();
        }
      } else {
        console.warn(`Template de vídeo '${videoTemplateId}' não encontrado.`);
        alert('Vídeos não disponíveis no momento.');
      }
    };

    // Função para fechar o modal de vídeo
    const closeVideoModal = () => {
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
      if (videoPlayerContainer) {
        videoPlayerContainer.innerHTML = '';
      }
    };

    // Adicionar evento de clique nos cartões de curso com vídeos
    courseCards.forEach((card) => {
      const videoId = card.getAttribute('data-video');
      const btn = card.querySelector('.btn-primary');
      
      if (videoId && btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openVideoModal(videoId);
        });
        
        // Também permitir clique no cartão
        card.addEventListener('click', (e) => {
          e.preventDefault();
          openVideoModal(videoId);
        });
      }
    });

    // 5. MODAL DE VÍDEOS DAS PLAYLISTS (Cards de playlist)
    const playlistCards = document.querySelectorAll('.playlist-card[data-video]');
    
    playlistCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const videoTemplateId = card.getAttribute('data-video');
        if (videoTemplateId) {
          openVideoModal(videoTemplateId);
        }
      });
    });

    // 6. VIVER DE TRADE - Video Cover with Modal Player
    const viverDeTradeCard = document.getElementById('viver-de-trade-card');
    const viverDeTradeIframe = document.getElementById('viver-de-trade-iframe');
    const videoContainer = document.getElementById('viver-de-trade-video');
    
    // IDs dos vídeos Vimeo
    const CAPA_VIDEO_ID = '835470455';  // Vídeo de animação (capa)
    const PLAY_VIDEO_ID = '835469062';  // Vídeo principal (ao clicar)
    const PLAY_VIDEO_HASH = '29cd158274';
    
    if (viverDeTradeCard && viverDeTradeIframe) {
      let vimeoPlayer = null;
      let playerReady = false;
      let modalAberto = false;
      
      // Criar modal para meio screen
      const criarModalVideo = () => {
        const modal = document.createElement('div');
        modal.id = 'viver-de-trade-modal';
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        `;
        
        const containerVideo = document.createElement('div');
        containerVideo.style.cssText = `
          width: 100%;
          height: 100%;
          max-width: 100vw;
          max-height: 100vh;
          background: #000;
          overflow: hidden;
        `;
        
        const iframe = document.createElement('iframe');
        // Vídeo com som e sem controles - otimizado para mobile
        iframe.src = `https://player.vimeo.com/video/${PLAY_VIDEO_ID}?h=${PLAY_VIDEO_HASH}&autoplay=1&muted=0&controls=0&background=0&dnt=1&loop=0&playsinline=1`;
        iframe.style.cssText = `
          width: 100%;
          height: 100%;
          border: none;
        `;
        iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
        iframe.allowFullscreen = false;
        iframe.setAttribute('playsinline', '');
        iframe.setAttribute('webkit-playsinline', '');
        iframe.setAttribute('allowfullscreen', 'false');
        
        containerVideo.appendChild(iframe);
        modal.appendChild(containerVideo);
        document.body.appendChild(modal);
        
        // Botão discreto para pular o vídeo - otimizado para mobile
        const pularBtn = document.createElement('button');
        pularBtn.innerHTML = 'Pular <i class="fas fa-forward"></i>';
        pularBtn.style.cssText = `
          position: absolute;
          bottom: 40px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 14px 24px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          opacity: 0.6;
          transition: opacity 0.3s ease, transform 0.2s ease;
          z-index: 10000;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          min-height: 48px;
          min-width: 100px;
        `;
        pularBtn.onmouseover = () => pularBtn.style.opacity = '1';
        pularBtn.onmouseout = () => pularBtn.style.opacity = '0.6';
        
        // Eventos para touch em dispositivos móveis
        pularBtn.ontouchstart = (e) => {
          e.preventDefault();
          pularBtn.style.transform = 'scale(0.95)';
          pularBtn.style.opacity = '1';
        };
        pularBtn.ontouchend = (e) => {
          e.preventDefault();
          pularBtn.style.transform = 'scale(1)';
        };
        
        pularBtn.onclick = () => {
          console.log('Pular vídeo clicked');
          fecharModal(modal, iframe);
          openVideoModal('viver-de-trade');
        };
        modal.appendChild(pularBtn);
        
        // Animação de entrada
        requestAnimationFrame(() => {
          modal.style.opacity = '1';
        });
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            fecharModal(modal, iframe);
          }
        });
        
        return { modal, iframe };
      };
      
      const fecharModal = (modal, iframe) => {
        modal.style.opacity = '0';
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
          modalAberto = false;
        }, 300);
      };
      
      // Função para carregar o vídeo principal no modal
      const loadMainVideo = () => {
        console.log('Carregando vídeo principal no modal...');
        
        if (modalAberto) return;
        modalAberto = true;
        
        const { modal, iframe } = criarModalVideo();
        
        // Tentar usar a API para detectar fim do vídeo
        if (typeof Vimeo !== 'undefined') {
          // Espera o iframe carregar
          setTimeout(() => {
            try {
              vimeoPlayer = new Vimeo.Player(iframe, {
                id: parseInt(PLAY_VIDEO_ID),
                h: PLAY_VIDEO_HASH,
                autoplay: true,
                muted: false,
                controls: false,
                background: false
              });
              
              vimeoPlayer.on('ended', () => {
                console.log('Vídeo terminou!');
                fecharModal(modal, iframe);
                // Abrir o modal com as aulas do projeto Viver de Trade
                openVideoModal('viver-de-trade');
              });
              
              // Fallback: verificar a cada 2 segundos se o vídeo terminou
              const checkEnded = setInterval(() => {
                vimeoPlayer.getEnded().then((ended) => {
                  if (ended) {
                    clearInterval(checkEnded);
                    console.log('Vídeo terminou (polling)!');
                    fecharModal(modal, iframe);
                    openVideoModal('viver-de-trade');
                  }
                }).catch(() => {});
              }, 2000);
              
            } catch (e) {
              console.error('Erro ao criar player Vimeo:', e);
            }
          }, 500);
        } else {
          // Fallback: detectar fim via URL do Vimeo
          console.warn('API Vimeo não disponível, usando fallback');
          
          // Configurar redirect após 5 minutos como fallback
          setTimeout(() => {
            if (modalAberto) {
              fecharModal(modal, iframe);
              openVideoModal('viver-de-trade');
            }
          }, 300000); // 5 minutos
        }
      };
      
      // Evento de clique no card
      viverDeTradeCard.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Viver de Trade card clicado!');
        loadMainVideo();
      });
      
      // Precarregar a API Vimeo em background
      const vimeoScript = document.createElement('script');
      vimeoScript.src = 'https://player.vimeo.com/api/player.js';
      vimeoScript.onerror = function() {
        console.error('Falha ao carregar API Vimeo');
      };
      vimeoScript.onload = function() {
        console.log('API Vimeo carregada');
        playerReady = true;
      };
      document.head.appendChild(vimeoScript);
    }

    // Fechar modal de vídeo ao clicar no overlay
    if (videoModalOverlay) {
      videoModalOverlay.addEventListener('click', closeVideoModal);
    }

    // Fechar modal de vídeo ao clicar no botão de fechar
    if (videoModalClose) {
      videoModalClose.addEventListener('click', closeVideoModal);
    }

    // Fechar modal de vídeo ao pressionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
      }
    });

    // 5. MODAL DE CERTIFICADOS
    const certificateModal = document.getElementById('certificate-modal');
    const certificateModalOverlay = document.getElementById('certificate-modal-overlay');
    const certificateModalClose = document.getElementById('certificate-modal-close');
    const certificateViewer = document.getElementById('certificate-viewer');

    // Mapeamento de certificados para imagens PNG (pasta local)
    const certificates = {
      'laboratorio-fimathe': 'certificados/Laboratorio Fimathe.png',
      'masterclass-fimathe': 'certificados/MasterClass Fimathe.png',
      'metodo-fimathe': 'certificados/Metodo Fimathe.png',
      'scalper': 'certificados/Scalper.png',
      'formula-ouro': 'certificados/Formula do Ouro.png'
    };

    // Função para abrir o modal de certificado
    const openCertificateModal = (certId) => {
      const imgPath = certificates[certId];
      
      if (imgPath && certificateViewer) {
        // Exibir a imagem PNG no modal
        certificateViewer.innerHTML = `<img src="${imgPath}" style="width:100%;height:auto;max-height:90vh;object-fit:contain;" alt="Certificado" />`;
        
        certificateModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (certificateModalClose) {
          certificateModalClose.focus();
        }
      } else {
        console.warn(`Certificado '${certId}' não encontrado.`);
        alert('Certificado não disponível no momento.');
      }
    };

    // Função para fechar o modal de certificado
    const closeCertificateModal = () => {
      certificateModal.classList.remove('active');
      document.body.style.overflow = '';
      if (certificateViewer) {
        certificateViewer.innerHTML = '';
      }
    };

    // Adicionar evento de clique nos slides do carrossel de certificados
    const certificateSlides = document.querySelectorAll('.certificate-slide');
    certificateSlides.forEach((slide) => {
      slide.addEventListener('click', () => {
        const certId = slide.getAttribute('data-certificado');
        if (certId) {
          openCertificateModal(certId);
        }
      });
    });

    // Também adicionar eventos aos cartões de certificado na página certificados.html
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach((card) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.cert-card-image');
        if (img) {
          const src = img.getAttribute('src');
          if (src && certificateViewer) {
            certificateViewer.innerHTML = `<img src="${src}" style="width:100%;height:auto;max-height:90vh;object-fit:contain;" />`;
            certificateModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        }
      });
    });

    // Fechar modal de certificado ao clicar no overlay
    if (certificateModalOverlay) {
      certificateModalOverlay.addEventListener('click', closeCertificateModal);
    }

    // Fechar modal de certificado ao clicar no botão de fechar
    if (certificateModalClose) {
      certificateModalClose.addEventListener('click', closeCertificateModal);
    }

    // Fechar modal de certificado ao pressionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certificateModal.classList.contains('active')) {
        closeCertificateModal();
      }
    });

    // 6. CARROSSEL DE CERTIFICADOS
    const carouselTrack = document.querySelector('.certificates-inner');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    const totalSlides = indicators.length;
    
    const updateCarousel = (newIndex) => {
      if (newIndex < 0) {
        newIndex = totalSlides - 1;
      } else if (newIndex >= totalSlides) {
        newIndex = 0;
      }
      
      currentSlide = newIndex;
      
      if (carouselTrack) {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      }
      
      indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === currentSlide);
      });
    };
    
    if (carouselPrev) {
      carouselPrev.addEventListener('click', () => updateCarousel(currentSlide - 1));
    }
    
    if (carouselNext) {
      carouselNext.addEventListener('click', () => updateCarousel(currentSlide + 1));
    }
    
    indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => updateCarousel(i));
    });
    
    // Suporte a swipe em dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;
    
    const certificatesCarousel = document.querySelector('.certificates-carousel');
    if (certificatesCarousel) {
      certificatesCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });
      
      certificatesCarousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });
      
      const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
          updateCarousel(currentSlide + 1); // swipe left - next
        }
        if (touchEndX > touchStartX + swipeThreshold) {
          updateCarousel(currentSlide - 1); // swipe right - prev
        }
      };
    }
  });
