// ─── API base — set via env var or default ───
const API_BASE = window.__LUMERE_API__ || 'https://lumere-backend.railway.app';

// ─── Product catalogue ───────────────────────
const PRODUCTS = [
  {
    id: 'NIA-10',
    slug: 'niacinamide-10-zinc-1',
    name: 'Niacinamide 10% + Zinc 1%',
    tagline: 'Oil control · Pore minimising',
    desc: 'Controls sebum, reduces pore appearance, and targets active breakouts at a proven 10% concentration — the threshold where clinical efficacy begins.',
    active: 'Niacinamide 10%, Zinc PCA 1%',
    inci: 'Aqua, Niacinamide, Zinc PCA, Pentylene Glycol, Sodium PCA, Panthenol',
    ph: '5.5 – 6.5',
    price: 699,
    mrp: 849,
    volume: '30ml',
    skintypes: ['Oily', 'Combination', 'Acne-prone'],
    concerns: ['Large pores', 'Excess sebum', 'Uneven texture'],
    capColor: '#1A1814',
    cardBg: 'linear-gradient(135deg,#EBF2F0 0%,#F0E8DF 100%)',
    badge: 'Bestseller',
    badgeClass: 'badge-sage',
    howToUse: 'Apply 2–3 drops on cleansed skin, morning and/or night. Follow with moisturiser. Do not mix with Vitamin C in the same routine.'
  },
  {
    id: 'TXA-5',
    slug: 'tranexamic-acid-5-kojic-acid-1',
    name: 'Tranexamic Acid 5% + Kojic Acid 1%',
    tagline: 'Pigmentation · Brightening',
    desc: 'Targets melanin production at the source for even skin tone. No hydroquinone, no mercury. Formulated specifically for hyperpigmentation patterns common in Indian skin.',
    active: 'Tranexamic Acid 5%, Kojic Acid 1%',
    inci: 'Aqua, Tranexamic Acid, Kojic Acid, Niacinamide, Alpha-Arbutin, Glycerin',
    ph: '4.5 – 5.5',
    price: 849,
    mrp: 999,
    volume: '30ml',
    skintypes: ['All skin types'],
    concerns: ['Hyperpigmentation', 'Dark spots', 'Uneven tone', 'Melasma'],
    capColor: '#B8915A',
    cardBg: 'linear-gradient(135deg,#F5EDDC 0%,#EDE0D0 100%)',
    badge: 'For Indian skin',
    badgeClass: 'badge-gold',
    howToUse: 'Apply 2–3 drops on cleansed skin in the PM routine. Use SPF every morning when using this serum. Results visible in 4–6 weeks.'
  },
  {
    id: 'HA-2',
    slug: 'hyaluronic-acid-2-vitamin-b5',
    name: 'Hyaluronic Acid 2% + Vitamin B5',
    tagline: 'Deep hydration · Barrier repair',
    desc: 'Multi-molecular HA for deep and surface hydration. Vitamin B5 repairs the skin barrier. Fragrance-free and safe for reactive skin.',
    active: 'Sodium Hyaluronate 2%, Panthenol 5%',
    inci: 'Aqua, Sodium Hyaluronate, Panthenol, Glycerin, Betaine, Allantoin',
    ph: '5.0 – 6.0',
    price: 649,
    mrp: 799,
    volume: '30ml',
    skintypes: ['Dry', 'Sensitive', 'Dehydrated'],
    concerns: ['Dryness', 'Tight skin', 'Compromised barrier'],
    capColor: '#4A7BA7',
    cardBg: 'linear-gradient(135deg,#E8EEF5 0%,#D8E5EE 100%)',
    badge: 'Sensitive skin',
    badgeClass: 'badge-sage',
    howToUse: 'Apply to damp skin after cleansing, before serums. Use morning and night. Layer other actives on top.'
  }
];

// ─── Cart helpers ─────────────────────────────
function getCart() { return JSON.parse(localStorage.getItem('lumere_cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('lumere_cart', JSON.stringify(cart)); }
function getCartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }
function getCartTotal() { return getCart().reduce((s, i) => s + (i.price * i.qty), 0); }

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty += qty; } else { cart.push({ id: product.id, name: product.name, price: product.price, qty }); }
  saveCart(cart);
  updateCartCount();
  showToast(`${product.name.split('+')[0].trim()} added to cart`);
}

function updateCartCount() {
  const count = getCartCount();
  const el = document.getElementById('cartCount');
  if (el) { el.textContent = count; el.style.display = count > 0 ? 'flex' : 'none'; }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── Render product grid ──────────────────────
function renderProductsGrid(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
  container.innerHTML = list.map(p => `
    <div class="product-card" onclick="location.href='product.html?id=${p.id}'">
      <div class="pc-visual" style="background:${p.cardBg}">
        <div class="pc-bottle">
          <div class="pc-cap" style="background:${p.capColor}"></div>
          <div class="pc-label">${p.active.split(',')[0].trim()}</div>
        </div>
      </div>
      <div class="pc-body">
        <div class="pc-inci">${p.tagline}</div>
        <div class="pc-name">${p.name}</div>
        <p class="pc-desc">${p.desc.substring(0, 100)}…</p>
        <div class="pc-row">
          <div><div class="pc-price">₹${p.price}</div><div class="pc-size">${p.volume} · ~90 days</div></div>
          <span class="badge ${p.badgeClass}">${p.badge}</span>
        </div>
        <button class="btn btn-primary" style="width:100%;margin-top:14px;" onclick="event.stopPropagation();addToCart('${p.id}')">Add to cart</button>
      </div>
    </div>
  `).join('');
}
