/*!
 * CafePhoXua.Menu.js
 * CafePhoXua V8 Stable - Full Menu 2026
 * 42 drinks / 7 categories
 */
(function (window, document) {
    'use strict';

    const categories = [
        {
            id: 'coffee',
            title: '☕ Cà Phê Truyền Thống',
            items: [
                ['Cafe Đen Nóng', 15000, 'Cà phê nóng đậm đà, thơm nguyên chất.', 'coffee-01.webp'],
                ['Cafe Đen Đá', 15000, 'Cà phê rang xay đậm vị, dùng cùng đá mát lạnh.', 'coffee-08.webp'],
                ['Cafe Sữa Nóng', 20000, 'Cà phê sữa nóng béo thơm, phong vị truyền thống.', 'coffee-01.webp'],
                ['Cafe Sữa Đá', 20000, 'Cà phê đậm hòa sữa đặc, mát lạnh và dễ uống.', 'coffee-09.webp'],
                ['Bạc Xỉu', 30000, 'Nhiều sữa, nhẹ cà phê, thơm béo dịu dàng.', 'coffee-02.webp'],
                ['Cafe Muối', 30000, 'Cà phê đậm vị kết hợp lớp kem muối béo nhẹ.', 'coffee-02.webp']
            ]
        },
        {
            id: 'tea',
            title: '🍹 Trà & Trái Cây',
            items: [
                ['Trà Tắc', 20000, 'Trà thơm hòa vị tắc chua ngọt, giải khát sảng khoái.', 'coffee-04.webp'],
                ['Trà Chanh', 20000, 'Trà thanh nhẹ, chanh tươi chua dịu, mát lạnh.', 'coffee-04.webp'],
                ['Trà Đào Cam Sả', 30000, 'Đào ngọt thanh, cam tươi và sả thơm dễ chịu.', 'coffee-03.webp'],
                ['Trà Vải', 30000, 'Trà thanh mát kết hợp vải ngọt thơm.', 'coffee-03.webp'],
                ['Trà Dâu', 30000, 'Vị trà nhẹ hòa dâu chua ngọt tươi mát.', 'coffee-03.webp'],
                ['Trà Gừng Mật Ong', 25000, 'Ấm thơm vị gừng, dịu ngọt mật ong.', 'coffee-05.webp']
            ]
        },
        {
            id: 'milktea',
            title: '🧋 Trà Sữa',
            items: [
                ['Trà Sữa Truyền Thống', 25000, 'Trà thơm, sữa béo vừa, vị cân bằng dễ uống.', 'coffee-03.webp'],
                ['Trà Sữa Thái Xanh', 30000, 'Hương trà Thái xanh thơm đặc trưng, béo mát.', 'coffee-03.webp'],
                ['Trà Sữa Thái Đỏ', 30000, 'Trà Thái đỏ thơm đậm, vị sữa hài hòa.', 'coffee-03.webp'],
                ['Trà Sữa Ô Long', 30000, 'Ô long thơm sâu kết hợp sữa béo nhẹ.', 'coffee-05.webp'],
                ['Trà Sữa Matcha', 35000, 'Matcha thơm dịu, sữa béo mịn.', 'coffee-05.webp'],
                ['Trà Sữa Socola', 35000, 'Socola đậm vị kết hợp trà sữa béo thơm.', 'coffee-05.webp']
            ]
        },
        {
            id: 'juice',
            title: '🍊 Nước Ép Tươi',
            items: [
                ['Nước Ép Cam', 30000, 'Cam tươi ép nguyên vị, chua ngọt tự nhiên.', 'coffee-04.webp'],
                ['Nước Ép Chanh Dây', 25000, 'Chanh dây thơm mát, vị chua ngọt dễ uống.', 'coffee-04.webp'],
                ['Nước Ép Dưa Hấu', 25000, 'Dưa hấu tươi mát, vị ngọt nhẹ tự nhiên.', 'coffee-04.webp'],
                ['Nước Ép Thơm', 25000, 'Thơm tươi ép mát lạnh, vị chua ngọt hài hòa.', 'coffee-04.webp'],
                ['Nước Ép Ổi', 25000, 'Ổi tươi thơm dịu, thanh mát.', 'coffee-04.webp'],
                ['Nước Ép Cà Rốt', 25000, 'Cà rốt tươi ép nguyên vị, dễ uống.', 'coffee-04.webp']
            ]
        },
        {
            id: 'smoothie',
            title: '🥑 Sinh Tố',
            items: [
                ['Sinh Tố Bơ', 35000, 'Bơ xay mịn, béo thơm và sánh mượt.', 'coffee-05.webp'],
                ['Sinh Tố Dâu', 35000, 'Dâu chua ngọt xay mịn cùng sữa.', 'coffee-05.webp'],
                ['Sinh Tố Xoài', 30000, 'Xoài chín thơm ngọt, xay mịn mát lạnh.', 'coffee-05.webp'],
                ['Sinh Tố Mãng Cầu', 35000, 'Mãng cầu chua ngọt, thơm béo và mát lạnh.', 'coffee-05.webp'],
                ['Sinh Tố Sapoche', 30000, 'Sapoche ngọt dịu, xay mịn cùng sữa.', 'coffee-05.webp'],
                ['Sinh Tố Chuối', 25000, 'Chuối chín thơm béo, xay mịn dễ uống.', 'coffee-05.webp']
            ]
        },
        {
            id: 'refresh',
            title: '🥤 Soda & Giải Khát',
            items: [
                ['Soda Chanh', 25000, 'Soda mát lạnh hòa vị chanh tươi sảng khoái.', 'coffee-04.webp'],
                ['Soda Dâu', 30000, 'Soda có ga kết hợp vị dâu chua ngọt.', 'coffee-04.webp'],
                ['Soda Việt Quất', 30000, 'Soda mát lạnh với hương việt quất thơm dịu.', 'coffee-04.webp'],
                ['Đá Me', 25000, 'Me chua ngọt đậm vị, dùng cùng đá mát lạnh.', 'coffee-04.webp'],
                ['Chanh Muối', 20000, 'Chanh muối truyền thống, thanh mát dễ uống.', 'coffee-04.webp'],
                ['Tắc Xí Muội', 25000, 'Tắc chua thanh kết hợp xí muội đậm đà.', 'coffee-04.webp']
            ]
        },
        {
            id: 'iceblend',
            title: '❄️ Đá Xay & Món Đặc Biệt',
            items: [
                ['Cafe Đá Xay', 35000, 'Cà phê đậm thơm xay mịn cùng đá.', 'coffee-02.webp'],
                ['Matcha Đá Xay', 40000, 'Matcha thơm dịu, béo mịn và mát lạnh.', 'coffee-05.webp'],
                ['Socola Đá Xay', 40000, 'Socola đậm vị xay mịn, thơm béo.', 'coffee-05.webp'],
                ['Cookies Đá Xay', 40000, 'Bánh quy xay cùng sữa và đá, thơm béo vui miệng.', 'coffee-05.webp'],
                ['Dâu Sữa Đá Xay', 40000, 'Dâu chua ngọt hòa sữa béo, xay mịn mát lạnh.', 'coffee-05.webp'],
                ['Oreo Đá Xay', 40000, 'Oreo giòn thơm kết hợp sữa và đá xay mịn.', 'coffee-05.webp']
            ]
        }
    ];

    function money(value) {
        return Number(value || 0).toLocaleString('vi-VN') + 'đ';
    }

    function escapeHtml(value) {
        return String(value || '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function renderMenu() {
        const menu = document.getElementById('menu');
        if (!menu || menu.dataset.fullMenuReady === 'true') return;

        const nav = categories.map(category =>
            `<a href="#menu-${category.id}">${escapeHtml(category.title.replace(/^\S+\s/, ''))}</a>`
        ).join('');

        const sections = categories.map(category => {
            const cards = category.items.map(([name, price, description, image]) => `
                <article class="menu-card">
                    <img src="images/${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="lazy">
                    <div class="menu-card-body">
                        <h3>${escapeHtml(name)}</h3>
                        <p>${escapeHtml(description)}</p>
                        <span class="price">${money(price)}</span>
                        <a href="#" class="menu-order-btn" data-product="${escapeHtml(name)}" data-price="${price}">☕ Đặt ngay</a>
                    </div>
                </article>`).join('');

            return `
                <section class="menu-category" id="menu-${category.id}">
                    <h3 class="menu-category-title">${escapeHtml(category.title)}</h3>
                    <div class="menu-grid">${cards}</div>
                </section>`;
        }).join('');

        menu.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <span class="section-tag">Thực đơn Cafe Phố Xưa</span>
                    <h2>Đầy đủ thức uống cho mọi lứa tuổi</h2>
                    <div class="line"></div>
                    <p>Từ cà phê truyền thống đến trà, sinh tố, nước ép và đá xay. Chọn món yêu thích và bấm “Đặt ngay” để thêm vào giỏ hàng.</p>
                </div>
                <nav class="menu-category-nav" aria-label="Danh mục thực đơn">${nav}</nav>
                ${sections}
            </div>`;

        menu.dataset.fullMenuReady = 'true';
    }

    function bindOrders() {
        const menu = document.getElementById('menu');
        if (!menu || menu.dataset.fullMenuEvents === 'true') return;

        menu.addEventListener('click', function (event) {
            const button = event.target.closest('.menu-order-btn');
            if (!button || !menu.contains(button)) return;

            event.preventDefault();

            const product = button.dataset.product || '';
            const price = Number(button.dataset.price) || 0;

            if (typeof window.addToCart === 'function') {
                window.addToCart(product, price);
            } else {
                console.error('[CafePhoXua.Menu] addToCart chưa sẵn sàng.');
                return;
            }

            const cartIcon = document.getElementById('cart-icon');
            if (cartIcon) {
                cartIcon.classList.add('cart-bounce');
                setTimeout(() => cartIcon.classList.remove('cart-bounce'), 400);
            }

            if (button.dataset.busy === 'true') return;
            button.dataset.busy = 'true';
            const oldText = button.innerHTML;
            button.innerHTML = '✔ Đã thêm';
            button.classList.add('is-added');
            setTimeout(function () {
                button.innerHTML = oldText;
                button.classList.remove('is-added');
                button.dataset.busy = 'false';
            }, 900);
        });

        menu.dataset.fullMenuEvents = 'true';
    }

    function injectStyles() {
        if (document.getElementById('cafe-pho-xua-menu-v8-style')) return;
        const style = document.createElement('style');
        style.id = 'cafe-pho-xua-menu-v8-style';
        style.textContent = `
            .menu-category-nav{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:-20px auto 45px;max-width:980px;position:sticky;top:76px;z-index:20;padding:12px;border-radius:18px;background:rgba(248,248,248,.94);backdrop-filter:blur(10px)}
            .menu-category-nav a{display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:999px;background:#fff;color:#6f451f;text-decoration:none;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.07);transition:.2s}
            .menu-category-nav a:hover{background:#a66b2d;color:#fff;transform:translateY(-2px)}
            .menu-category{scroll-margin-top:155px;margin-bottom:62px}
            .menu-category-title{text-align:center;font-size:28px;color:#3d2a1d;margin:0 0 28px;letter-spacing:.3px}
            .menu-card{display:flex;flex-direction:column;height:100%}
            .menu-card-body{display:flex;flex:1;flex-direction:column;align-items:center;padding:0 18px 22px}
            .menu-card-body p{min-height:52px;margin-bottom:0}
            .menu-card-body .price{margin-top:auto;margin-bottom:16px}
            .menu-order-btn{display:inline-flex;align-items:center;justify-content:center;min-width:136px;padding:11px 20px;border-radius:999px;background:#a66b2d;color:#fff;text-decoration:none;font-weight:700;transition:.2s;box-shadow:0 6px 16px rgba(166,107,45,.22)}
            .menu-order-btn:hover{background:#87521f;transform:translateY(-2px)}
            .menu-order-btn.is-added{background:#28a745}
            @media(max-width:768px){.menu-category-nav{position:static;margin-top:-25px;padding:8px;background:transparent}.menu-category-nav a{font-size:13px;padding:9px 12px}.menu-category-title{font-size:24px}.menu-card-body p{min-height:0}.menu-category{scroll-margin-top:90px;margin-bottom:45px}}
        `;
        document.head.appendChild(style);
    }

    function init() {
        injectStyles();
        renderMenu();
        bindOrders();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    window.CafePhoXuaMenu = Object.freeze({
        version: '8.0.0-menu-2026',
        categories,
        init
    });
})(window, document);
