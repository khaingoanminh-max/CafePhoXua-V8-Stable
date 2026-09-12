/* CafePhoXua.Branding.js - V8.8 production brand + real menu photos */
(function(w,d){'use strict';
function keepRealMenuPhotos(){
  d.querySelectorAll('#menu .menu-card').forEach(card=>{
    const art=card.querySelector('.cpx-art-wrap');
    if(art){
      const name=card.querySelector('h3')?.textContent?.trim()||'Cafe Phố Xưa';
      const category=card.dataset.category||'';
      const fallback={coffee:'coffee-01.webp',tea:'coffee-03.webp',milktea:'coffee-05.webp',juice:'coffee-04.webp',smoothie:'coffee-05.webp',refresh:'coffee-04.webp',iceblend:'coffee-02.webp'}[category]||'coffee-03.webp';
      const img=d.createElement('img');
      img.src='images/'+fallback;
      img.alt=name;
      img.loading='lazy';
      img.decoding='async';
      art.replaceWith(img);
    }
    const img=card.querySelector('.sales-card-media img');
    if(img){
      img.loading='lazy';
      img.decoding='async';
      img.fetchPriority='low';
      img.removeAttribute('width');
      img.removeAttribute('height');
    }
    card.dataset.brandArt='real-photo';
  });
}
function enhanceHero(){
  const hero=d.querySelector('.hero-content');
  if(!hero||hero.dataset.brandDone)return;
  const p=hero.querySelector('p');
  if(p)p.innerHTML='Không gian xưa – Cà phê thật.<br>42 thức uống từ cà phê, trà sữa đến sinh tố và đá xay.';
  const buttons=hero.querySelector('.hero-buttons');
  if(buttons)buttons.innerHTML='<a href="#menu" class="btn btn-primary">☕ Xem thực đơn</a><a href="https://zalo.me/0868708799" target="_blank" rel="noopener noreferrer" class="btn btn-outline">💬 Đặt giao tận nơi – Zalo 0868708799</a>';
  hero.dataset.brandDone='1';
}
function bindProductionUx(){
  if(d.documentElement.dataset.cpxProdUx==='1')return;
  d.documentElement.dataset.cpxProdUx='1';
  const continueBtn=d.getElementById('btnContinueShopping');
  if(continueBtn)continueBtn.addEventListener('click',()=>{const overlay=d.getElementById('paymentOverlay');if(overlay)overlay.style.display='none';d.getElementById('menu')?.scrollIntoView({behavior:'smooth',block:'start'});});
  const cart=d.getElementById('cart-icon');
  if(cart)cart.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cart.click();}});
  d.querySelectorAll('a[target="_blank"]').forEach(a=>{const rel=new Set((a.getAttribute('rel')||'').split(/\s+/).filter(Boolean));rel.add('noopener');rel.add('noreferrer');a.setAttribute('rel',[...rel].join(' '));});
}
function css(){
  if(d.getElementById('cpx-brand-style'))return;
  const s=d.createElement('style');s.id='cpx-brand-style';s.textContent=`
  .hero-content .hero-buttons{flex-wrap:wrap}.hero-content .hero-buttons .btn{min-height:46px;display:inline-flex;align-items:center;justify-content:center}.hero-image img{border-radius:28px;box-shadow:0 24px 60px rgba(50,31,18,.18)}
  #menu .sales-card-media{height:220px;background:#f4eee8}
  #menu .sales-card-media img{width:100%!important;height:100%!important;aspect-ratio:auto!important;object-fit:cover!important;display:block!important}
  #menu .sales-card-body{min-width:0}
  #menu .sales-card-footer{display:grid!important;grid-template-columns:auto minmax(118px,1fr);align-items:center!important;gap:12px!important}
  #menu .menu-order-btn{white-space:nowrap!important;line-height:1.15!important;padding:11px 14px!important;min-height:42px!important;box-sizing:border-box!important}
  #menu .sales-toolbar{position:relative!important;top:auto!important;z-index:10!important;margin:0 0 34px!important}
  #menu .sales-category{scroll-margin-top:92px!important}
  @media(max-width:900px){#menu .sales-card-media{height:190px}}
  @media(max-width:768px){#menu .sales-toolbar{position:relative!important;top:auto!important;margin:0 0 24px!important}#menu .sales-card-footer{grid-template-columns:1fr!important}#menu .menu-order-btn{width:100%!important}#menu .sales-card-media{height:180px}.hero-content .hero-buttons{display:grid;grid-template-columns:1fr}.hero-content .hero-buttons .btn{width:100%;box-sizing:border-box;font-size:14px}}
  @media(max-width:480px){#menu .sales-card-media{height:165px}}
  `;d.head.appendChild(s);
}
function init(){css();enhanceHero();keepRealMenuPhotos();bindProductionUx();const m=d.getElementById('menu');if(m)new MutationObserver(keepRealMenuPhotos).observe(m,{childList:true,subtree:true});}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init,{once:true});else init();
w.CafePhoXuaBranding=Object.freeze({version:'8.8.0',refresh:keepRealMenuPhotos});
})(window,document);