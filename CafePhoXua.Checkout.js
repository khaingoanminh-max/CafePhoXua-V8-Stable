/*!
 * =====================================================
 * CafePhoXua.Checkout.js
 * =====================================================
 * CafePhoXua V8 Stable - Checkout Coordinator
 *
 * Responsibilities:
 * - Collect customer data
 * - Read the V8 Cart
 * - Build the order
 * - Delegate message creation to OrderBuilder
 * - Delegate sending to Zalo
 *
 * Does not:
 * - Render UI
 * - Manage cart state
 * - Build HTML
 * =====================================================
 */
(function (window) {
    "use strict";

    if (!window.CafePhoXua) {
        throw new Error("[CafePhoXua.Checkout] Core chưa được tải.");
    }

    const Core = window.CafePhoXua;

    if (!Core.Cart) {
        throw new Error("[CafePhoXua.Checkout] Cart Engine chưa được tải.");
    }

    if (!window.CafePhoXuaOrderBuilder) {
        throw new Error("[CafePhoXua.Checkout] OrderBuilder chưa được tải.");
    }

    if (!window.CafePhoXuaZalo) {
        throw new Error("[CafePhoXua.Checkout] Zalo Connector chưa được tải.");
    }

    const Checkout = window.CafePhoXuaCheckout || {};
    Checkout.Utils = Checkout.Utils || {};
    Checkout.Builder = Checkout.Builder || {};
    Checkout.Actions = Checkout.Actions || {};

    Checkout.Utils.getFieldValue = function (id) {
        return document.getElementById(id)?.value?.trim() || "";
    };

    Checkout.Builder.buildCustomer = function () {
        return {
            name: Checkout.Utils.getFieldValue("customerName"),
            phone: Checkout.Utils.getFieldValue("customerPhone"),
            address: Checkout.Utils.getFieldValue("customerAddress"),
            note: Checkout.Utils.getFieldValue("customerNote")
        };
    };

    Checkout.Builder.buildOrder = function (customer) {
        const summary = Core.Cart.getSummary();

        return {
            customer: customer || {},
            items: Core.Cart.getItems(),
            total: summary.total
        };
    };

    Checkout.Actions.collectOrder = function () {
        const order = Checkout.Builder.buildOrder(
            Checkout.Builder.buildCustomer()
        );

        if (order.items.length === 0) {
            return null;
        }

        return order;
    };

    Checkout.Actions.sendOrder = function () {
        const order = Checkout.Actions.collectOrder();

        if (!order) {
            return false;
        }

        const message =
            window.CafePhoXuaOrderBuilder.buildOrderMessage(order);

        return window.CafePhoXuaZalo.send(message);
    };

    Checkout.Actions.getSummary = function () {
        return Core.Cart.getSummary();
    };

    window.CafePhoXuaCheckout = Checkout;
})(window);
