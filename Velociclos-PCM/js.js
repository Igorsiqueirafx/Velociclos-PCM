
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
              // Atualizar o iframe com o novo vídeo
              videoPlayerMain.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
              
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
  });
