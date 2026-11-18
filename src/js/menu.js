/**
 * Container Parada Obrigatória — Módulo do Cardápio Interativo (V2 Design Studio)
 * Imagens gastronômicas apetitosas, filtros por abas, busca instantânea e geração de pedidos WhatsApp.
 */

const WHATSAPP_NUMBER = "5547984055872";

class MenuManager {
  constructor(menuData) {
    this.data = menuData;
    this.currentCategory = 'peixes_frutos_do_mar';
    this.searchQuery = '';
    
    this.tabsContainer = document.getElementById('menu-tabs');
    this.itemsGrid = document.getElementById('menu-items-grid');
    this.searchInput = document.getElementById('menu-search');
    this.counterEl = document.getElementById('menu-counter');
  }

  init() {
    this.renderTabs();
    this.renderItems();
    this.setupListeners();
  }

  setupListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderItems();
      });
    }
  }

  renderTabs() {
    if (!this.tabsContainer || !this.data || !this.data.categorias) return;
    
    this.tabsContainer.innerHTML = this.data.categorias.map(cat => {
      const isActive = cat.id === this.currentCategory;
      return `
        <button 
          type="button"
          role="tab"
          aria-selected="${isActive}"
          aria-controls="panel-${cat.id}"
          class="menu-tab-btn ${isActive ? 'active' : ''}"
          data-category="${cat.id}">
          <span class="tab-label">${cat.nome}</span>
        </button>
      `;
    }).join('');

    this.tabsContainer.querySelectorAll('.menu-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.dataset.category;
        this.updateActiveTabVisual();
        this.renderItems();
      });
    });
  }

  updateActiveTabVisual() {
    if (!this.tabsContainer) return;
    this.tabsContainer.querySelectorAll('.menu-tab-btn').forEach(btn => {
      const isActive = btn.dataset.category === this.currentCategory;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  getFilteredItems() {
    if (!this.data || !this.data.itens) return [];
    let items = this.data.itens;

    if (this.searchQuery) {
      items = items.filter(item => 
        item.nome.toLowerCase().includes(this.searchQuery) ||
        item.descricao.toLowerCase().includes(this.searchQuery) ||
        (item.destaque && item.destaque.toLowerCase().includes(this.searchQuery))
      );
    } else {
      items = items.filter(item => item.categoria === this.currentCategory);
    }

    return items;
  }

  renderItems() {
    if (!this.itemsGrid) return;
    
    const items = this.getFilteredItems();

    if (this.counterEl) {
      this.counterEl.textContent = `${items.length} ${items.length === 1 ? 'item selecionado' : 'itens selecionados'}`;
    }

    if (items.length === 0) {
      this.itemsGrid.innerHTML = `
        <div class="menu-empty-state">
          <p>Nenhum prato ou bebida encontrado com "${this.searchQuery}".</p>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-search">Limpar Busca</button>
        </div>
      `;
      const clearBtn = document.getElementById('btn-clear-search');
      if (clearBtn && this.searchInput) {
        clearBtn.addEventListener('click', () => {
          this.searchInput.value = '';
          this.searchQuery = '';
          this.renderItems();
        });
      }
      return;
    }

    this.itemsGrid.innerHTML = items.map(item => {
      const serveBadge = item.serve ? `<span class="card-badge badge-serve">👥 ${item.serve}</span>` : '';
      const highlightBadge = item.destaque ? `<span class="card-badge badge-destaque">⭐ ${item.destaque}</span>` : '';
      
      const whatsappMsg = encodeURIComponent(
        `Olá! Estou no site do Container Parada Obrigatória e gostaria de pedir:\n\n👉 *${item.nome}* (R$ ${item.preco})\n\nPor favor, como está o atendimento pé na areia / mesas no momento?`
      );
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

      const photoUrl = item.foto || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80';

      return `
        <article class="menu-card" data-item-id="${item.id}">
          <div class="menu-card-image-wrap">
            <img src="${photoUrl}" alt="${item.nome}" loading="lazy" class="menu-card-img" onerror="this.src='https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'">
            <div class="menu-card-overlay"></div>
            <div class="menu-card-badges-float">
              ${highlightBadge}
              ${serveBadge}
            </div>
          </div>

          <div class="menu-card-content">
            <div class="menu-card-body">
              <h3 class="menu-card-title">${item.nome}</h3>
              <p class="menu-card-desc">${item.descricao}</p>
            </div>

            <div class="menu-card-footer">
              <div class="menu-card-price-block">
                <span class="currency">R$</span>
                <span class="value">${item.preco}</span>
              </div>
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-order" aria-label="Pedir ${item.nome} no WhatsApp">
                <span>Pedir no WhatsApp</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
}

// Inicialização imediata
function startMenu() {
  if (window.__MENU_DATA__) {
    const menu = new MenuManager(window.__MENU_DATA__);
    menu.init();
    return;
  }

  // Fallback assíncrono via fetch
  const fetchUrl = window.location.pathname.includes('/src/') ? './data/menu.json' : './src/data/menu.json';
  fetch(fetchUrl)
    .then(res => res.json())
    .then(data => {
      const menu = new MenuManager(data);
      menu.init();
    })
    .catch(err => {
      console.error('Erro ao inicializar cardápio:', err);
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMenu);
} else {
  startMenu();
}
