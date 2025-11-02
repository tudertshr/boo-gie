/* =========================
   CONFIG / DONNÉES
   ========================= */
const WHATSAPP_NUMBER = "+213558857832"; // numéro affiché / utilisé pour l'envoi
document.getElementById('wa-phone').textContent = WHATSAPP_NUMBER;

//______________________________________________________________________________ Produits (modifiable)__________________________________________________
const PRODUCTS = [
    { id: "p1", name: "heart cake", price: 500 , img: "img/candle1.jpeg", desc: "Bougie parfumée framboise rouge, 220g."},
    { id: "p2", name: "bubbly 4", price: 1200, img: "img/pack1.jpeg", desc: "Bougie parfumée framboise rouge, 100g."},
    { id: "p3", name: "noeud", price: 1000, img: "img/pack2.jpeg", desc: "Bougie parfumée framboise rouge, 150g"},
    { id: "p4", name: "pack 01 ", price: 2000, img: "img/candle2.jpeg", desc: "noeud + heart cake ; framboire; rouge"}
];

// _____________________________________________________________________________Galerie (modifiable)_______________________________________________________
const GALLERY = [
    "img/candle1.jpeg","img/commande1.jpeg","img/pack2.jpeg","img/candle2.jpeg","img/pack1.jpeg"
];

// ______________________________________________________________________🎨 Liste des couleurs disponibles__________________________________________________
const AVAILABLE_COLORS = [
    {name: "Rose", code: "#b72a52"},
    {name: "vert", code: "#0a5c38"},
    {name: "rouge", code: "#7a0f1e"},
    {name: "bleu", code: "#123a6f"},
    {name: "marron", code: "#4a2b18"},
    {name: "violet", code: "#4b1e6d"}
    // ajoute ici les couleurs que tu veux 👇
    // {name: "Lavande", code: "#b57edc"},
];

//____________________________________________________________________________________________________________________________________________________________
const colorContainer = document.getElementById("color-options");
let selectedColors = [];

function renderColorChoices() {
    if (!colorContainer) {
        console.warn("color-options element introuvable — rendu des couleurs ignoré.");
        return;
    }

    AVAILABLE_COLORS.forEach(c => {
        const box = document.createElement("div");
        box.className = "color-box";
        box.style.backgroundColor = c.code;
        box.title = c.name;

        box.addEventListener("click", () => {
            if (selectedColors.includes(c.name)) {
                selectedColors = selectedColors.filter(col => col !== c.name);
                box.classList.remove("selected");
            } else {
                selectedColors.push(c.name);
                box.classList.add("selected");
            }
            updateCustomPreview();
        });

        colorContainer.appendChild(box);
    });
}

renderColorChoices();

// 🕯️ Remplir automatiquement les modèles dans le menu de personnalisation
const modeleSelect = document.getElementById("custom-modele");

function loadModelsInCustomization() {
    if (!modeleSelect) {
        console.warn("custom-modele element introuvable — rendu des modèles ignoré.");
        return;
    }

    modeleSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';
    PRODUCTS.forEach(product => {
        const opt = document.createElement("option");
        opt.value = product.name;
        opt.textContent = `${product.name} — ${product.price} DA`;
        opt.dataset.price = product.price;
        modeleSelect.appendChild(opt);
    });
}

loadModelsInCustomization();

/* =========================
   RÉFÉRENCES DOM
   ========================= */
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

const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
const lbClose = document.getElementById('lb-close');

const openCustomBtn = document.getElementById('open-custom-btn');
const customModal = document.getElementById('custom-modal');
const closeCustomBtn = document.getElementById('close-custom');
const cancelCustomBtn = document.getElementById('cancel-custom');

// Custom form fields
const customParfum = document.getElementById('custom-parfum');
const customModele = document.getElementById('custom-modele');
const customQty = document.getElementById('custom-qty');
const customMessage = document.getElementById('custom-message');
const customImage = document.getElementById('custom-image');
const addCustomBtn = document.getElementById('add-custom-to-cart');

const previewParfum = document.getElementById('preview-parfum');
const previewModele = document.getElementById('preview-modele');
const previewCouleur = document.getElementById('preview-couleur');
const previewImg = document.getElementById('preview-img');
const customPriceEl = document.getElementById('custom-price');

