/* script.js - logique SPA simple, produits, galerie, panier, whatsapp */

// ------- CONFIG / données (modifie ici) -------
const WHATSAPP_NUMBER = "+213 558857832"; // <-- remplace par ton numéro (format international, ex: +33123456789)
document.getElementById('wa-phone').textContent = WHATSAPP_NUMBER;
const PRODUCTS = [
  { id: "p1", name: "Rose Velours", price: 500 , img: "img/candle1.jpeg", desc: "Bougie parfumée rose, 220g."},
  { id: "p2", name: "Vanille Douce", price: 1200, img: "img/pack1.jpeg", desc: "Notes chaudes de vanille et bois."},
  { id: "p3", name: "Jasmin Nuit", price: 1000, img: "img/pack2.jpeg", desc: "Parfum floral délicat."},
  { id: "p4", name: "Citrus Zest", price: 800, img: "img/candle2.jpeg", desc: "Fraîcheur pétillante."}
];



// Galerie sample (remplace avec tes photos)
const GALLERY = [
  "img/candle1.jpeg","img/commande1.jpeg","img/pack2.jpeg","img/candle2.jpeg","img/pack1.jpeg"
];





// ------- UI initialisation -------
const productsEl = document.getElementById('products');
const galleryEl = document.getElementById('gallery-grid');
const miniGallery = document.getElementById('mini-gallery');
const cartCountEl = document.getElementById('cart-count');
const cartPanel = document.getElementById('cart-panel');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutWaBtn = document.getElementById('checkout-wa');
const waOrderBtn = document.getElementById('whatsapp-order');
const floatWA = document.getElementById('float-whatsapp');
const contactForm = document.getElementById('contact-form');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();
cartCountEl.textContent = "0";

// ------- RENDER PRODUCTS -------
function currencyFmt(x){ return x.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' }); }

function renderProducts(){
  productsEl.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div');
    card.className = "product";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <h4>${p.name}</h4>
      <div class="small">${p.desc}</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div class="price">${currencyFmt(p.price)}</div>
        <div class="actions">
          <button class="btn ghost" data-id="${p.id}">Voir</button>
          <button class="btn add-btn" data-id="${p.id}">Ajouter</button>
        </div>
      </div>
    `;
    productsEl.appendChild(card);
  });
}
renderProducts();

// ------- RENDER GALLERY -------
function renderGallery(){
  galleryEl.innerHTML = "";
  miniGallery.innerHTML = "";
  GALLERY.forEach((src, idx)=>{
    const img = document.createElement('img');
    img.src = src; img.alt = `Boo-gie ${idx+1}`; img.dataset.index = idx;
    img.addEventListener('click', ()=> openLightbox(idx));
    galleryEl.appendChild(img);

    const m = document.createElement('img'); m.src = src; m.alt="mini"; miniGallery.appendChild(m);
  });
}
renderGallery();

// ------- LIGHTBOX -------
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
let lbIndex = 0;

function openLightbox(i){
  lbIndex = i;
  lbImg.src = GALLERY[i];
  lbCaption.textContent = `Création ${i+1}`;
  lb.classList.add('open');
}
document.getElementById('lb-close').addEventListener('click', ()=> lb.classList.remove('open'));
document.getElementById('lb-prev').addEventListener('click', ()=> {
  lbIndex = (lbIndex - 1 + GALLERY.length) % GALLERY.length;
  openLightbox(lbIndex);
});
document.getElementById('lb-next').addEventListener('click', ()=> {
  lbIndex = (lbIndex + 1) % GALLERY.length;
  openLightbox(lbIndex);
});
lb.addEventListener('click', (e)=> { if(e.target === lb) lb.classList.remove('open'); });

// ------- PANIER (localStorage) -------
let CART = JSON.parse(localStorage.getItem('bg_cart') || "{}");

function saveCart(){ localStorage.setItem('bg_cart', JSON.stringify(CART)); updateCartUI(); }
function updateCartUI(){
  const items = Object.values(CART);
  const count = items.reduce((s,i)=> s + i.qty, 0);
  cartCountEl.textContent = count;
  cartItemsEl.innerHTML = "";
  let total = 0;
  items.forEach(it=>{
    total += it.qty * it.price;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <div style="flex:1">
        <div style="font-weight:700">${it.name}</div>
        <div class="small">${currencyFmt(it.price)} x ${it.qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn" data-op="inc" data-id="${it.id}">+</button>
        <button class="btn ghost" data-op="dec" data-id="${it.id}">-</button>
      </div>
    `;
    cartItemsEl.appendChild(el);
  });
  cartTotalEl.textContent = currencyFmt(total);
  cartCountEl.textContent = count;
}
updateCartUI();

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  if(CART[id]) CART[id].qty += 1; else CART[id] = { id:p.id, name:p.name, price:p.price, img:p.img, qty:1 };
  saveCart();
}
function changeQty(id, op){
  if(!CART[id]) return;
  if(op === 'inc') CART[id].qty++;
  else CART[id].qty--;
  if(CART[id].qty <= 0) delete CART[id];
  saveCart();
}
function clearCart(){
  CART = {}; saveCart();
}

