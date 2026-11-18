/**
 * Container Parada Obrigatória — Módulo do Cardápio Interativo
 * Renderização dinâmica, filtros por abas, busca instantânea e geração de pedidos WhatsApp.
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
      this.counterEl.textContent = `${items.length} ${items.length === 1 ? 'item disponível' : 'itens disponíveis'}`;
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
      const serveBadge = item.serve ? `<span class="badge badge-serve">👥 ${item.serve}</span>` : '';
      const highlightBadge = item.destaque ? `<span class="badge badge-destaque">⭐ ${item.destaque}</span>` : '';
      
      const whatsappMsg = encodeURIComponent(
        `Olá! Estou vendo o cardápio do Container Parada Obrigatória e gostaria de pedir / saber mais sobre:\n\n👉 *${item.nome}* (R$ ${item.preco})\n\nComo está o atendimento pé na areia / mesas no momento?`
      );
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

      return `
        <article class="menu-card" data-item-id="${item.id}">
          <div class="menu-card-header">
            <div class="menu-card-badges">
              ${highlightBadge}
              ${serveBadge}
            </div>
            <div class="menu-card-price">
              <span class="currency">R$</span>
              <span class="value">${item.preco}</span>
            </div>
          </div>
          
          <div class="menu-card-body">
            <h3 class="menu-card-title">${item.nome}</h3>
            <p class="menu-card-desc">${item.descricao}</p>
          </div>

          <div class="menu-card-footer">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-card-whatsapp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              <span>Pedir no WhatsApp</span>
            </a>
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
