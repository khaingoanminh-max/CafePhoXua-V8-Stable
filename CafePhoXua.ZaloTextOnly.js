/* Cafe Phố Xưa V8.12 - text-only Zalo checkout override */
(function (window, document) {
  'use strict';

  const ZALO_URL = 'https://zalo.me/0868708799';
  const Core = window.CafePhoXua;

  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch (_) {
      return false;
    }
  }

  function field(id) {
    return document.getElementById(id)?.value?.trim() || '';
  }

  function money(value) {
    return Number(value || 0).toLocaleString('vi-VN') + 'đ';
  }

  function buildFallbackMessage(order) {
    const lines = [
      '☕ CAFE PHỐ XƯA',
      '🛒 ĐƠN ĐẶT ĐỒ UỐNG',
      '',
      '👤 Khách hàng: ' + order.customer.name,
      '📞 Điện thoại: ' + order.customer.phone,
      '📍 Địa chỉ: ' + order.customer.address,
      '📝 Ghi chú: ' + (order.customer.note || 'Không có'),
      '',
      '📋 DANH SÁCH MÓN'
    ];
    order.items.forEach(function (item, index) {
      lines.push((index + 1) + '. ' + item.name + ' | SL ' + item.quantity + ' × ' + money(item.price));
    });
    lines.push('', '💰 TỔNG: ' + money(order.total), '', '❤️ Cảm ơn Quý khách!');
    return lines.join('\n');
  }

  function buildMessage(order) {
    try {
      if (window.CafePhoXuaOrderBuilder?.buildOrderMessage) {
        return window.CafePhoXuaOrderBuilder.buildOrderMessage(order);
      }
    } catch (_) {}
    return buildFallbackMessage(order);
  }

  function persist(order, message) {
    try {
      if (!Core?.storage) return;
      Core.storage.set('customer.v1', {
        name: order.customer.name,
        phone: order.customer.phone,
        address: order.customer.address,
        savedAt: Date.now()
      });
      Core.storage.set('lastOrder.v1', { order, message, savedAt: Date.now() });
    } catch (_) {}
  }

  document.addEventListener('click', async function (event) {
    const button = event.target.closest?.('#btnSendZaloOrder');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const Cart = Core?.Cart;
    if (!Cart || Cart.isEmpty()) {
      alert('Giỏ hàng đang trống.');
      return;
    }

    const customer = {
      name: field('customerName'),
      phone: field('customerPhone'),
      address: field('customerAddress'),
      note: field('customerNote')
    };

    if (!customer.name || !customer.phone || !customer.address) {
      alert('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }

    const normalizedPhone = customer.phone.replace(/[\s.()-]/g, '');
    if (!/^(?:\+84|0)\d{9}$/.test(normalizedPhone)) {
      alert('Số điện thoại chưa đúng định dạng Việt Nam.');
      document.getElementById('customerPhone')?.focus();
      return;
    }

    const order = {
      customer,
      items: Cart.getItems(),
      total: Cart.getSummary().total
    };
    const message = buildMessage(order);
    persist(order, message);

    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = 'Đang chuẩn bị đơn...';

    const copied = await copyText(message);
    alert(copied
      ? 'Đơn hàng đã được sao chép. Zalo sẽ mở ngay. Hãy Dán nội dung vào khung chat Cafe Phố Xưa rồi bấm Gửi.'
      : 'Zalo sẽ mở ngay. Nếu nội dung chưa có sẵn, vui lòng quay lại website và thử Sao chép lại đơn.');

    button.disabled = false;
    button.textContent = oldText;
    window.location.assign(ZALO_URL);
  }, true);
})(window, document);
