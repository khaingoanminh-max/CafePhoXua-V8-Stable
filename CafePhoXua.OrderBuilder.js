/**
 * =====================================================
 * CafePhoXua V8 Stable
 * Module: Order Builder
 * -----------------------------------------------------
 * Tạo nội dung đơn hàng và export qua window.
 * =====================================================
 */
(function (window) {
'use strict';

const CafePhoXuaOrderBuilder = {};

CafePhoXuaOrderBuilder.Utils = {};

CafePhoXuaOrderBuilder.Utils.formatPrice = function (price) {
    const value = Number(price);
    if (Number.isNaN(value)) return "0đ";
    return value.toLocaleString("vi-VN") + "đ";
};

CafePhoXuaOrderBuilder.Utils.formatDate = function () {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

CafePhoXuaOrderBuilder.Builder = {};

CafePhoXuaOrderBuilder.Builder.buildCustomerInfo = function (customer) {
    customer = customer || {};
    return [
        "👤 Khách hàng", customer.name || "", "",
        "📞 Điện thoại", customer.phone || "", "",
        "📍 Địa chỉ", customer.address || "", "",
        "📝 Ghi chú", customer.note || "Không có", ""
    ].join("\n");
};

CafePhoXuaOrderBuilder.Builder.buildItems = function (items) {
    items = Array.isArray(items) ? items : [];
    if (items.length === 0) return "📋 DANH SÁCH MÓN\n\nKhông có sản phẩm";
    const lines = ["📋 DANH SÁCH MÓN", ""];
    items.forEach(function (item, index) {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const toppingTotal = Array.isArray(item.toppings)
            ? item.toppings.reduce((sum, topping) => sum + (Number(topping.price) || 0), 0)
            : 0;
        const unitPrice = price + toppingTotal;
        const total = quantity * unitPrice;
        lines.push(
            `${index + 1}. ${item.name || "Không xác định"}`,
            `   SL: ${quantity} × ${CafePhoXuaOrderBuilder.Utils.formatPrice(unitPrice)}`,
            `   Thành tiền: ${CafePhoXuaOrderBuilder.Utils.formatPrice(total)}`,
            ""
        );
    });
    return lines.join("\n");
};

CafePhoXuaOrderBuilder.Builder.buildSummary = function (total) {
    total = Number(total);
    if (Number.isNaN(total)) total = 0;
    return [
        "━━━━━━━━━━━━━━━━━━", "",
        "💰 TỔNG THANH TOÁN", "",
        CafePhoXuaOrderBuilder.Utils.formatPrice(total), ""
    ].join("\n");
};

CafePhoXuaOrderBuilder.buildOrderMessage = function (order) {
    order = order || {};
    const customer = order.customer || {};
    const items = order.items || [];
    const total = order.total || 0;
    return [
        "☕ CAFE PHỐ XƯA", "",
        "🛒 ĐƠN ĐẶT ĐỒ UỐNG", "",
        "📅 Thời gian", CafePhoXuaOrderBuilder.Utils.formatDate(), "",
        "━━━━━━━━━━━━━━━━━━", "",
        CafePhoXuaOrderBuilder.Builder.buildCustomerInfo(customer),
        "━━━━━━━━━━━━━━━━━━", "",
        CafePhoXuaOrderBuilder.Builder.buildItems(items),
        "━━━━━━━━━━━━━━━━━━", "",
        CafePhoXuaOrderBuilder.Builder.buildSummary(total),
        "━━━━━━━━━━━━━━━━━━", "",
        "❤️ Cảm ơn Quý khách!",
        "Cafe Phố Xưa sẽ xác nhận đơn trong thời gian sớm nhất."
    ].join("\n");
};

window.CafePhoXuaOrderBuilder = CafePhoXuaOrderBuilder;

})(window);
