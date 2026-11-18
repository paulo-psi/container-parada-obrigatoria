/**
 * Container Parada Obrigatória — Módulo de Experiência e Comanda Digital de Praia (V3 World-Class)
 * Inclui:
 * 1. Comanda Digital Flutuante (Carrinho de Praia) com cálculo de 10% e envio consolidado ao WhatsApp
 * 2. Filtros Duplos: Por Categoria Oficial e por Ocasião/Momento de Consumo
 * 3. Busca em Tempo Real e Feedback Tátil (Toast Notifications)
 * 4. PWA Service Worker Registration
 */

const WHATSAPP_NUMBER = "5547984055872";

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.includeServiceTax = true;
    this.locationType = 'areia'; // 'areia' ou 'deck'
    this.locationRef = '';
    this.notes = '';

    this.fabBtn = document.getElementById('cart-fab');
    this.drawer = document.getElementById('cart-drawer');
    this.overlay = document.getElementById('cart-overlay');
    this.itemsList = document.getElementById('cart-items-list');
    this.subtotalEl = document.getElementById('cart-subtotal');
    this.taxEl = document.getElementById('cart-tax');
    this.totalEl = document.getElementById('cart-total');
    this.badgeEl = document.getElementById('cart-badge');
    this.serviceCheck = document.getElementById('cart-service-check');
    this.sendBtn = document.getElementById('btn-send-whatsapp-order');
    this.closeBtn = document.getElementById('btn-close-cart');
    this.emptyState = document.getElementById('cart-empty-state');
    this.footerBlock = document.getElementById('cart-footer-block');

    this.bindEvents();
    this.updateUI();
  }

  loadCart() {
    try {
      const saved = sessionStorage.getItem('container_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveCart() {
    try {
      sessionStorage.setItem('container_cart', JSON.stringify(this.items));
    } catch (e) {
      console.warn(e);
    }
  }

  bindEvents() {
    if (this.fabBtn) {
      this.fabBtn.addEventListener('click', () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
    if (this.serviceCheck) {
      this.serviceCheck.addEventListener('change', (e) => {
        this.includeServiceTax = e.target.checked;
        this.updateUI();
      });
    }

    // Localização (Areia vs Deck)
    document.querySelectorAll('input[name="cart-location-type"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.locationType = e.target.value;
        const refInput = document.getElementById('cart-location-ref');
        if (refInput) {
          refInput.placeholder = this.locationType === 'areia' 
            ? 'Ex: Guarda-sol azul perto da árvore' 
            : 'Ex: Mesa 04 no deck de madeira';
        }
      });
    });

    const refInput = document.getElementById('cart-location-ref');
    if (refInput) {
      refInput.addEventListener('input', (e) => {
        this.locationRef = e.target.value;
      });
    }

    const notesInput = document.getElementById('cart-notes');
    if (notesInput) {
      notesInput.addEventListener('input', (e) => {
        this.notes = e.target.value;
      });
    }

    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.sendToWhatsApp());
    }
  }

  open() {
    if (this.drawer) this.drawer.classList.add('open');
    if (this.overlay) this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.drawer) this.drawer.classList.remove('open');
    if (this.overlay) this.overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  addItem(item) {
    const existing = this.items.find(i => i.id === item.id);
    const precoNum = parseFloat(item.preco.replace('.', '').replace(',', '.'));

    if (existing) {
      existing.qtd += 1;
    } else {
      this.items.push({
        id: item.id,
        nome: item.nome,
        precoStr: item.preco,
        precoNum: precoNum,
        qtd: 1
      });
    }

    this.saveCart();
    this.updateUI();
    this.showToast(`+1 ${item.nome} na comanda! 🛒`);
  }

  updateQty(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    item.qtd += delta;
    if (item.qtd <= 0) {
      this.items = this.items.filter(i => i.id !== id);
    }

    this.saveCart();
    this.updateUI();
  }

  calculateTotals() {
    const subtotal = this.items.reduce((acc, item) => acc + (item.precoNum * item.qtd), 0);
    const tax = this.includeServiceTax ? subtotal * 0.10 : 0;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }

  formatMoeda(val) {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  updateUI() {
    const totalCount = this.items.reduce((acc, i) => acc + i.qtd, 0);
    
    // Atualizar badge do botão flutuante
    if (this.badgeEl) {
      this.badgeEl.textContent = totalCount;
      this.badgeEl.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }

    if (this.fabBtn) {
      this.fabBtn.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }

    // Renderizar itens no drawer
    if (this.items.length === 0) {
      if (this.emptyState) this.emptyState.style.display = 'block';
      if (this.itemsList) this.itemsList.innerHTML = '';
      if (this.footerBlock) this.footerBlock.style.display = 'none';
      return;
    }

    if (this.emptyState) this.emptyState.style.display = 'none';
    if (this.footerBlock) this.footerBlock.style.display = 'block';

    const { subtotal, tax, total } = this.calculateTotals();

    if (this.subtotalEl) this.subtotalEl.textContent = `R$ ${this.formatMoeda(subtotal)}`;
    if (this.taxEl) this.taxEl.textContent = `R$ ${this.formatMoeda(tax)}`;
    if (this.totalEl) this.totalEl.textContent = `R$ ${this.formatMoeda(total)}`;

    if (this.itemsList) {
      this.itemsList.innerHTML = this.items.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.nome}</h4>
            <div class="cart-item-price">R$ ${item.precoStr} cada</div>
          </div>
          <div class="cart-item-actions">
            <div class="cart-qty-ctrl">
              <button type="button" class="btn-qty-minus" aria-label="Diminuir">–</button>
              <span class="cart-qty-val">${item.qtd}</span>
              <button type="button" class="btn-qty-plus" aria-label="Aumentar">+</button>
            </div>
            <div class="cart-item-total">
              R$ ${this.formatMoeda(item.precoNum * item.qtd)}
            </div>
          </div>
        </div>
      `).join('');

      // Eventos de clique nas quantidades
      this.itemsList.querySelectorAll('.cart-item-row').forEach(row => {
        const id = row.dataset.id;
        row.querySelector('.btn-qty-minus').addEventListener('click', () => this.updateQty(id, -1));
        row.querySelector('.btn-qty-plus').addEventListener('click', () => this.updateQty(id, 1));
      });
    }
  }

  showToast(msg) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.className = 'cart-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  sendToWhatsApp() {
    if (this.items.length === 0) return;

    const { subtotal, tax, total } = this.calculateTotals();
    const locNome = this.locationType === 'areia' ? '🏖️ Cadeira / Guarda-sol na Areia' : '🪵 Mesa no Deck de Madeira';
    const locDetalhe = this.locationRef.trim() ? ` (${this.locationRef.trim()})` : '';

    let text = `🌊 *NOVA COMANDA — CONTÂINER PARADA OBRIGATÓRIA*\n`;
    text += `📍 *Local:* ${locNome}${locDetalhe}\n\n`;
    text += `📋 *Itens do Pedido:*\n`;

    this.items.forEach(item => {
      text += `• ${item.qtd}x ${item.nome} — R$ ${this.formatMoeda(item.precoNum * item.qtd)}\n`;
    });

    if (this.notes.trim()) {
      text += `\n📝 *Observações:* ${this.notes.trim()}\n`;
    }

    text += `\n💰 *Subtotal:* R$ ${this.formatMoeda(subtotal)}`;
    if (this.includeServiceTax) {
      text += `\n🤝 *Serviço (10%):* R$ ${this.formatMoeda(tax)}`;
    }
    text += `\n✨ *TOTAL:* R$ ${this.formatMoeda(total)}\n\n`;
    text += `Por favor, confirmem o recebimento do pedido com o garçom! Obrigado! 🙏`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}

class MenuManager {
  constructor(menuData, cartManager) {
    this.data = menuData;
    this.cart = cartManager;
    this.currentMode = 'categoria'; // 'categoria' ou 'ocasiao'
    this.currentCategory = 'peixes_frutos_do_mar';
    this.currentOccasion = 'all';
    this.searchQuery = '';
    
    this.tabsContainer = document.getElementById('menu-tabs');
    this.occasionContainer = document.getElementById('occasion-pills');
    this.itemsGrid = document.getElementById('menu-items-grid');
    this.searchInput = document.getElementById('menu-search');
    this.counterEl = document.getElementById('menu-counter');
  }

  init() {
    this.renderOccasions();
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

  renderOccasions() {
    if (!this.occasionContainer) return;
    
    const occasions = [
      { id: 'all', nome: 'Todos os Pratos', icone: '🍽️' },
      { id: 'pe_na_areia', nome: 'Pé na Areia', icone: '🏖️' },
      { id: 'almoco_farto', nome: 'Almoço em Família', icone: '🐟' },
      { id: 'sunset_happy_hour', nome: 'Sunset & Chopp', icone: '🌅' },
      { id: 'pos_surf', nome: 'Pós-Surf & Energia', icone: '🏄‍♂️' }
    ];

    this.occasionContainer.innerHTML = occasions.map(occ => {
      const isActive = occ.id === this.currentOccasion;
      return `
        <button 
          type="button"
          class="occasion-pill-btn ${isActive ? 'active' : ''}"
          data-occasion="${occ.id}">
          <span class="occ-icon">${occ.icone}</span>
          <span class="occ-label">${occ.nome}</span>
        </button>
      `;
    }).join('');

    this.occasionContainer.querySelectorAll('.occasion-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentOccasion = btn.dataset.occasion;
        this.occasionContainer.querySelectorAll('.occasion-pill-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.occasion === this.currentOccasion);
        });
        this.renderItems();
      });
    });
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
        this.currentOccasion = 'all';
        if (this.occasionContainer) {
          this.occasionContainer.querySelectorAll('.occasion-pill-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.occasion === 'all');
          });
        }
        this.updateActiveTabVisual();
        this.renderItems();
      });
    });
  }

  updateActiveTabVisual() {
    if (!this.tabsContainer) return;
    this.tabsContainer.querySelectorAll('.menu-tab-btn').forEach(btn => {
      const isActive = btn.dataset.category === this.currentCategory && this.currentOccasion === 'all';
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
    } else if (this.currentOccasion !== 'all') {
      items = items.filter(item => item.ocasioes && item.ocasioes.includes(this.currentOccasion));
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
          <p>Nenhum prato ou bebida encontrado para este filtro.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-search">Ver Cardápio Completo</button>
        </div>
      `;
      const clearBtn = document.getElementById('btn-clear-search');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (this.searchInput) this.searchInput.value = '';
          this.searchQuery = '';
          this.currentOccasion = 'all';
          this.currentCategory = 'peixes_frutos_do_mar';
          this.renderTabs();
          this.renderOccasions();
          this.renderItems();
        });
      }
      return;
    }

    this.itemsGrid.innerHTML = items.map(item => {
      const serveBadge = item.serve ? `<span class="card-badge badge-serve">👥 ${item.serve}</span>` : '';
      const highlightBadge = item.destaque ? `<span class="card-badge badge-destaque">⭐ ${item.destaque}</span>` : '';
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
              <button type="button" class="btn-card-add" data-id="${item.id}" aria-label="Adicionar ${item.nome} à comanda">
                <span>+ Comanda</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Eventos de clique para adicionar ao carrinho
    this.itemsGrid.querySelectorAll('.btn-card-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const item = this.data.itens.find(i => i.id === id);
        if (item && this.cart) {
          this.cart.addItem(item);
        }
      });
    });
  }
}

// Inicialização Principal
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Comanda / Carrinho
  const cart = new CartManager();

  // 2. Inicializar Menu
  function startMenu(data) {
    const menu = new MenuManager(data, cart);
    menu.init();
  }

  if (window.__MENU_DATA__) {
    startMenu(window.__MENU_DATA__);
  } else {
    const fetchUrl = window.location.pathname.includes('/src/') ? './data/menu.json' : './src/data/menu.json';
    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => startMenu(data))
      .catch(err => console.error('Erro ao carregar cardápio:', err));
  }

  // 3. Registrar Service Worker para PWA / Cache offline
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').then(() => {
      console.log('Service Worker do Container Parada ativo.');
    }).catch(err => console.warn('PWA SW registro:', err));
  }
});
