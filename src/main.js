/* ==========================================================================
   LUMIÈRE LUXE — Core Application & Interactive Controller
   ========================================================================== */

import { LUXURY_PRODUCTS, BRANDS, CATEGORIES } from './data/products.js';
import confetti from 'canvas-confetti';

// Reliable SVG Fallback Image generator for luxury items
const SVG_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23101116'/><circle cx='200' cy='200' r='120' fill='none' stroke='%23d4af37' stroke-width='2' stroke-dasharray='4,4'/><text x='50%25' y='48%25' dominant-baseline='middle' text-anchor='middle' fill='%23d4af37' font-family='serif' font-size='20' letter-spacing='4'>HAUTE HAUTEUR</text><text x='50%25' y='56%25' dominant-baseline='middle' text-anchor='middle' fill='%23a0a5b5' font-family='sans-serif' font-size='12' letter-spacing='2'>MAISON LUMIÈRE</text></svg>";

// State Management
const state = {
  cart: [],
  wishlist: [],
  compare: [],
  selectedCategory: 'all',
  selectedBrand: 'All Brands',
  searchQuery: '',
  maxPrice: 350000,
  activeProductModal: null,
  isCartOpen: false,
  isCompareOpen: false,
  isConciergeOpen: false,
  appliedPromo: null
};

