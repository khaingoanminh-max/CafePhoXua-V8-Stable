/*!
 * ==========================================================
 * CafePhoXua - Application UI
 * ==========================================================
 * V8 Stable UI layer
 *
 * Responsibilities:
 * - Load and render the official menu dataset
 * - Connect UI actions to CafePhoXua.Cart
 * - Persist V8 cart state
 * - Render cart/payment summaries
 * - Coordinate checkout UI
 *
 * This file does NOT own cart data.
 * The single cart source of truth is CafePhoXua.Cart.
 * ==========================================================
 */
(function (window, document) {
    "use strict";

    const App = window.CafePhoXua;
    const Cart = App?.Cart;

    if (!App || !Cart) {
        throw new Error("[CafePhoXua.UI] Core/Cart chưa được tải.");
    }

    const MENU_URL = "src/data/menu.json";
    const CART_STORAGE_KEY = "cart";
    const IMAGE_FALLBACK = "images/coffee-01.webp";

    const $ = (id) => document.getElementById(id);

    const els = {
        menuGrid: document.querySelector(".menu-grid"),
        cartIcon: $("cart-icon"),
        cartPopup: $("cart-popup"),
        cartItems: $("cart-items"),
        cartCount: $("cart-count"),
        cartTotal: $("cart-total"),
        closeCart: $("close-cart"),
        paymentOverlay: $("paymentOverlay"),
        paymentOrderList: $("paymentOrderList"),
        paymentTotalPrice: $("paymentTotalPrice"),
        openPayment: $("btnOpenPaymentPopup"),
        closePayment: $("closePaymentPopup"),
        continueShopping: $("btnContinueShopping"),
        sendZalo: $("btnSendZaloOrder"),
        successOverlay: $("successOverlay"),
        successDone: $("btnSuccessDone")
    };

    let menuItems = [];

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function formatPrice(value) {
        if (value === null || value === undefined || value === "") {
            return "Giá đang cập nhật";
        }

        const number = Number(value);
        if (!Number.isFinite(number) || number <= 0) {
            return "Giá đang cập nhật";
        }

        return number.toLocaleString("vi-VN") + "đ";
    }

    function syncCoreState() {
        App.state.cart = Cart.getItems();
        App.state.menu = menuItems.slice();
        App.state.categories = [...new Set(menuItems.map(item => item.category))];
    }

    function saveCart() {
        App.storage.set(CART_STORAGE_KEY, Cart.getItems());
    }

    function loadCart() {
        const saved = App.storage.get(CART_STORAGE_KEY, []);

        if (!Array.isArray(saved) || saved.length === 0) {
            return;
        }

        const normalized = saved
            .map(item => {
                const source = menuItems.find(menu =>
                    menu.id === item.id ||
                    menu.name === item.name ||
                    menu.name === item.product
                );

                if (!source) return null;

                return {
                    id: source.id,
                    name: source.name,
                    price: source.price ?? (Number(item.price) || 0),
                    quantity: Math.max(1, Number(item.quantity) || 1),
                    note: item.note || "",
                    sugar: item.sugar ?? 100,
                    ice: item.ice ?? 100,
                    toppings: item.toppings || []
                };
            })
            .filter(Boolean);

        Cart.clearCart();
        Cart.addItems(normalized);
    }

    function findCartItem(productId) {
        return Cart.getItem(productId);
    }

    function addProduct(productId) {
        const product = menuItems.find(item => item.id === productId);
        if (!product || product.price === null) {
            return;
        }

        const existing = findCartItem(product.id);

        if (existing) {
            Cart.increaseQuantity(existing.id);
        } else {
            Cart.addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        pulseCart();
    }

    function increaseProduct(id) {
        Cart.increaseQuantity(id);
    }

    function decreaseProduct(id) {
        const item = Cart.getItem(id);
        if (!item) return;

        if (item.quantity <= 1) {
            Cart.removeItem(id);
        } else {
            Cart.decreaseQuantity(id);
        }
    }

    function pulseCart() {
        if (!els.cartIcon) return;
        els.cartIcon.classList.add("cart-bounce");
        window.setTimeout(() => {
            els.cartIcon.classList.remove("cart-bounce");
        }, 400);
    }

    function renderMenu() {
        if (!els.menuGrid) return;

        if (menuItems.length === 0) {
            els.menuGrid.innerHTML = "<p>Chưa có dữ liệu thực đơn.</p>";
            return;
        }

        els.menuGrid.innerHTML = menuItems.map(item => {
            const hasPrice = Number.isFinite(Number(item.price)) && Number(item.price) > 0;
            const button = hasPrice
                ? `<a href="#" class="menu-order-btn" data-product-id="${escapeHtml(item.id)}">☕ Đặt ngay</a>`
                : `<span class="menu-order-btn" aria-disabled="true" style="opacity:.6;cursor:not-allowed;">Đang cập nhật giá</span>`;

            return `
                <article class="menu-card" data-category="${escapeHtml(item.category)}">
                    <img src="${escapeHtml(item.image || IMAGE_FALLBACK)}"
                         alt="${escapeHtml(item.name)}"
                         loading="lazy"
                         onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}'">
                    <h3>${escapeHtml(item.name)}</h3>
                    <p>${escapeHtml(item.description)}</p>
                    <span class="price">${formatPrice(item.price)}</span>
                    ${button}
                </article>
            `;
        }).join("");
    }

    function renderCart() {
        if (!els.cartItems || !els.cartCount || !els.cartTotal) return;

        const items = Cart.getItems();
        const summary = Cart.getSummary();

        els.cartCount.textContent = summary.itemCount;
        els.cartTotal.textContent = "Tổng tiền: " + formatPrice(summary.total);

        if (items.length === 0) {
            els.cartItems.innerHTML = '<p style="text-align:center;padding:20px;">Chưa có sản phẩm.</p>';
            return;
        }

        els.cartItems.innerHTML = items.map(item => `
            <div class="cart-item" data-cart-id="${escapeHtml(item.id)}">
                <strong>${escapeHtml(item.name)}</strong>
                <div class="cart-qty">
                    <button type="button" class="minus-btn" data-cart-id="${escapeHtml(item.id)}">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="plus-btn" data-cart-id="${escapeHtml(item.id)}">+</button>
                </div>
                <div>${formatPrice(item.price * item.quantity)}</div>
            </div>
            <hr>
        `).join("");
    }

    function renderPayment() {
        if (!els.paymentOrderList || !els.paymentTotalPrice) return;

        const items = Cart.getItems();
        const summary = Cart.getSummary();

        if (items.length === 0) {
            els.paymentOrderList.innerHTML = '<p style="text-align:center;color:#888;">Chưa có sản phẩm.</p>';
            els.paymentTotalPrice.textContent = "0đ";
            return;
        }

        els.paymentOrderList.innerHTML = items.map(item => `
            <div class="payment-item">
                <strong>${escapeHtml(item.name)}</strong>
                <div>SL: ${item.quantity}</div>
                <div>${formatPrice(item.price * item.quantity)}</div>
                <hr>
            </div>
        `).join("");

        els.paymentTotalPrice.textContent = formatPrice(summary.total);
    }

    function openCart() {
        if (els.cartPopup) els.cartPopup.style.display = "flex";
    }

    function closeCart() {
        if (els.cartPopup) els.cartPopup.style.display = "none";
    }

    function openPayment() {
        if (Cart.isEmpty()) {
            openCart();
            return;
        }

        closeCart();
        renderPayment();
        if (els.paymentOverlay) els.paymentOverlay.style.display = "flex";
    }

    function closePayment() {
        if (els.paymentOverlay) els.paymentOverlay.style.display = "none";
    }

    function showSuccess() {
        closePayment();
        if (els.successOverlay) els.successOverlay.style.display = "flex";
    }

    async function loadMenu() {
        try {
            const response = await fetch(MENU_URL, { cache: "no-store" });
            if (!response.ok) throw new Error("HTTP " + response.status);

            const data = await response.json();
            menuItems = Array.isArray(data.items) ? data.items : [];

            renderMenu();
            loadCart();
            syncCoreState();
            renderCart();
        } catch (error) {
            console.error("[CafePhoXua.UI] Không tải được menu:", error);
            if (els.menuGrid) {
                els.menuGrid.innerHTML = '<p>Không thể tải thực đơn. Vui lòng thử lại.</p>';
            }
        }
    }

    function bindEvents() {
        els.cartIcon?.addEventListener("click", openCart);
        els.closeCart?.addEventListener("click", closeCart);
        els.openPayment?.addEventListener("click", openPayment);
        els.closePayment?.addEventListener("click", closePayment);
        els.continueShopping?.addEventListener("click", closePayment);
        els.successDone?.addEventListener("click", () => {
            if (els.successOverlay) els.successOverlay.style.display = "none";
        });

        els.cartPopup?.addEventListener("click", event => {
            if (event.target === els.cartPopup) closeCart();
        });

        els.paymentOverlay?.addEventListener("click", event => {
            if (event.target === els.paymentOverlay) closePayment();
        });

        document.addEventListener("click", event => {
            const orderButton = event.target.closest(".menu-order-btn[data-product-id]");
            if (orderButton) {
                event.preventDefault();
                addProduct(orderButton.dataset.productId);
                return;
            }

            const plusButton = event.target.closest(".plus-btn[data-cart-id]");
            if (plusButton) {
                increaseProduct(plusButton.dataset.cartId);
                return;
            }

            const minusButton = event.target.closest(".minus-btn[data-cart-id]");
            if (minusButton) {
                decreaseProduct(minusButton.dataset.cartId);
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key !== "Escape") return;
            closeCart();
            closePayment();
        });

        els.sendZalo?.addEventListener("click", () => {
            if (Cart.isEmpty()) return;

            const sent = window.CafePhoXuaCheckout?.Actions?.sendOrder();
            if (sent) showSuccess();
        });

        Cart.on("cart:change", () => {
            syncCoreState();
            saveCart();
            renderCart();
            renderPayment();
        });
    }

    bindEvents();
    loadMenu();

    window.CafePhoXuaUI = Object.freeze({
        addProduct,
        renderMenu,
        renderCart,
        renderPayment,
        openCart,
        closeCart,
        openPayment,
        closePayment
    });
})(window, document);
