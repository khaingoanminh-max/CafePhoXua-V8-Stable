/*!
 * Cafe Phố Xưa V8.12 - Production UI Controller
 * Cart / customer profile / payment UI only
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
const $ = id => document.getElementById(id);
const money = value => Number(value || 0).toLocaleString('vi-VN') + 'đ';
const esc = value => String(value ?? '')
  .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
  .replaceAll('"','&quot;').replaceAll("'",'&#039;');

function saveCart() {
  try {
    Core.storage.set(CART_KEY, Cart.getItems());
    localStorage.removeItem('cafePhoXuaCart');
  } catch (error) {
    console.warn('[CafePhoXua.UI] Không thể lưu giỏ hàng.', error);
  }
}

function restoreCart() {
  let items = Core.storage.get(CART_KEY, null);
  if (!Array.isArray(items)) {
    try { items = JSON.parse(localStorage.getItem('cafePhoXuaCart') || '[]'); }
    catch (_) { items = []; }
  }
  if (!Array.isArray(items) || !items.length || Cart.hasItems()) return;
  items.forEach(item => {
    if (!item || !(item.name || item.product)) return;
    Cart.addItem({
      name: item.name || item.product,
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

function restoreCustomerProfile() {
  const profile = Core.storage.get(CUSTOMER_KEY, null);
  if (!profile || typeof profile !== 'object') return;
  if ($('customerName') && !$('customerName').value) $('customerName').value = profile.name || '';
  if ($('customerPhone') && !$('customerPhone').value) $('customerPhone').value = profile.phone || '';
  if ($('customerAddress') && !$('customerAddress').value) $('customerAddress').value = profile.address || '';
}

function ensureFloatingCart() {
  let button = $('floatingCartSummary');
  if (button) return button;
  if (!document.getElementById('cpx-floating-cart-style')) {
    const style = document.createElement('style');
    style.id = 'cpx-floating-cart-style';
    style.textContent = '#floatingCartSummary{display:none;position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;border:0;border-radius:999px;padding:13px 20px;background:#6f451f;color:#fff;font-weight:800;box-shadow:0 10px 30px rgba(0,0,0,.25);cursor:pointer;white-space:nowrap}@media(min-width:769px){#floatingCartSummary{display:none!important}}';
    document.head.appendChild(style);
  }
  button = document.createElement('button');
  button.id = 'floatingCartSummary';
  button.type = 'button';
  button.setAttribute('aria-label', 'Mở giỏ hàng');
  button.addEventListener('click', openCart);
  document.body.appendChild(button);
  return button;
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

  const floating = ensureFloatingCart();
  floating.textContent = `🛒 ${summary.itemCount || 0} món • ${money(summary.total)}`;
  floating.style.display = summary.itemCount > 0 ? 'block' : 'none';

  if (!items.length) {
    list.innerHTML = '<p class="cart-empty" style="text-align:center;padding:20px;">Chưa có sản phẩm.</p>';
    return;
  }

  list.innerHTML = items.map(item => `
    <div class="cart-item" data-cart-id="${esc(item.id)}">
      <div class="cart-item-info"><strong>${esc(item.name)}</strong><div>${money(item.price)} × ${item.quantity}</div></div>
      <div class="cart-qty">
        <button type="button" data-cart-action="minus" data-cart-id="${esc(item.id)}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-cart-action="plus" data-cart-id="${esc(item.id)}">+</button>
      </div>
      <div><strong>${money(Number(item.price) * Number(item.quantity))}</strong></div>
    </div><hr>`).join('');
}

function renderPaymentSummary() {
  const list = $('paymentOrderList');
  const totalEl = $('paymentTotalPrice');
  if (!list || !totalEl) return;
  const items = Cart.getItems();
  const summary = Cart.getSummary();
  list.innerHTML = items.length
    ? items.map(item => `<div class="payment-item"><div><strong>${esc(item.name)}</strong></div><div>SL: ${item.quantity}</div><div>${money(Number(item.price) * Number(item.quantity))}</div><hr></div>`).join('')
    : '<p>Chưa có sản phẩm.</p>';
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
  restoreCustomerProfile();
  renderPaymentSummary();
  closeCart();
  const overlay = $('paymentOverlay');
  if (overlay) overlay.style.display = 'flex';
}

function closePayment() {
  const overlay = $('paymentOverlay');
  if (overlay) overlay.style.display = 'none';
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
  if (document.documentElement.dataset.cpxUiBound === '1') return;
  document.documentElement.dataset.cpxUiBound = '1';

  $('cart-icon')?.addEventListener('click', openCart);
  $('close-cart')?.addEventListener('click', closeCart);
  $('btnOpenPaymentPopup')?.addEventListener('click', openPayment);
  $('closePaymentPopup')?.addEventListener('click', closePayment);
  $('btnContinueShopping')?.addEventListener('click', () => {
    closePayment();
    $('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('btnSuccessDone')?.addEventListener('click', finishOrder);
  $('cart-popup')?.addEventListener('click', event => {
    if (event.target === $('cart-popup')) closeCart();
  });
  $('paymentOverlay')?.addEventListener('click', event => {
    if (event.target === $('paymentOverlay')) closePayment();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeCart(); closePayment(); }
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

function loadBranding() {
  if (document.querySelector('script[data-cpx-branding]')) return;
  const script = document.createElement('script');
  script.src = 'CafePhoXua.Branding.js?v=8.12.0-20260913';
  script.dataset.cpxBranding = 'true';
  document.head.appendChild(script);
}

function loadLocalSeo() {
  if (document.querySelector('script[data-cpx-local-seo]')) return;
  const script = document.createElement('script');
  script.src = 'CafePhoXua.LocalSEO.js?v=1.1.0-20260913';
  script.dataset.cpxLocalSeo = 'true';
  document.head.appendChild(script);
}

function init() {
  restoreCart();
  restoreCustomerProfile();
  bindUI();
  Cart.on('cart:change', () => {
    saveCart();
    renderCart();
    if ($('paymentOverlay')?.style.display === 'flex') renderPaymentSummary();
  });
  renderCart();
  loadBranding();
  loadLocalSeo();
  console.log('☕ Cafe Phố Xưa V8.12 UI READY');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
})(window, document);