// Initialize Application safely
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => renderApp());
} else {
  renderApp();
}

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <!-- Glassmorphic Navigation Header -->
    <header class="header">
      <div class="container header-container">
        <div class="logo">
          <span class="logo-sub">MAISON DE HAUTE LUXE</span>
          <h1 class="logo-main text-shimmer">LUMIÈRE & AURA</h1>
        </div>

        <nav class="nav-links">
          <a href="#hero" class="nav-link">Home</a>
          <a href="#catalog" class="nav-link">Catalog</a>
          <a href="#spotlight" class="nav-link">Spotlight</a>
          <a href="#concierge" class="nav-link nav-concierge-trigger">VIP Concierge</a>
        </nav>

        <div class="header-actions">
          <button id="compare-btn" class="icon-btn" title="Compare Items">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="8" height="18" rx="1"/><rect x="14" y="3" width="8" height="18" rx="1"/></svg>
            ${state.compare.length ? `<span class="badge-count">${state.compare.length}</span>` : ''}
          </button>

          <button id="wishlist-btn" class="icon-btn" title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${state.wishlist.length ? '#d4af37' : 'currentColor'}" fill="${state.wishlist.length ? '#d4af37' : 'none'}" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            ${state.wishlist.length ? `<span class="badge-count">${state.wishlist.length}</span>` : ''}
          </button>

          <button id="cart-btn" class="btn-gold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>BAG (${getCartTotalCount()})</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="hero" class="hero-section">
      <div class="hero-bg-particles"></div>
      <div class="container hero-grid">
        <div class="hero-text-content">
          <span class="badge-gold">EXCLUSIVITY REDEFINED</span>
          <h2 class="hero-title">Haute Horlogerie & Exceptional Couture</h2>
          <p class="hero-description">
            Discover a rare, curated realm of master watchmaking, haute couture, and fine jewelry reserved for true connoisseurs of luxury.
          </p>
          <div class="hero-cta">
            <a href="#catalog" class="btn-gold">EXPLORE CATALOG</a>
            <button class="btn-outline-gold nav-concierge-trigger">PRIVATE CONCIERGE</button>
          </div>
        </div>

        <div class="hero-spotlight-card glass-card" id="spotlight">
          <div class="spotlight-tag">CURATOR'S CHOICE</div>
          <div class="spotlight-img-container">
            <img src="${LUXURY_PRODUCTS[0].image}" alt="Spotlight Piece" class="spotlight-img floating-element" onerror="this.onerror=null; this.src='${SVG_FALLBACK}';" />
          </div>
          <div class="spotlight-info">
            <span class="spotlight-brand">${LUXURY_PRODUCTS[0].brand}</span>
            <h3 class="spotlight-name">${LUXURY_PRODUCTS[0].name}</h3>
            <div class="spotlight-price">$${LUXURY_PRODUCTS[0].price.toLocaleString()} USD</div>
            <button class="btn-outline-gold quick-view-btn" data-id="${LUXURY_PRODUCTS[0].id}">INSPECT PIECE</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Brands Banner -->
    <div class="brands-bar">
      <div class="container brands-flex">
        ${BRANDS.filter(b => b !== 'All Brands').map(b => `<span class="brand-item">${b}</span>`).join('')}
      </div>
    </div>

    <!-- Main Catalog Section -->
    <section id="catalog" class="catalog-section container">
      <div class="section-title">
        <span class="section-subtitle">THE COLLECTION</span>
        <h2 class="section-main-title">Masterpieces of Excellence</h2>
      </div>

      <!-- Filters & Controls Bar -->
      <div class="controls-bar glass-card">
        <div class="category-tabs">
          ${CATEGORIES.map(c => `
            <button class="tab-btn ${state.selectedCategory === c.id ? 'active' : ''}" data-category="${c.id}">
              ${c.name}
            </button>
          `).join('')}
        </div>

        <div class="filter-dropdowns">
          <input type="text" id="search-input" placeholder="Search brands, pieces..." value="${state.searchQuery}" style="background: #101116; border: 1px solid var(--border-gold); color: #fff; padding: 10px 14px; font-family: var(--font-heading); font-size: 0.75rem; border-radius: 2px;" />

          <select id="brand-select" class="custom-select">
            ${BRANDS.map(b => `<option value="${b}" ${state.selectedBrand === b ? 'selected' : ''}>${b}</option>`).join('')}
          </select>

          <div class="price-slider-wrap">
            <label>Max Price: <span id="price-val">$${state.maxPrice.toLocaleString()}</span></label>
            <input type="range" id="price-range" min="10000" max="350000" step="5000" value="${state.maxPrice}" />
          </div>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="product-grid" id="product-grid-container">
        ${renderProductGrid()}
      </div>
    </section>

    <!-- Modals & Drawers -->
    <div id="modal-container"></div>
    <div id="cart-drawer-container"></div>
    <div id="compare-modal-container"></div>
    <div id="concierge-chat-container"></div>
  `;

  attachDynamicEvents();
}

function renderProductGrid() {
  const filtered = LUXURY_PRODUCTS.filter(p => {
    const matchCat = state.selectedCategory === 'all' || p.category === state.selectedCategory;
    const matchBrand = state.selectedBrand === 'All Brands' || p.brand === state.selectedBrand;
    const matchPrice = p.price <= state.maxPrice;
    const matchSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                        p.brand.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCat && matchBrand && matchPrice && matchSearch;
  });

  if (filtered.length === 0) {
    return `
      <div class="empty-state glass-card" style="grid-column: 1/-1; text-align: center; padding: 60px;">
        <h3 class="font-heading" style="color: var(--gold-primary);">NO MATCHING MASTERPIECES</h3>
        <p style="color: var(--text-muted); margin-top: 8px;">Try adjusting your luxury filters or price threshold.</p>
      </div>
    `;
  }

  return filtered.map(p => `
    <div class="glass-card product-card">
      <div class="card-image-wrap">
        <img src="${p.image}" alt="${p.name}" class="card-img" onerror="this.onerror=null; this.src='${SVG_FALLBACK}';" />
        <span class="badge-gold category-badge">${p.category.toUpperCase()}</span>
        <button class="wishlist-toggle ${state.wishlist.includes(p.id) ? 'active' : ''}" data-id="${p.id}" title="Add to Wishlist">
          ♥
        </button>
      </div>

      <div class="card-details">
        <span class="card-brand">${p.brand}</span>
        <h3 class="card-title">${p.name}</h3>
        <div class="card-price-row">
          <span class="card-price">$${p.price.toLocaleString()} USD</span>
          <span class="card-rating">★ ${p.rating}</span>
        </div>

        <div class="card-actions">
          <button class="btn-gold add-to-cart-btn" data-id="${p.id}">ADD TO BAG</button>
          <button class="btn-outline-gold quick-view-btn" data-id="${p.id}">DETAILS</button>
          <button class="compare-toggle-btn ${state.compare.includes(p.id) ? 'active' : ''}" data-id="${p.id}" title="Compare">⚖</button>
        </div>
      </div>
    </div>
  `).join('');
}

function getCartTotalCount() {
  return state.cart.reduce((acc, item) => acc + item.qty, 0);
}

function attachDynamicEvents() {
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      document.getElementById('product-grid-container').innerHTML = renderProductGrid();
      attachCardEvents();
    });
  }

  // Category tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.selectedCategory = e.target.dataset.category;
      renderApp();
    });
  });

  // Brand dropdown
  const brandSelect = document.getElementById('brand-select');
  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      state.selectedBrand = e.target.value;
      renderApp();
    });
  }

  // Price range
  const priceRange = document.getElementById('price-range');
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      state.maxPrice = parseInt(e.target.value);
      document.getElementById('price-val').innerText = `$${state.maxPrice.toLocaleString()}`;
      document.getElementById('product-grid-container').innerHTML = renderProductGrid();
      attachCardEvents();
    });
  }

  // Cart button
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      state.isCartOpen = true;
      renderCartDrawer();
    });
  }

  // Concierge trigger
  document.querySelectorAll('.nav-concierge-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      state.isConciergeOpen = true;
      renderConciergeChat();
    });
  });

  // Compare trigger
  const compareBtn = document.getElementById('compare-btn');
  if (compareBtn) {
    compareBtn.addEventListener('click', () => {
      renderCompareModal();
    });
  }

  attachCardEvents();
}

function attachCardEvents() {
  // Quick View
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const product = LUXURY_PRODUCTS.find(p => p.id === id);
      if (product) renderProductModal(product);
    });
  });

  // Add to cart
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      addToCart(id);
    });
  });

  // Wishlist toggle
  document.querySelectorAll('.wishlist-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter(w => w !== id);
      } else {
        state.wishlist.push(id);
      }
      renderApp();
    });
  });

  // Compare toggle
  document.querySelectorAll('.compare-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (state.compare.includes(id)) {
        state.compare = state.compare.filter(c => c !== id);
      } else {
        if (state.compare.length >= 2) state.compare.shift();
        state.compare.push(id);
      }
      renderApp();
    });
  });
}

function addToCart(productId) {
  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    const p = LUXURY_PRODUCTS.find(item => item.id === productId);
    if (p) state.cart.push({ ...p, qty: 1 });
  }
  try {
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  } catch (e) {}
  renderApp();
  state.isCartOpen = true;
  renderCartDrawer();
}

// Product Modal & 360 AR View
function renderProductModal(product) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-overlay active" id="p-modal">
      <div class="modal-content glass-card p-modal-inner">
        <button class="close-modal-btn" id="close-p-modal">✕</button>

        <div class="modal-grid">
          <div class="modal-gallery">
            <div class="ar-view-box">
              <img src="${product.image}" id="main-modal-img" class="modal-main-img" onerror="this.onerror=null; this.src='${SVG_FALLBACK}';" />
              <div class="ar-badge">360° SIMULATOR ACTIVE</div>
            </div>
            <div class="gallery-thumbs">
              ${product.gallery.map(g => `<img src="${g}" class="thumb-img" onerror="this.onerror=null; this.src='${SVG_FALLBACK}';" onclick="document.getElementById('main-modal-img').src='${g}'" />`).join('')}
            </div>
          </div>

          <div class="modal-info-col">
            <span class="badge-gold">${product.brand}</span>
            <h2 class="font-heading" style="font-size: 1.8rem; margin: 8px 0;">${product.name}</h2>
            <div class="text-gold-gradient" style="font-size: 1.6rem; font-weight: 700;">$${product.price.toLocaleString()} USD</div>
            <p style="color: var(--text-muted); margin: 16px 0; font-size: 0.95rem;">${product.description}</p>

            <div class="specs-box">
              <h4 class="font-heading" style="color: var(--gold-primary); margin-bottom: 8px;">HORLOGERIE / ATELIER SPECS</h4>
              <div class="specs-grid">
                ${Object.entries(product.specs).map(([key, val]) => `
                  <div class="spec-row">
                    <span class="spec-key">${key}:</span>
                    <span class="spec-val">${val}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="modal-actions-row" style="margin-top: 24px;">
              <button class="btn-gold" id="modal-add-cart" data-id="${product.id}">ADD TO SHOPPING BAG</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-p-modal').addEventListener('click', () => {
    container.innerHTML = '';
  });

  document.getElementById('modal-add-cart').addEventListener('click', () => {
    addToCart(product.id);
    container.innerHTML = '';
  });
}

