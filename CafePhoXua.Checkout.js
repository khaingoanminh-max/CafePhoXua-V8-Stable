/**
 * Cafe Phố Xưa V8 - Checkout Adapter
 * Điều phối Cart -> OrderBuilder -> Zalo.
 */
(function (window, document) {
  'use strict';

  const Core = window.CafePhoXua;
  if (!Core || !Core.Cart) {
    console.error('[CafePhoXua.Checkout] Core/Cart chưa sẵn sàng.');
    return;
  }

  const Checkout = {
    Builder: {},
    Actions: {},
    Events: {}
  };

  Checkout.Builder.buildCustomer = function () {
    return {
      name: document.getElementById('customerName')?.value?.trim() || '',
      phone: document.getElementById('customerPhone')?.value?.trim() || '',
      address: document.getElementById('customerAddress')?.value?.trim() || '',
      note: document.getElementById('customerNote')?.value?.trim() || ''
    };
  };

  Checkout.Builder.buildOrder = function () {
    const summary = Core.Cart.getSummary();
    return {
      customer: Checkout.Builder.buildCustomer(),
      items: Core.Cart.getItems(),
      total: Number(summary.total) || 0
    };
  };

  Checkout.Actions.collectOrder = function () {
    return Checkout.Builder.buildOrder();
  };

  Checkout.Actions.sendOrder = function () {
    if (Core.Cart.isEmpty()) return false;
    if (!window.CafePhoXuaOrderBuilder || !window.CafePhoXuaZalo) return false;
    const order = Checkout.Actions.collectOrder();
    const message = window.CafePhoXuaOrderBuilder.buildOrderMessage(order);
    return window.CafePhoXuaZalo.send(message);
  };

  Checkout.Events.bindSendButton = function () {
    const button = document.getElementById('btnSendZaloOrder');
    if (!button || button.dataset.checkoutBound === 'true') return false;
    button.dataset.checkoutBound = 'true';
    return true;
  };

  Checkout.init = function () {
    Checkout.Events.bindSendButton();
    return Checkout;
  };

  window.CafePhoXuaCheckout = Checkout;
})(window, document);
