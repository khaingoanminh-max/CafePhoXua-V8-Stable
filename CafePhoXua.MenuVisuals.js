/* CafePhoXua.MenuVisuals.js - lightweight drink recognition overlays */
(function(d){'use strict';
const icons={
'Cafe Đen Nóng':'☕','Cafe Đen Đá':'🧊☕','Cafe Sữa Nóng':'☕🥛','Cafe Sữa Đá':'🧊☕🥛','Bạc Xỉu':'🥛☕','Cafe Muối':'☕🥛',
'Trà Tắc':'🍋','Trà Chanh':'🍋','Trà Đào Cam Sả':'🍑🍊','Trà Vải':'🍈','Trà Dâu':'🍓','Trà Gừng Mật Ong':'🍯',
'Trà Sữa Truyền Thống':'🧋','Trà Sữa Thái Xanh':'🧋🌿','Trà Sữa Thái Đỏ':'🧋','Trà Sữa Ô Long':'🧋🍃','Trà Sữa Matcha':'🍵🧋','Trà Sữa Socola':'🍫🧋',
'Nước Ép Cam':'🍊','Nước Ép Chanh Dây':'🟡','Nước Ép Dưa Hấu':'🍉','Nước Ép Thơm':'🍍','Nước Ép Ổi':'🍐','Nước Ép Cà Rốt':'🥕',
'Sinh Tố Bơ':'🥑','Sinh Tố Dâu':'🍓','Sinh Tố Xoài':'🥭','Sinh Tố Mãng Cầu':'🍈','Sinh Tố Sapoche':'🥤','Sinh Tố Chuối':'🍌',
'Soda Chanh':'🍋🥤','Soda Dâu':'🍓🥤','Soda Việt Quất':'🫐🥤','Đá Me':'🥤','Chanh Muối':'🍋','Tắc Xí Muội':'🍋🥤',
'Cafe Đá Xay':'☕❄️','Matcha Đá Xay':'🍵❄️','Socola Đá Xay':'🍫❄️','Cookies Đá Xay':'🍪❄️','Dâu Sữa Đá Xay':'🍓🥛','Oreo Đá Xay':'🍪🥛'
};
function apply(){d.querySelectorAll('#menu .menu-card').forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim();const media=card.querySelector('.sales-card-media');if(!name||!media||media.querySelector('.cpx-drink-recognition'))return;const badge=d.createElement('span');badge.className='cpx-drink-recognition';badge.setAttribute('aria-label','Minh họa '+name);badge.innerHTML=`<span class="cpx-drink-icon">${icons[name]||'🥤'}</span><span class="cpx-drink-label">${name}</span>`;media.appendChild(badge);});}
function css(){if(d.getElementById('cpx-menu-visuals-style'))return;const s=d.createElement('style');s.id='cpx-menu-visuals-style';s.textContent=`#menu .sales-card-media{position:relative}#menu .cpx-drink-recognition{position:absolute;right:10px;bottom:10px;z-index:4;display:flex;align-items:center;gap:7px;max-width:calc(100% - 20px);padding:7px 10px;border:1px solid rgba(255,255,255,.72);border-radius:999px;background:rgba(255,250,244,.92);box-shadow:0 5px 16px rgba(52,31,16,.18);backdrop-filter:blur(7px);color:#4b2c18;font-weight:800;font-size:11px;line-height:1.1;pointer-events:none}.cpx-drink-icon{font-size:24px;line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12))}.cpx-drink-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#menu .sales-card:hover .cpx-drink-recognition{transform:translateY(-2px)}@media(max-width:600px){#menu .cpx-drink-recognition{right:7px;bottom:7px;padding:6px 8px;max-width:calc(100% - 14px)}.cpx-drink-icon{font-size:20px}.cpx-drink-label{font-size:10px}}`;d.head.appendChild(s);}
function init(){css();apply();const m=d.getElementById('menu');if(m)new MutationObserver(apply).observe(m,{childList:true,subtree:true});}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(document);