// Shopping Bag Drawer
function renderCartDrawer() {
  const container = document.getElementById('cart-drawer-container');
  if (!container || !state.isCartOpen) {
    if (container) container.innerHTML = '';
    return;
  }

  const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const discount = state.appliedPromo ? subtotal * 0.10 : 0;
  const grandTotal = subtotal - discount;

  container.innerHTML = `
    <div class="cart-drawer-overlay active" id="cart-overlay">
      <div class="cart-drawer glass-card">
        <div class="cart-header">
          <h3 class="font-heading">HAUTE BAG (${getCartTotalCount()})</h3>
          <button class="close-modal-btn" id="close-cart-btn">✕</button>
        </div>

        <div class="cart-items-wrap">
          ${state.cart.length === 0 ? `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">Your luxury bag is currently empty.</div>
          ` : state.cart.map(item => `
            <div class="cart-item-row">
              <img src="${item.image}" class="cart-item-img" onerror="this.onerror=null; this.src='${SVG_FALLBACK}';" />
              <div class="cart-item-info">
                <span class="badge-gold" style="font-size:0.6rem;">${item.brand}</span>
                <h4 style="font-size: 0.9rem; margin: 4px 0;">${item.name}</h4>
                <div style="color: var(--gold-primary); font-weight: 600;">$${item.price.toLocaleString()} USD</div>
                <div style="display: flex; gap: 8px; align-items: center; margin-top: 6px;">
                  <span>Qty: ${item.qty}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="cart-footer">
          <div class="promo-wrap">
            <input type="text" id="promo-input" placeholder="VIP Code (e.g. VIPLUXE10)" value="${state.appliedPromo || ''}" />
            <button class="btn-outline-gold" id="apply-promo-btn">APPLY</button>
          </div>

          <div class="subtotal-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toLocaleString()} USD</span>
          </div>
          ${state.appliedPromo ? `
            <div class="subtotal-row" style="color: var(--gold-light);">
              <span>VIP Discount (10%):</span>
              <span>-$${discount.toLocaleString()} USD</span>
            </div>
          ` : ''}
          <div class="subtotal-row total-row">
            <span>Grand Total:</span>
            <span class="text-gold-gradient" style="font-size: 1.3rem;">$${grandTotal.toLocaleString()} USD</span>
          </div>

          <button class="btn-gold" style="width: 100%; margin-top: 16px;" id="checkout-trigger-btn" ${state.cart.length === 0 ? 'disabled' : ''}>
            EXPRESS VIP CHECKOUT
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-cart-btn').addEventListener('click', () => {
    state.isCartOpen = false;
    renderCartDrawer();
  });

  document.getElementById('apply-promo-btn').addEventListener('click', () => {
    const val = document.getElementById('promo-input').value.trim();
    if (val.toUpperCase() === 'VIPLUXE10') {
      state.appliedPromo = 'VIPLUXE10';
      renderCartDrawer();
    } else {
      alert('Invalid VIP Promo Code. Use: VIPLUXE10');
    }
  });

  const checkoutBtn = document.getElementById('checkout-trigger-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      renderCheckoutModal(grandTotal);
    });
  }
}