/* =========================
   UTILITAIRES
   ========================= */
function currencyFmt(x){
    try { return x.toLocaleString('fr-FR') + ' DA'; } 
    catch(e) { return x + ' DA'; }
}

function uid(prefix = 'id'){
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

/* =========================
   ANNEE FOOTER
   ========================= */
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   RENDER PRODUITS
   ========================= */
function renderProducts(){
    if(!productsEl) return;
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
                    <button class="btn ghost view-btn" data-id="${p.id}">Voir</button>
                    <button class="btn add-btn" data-id="${p.id}">Ajouter</button>
                </div>
            </div>
        `;
        productsEl.appendChild(card);
    });
}

/* =========================
   RENDER GALLERY
   ========================= */
function renderGallery(){
    if(!galleryEl || !miniGallery) return;
    galleryEl.innerHTML = "";
    miniGallery.innerHTML = "";
    GALLERY.forEach((src, idx) => {
        const img = document.createElement('img');
        img.src = src; img.alt = `Boo-gie ${idx+1}`; img.dataset.index = idx;
        img.addEventListener('click', ()=> openLightbox(idx));
        galleryEl.appendChild(img);

        const m = document.createElement('img');
        m.src = src; m.alt = 'mini';
        miniGallery.appendChild(m);
    });
}

/* =========================
   LIGHTBOX
   ========================= */
let lbIndex = 0;
function openLightbox(i){
    if(!lb) return;
    lbIndex = i;
    lbImg.src = GALLERY[i];
    lbCaption.textContent = `Création ${i+1}`;
    lb.classList.add('open');
}
if(lbClose) lbClose.addEventListener('click', ()=> lb.classList.remove('open'));
if(lbPrev) lbPrev.addEventListener('click', ()=> {
    lbIndex = (lbIndex - 1 + GALLERY.length) % GALLERY.length;
    openLightbox(lbIndex);
});
if(lbNext) lbNext.addEventListener('click', ()=> {
    lbIndex = (lbIndex + 1) % GALLERY.length;
    openLightbox(lbIndex);
});
if(lb) lb.addEventListener('click', (e)=> { if(e.target === lb) lb.classList.remove('open'); });

/* =========================
   PANIER - localStorage
   ========================= */
let CART = JSON.parse(localStorage.getItem('bg_cart') || "{}");

function saveCart(){ 
    localStorage.setItem('bg_cart', JSON.stringify(CART)); 
    updateCartUI(); 
}

function updateCartUI(){
    const items = Object.values(CART);
    const count = items.reduce((s,i)=> s + i.qty, 0);
    if(cartCountEl) cartCountEl.textContent = count;
    if(!cartItemsEl) return;
    cartItemsEl.innerHTML = "";
    let total = 0;

    items.forEach(it=>{
        total += it.qty * it.price;
        const container = document.createElement('div');
        container.className = 'cart-item';

        // récupère la source brute (option.image priorité)
        const imgRaw = (it.options && it.options.image) ? it.options.image : (it.img || '');

        // détection si c'est une image (data:, http(s) ou chemin local ou extension image)
        const looksLikeImage = typeof imgRaw === 'string' && (
            /^data:image\//i.test(imgRaw) ||
            /^https?:\/\//i.test(imgRaw) ||
            /(^\/)|(^\.\.\/)|(^\.\/)/.test(imgRaw) ||
            /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i.test(imgRaw)
        );

        let imgHtml = "";
        if (looksLikeImage) {
            // image normale / dataUrl → <img>
            const safeSrc = imgRaw || 'img/candle1.jpeg';
            imgHtml = `<img src="${safeSrc}" alt="${it.name}">`;
        } else {
            // pas une image → afficher un fallback (emoji ou image de fallback)
            const emoji = (imgRaw && imgRaw.length <= 4) ? imgRaw : "🕯️";
            imgHtml = `<div class="cart-emoji" aria-hidden="true">${emoji}</div>`;
        }

        // show options summary for custom
        let optsHtml = '';
        if(it.options){
            optsHtml += `<div class="small" style="margin-top:6px;color:var(--muted)">`;
            if(it.options.parfum) optsHtml += `Parfum: ${it.options.parfum} · `;
            if(it.options.modele) optsHtml += `Modèle: ${it.options.modele} · `;
            if(it.options.couleur) optsHtml += `Couleur(s): ${it.options.couleur}`;
            optsHtml += `</div>`;
            if(it.options.message) optsHtml += `<div class="small" style="margin-top:6px;color:var(--muted)">Note: ${it.options.message}</div>`;
        }

        container.innerHTML = `
            ${imgHtml}
            <div style="flex:1">
                <div style="font-weight:700">${it.name}</div>
                <div class="small">${currencyFmt(it.price)} x ${it.qty}</div>
                ${optsHtml}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
                <button class="btn" data-op="inc" data-id="${it.id}">+</button>
                <button class="btn ghost" data-op="dec" data-id="${it.id}">-</button>
            </div>
        `;
        cartItemsEl.appendChild(container);
    });

    if(cartTotalEl) cartTotalEl.textContent = currencyFmt(total);
}

const floatingCartBtn = document.getElementById('floating-cart-btn');
const topCartBtn = document.getElementById('open-cart');

floatingCartBtn.addEventListener('click', () => {
  topCartBtn.click(); // simule le clic sur le panier en haut
});



/* =========================
   AJOUTER PRODUIT NORMAL AU PANIER
   ========================= */
function addToCart(id){
    console.log("addToCart appelé pour id =", id);
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) {
        console.warn("Produit introuvable pour id =", id);
        return;
    }
    if(CART[id]) CART[id].qty += 1;
    else {
  const defaultImg = "🕯️"; // emoji bougie par défaut
  CART[id] = { 
    id: p.id, 
    name: p.name, 
    price: p.price, 
    img: p.img && p.img.trim() !== "" ? p.img : defaultImg, 
    qty: 1 
  };

}
    saveCart();
}

/* =========================
   CHANGER QUANTITÉ (normal ou personnalisé)
   ========================= */
function changeQty(id, op){
    if(!CART[id]) return;
    if(op === 'inc') CART[id].qty++;
    else CART[id].qty--;
    if(CART[id].qty <= 0) delete CART[id];
    saveCart();
}

function clearCart(){
    CART = {}; 
    saveCart();
}

/* =========================
   EVENTS: clic sur produits (délégation)
   ========================= */
if(productsEl) {
    productsEl.addEventListener('click', (e)=>{
        const id = e.target.dataset.id;
        if(!id) return;
        if(e.target.classList.contains('add-btn')) {
            addToCart(id);
        } else if(e.target.classList.contains('view-btn')){
            const p = PRODUCTS.find(x=>x.id===id);
            if(p) openImagePreview(p.img, p.name, p.desc);
        }
        updateCartUI();
    });
}

/* =========================
   HELPER: aperçu image produit dans lightbox
   ========================= */
function openImagePreview(src, name, desc){
    if(!lb) return;
    lbImg.src = src; 
    lbCaption.textContent = `${name} — ${desc}`; 
    lb.classList.add('open');
}

/* =========================
   DELEGATION +/- PANIER
   ========================= */
if(cartItemsEl) {
    cartItemsEl.addEventListener('click', (e)=>{
        const id = e.target.dataset.id; 
        const op = e.target.dataset.op;
        if(!id || !op) return;
        changeQty(id, op);
    });
}

/* =========================
   CONTRÔLES PANIER
   ========================= */
if(openCartBtn && cartPanel) openCartBtn.addEventListener('click', ()=> cartPanel.classList.add('open'));
if(closeCartBtn && cartPanel) closeCartBtn.addEventListener('click', ()=> cartPanel.classList.remove('open'));
if(clearCartBtn) clearCartBtn.addEventListener('click', ()=> { if(confirm("Vider le panier ?")) clearCart(); });

/* =========================
   WHATSAPP CHECKOUT
   ========================= */
function cartToMessage(){
    const items = Object.values(CART);
    if(items.length === 0) return null;
    let msgParts = [];
    msgParts.push("Bonjour Boo-gie!%0AJe souhaite commander :%0A");
    let total = 0;

    items.forEach(it=>{
        total += it.qty * it.price;
        if(it.options){
            msgParts.push(`- ${it.name} x${it.qty} : ${it.qty}x${it.price}DA%0A`);
            if(it.options.parfum) msgParts.push(`  Parfum: ${encodeURIComponent(it.options.parfum)}%0A`);
            if(it.options.modele) msgParts.push(`  Modèle: ${encodeURIComponent(it.options.modele)}%0A`);
            if(it.options.couleur) msgParts.push(`  Couleur(s): ${encodeURIComponent(it.options.couleur)}%0A`);
            if(it.options.message) msgParts.push(`  Note: ${encodeURIComponent(it.options.message)}%0A`);
            if(it.options.image) msgParts.push(`  (Image fournie)%0A`);
        } else {
            msgParts.push(`- ${it.name} x${it.qty} : ${it.qty}x${it.price}DA%0A`);
        }
    });

    msgParts.push(`%0ATotal : ${total.toFixed(2)} DA%0A%0AMon nom : %0AMon lieu de livraison : %0AMon téléphone :`);
    return msgParts.join('');
}

if(checkoutWaBtn){
    checkoutWaBtn.addEventListener('click', ()=> {
        const msg = cartToMessage();
        if(!msg){ alert("Votre panier est vide."); return; }
        const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(WHATSAPP_NUMBER)}&text=${msg}`;
        window.open(url, '_blank');
    });
}

