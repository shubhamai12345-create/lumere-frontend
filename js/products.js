// ─── Config ───────────────────────────────────────────────────────
const API_BASE = (typeof window !== 'undefined' && window.__LUMERE_API__) 
  || 'https://lumere-backend-production.up.railway.app';

// ─── Catalogue ────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id:'NIA-10',slug:'niacinamide-10',
    name:'Niacinamide 10% + Zinc 1%',
    tagline:'Oil control · Pore minimising · Anti-blemish',
    desc:'Controls sebum, minimises pores, and reduces hyperpigmentation at the clinically effective 10% threshold.',
    active:'Niacinamide 10%, Zinc PCA 1%',
    inci:'Aqua, Niacinamide, Zinc PCA, Pentylene Glycol, Sodium PCA, Panthenol, Allantoin',
    ph:'5.5 – 6.5', price:699, mrp:849, volume:'30ml',
    skintypes:['Oily','Combination','Acne-prone'],
    concerns:['Large pores','Excess sebum','Active breakouts','Uneven texture'],
    howToUse:'Apply 2–3 drops on cleansed skin, morning and/or night. Follow with moisturiser. Do not mix with Vitamin C in the same routine.',
    accent:'#5C8C7A',badge:'Bestseller'
  },
  {
    id:'TXA-5',slug:'tranexamic-acid-5',
    name:'Tranexamic Acid 5% + Kojic Acid 1%',
    tagline:'Brightening · Pigmentation · Even tone',
    desc:'Targets melanin at the source with no hydroquinone. Built for Indian skin\'s pigmentation patterns.',
    active:'Tranexamic Acid 5%, Kojic Acid 1%',
    inci:'Aqua, Tranexamic Acid, Kojic Acid, Niacinamide, Alpha-Arbutin, Glycerin, Sodium Hyaluronate',
    ph:'4.5 – 5.5', price:849, mrp:999, volume:'30ml',
    skintypes:['All skin types'],
    concerns:['Hyperpigmentation','Dark spots','Uneven tone','Post-acne marks'],
    howToUse:'Apply 2–3 drops PM only. Always use SPF in the morning when using this serum. Visible results in 4–6 weeks.',
    accent:'#B8864E',badge:'For Indian skin'
  },
  {
    id:'HA-2',slug:'hyaluronic-acid-2',
    name:'Hyaluronic Acid 2% + Vitamin B5',
    tagline:'Deep hydration · Barrier repair · Plumping',
    desc:'Multi-molecular HA for both surface and deep hydration. Vitamin B5 repairs the skin barrier. Fragrance-free.',
    active:'Sodium Hyaluronate 2%, Panthenol 5%',
    inci:'Aqua, Sodium Hyaluronate, Panthenol, Glycerin, Betaine, Allantoin, Sodium PCA',
    ph:'5.0 – 6.0', price:649, mrp:799, volume:'30ml',
    skintypes:['Dry','Sensitive','Dehydrated','All types'],
    concerns:['Dryness','Tight skin','Compromised barrier','Reactive skin'],
    howToUse:'Apply to damp skin after cleansing, before other serums. Use morning and night. Works under any other actives.',
    accent:'#4A7BA7',badge:'Sensitive-safe'
  }
];

// ─── Cart ──────────────────────────────────────────────────────────
function getCart(){ return JSON.parse(localStorage.getItem('lumere_cart')||'[]'); }
function saveCart(c){ localStorage.setItem('lumere_cart',JSON.stringify(c)); }
function getCartCount(){ return getCart().reduce((s,i)=>s+i.qty,0); }
function getCartTotal(){ return getCart().reduce((s,i)=>s+(i.price*i.qty),0); }

function addToCart(id,qty=1){
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
  const cart=getCart(), ex=cart.find(i=>i.id===id);
  if(ex){ex.qty+=qty;}else{cart.push({id:p.id,name:p.name,price:p.price,qty});}
  saveCart(cart); updateCartCount();
  showToast(p.name.split('+')[0].trim()+' added to cart');
}

function updateCartCount(){
  const n=getCartCount();
  const el=document.getElementById('cartCount');
  if(el){el.textContent=n;el.style.display=n>0?'flex':'none';}
}

function showToast(msg){
  const t=document.getElementById('toast'); if(!t) return;
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

// ─── Render product grid ───────────────────────────────────────────
function renderProductsGrid(containerId, limit){
  const el=document.getElementById(containerId); if(!el) return;
  const list=limit?PRODUCTS.slice(0,limit):PRODUCTS;
  el.innerHTML=list.map((p,i)=>`
    <div class="product-card" onclick="location.href='product.html?id=${p.id}'">
      <div class="pc-num">0${i+1}</div>
      <div class="pc-formula">${p.tagline}</div>
      <div class="pc-name">${p.name}</div>
      <p class="pc-desc">${p.desc}</p>
      <div class="pc-footer">
        <div>
          <div class="pc-price">₹${p.price}</div>
          <div class="pc-vol">${p.volume} · ~90 days supply</div>
        </div>
        <button class="btn-add" onclick="event.stopPropagation();addToCart('${p.id}')">Add to cart</button>
      </div>
    </div>`).join('');
}
