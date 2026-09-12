/*!
 * Cafe Phố Xưa V8.5 - Production UI Controller
 * One cart / one checkout / reliable Zalo handoff / remembered customer profile
 */
(function (window, document) {
  'use strict';

  const Core = window.CafePhoXua;
  if (!Core || !Core.Cart) {
    console.error('[CafePhoXua.UI] Core/Cart chưa sẵn sàng.');
    return;
  }

  const Cart = Core.Cart;
  const CART_KEY = 'cart.v8';
  const CUSTOMER_KEY = 'customer.v1';
  const ZALO_PHONE = '0868708799';
  const $ = id => document.getElementById(id);
  const money = value => Number(value || 0).toLocaleString('vi-VN') + 'đ';
  const esc = value => String(value ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'",'&#039;');

  function saveCart() {
    try {
      Core.storage.set(CART_KEY, Cart.getItems());
      localStorage.removeItem('cafePhoXuaCart');
    } catch (err) {
      console.warn('[CafePhoXua.UI] Không thể lưu giỏ hàng.', err);
    }
  }

  function restoreCart() {
    let items = Core.storage.get(CART_KEY, null);
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
      } catch (_) { items = []; }
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

  function getCustomerProfile() {
    const profile = Core.storage.get(CUSTOMER_KEY, null);
    return profile && typeof profile === 'object' ? profile : null;
  }

  function restoreCustomerProfile() {
    const profile = getCustomerProfile();
    if (!profile) return;
    if ($('customerName') && !$('customerName').value) $('customerName').value = profile.name || '';
    if ($('customerPhone') && !$('customerPhone').value) $('customerPhone').value = profile.phone || '';
    if ($('customerAddress') && !$('customerAddress').value) $('customerAddress').value = profile.address || '';
  }

  function saveCustomerProfile(order) {
    if (!order || !order.customer) return;
    try {
      Core.storage.set(CUSTOMER_KEY, {
        name: String(order.customer.name || '').trim(),
        phone: String(order.customer.phone || '').trim(),
        address: String(order.customer.address || '').trim(),
        savedAt: Date.now()
      });
    } catch (err) {
      console.warn('[CafePhoXua.UI] Không thể lưu thông tin khách hàng.', err);
    }
  }

  function ensureFloatingCart() {
    let button = $('floatingCartSummary');
    if (button) return button;
    const style = document.createElement('style');
    style.id = 'cpx-floating-cart-style';
    style.textContent = '#floatingCartSummary{display:none;position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;border:0;border-radius:999px;padding:13px 20px;background:#6f451f;color:#fff;font-weight:800;box-shadow:0 10px 30px rgba(0,0,0,.25);cursor:pointer;white-space:nowrap}@media(min-width:769px){#floatingCartSummary{display:none!important}}';
    document.head.appendChild(style);
    button = document.createElement('button');
    button.id = 'floatingCartSummary';
    button.type = 'button';
    button.setAttribute('aria-label', 'Mở giỏ hàng');
    button.addEventListener('click', openCart);
    document.body.appendChild(button);
    return button;
  }

  function renderCart() {
    const list = $('cart-items'), count = $('cart-count'), totalEl = $('cart-total');
    if (!list || !count || !totalEl) return;
    const items = Cart.getItems(), summary = Cart.getSummary();
    count.textContent = String(summary.itemCount || 0);
    totalEl.textContent = 'Tổng tiền: ' + money(summary.total);
    const floating = ensureFloatingCart();
    floating.textContent = `🛒 ${summary.itemCount || 0} món • ${money(summary.total)}`;
    floating.style.display = summary.itemCount > 0 ? 'block' : 'none';
    if (!items.length) {
      list.innerHTML = '<p class="cart-empty" style="text-align:center;padding:20px;">Chưa có sản phẩm.</p>';
      return;
    }
    list.innerHTML = items.map(item => `<div class="cart-item" data-cart-id="${esc(item.id)}"><div class="cart-item-info"><strong>${esc(item.name)}</strong><div>${money(item.price)} × ${item.quantity}</div></div><div class="cart-qty"><button type="button" data-cart-action="minus" data-cart-id="${esc(item.id)}" aria-label="Giảm ${esc(item.name)}">−</button><span>${item.quantity}</span><button type="button" data-cart-action="plus" data-cart-id="${esc(item.id)}" aria-label="Tăng ${esc(item.name)}">+</button></div><div><strong>${money(Number(item.price) * Number(item.quantity))}</strong></div></div><hr>`).join('');
  }

  function renderPaymentSummary() {
    const list = $('paymentOrderList'), totalEl = $('paymentTotalPrice');
    if (!list || !totalEl) return;
    const items = Cart.getItems(), summary = Cart.getSummary();
    list.innerHTML = items.length ? items.map(item => `<div class="payment-item"><div><strong>${esc(item.name)}</strong></div><div>SL: ${item.quantity}</div><div>${money(Number(item.price) * Number(item.quantity))}</div><hr></div>`).join('') : '<p>Chưa có sản phẩm.</p>';
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
  function closeCart() { const popup = $('cart-popup'); if (popup) popup.style.display = 'none'; }

  function openPayment() {
    if (Cart.isEmpty()) { alert('Giỏ hàng đang trống. Vui lòng chọn ít nhất một món.'); return; }
    restoreCustomerProfile();
    renderPaymentSummary();
    closeCart();
    const overlay = $('paymentOverlay');
    if (overlay) overlay.style.display = 'flex';
  }
  function closePayment() { const overlay = $('paymentOverlay'); if (overlay) overlay.style.display = 'none'; }

  function validateCustomer() {
    const fields = [
      [$('customerName'), 'Vui lòng nhập họ và tên.'],
      [$('customerPhone'), 'Vui lòng nhập số điện thoại.'],
      [$('customerAddress'), 'Vui lòng nhập địa chỉ giao hàng.']
    ];
    for (const [input, message] of fields) {
      if (!input) continue;
      input.style.borderColor = '';
      if (!input.value.trim()) { alert(message); input.style.borderColor = 'red'; input.focus(); return false; }
    }
    const phone = $('customerPhone');
    if (phone) {
      const normalized = phone.value.replace(/[\s.()-]/g, '');
      if (!/^(?:\+84|0)\d{9}$/.test(normalized)) {
        alert('Số điện thoại chưa đúng định dạng Việt Nam.');
        phone.style.borderColor = 'red'; phone.focus(); return false;
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

  function fallbackOrderMessage(order) {
    const lines = ['☕ CAFE PHỐ XƯA', '', '🛒 ĐƠN ĐẶT ĐỒ UỐNG', '', `👤 ${order.customer.name}`, `📞 ${order.customer.phone}`, `📍 ${order.customer.address}`, `📝 ${order.customer.note || 'Không có'}`, '', '📋 DANH SÁCH MÓN'];
    order.items.forEach((item, i) => lines.push(`${i + 1}. ${item.name} — SL: ${item.quantity} — ${money(Number(item.price) * Number(item.quantity))}`));
    lines.push('', `💰 TỔNG THANH TOÁN: ${money(order.total)}`, '', '❤️ Cảm ơn Quý khách!');
    return lines.join('\n');
  }

  function buildOrderMessage(order) {
    try {
      if (window.CafePhoXuaOrderBuilder?.buildOrderMessage) return window.CafePhoXuaOrderBuilder.buildOrderMessage(order);
    } catch (err) { console.warn('[CafePhoXua.UI] OrderBuilder fallback.', err); }
    return fallbackOrderMessage(order);
  }

  function copyOrderMessage(message) {
    try {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(message).catch(() => {});
    } catch (_) {}
  }

  function openZalo(message) {
    const url = `https://zalo.me/${ZALO_PHONE}?text=${encodeURIComponent(message)}`;
    copyOrderMessage(message);
    try {
      window.location.assign(url);
      return true;
    } catch (err) {
      console.error('[CafePhoXua.UI] Không thể mở Zalo.', err);
      return false;
    }
  }

  function sendOrder() {
    if (Cart.isEmpty()) { alert('Giỏ hàng đang trống.'); return false; }
    if (!validateCustomer()) return false;
    const order = buildOrder();
    saveCustomerProfile(order);
    saveCart();
    const message = buildOrderMessage(order);
    const sent = openZalo(message);
    if (!sent) {
      alert('Không thể mở Zalo. Nội dung đơn đã được giữ lại, vui lòng thử lại.');
      return false;
    }
    return true;
  }

  function finishOrder() {
    const success = $('successOverlay');
    if (success) success.style.display = 'none';
    Cart.clearCart();
    Core.storage.remove(CART_KEY);
    localStorage.removeItem('cafePhoXuaCart');
    if ($('customerNote')) $('customerNote').value = '';
    renderCart();
  }

  function bindUI() {
    $('cart-icon')?.addEventListener('click', openCart);
    $('close-cart')?.addEventListener('click', closeCart);
    $('btnOpenPaymentPopup')?.addEventListener('click', openPayment);
    $('closePaymentPopup')?.addEventListener('click', closePayment);
    $('btnContinueShopping')?.addEventListener('click', () => { closePayment(); $('menu')?.scrollIntoView({ behavior:'smooth', block:'start' }); });
    $('btnSendZaloOrder')?.addEventListener('click', event => { event.preventDefault(); sendOrder(); });
    $('btnSuccessDone')?.addEventListener('click', finishOrder);
    $('cart-popup')?.addEventListener('click', event => { if (event.target === $('cart-popup')) closeCart(); });
    $('paymentOverlay')?.addEventListener('click', event => { if (event.target === $('paymentOverlay')) closePayment(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeCart(); closePayment(); } });
    $('cart-items')?.addEventListener('click', event => {
      const button = event.target.closest('[data-cart-action]');
      if (!button) return;
      const id = button.dataset.cartId, item = Cart.getItem(id);
      if (!item) return;
      if (button.dataset.cartAction === 'plus') Cart.increaseQuantity(id, 1);
      if (button.dataset.cartAction === 'minus') item.quantity <= 1 ? Cart.removeItem(id) : Cart.decreaseQuantity(id, 1);
    });
  }

  function loadBranding() {
    if (document.querySelector('script[data-cpx-branding]')) return;
    const s = document.createElement('script');
    s.src = 'CafePhoXua.Branding.js?v=8.5.0-20260913';
    s.dataset.cpxBranding = 'true';
    document.head.appendChild(s);
  }

  function init() {
    restoreCart();
    restoreCustomerProfile();
    bindUI();
    Cart.on('cart:change', function () {
      saveCart(); renderCart();
      if ($('paymentOverlay')?.style.display === 'flex') renderPaymentSummary();
    });
    renderCart();
    loadBranding();
    console.log('☕ Cafe Phố Xưa V8.5 UI READY');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})(window, document);