// VIP Checkout Modal
function renderCheckoutModal(total) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-overlay active">
      <div class="modal-content glass-card" style="max-width: 600px; padding: 32px;">
        <h2 class="font-heading text-shimmer" style="text-align: center; margin-bottom: 20px;">VIP CONCIERGE CHECKOUT</h2>
        <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 24px;">Complimentary White-Glove Armored Express Delivery Included</p>

        <form id="checkout-form">
          <div style="margin-bottom: 16px;">
            <label style="display:block; font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 6px;">FULL NAME / CLIENT TITLE</label>
            <input type="text" required placeholder="e.g. Lord Alexander Sterling" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-gold); color: #fff;" />
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display:block; font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 6px;">PRIVATE DELIVERY ADDRESS</label>
            <input type="text" required placeholder="Mayfair, London / Penthouse suite address" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-gold); color: #fff;" />
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display:block; font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 6px;">PAYMENT METHOD</label>
            <select style="width: 100%; padding: 12px; background: #101116; border: 1px solid var(--border-gold); color: #fff;">
              <option>Centurion Black Card (Amex)</option>
              <option>Swiss Bank Private Wire Transfer</option>
              <option>Cryptocurrency Vault (BTC / ETH / USDT)</option>
            </select>
          </div>

          <button type="submit" class="btn-gold" style="width: 100%;">CONFIRM & GENERATE VIP RECEIPT ($${total.toLocaleString()} USD)</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    } catch(e) {}
    alert('✨ CONGRATULATIONS! Your order has been placed with Maison Lumière Concierge. Your receipt is confirmed.');
    state.cart = [];
    state.isCartOpen = false;
    container.innerHTML = '';
    renderApp();
  });
}