// ------- événement boutons produits (délégation) -------
productsEl.addEventListener('click', (e)=>{
  const id = e.target.dataset.id;
  if(!id) return;
  if(e.target.classList.contains('add-btn')) addToCart(id);
  else {
    // Voir => ouvrir lightbox avec image du produit (si existe)
    const p = PRODUCTS.find(x=>x.id===id);
    if(p) openImagePreview(p.img, p.name, p.desc);
  }
  updateCartUI();
});

// petite prévisualisation image produit
function openImagePreview(src, name, desc){
  lbImg.src = src; lbCaption.textContent = `${name} — ${desc}`; lb.classList.add('open');
}

// cart panel controls
openCartBtn.addEventListener('click', ()=> cartPanel.classList.add('open'));
closeCartBtn.addEventListener('click', ()=> cartPanel.classList.remove('open'));
cartItemsEl.addEventListener('click', (e)=>{
  const id = e.target.dataset.id; const op = e.target.dataset.op;
  if(!id || !op) return;
  changeQty(id, op);
});
clearCartBtn.addEventListener('click', ()=> { if(confirm("Vider le panier ?")) clearCart(); });

// Checkout via WhatsApp : construit message et ouvre wa
function cartToMessage(){
  const items = Object.values(CART);
  if(items.length === 0) return null;
  let msg = `Bonjour Boo-gie!%0AJe souhaite commander :%0A`;
  let total = 0;
  items.forEach(it=>{
    msg += `- ${it.name} x${it.qty} : ${it.qty}x${it.price}DA%0A`;
    total += it.qty * it.price;
  });
  msg += `%0ATotal : ${total.toFixed(2)} DA%0A%0AMon nom : %0AMon lieu de livraison : %0AMon téléphone :`;
  return msg;
}
checkoutWaBtn.addEventListener('click', ()=> {
  const msg = cartToMessage();
  if(!msg){ alert("Votre panier est vide."); return; }
  const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(WHATSAPP_NUMBER)}&text=${msg}`;
  window.open(url, '_blank');
});

// Float whatsapp / channel
floatWA.addEventListener('click', ()=> {
  const msg = cartToMessage() || encodeURIComponent("Bonjour Boo-gie! Je veux commander / une info :)");
  const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(WHATSAPP_NUMBER)}&text=${msg}`;
  window.open(url,'_blank');
});
waOrderBtn.addEventListener('click', ()=> floatWA.click());

// contact form simple (envoi simulé)
contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if(!name || !email || !message){ alert("Merci de remplir tous les champs."); return; }
  // Ici tu peux ajouter une requête fetch vers un endpoint ou service (ex: Formspree)
  alert("Merci! Ton message a bien été envoyé (simulation). Nous te répondrons bientôt.");
  contactForm.reset();
});

// small sparkle background generation (gentil)
(function sparkleLoop(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  setInterval(()=>{
    const s = document.createElement('div');
    s.textContent = "✨";
    s.style.position = 'absolute';
    s.style.left = Math.random()*80 + "%";
    s.style.top = Math.random()*60 + "%";
    s.style.fontSize = (8 + Math.random()*18) + "px";
    s.style.opacity = '0.9';
    s.style.transform = `translateY(0)`;
    s.style.transition = 'all 1400ms ease-out';
    hero.appendChild(s);
    setTimeout(()=>{ s.style.opacity = 0; s.style.transform = 'translateY(-30px)'; }, 80);
    setTimeout(()=> s.remove(), 1600);
  }, 900);
})();

// small scroll reveal for sections
const sections = document.querySelectorAll('.section, .hero-inner');
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting) ent.target.style.opacity = 1;
    else ent.target.style.opacity = 0.6;
  });
},{threshold:0.2});
sections.forEach(s=>{ s.style.opacity = 0; obs.observe(s); });

// add small event to update cart when page loads (render saved)
window.addEventListener('load', ()=> {
  // render product images even if missing
  renderProducts();
  renderGallery();
  updateCartUI();
});

// allow product qty change buttons in cart (delegation re-binding)
cartItemsEl.addEventListener('click', (e) => {
  const op = e.target.dataset.op;
  const id = e.target.dataset.id;
  if(op && id) {
    changeQty(id, op);
  }
});


