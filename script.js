/*!
 * Cafe Phố Xưa V8 - UI Controller
 * One cart / one checkout / one Zalo flow
 */
(function (window, document) {
  'use strict';

  const Core = window.CafePhoXua;
  if (!Core || !Core.Cart) {
    console.error('[CafePhoXua.UI] Core/Cart chưa sẵn sàng.');
    return;
  }

  const Cart = Core.Cart;
  const STORAGE_KEY = 'cart.v8';

  const $ = (id) => document.getElementById(id);
  const money = (value) => Number(value || 0).toLocaleString('vi-VN') + 'đ';
  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function saveCart() {
    try {
      Core.storage.set(STORAGE_KEY, Cart.getItems());
      localStorage.removeItem('cafePhoXuaCart');
    } catch (err) {
      console.warn('[CafePhoXua.UI] Không thể lưu giỏ hàng.', err);
    }
  }

  function restoreCart() {
    let items = Core.storage.get(STORAGE_KEY, null);

    if (!Array.isArray(items)) {
      try {
        const legacy = JSON.parse(localStorage.getItem('cafePhoXuaCart') || '[]');
        if (Array.isArray(legacy) && legacy.length) {
          items = legacy.map(item => ({
            name: item.product || item.name || '',
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1
          }));
        }
      } catch (_) {
        items = [];
      }
    }

    if (!Array.isArray(items) || !items.length || Cart.hasItems()) return;

    items.forEach(item => {
      if (!item || !item.name || !(Number(item.price) >= 0)) return;
      Cart.addItem({
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        note: item.note || '',
        sugar: item.sugar ?? 100,
        ice: item.ice ?? 100,
        toppings: Array.isArray(item.toppings) ? item.toppings : []
      });
    });
    saveCart();
  }

  function renderCart() {
    const list = $('cart-items');
    const count = $('cart-count');
    const totalEl = $('cart-total');
    if (!list || !count || !totalEl) return;

    const items = Cart.getItems();
    const summary = Cart.getSummary();
    count.textContent = String(summary.itemCount || 0);
    totalEl.textContent = 'Tổng tiền: ' + money(summary.total);

    if (!items.length) {
      list.innerHTML = '<p class="cart-empty" style="text-align:center;padding:20px;">Chưa có sản phẩm.</p>';
      return;
    }

    list.innerHTML = items.map(item => `
      <div class="cart-item" data-cart-id="${esc(item.id)}">
        <div class="cart-item-info">
          <strong>${esc(item.name)}</strong>
          <div>${money(item.price)} × ${item.quantity}</div>
        </div>
        <div class="cart-qty">
          <button type="button" class="minus-btn" data-cart-action="minus" data-cart-id="${esc(item.id)}" aria-label="Giảm ${esc(item.name)}">−</button>
          <span>${item.quantity}</span>
          <button type="button" class="plus-btn" data-cart-action="plus" data-cart-id="${esc(item.id)}" aria-label="Tăng ${esc(item.name)}">+</button>
        </div>
        <div><strong>${money(Number(item.price) * Number(item.quantity))}</strong></div>
      </div>
      <hr>
    `).join('');
  }

  function renderPaymentSummary() {
    const list = $('paymentOrderList');
    const totalEl = $('paymentTotalPrice');
    if (!list || !totalEl) return;

    const items = Cart.getItems();
    const summary = Cart.getSummary();
    if (!items.length) {
      list.innerHTML = '<p style="text-align:center;color:#888;">Chưa có sản phẩm.</p>';
      totalEl.textContent = '0đ';
      return;
    }

    list.innerHTML = items.map(item => `
      <div class="payment-item">
        <div><strong>${esc(item.name)}</strong></div>
        <div>SL: ${item.quantity}</div>
        <div>${money(Number(item.price) * Number(item.quantity))}</div>
        <hr>
      </div>
    `).join('');
    totalEl.textContent = money(summary.total);
  }

  function addToCart(name, price) {
    name = String(name || '').trim();
    price = Number(price) || 0;
    if (!name) return false;

    const existing = Cart.findFirst(item => item.name === name && Number(item.price) === price);
    if (existing) Cart.increaseQuantity(existing.id, 1);
    else Cart.addItem({ name, price, quantity: 1 });
    return true;
  }
  window.addToCart = addToCart;

  function openCart() {
    renderCart();
    const popup = $('cart-popup');
    if (popup) popup.style.display = 'flex';
  }
  function closeCart() {
    const popup = $('cart-popup');
    if (popup) popup.style.display = 'none';
  }
  function openPayment() {
    if (Cart.isEmpty()) {
      alert('Giỏ hàng đang trống. Vui lòng chọn ít nhất một món.');
      return;
    }
    renderPaymentSummary();
    closeCart();
    const overlay = $('paymentOverlay');
    if (overlay) overlay.style.display = 'flex';
  }
  function closePayment() {
    const overlay = $('paymentOverlay');
    if (overlay) overlay.style.display = 'none';
  }

  function validateCustomer() {
    const fields = [
      [$('customerName'), 'Vui lòng nhập họ và tên.'],
      [$('customerPhone'), 'Vui lòng nhập số điện thoại.'],
      [$('customerAddress'), 'Vui lòng nhập địa chỉ giao hàng.']
    ];

    for (const [input, message] of fields) {
      if (!input) continue;
      input.style.borderColor = '';
      if (!input.value.trim()) {
        alert(message);
        input.style.borderColor = 'red';
        input.focus();
        return false;
      }
    }

    const phone = $('customerPhone');
    if (phone) {
      const normalized = phone.value.replace(/[\s.()-]/g, '');
      if (!/^(?:\+84|0)\d{9}$/.test(normalized)) {
        alert('Số điện thoại chưa đúng định dạng Việt Nam.');
        phone.style.borderColor = 'red';
        phone.focus();
        return false;
      }
    }
    return true;
  }

  function buildOrder() {
    return {
      customer: {
        name: $('customerName')?.value.trim() || '',
        phone: $('customerPhone')?.value.trim() || '',
        address: $('customerAddress')?.value.trim() || '',
        note: $('customerNote')?.value.trim() || ''
      },
      items: Cart.getItems(),
      total: Cart.getSummary().total
    };
  }

  function sendOrder() {
    if (Cart.isEmpty()) {
      alert('Giỏ hàng đang trống.');
      return false;
    }
    if (!validateCustomer()) return false;

    const order = buildOrder();
    if (!window.CafePhoXuaOrderBuilder || !window.CafePhoXuaZalo) {
      alert('Hệ thống đặt hàng chưa sẵn sàng. Vui lòng tải lại trang.');
      return false;
    }

    const message = window.CafePhoXuaOrderBuilder.buildOrderMessage(order);
    const sent = window.CafePhoXuaZalo.send(message);
    if (!sent) {
      alert('Không thể mở Zalo. Vui lòng thử lại.');
      return false;
    }

    closePayment();
    const success = $('successOverlay');
    if (success) success.style.display = 'flex';
    return true;
  }

  function finishOrder() {
    const success = $('successOverlay');
    if (success) success.style.display = 'none';
    Cart.clearCart();
    Core.storage.remove(STORAGE_KEY);
    localStorage.removeItem('cafePhoXuaCart');
    ['customerName', 'customerPhone', 'customerAddress', 'customerNote'].forEach(id => {
      const input = $(id);
      if (input) {
        input.value = '';
        input.style.borderColor = '';
      }
    });
    renderCart();
  }

  function bindUI() {
    $('cart-icon')?.addEventListener('click', openCart);
    $('close-cart')?.addEventListener('click', closeCart);
    $('btnOpenPaymentPopup')?.addEventListener('click', openPayment);
    $('closePaymentPopup')?.addEventListener('click', closePayment);
    $('btnSendZaloOrder')?.addEventListener('click', event => {
      event.preventDefault();
      sendOrder();
    });
    $('btnSuccessDone')?.addEventListener('click', finishOrder);

    $('cart-popup')?.addEventListener('click', event => {
      if (event.target === $('cart-popup')) closeCart();
    });
    $('paymentOverlay')?.addEventListener('click', event => {
      if (event.target === $('paymentOverlay')) closePayment();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeCart();
        closePayment();
      }
    });

    $('cart-items')?.addEventListener('click', event => {
      const button = event.target.closest('[data-cart-action]');
      if (!button) return;
      const id = button.dataset.cartId;
      const item = Cart.getItem(id);
      if (!item) return;
      if (button.dataset.cartAction === 'plus') Cart.increaseQuantity(id, 1);
      if (button.dataset.cartAction === 'minus') {
        if (item.quantity <= 1) Cart.removeItem(id);
        else Cart.decreaseQuantity(id, 1);
      }
    });
  }

  function init() {
    restoreCart();
    bindUI();
    Cart.on('cart:change', function () {
      saveCart();
      renderCart();
      if ($('paymentOverlay')?.style.display === 'flex') renderPaymentSummary();
    });
    renderCart();
    console.log('☕ Cafe Phố Xưa V8 UI READY');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window, document);