// Compare Modal
function renderCompareModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const items = state.compare.map(id => LUXURY_PRODUCTS.find(p => p.id === id)).filter(Boolean);

  container.innerHTML = `
    <div class="modal-overlay active">
      <div class="modal-content glass-card" style="max-width: 900px; padding: 32px;">
        <button class="close-modal-btn" id="close-comp">✕</button>
        <h2 class="font-heading text-gold-gradient" style="text-align: center; margin-bottom: 24px;">PIECE COMPARISON MATRIX</h2>

        ${items.length === 0 ? `
          <div style="text-align: center; color: var(--text-muted); padding: 40px;">Select 2 pieces using the ⚖ icon to compare horlogerie specs.</div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(${items.length}, 1fr); gap: 24px;">
            ${items.map(p => `
              <div class="glass-card" style="padding: 20px; text-align: center;">
                <img src="${p.image}" style="height: 180px; object-fit: contain; margin-bottom: 12px;" onerror="this.onerror=null; this.src='${SVG_FALLBACK}';" />
                <h3 class="font-heading">${p.name}</h3>
                <div style="color: var(--gold-primary); font-weight: 700; margin: 8px 0;">$${p.price.toLocaleString()} USD</div>
                <div style="text-align: left; margin-top: 16px; font-size: 0.85rem;">
                  ${Object.entries(p.specs).map(([k,v]) => `<div style="margin-bottom: 6px;"><strong>${k}:</strong> ${v}</div>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  document.getElementById('close-comp').addEventListener('click', () => container.innerHTML = '');
}

// Concierge AI Chat Drawer
function renderConciergeChat() {
  const container = document.getElementById('concierge-chat-container');
  if (!container || !state.isConciergeOpen) {
    if (container) container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="cart-drawer-overlay active">
      <div class="cart-drawer glass-card">
        <div class="cart-header">
          <h3 class="font-heading text-shimmer">VIP STYLIST CONCIERGE</h3>
          <button class="close-modal-btn" id="close-conc-btn">✕</button>
        </div>

        <div style="flex: 1; padding: 20px; overflow-y: auto;">
          <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid var(--border-gold); padding: 14px; border-radius: 4px; font-size: 0.85rem; margin-bottom: 16px;">
            💎 Welcome to Maison Lumière Private Stylist. How may I assist your acquisition today?
          </div>
        </div>

        <div style="padding: 20px; border-top: 1px solid var(--border-dark);">
          <input type="text" placeholder="Ask about watch movements or styling..." style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-gold); color: #fff;" />
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-conc-btn').addEventListener('click', () => {
    state.isConciergeOpen = false;
    renderConciergeChat();
  });
}
