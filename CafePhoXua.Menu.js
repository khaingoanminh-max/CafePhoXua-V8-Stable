/*!
 * CafePhoXua.Menu.js
 * CafePhoXua V8 Stable - Sales UI 2026
 * 42 drinks / 7 categories
 */
(function (window, document) {
    'use strict';

    const categories = [
        { id:'coffee', title:'☕ Cà Phê Truyền Thống', items:[
            ['Cafe Đen Nóng',15000,'Cà phê nóng đậm đà, thơm nguyên chất.','coffee-01.webp'],
            ['Cafe Đen Đá',15000,'Cà phê rang xay đậm vị, dùng cùng đá mát lạnh.','coffee-08.webp'],
            ['Cafe Sữa Nóng',20000,'Cà phê sữa nóng béo thơm, phong vị truyền thống.','coffee-01.webp'],
            ['Cafe Sữa Đá',20000,'Cà phê đậm hòa sữa đặc, mát lạnh và dễ uống.','coffee-09.webp'],
            ['Bạc Xỉu',30000,'Nhiều sữa, nhẹ cà phê, thơm béo dịu dàng.','coffee-02.webp'],
            ['Cafe Muối',30000,'Cà phê đậm vị kết hợp lớp kem muối béo nhẹ.','coffee-02.webp']
        ]},
        { id:'tea', title:'🍹 Trà & Trái Cây', items:[
            ['Trà Tắc',20000,'Trà thơm hòa vị tắc chua ngọt, giải khát sảng khoái.','coffee-04.webp'],
            ['Trà Chanh',20000,'Trà thanh nhẹ, chanh tươi chua dịu, mát lạnh.','coffee-04.webp'],
            ['Trà Đào Cam Sả',30000,'Đào ngọt thanh, cam tươi và sả thơm dễ chịu.','coffee-03.webp'],
            ['Trà Vải',30000,'Trà thanh mát kết hợp vải ngọt thơm.','coffee-03.webp'],
            ['Trà Dâu',30000,'Vị trà nhẹ hòa dâu chua ngọt tươi mát.','coffee-03.webp'],
            ['Trà Gừng Mật Ong',25000,'Ấm thơm vị gừng, dịu ngọt mật ong.','coffee-05.webp']
        ]},
        { id:'milktea', title:'🧋 Trà Sữa', items:[
            ['Trà Sữa Truyền Thống',25000,'Trà thơm, sữa béo vừa, vị cân bằng dễ uống.','coffee-03.webp'],
            ['Trà Sữa Thái Xanh',30000,'Hương trà Thái xanh thơm đặc trưng, béo mát.','coffee-03.webp'],
            ['Trà Sữa Thái Đỏ',30000,'Trà Thái đỏ thơm đậm, vị sữa hài hòa.','coffee-03.webp'],
            ['Trà Sữa Ô Long',30000,'Ô long thơm sâu kết hợp sữa béo nhẹ.','coffee-05.webp'],
            ['Trà Sữa Matcha',35000,'Matcha thơm dịu, sữa béo mịn.','coffee-05.webp'],
            ['Trà Sữa Socola',35000,'Socola đậm vị kết hợp trà sữa béo thơm.','coffee-05.webp']
        ]},
        { id:'juice', title:'🍊 Nước Ép Tươi', items:[
            ['Nước Ép Cam',30000,'Cam tươi ép nguyên vị, chua ngọt tự nhiên.','coffee-04.webp'],
            ['Nước Ép Chanh Dây',25000,'Chanh dây thơm mát, vị chua ngọt dễ uống.','coffee-04.webp'],
            ['Nước Ép Dưa Hấu',25000,'Dưa hấu tươi mát, vị ngọt nhẹ tự nhiên.','coffee-04.webp'],
            ['Nước Ép Thơm',25000,'Thơm tươi ép mát lạnh, vị chua ngọt hài hòa.','coffee-04.webp'],
            ['Nước Ép Ổi',25000,'Ổi tươi thơm dịu, thanh mát.','coffee-04.webp'],
            ['Nước Ép Cà Rốt',25000,'Cà rốt tươi ép nguyên vị, dễ uống.','coffee-04.webp']
        ]},
        { id:'smoothie', title:'🥑 Sinh Tố', items:[
            ['Sinh Tố Bơ',35000,'Bơ xay mịn, béo thơm và sánh mượt.','coffee-05.webp'],
            ['Sinh Tố Dâu',35000,'Dâu chua ngọt xay mịn cùng sữa.','coffee-05.webp'],
            ['Sinh Tố Xoài',30000,'Xoài chín thơm ngọt, xay mịn mát lạnh.','coffee-05.webp'],
            ['Sinh Tố Mãng Cầu',35000,'Mãng cầu chua ngọt, thơm béo và mát lạnh.','coffee-05.webp'],
            ['Sinh Tố Sapoche',30000,'Sapoche ngọt dịu, xay mịn cùng sữa.','coffee-05.webp'],
            ['Sinh Tố Chuối',25000,'Chuối chín thơm béo, xay mịn dễ uống.','coffee-05.webp']
        ]},
        { id:'refresh', title:'🥤 Soda & Giải Khát', items:[
            ['Soda Chanh',25000,'Soda mát lạnh hòa vị chanh tươi sảng khoái.','coffee-04.webp'],
            ['Soda Dâu',30000,'Soda có ga kết hợp vị dâu chua ngọt.','coffee-04.webp'],
            ['Soda Việt Quất',30000,'Soda mát lạnh với hương việt quất thơm dịu.','coffee-04.webp'],
            ['Đá Me',25000,'Me chua ngọt đậm vị, dùng cùng đá mát lạnh.','coffee-04.webp'],
            ['Chanh Muối',20000,'Chanh muối truyền thống, thanh mát dễ uống.','coffee-04.webp'],
            ['Tắc Xí Muội',25000,'Tắc chua thanh kết hợp xí muội đậm đà.','coffee-04.webp']
        ]},
        { id:'iceblend', title:'❄️ Đá Xay & Món Đặc Biệt', items:[
            ['Cafe Đá Xay',35000,'Cà phê đậm thơm xay mịn cùng đá.','coffee-02.webp'],
            ['Matcha Đá Xay',40000,'Matcha thơm dịu, béo mịn và mát lạnh.','coffee-05.webp'],
            ['Socola Đá Xay',40000,'Socola đậm vị xay mịn, thơm béo.','coffee-05.webp'],
            ['Cookies Đá Xay',40000,'Bánh quy xay cùng sữa và đá, thơm béo vui miệng.','coffee-05.webp'],
            ['Dâu Sữa Đá Xay',40000,'Dâu chua ngọt hòa sữa béo, xay mịn mát lạnh.','coffee-05.webp'],
            ['Oreo Đá Xay',40000,'Oreo giòn thơm kết hợp sữa và đá xay mịn.','coffee-05.webp']
        ]}
    ];

    const bestSellers = new Set([
        'Cafe Sữa Đá','Cafe Muối','Bạc Xỉu','Trà Đào Cam Sả',
        'Trà Sữa Truyền Thống','Sinh Tố Bơ'
    ]);

    function money(value){ return Number(value||0).toLocaleString('vi-VN')+'đ'; }
    function esc(value){
        return String(value??'')
          .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
          .replaceAll('"','&quot;').replaceAll("'",'&#039;');
    }
    function normalize(value){
        return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
          .replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();
    }

    function card(category, item){
        const [name,price,description,image] = item;
        const hot = bestSellers.has(name);
        return `
          <article class="menu-card sales-card"
            data-category="${esc(category.id)}"
            data-search="${esc(normalize(name+' '+description+' '+category.title))}">
            <div class="sales-card-media">
              <img src="images/${esc(image)}" alt="${esc(name)}" loading="lazy" decoding="async">
              ${hot ? '<span class="sales-badge">🔥 Bán chạy</span>' : ''}
            </div>
            <div class="menu-card-body sales-card-body">
              <h3>${esc(name)}</h3>
              <p>${esc(description)}</p>
              <div class="sales-card-footer">
                <span class="price">${money(price)}</span>
                <a href="#" class="menu-order-btn" data-product="${esc(name)}" data-price="${price}">+ Thêm vào giỏ</a>
              </div>
            </div>
          </article>`;
    }

    function renderMenu(){
        const menu=document.getElementById('menu');
        if(!menu || menu.dataset.salesUiReady==='true') return;

        const pills = [
          ['all','Tất cả'],
          ...categories.map(c=>[c.id,c.title.replace(/^\S+\s/,'')]),
          ['hot','Bán chạy']
        ].map(([id,label],i)=>`<button type="button" class="sales-filter${i===0?' is-active':''}" data-filter="${esc(id)}">${esc(label)}</button>`).join('');

        const hotCards = categories.flatMap(c=>c.items.filter(i=>bestSellers.has(i[0])).map(i=>card(c,i))).join('');
        const sections = categories.map(c=>`
          <section class="menu-category sales-category" id="menu-${c.id}" data-category-section="${c.id}">
            <div class="sales-category-heading">
              <h3 class="menu-category-title">${esc(c.title)}</h3>
              <span>${c.items.length} món</span>
            </div>
            <div class="menu-grid">${c.items.map(i=>card(c,i)).join('')}</div>
          </section>`).join('');

        menu.innerHTML=`
          <div class="container">
            <div class="section-header sales-menu-header">
              <span class="section-tag">Thực đơn Cafe Phố Xưa</span>
              <h2>Chọn món nhanh • Đặt hàng dễ dàng</h2>
              <div class="line"></div>
              <p>42 thức uống cho mọi lứa tuổi. Tìm món, lọc theo nhóm và thêm trực tiếp vào giỏ hàng.</p>
            </div>

            <div class="sales-toolbar">
              <label class="sales-search">
                <span>🔎</span>
                <input id="menuSearch" type="search" placeholder="Tìm: cafe muối, trà đào, sinh tố..." autocomplete="off">
                <button id="menuSearchClear" type="button" aria-label="Xóa tìm kiếm">×</button>
              </label>
              <div class="sales-filters" role="group" aria-label="Lọc thực đơn">${pills}</div>
            </div>

            <section class="sales-hot" id="salesHot">
              <div class="sales-hot-heading">
                <div><span>Gợi ý hôm nay</span><h3>🔥 Món bán chạy</h3></div>
                <small>Dễ chọn cho lần đầu ghé quán</small>
              </div>
              <div class="menu-grid">${hotCards}</div>
            </section>

            <div id="salesEmpty" class="sales-empty" hidden>
              <div>🥤</div><strong>Chưa tìm thấy món phù hợp</strong>
              <p>Thử tên khác hoặc chọn lại “Tất cả”.</p>
            </div>
            ${sections}
          </div>`;
        menu.dataset.salesUiReady='true';
    }

    function applyFilter(){
        const menu=document.getElementById('menu');
        if(!menu) return;
        const query=normalize(document.getElementById('menuSearch')?.value||'');
        const active=menu.querySelector('.sales-filter.is-active')?.dataset.filter||'all';
        let visible=0;

        menu.querySelectorAll('.sales-category').forEach(section=>{
            let sectionVisible=0;
            section.querySelectorAll('.sales-card').forEach(card=>{
                const byText=!query || card.dataset.search.includes(query);
                const byFilter=active==='all' || active===card.dataset.category ||
                  (active==='hot' && bestSellers.has(card.querySelector('h3')?.textContent||''));
                const show=byText && byFilter;
                card.hidden=!show;
                if(show){ visible++; sectionVisible++; }
            });
            section.hidden=sectionVisible===0;
        });

        const hot=document.getElementById('salesHot');
        if(hot) hot.hidden = Boolean(query) || active!=='all';
        const empty=document.getElementById('salesEmpty');
        if(empty) empty.hidden=visible!==0;
    }

    function bindUi(){
        const menu=document.getElementById('menu');
        if(!menu || menu.dataset.salesEvents==='true') return;

        menu.addEventListener('click',event=>{
            const filter=event.target.closest('.sales-filter');
            if(filter){
                menu.querySelectorAll('.sales-filter').forEach(b=>b.classList.remove('is-active'));
                filter.classList.add('is-active');
                applyFilter();
                return;
            }

            const clear=event.target.closest('#menuSearchClear');
            if(clear){
                const input=document.getElementById('menuSearch');
                if(input){ input.value=''; input.focus(); }
                applyFilter();
                return;
            }

            const button=event.target.closest('.menu-order-btn');
            if(!button || !menu.contains(button)) return;
            event.preventDefault();
            if(button.dataset.busy==='true') return;

            const product=button.dataset.product||'';
            const price=Number(button.dataset.price)||0;
            if(typeof window.addToCart!=='function'){
                console.error('[CafePhoXua.Menu] addToCart chưa sẵn sàng.');
                return;
            }
            window.addToCart(product,price);

            button.dataset.busy='true';
            const old=button.textContent;
            button.textContent='✓ Đã thêm';
            button.classList.add('is-added');
            setTimeout(()=>{button.textContent=old;button.classList.remove('is-added');button.dataset.busy='false';},900);
        });

        document.getElementById('menuSearch')?.addEventListener('input',applyFilter);
        menu.dataset.salesEvents='true';
    }

    function injectStyles(){
        if(document.getElementById('cpx-sales-ui-style')) return;
        const style=document.createElement('style');
        style.id='cpx-sales-ui-style';
        style.textContent=`
          .sales-menu-header{max-width:780px;margin-left:auto;margin-right:auto}
          .sales-toolbar{position:sticky;top:72px;z-index:35;background:rgba(248,248,248,.96);backdrop-filter:blur(12px);padding:14px;border-radius:20px;margin:-12px 0 34px;box-shadow:0 10px 30px rgba(44,28,16,.08)}
          .sales-search{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #eadfd4;border-radius:16px;padding:0 14px;box-shadow:0 3px 14px rgba(0,0,0,.04)}
          .sales-search input{flex:1;border:0;outline:0;padding:15px 0;font-size:16px;background:transparent;color:#2f2118;min-width:0}
          .sales-search button{border:0;background:transparent;font-size:24px;line-height:1;color:#8c7a6a;cursor:pointer;padding:6px}
          .sales-filters{display:flex;gap:8px;overflow-x:auto;padding:12px 2px 2px;scrollbar-width:none}
          .sales-filters::-webkit-scrollbar{display:none}
          .sales-filter{flex:0 0 auto;border:1px solid #e7d8ca;background:#fff;color:#6f451f;border-radius:999px;padding:9px 14px;font-weight:700;cursor:pointer}
          .sales-filter.is-active{background:#6f451f;color:#fff;border-color:#6f451f}
          .sales-hot{background:linear-gradient(135deg,#fff8ef,#fff);border:1px solid #f1dfc9;border-radius:24px;padding:24px;margin-bottom:50px}
          .sales-hot-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px}
          .sales-hot-heading span{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#a66b2d}
          .sales-hot-heading h3{font-size:27px;margin:4px 0 0;color:#3d2a1d}
          .sales-hot-heading small{color:#7d7066}
          .sales-category{scroll-margin-top:190px;margin-bottom:56px}
          .sales-category-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
          .sales-category-heading .menu-category-title{margin:0;text-align:left}
          .sales-category-heading>span{font-weight:700;color:#887565;background:#f4ede7;border-radius:999px;padding:7px 11px}
          .sales-card{display:flex;flex-direction:column;height:100%;overflow:hidden;border-radius:18px;transition:transform .2s,box-shadow .2s}
          .sales-card:hover{transform:translateY(-4px);box-shadow:0 14px 32px rgba(0,0,0,.12)}
          .sales-card-media{position:relative;overflow:hidden}
          .sales-card-media img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;transition:transform .35s}
          .sales-card:hover .sales-card-media img{transform:scale(1.04)}
          .sales-badge{position:absolute;left:12px;top:12px;background:#fff3dc;color:#9b5515;border-radius:999px;padding:7px 10px;font-weight:800;font-size:12px;box-shadow:0 5px 15px rgba(0,0,0,.12)}
          .sales-card-body{display:flex;flex:1;flex-direction:column;align-items:stretch;padding:18px}
          .sales-card-body h3{margin:0 0 8px}
          .sales-card-body p{margin:0;color:#77695f;line-height:1.5;min-height:46px}
          .sales-card-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:auto;padding-top:16px}
          .sales-card-footer .price{font-size:18px;font-weight:900;color:#6f451f;white-space:nowrap}
          .menu-order-btn{display:inline-flex;align-items:center;justify-content:center;border-radius:12px;padding:10px 13px;background:#a66b2d;color:#fff;text-decoration:none;font-weight:800;transition:.2s}
          .menu-order-btn:hover{background:#87521f;transform:translateY(-1px)}
          .menu-order-btn.is-added{background:#28a745}
          .sales-empty{text-align:center;padding:46px 20px;background:#fff;border:1px dashed #d8c8ba;border-radius:20px;margin:22px 0}
          .sales-empty div{font-size:42px}.sales-empty strong{display:block;font-size:20px;margin:8px}.sales-empty p{margin:0;color:#777}
          @media(max-width:768px){
            .sales-toolbar{top:0;margin:0 -4px 26px;padding:10px;border-radius:16px}
            .sales-search input{font-size:16px;padding:13px 0}
            .sales-filter{padding:8px 12px;font-size:13px}
            .sales-hot{padding:16px;border-radius:18px;margin-bottom:34px}
            .sales-hot-heading{align-items:flex-start;flex-direction:column;gap:4px}
            .sales-hot-heading h3{font-size:23px}
            .sales-category{scroll-margin-top:130px;margin-bottom:40px}
            .sales-category-heading .menu-category-title{font-size:23px}
            .sales-card-body{padding:14px}
            .sales-card-body p{min-height:0}
            .sales-card-footer{align-items:stretch;flex-direction:column}
            .menu-order-btn{width:100%;box-sizing:border-box}
          }
        `;
        document.head.appendChild(style);
    }

    function init(){ injectStyles(); renderMenu(); bindUi(); applyFilter(); }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();

    window.CafePhoXuaMenu=Object.freeze({
        version:'8.1.0-sales-ui',
        categories,
        bestSellers:[...bestSellers],
        init
    });
})(window, document);