if(floatWA){
    floatWA.addEventListener('click', ()=> {
        const msg = cartToMessage() || encodeURIComponent("Bonjour Boo-gie! Je veux commander / une info :)");
        const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(WHATSAPP_NUMBER)}&text=${msg}`;
        window.open(url,'_blank');
    });
}

if(waOrderBtn && floatWA) waOrderBtn.addEventListener('click', ()=> floatWA.click());

/* =========================
   FORMULAIRE CONTACT (simulation)
   ========================= */
if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        if(!name || !email || !message){ alert("Merci de remplir tous les champs."); return; }
        alert("Merci! Ton message a bien été envoyé (simulation). Nous te répondrons bientôt.");
        contactForm.reset();
    });
}

/* =========================
   SPARKLE ANIMATION (bougies)
   ========================= */
(function sparkleLoop(){
    const hero = document.querySelector('.hero');
    if(!hero) return;
    setInterval(()=>{
        const s = document.createElement('div');
        s.textContent = "🕯️";
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

/* =========================
   SCROLL REVEAL
   ========================= */
const sections = document.querySelectorAll('.section, .hero-inner');
const obs = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
        if(ent.isIntersecting) ent.target.style.opacity = 1;
        else ent.target.style.opacity = 0.6;
    });
},{threshold:0.2});
sections.forEach(s=>{ s.style.opacity = 0; obs.observe(s); });

/* =========================
   CUSTOMIZER: preview + ajout panier
   ========================= */
function safe(el){ return !!el; }

if(openCustomBtn && customModal){
    openCustomBtn.addEventListener('click', ()=> customModal.classList.add('open'));
}
if(closeCustomBtn) closeCustomBtn.addEventListener('click', ()=> customModal.classList.remove('open'));
if(cancelCustomBtn) cancelCustomBtn.addEventListener('click', ()=> customModal.classList.remove('open'));

function updateCustomPreview(){
    if(!safe(previewParfum) || !safe(customParfum) || !safe(customModele) || !safe(previewCouleur) || !safe(customQty) || !safe(customPriceEl)) return;

    previewParfum.textContent = `Parfum: ${customParfum.value || '-'}`;
    previewModele.textContent = `Modèle: ${customModele.value || '-'}`;
    if(selectedColors.length > 0) previewCouleur.textContent = "Couleur(s): " + selectedColors.join(", ");
    else previewCouleur.textContent = "Couleur(s): -";

    const qty = Number(customQty.value) || 1;
    const selectedModelData = PRODUCTS.find(p => p.name === customModele.value);
    const modelPrice = selectedModelData ? selectedModelData.price : 0;
    const totalPrice = modelPrice * qty;

    customPriceEl.textContent = `${totalPrice.toLocaleString('fr-FR')} DA`;
}

if(customParfum) customParfum.addEventListener('change', updateCustomPreview);
if(customModele) customModele.addEventListener('change', updateCustomPreview);
if(customQty) customQty.addEventListener('input', updateCustomPreview);

if(customImage){
    customImage.addEventListener('change', (e)=>{
        const f = e.target.files && e.target.files[0];
        if(!f){ 
            if(previewImg) { previewImg.style.display='none'; previewImg.src=''; }
            return; 
        }
        const reader = new FileReader();
        reader.onload = function(evt){
            if(previewImg) {
                previewImg.src = evt.target.result;
                previewImg.style.display = 'block';
            }
        }
        reader.readAsDataURL(f);
    });
}

function uidCustom(){ return 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

function addCustomToCart(options){
    const newUid = uidCustom(); 
    const name = `Bougie personnalisée — ${options.modele}`;
    const selectedModelData = PRODUCTS.find(p => p.name === options.modele);
    const unitPrice = selectedModelData ? selectedModelData.price : 0;

    CART[newUid] = {
        id: newUid,
        name,
        price: unitPrice,
        img: options.image || 'img/candle1.jpeg',
        qty: options.qty || 1,
        options: {
            parfum: options.parfum,
            modele: options.modele,
            couleur: selectedColors.join(", "),
            message: options.message || '',
            image: options.image || ''
        }
    };
    saveCart();

    const customForm = document.getElementById('custom-form');
    if(customForm) customForm.reset();
    if(previewImg) previewImg.style.display='none';

    updateCustomPreview();
    if(customModal) customModal.classList.remove('open');

    selectedColors = [];
    document.querySelectorAll(".color-box").forEach(box => box.classList.remove("selected"));
}

if(addCustomBtn){
    addCustomBtn.addEventListener('click', ()=>{
        const parfum = customParfum.value.trim();
        const modele = customModele.value;
        const qty = Number(customQty.value) || 1;
        const message = customMessage.value.trim();

        if (!modele || !parfum || selectedColors.length === 0) {
            alert("Veuillez choisir un Modèle, un Parfum, et au moins une couleur.");
            return;
        }

        // Récupérer image ou mettre une bougie si aucune
        const previewImg = document.getElementById("preview-img");
        const img = (previewImg && previewImg.src && previewImg.style.display !== "none")
            ? previewImg.src
            : "🕯️";  // emoji bougie par défaut

        addCustomToCart({
            parfum,
            modele,
            qty,
            message,
            image: img
        });
    });
}


/* =========================
   INITIALISATION
   ========================= */
renderProducts();
renderGallery();
updateCartUI();
updateCustomPreview();

/* =========================
EXPORTS for console debugging (optional)
========================= */
// eslint-disable-next-line no-unused-expressions
window.BG = {
     PRODUCTS, GALLERY, CART, addToCart, changeQty, clearCart, addCustomToCart, cartToMessage
};












//________________________________________________________________________________________________________________________________________________________

  // Ouvrir/fermer chat
  const floatAi = document.getElementById('float-ai');
  const aiChat = document.getElementById('ai-chat');
  const closeBtn = document.getElementById('close-ai-chat');
  floatAi.addEventListener('click', () => {
    aiChat.style.display = aiChat.style.display === 'flex' ? 'none' : 'flex';
  });
  closeBtn.addEventListener('click', () => aiChat.style.display = 'none');

  // Messages
  const sendBtn = document.getElementById('ai-send');
  const input = document.getElementById('ai-input');
  const messages = document.getElementById('ai-chat-messages');

  function showMsg(text, from='bot') {
    const div = document.createElement('div');
    div.className = 'msg ' + from;
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMsg() {
    const text = input.value.trim();
    if(!text) return;
    showMsg(text, 'user');
    input.value = '';
setTimeout(() => showMsg(getResponseFromData(text), 'bot'), 300);
  }

  sendBtn.addEventListener('click', sendMsg);
  input.addEventListener('keypress', e => { if(e.key==='Enter') sendMsg(); });



//__________________________________________________________________________________________________________________________________________________
// === Déplacement du chat ===
const header = document.getElementById('ai-chat-header');
let isDragging = false;
let offsetX, offsetY;

header.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - aiChat.offsetLeft;
  offsetY = e.clientY - aiChat.offsetTop;
  aiChat.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  aiChat.style.left = e.clientX - offsetX + 'px';
  aiChat.style.top = e.clientY - offsetY + 'px';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  aiChat.style.cursor = 'grab';
});
