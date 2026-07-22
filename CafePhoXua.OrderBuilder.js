/**
 * =====================================================
 * CafePhoXua V8 Stable
 * Module: Order Builder
 * -----------------------------------------------------
 * Nhiệm vụ:
 * - Tạo nội dung đơn hàng.
 * - Không thao tác với giao diện.
 * - Không mở Zalo.
 * - Không quản lý giỏ hàng.
 * =====================================================
 */

const CafePhoXuaOrderBuilder = {};
/**
 * =====================================================
 * Utilities
 * -----------------------------------------------------
 * Các hàm dùng chung cho Order Builder
 * =====================================================
 */

CafePhoXuaOrderBuilder.Utils = {};
/**
 * =====================================================
 * Format Price
 * -----------------------------------------------------
 * Định dạng tiền VNĐ
 * Ví dụ:
 * 15000 -> 15.000đ
 * =====================================================
 */

CafePhoXuaOrderBuilder.Utils.formatPrice = function (price) {

    const value = Number(price);

    if (Number.isNaN(value)) {
        return "0đ";
    }

    return value.toLocaleString("vi-VN") + "đ";

};
/**
 * =====================================================
 * Format Date
 * -----------------------------------------------------
 * Định dạng ngày giờ Việt Nam
 * Ví dụ:
 * 22/07/2026 - 07:45
 * =====================================================
 */

CafePhoXuaOrderBuilder.Utils.formatDate = function () {

    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;

};
/**
 * =====================================================
 * Builder
 * -----------------------------------------------------
 * Các hàm xây dựng từng phần của đơn hàng
 *
 * Nhiệm vụ:
 * - Xây dựng thông tin khách hàng
 * - Xây dựng danh sách món
 * - Xây dựng tổng thanh toán
 *
 * Builder chỉ xử lý dữ liệu,
 * không thao tác với giao diện.
 * =====================================================
 */

CafePhoXuaOrderBuilder.Builder = {};
/**
 * =====================================================
 * Build Customer Information
 * -----------------------------------------------------
 * Xây dựng thông tin khách hàng
 * =====================================================
 */

CafePhoXuaOrderBuilder.Builder.buildCustomerInfo = function (customer) {

    customer = customer || {};

    return [
        "👤 Khách hàng",
        customer.name || "",
        "",
        "📞 Điện thoại",
        customer.phone || "",
        "",
        "📍 Địa chỉ",
        customer.address || "",
        "",
        "📝 Ghi chú",
        customer.note || "Không có",
        ""
    ].join("\n");

};
/**
 * =====================================================
 * Build Items
 * -----------------------------------------------------
 * Xây dựng danh sách món trong đơn hàng
 * =====================================================
 */

CafePhoXuaOrderBuilder.Builder.buildItems = function (items) {

    items = Array.isArray(items) ? items : [];

    if (items.length === 0) {
        return "📋 DANH SÁCH MÓN\n\nKhông có sản phẩm";
    }

    const lines = [
        "📋 DANH SÁCH MÓN",
        ""
    ];

    items.forEach(function (item, index) {

        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const total = quantity * price;

        lines.push(
            `${index + 1}. ${item.name || "Không xác định"}`,
            `   SL: ${quantity} × ${CafePhoXuaOrderBuilder.Utils.formatPrice(price)}`,
            `   Thành tiền: ${CafePhoXuaOrderBuilder.Utils.formatPrice(total)}`,
            ""
        );

    });

    return lines.join("\n");

};
/**
 * =====================================================
 * Build Summary
 * -----------------------------------------------------
 * Xây dựng phần tổng thanh toán
 * =====================================================
 */

CafePhoXuaOrderBuilder.Builder.buildSummary = function (total) {

    total = Number(total);

    if (Number.isNaN(total)) {
        total = 0;
    }

    return [
        "━━━━━━━━━━━━━━━━━━",
        "",
        "💰 TỔNG THANH TOÁN",
        "",
        CafePhoXuaOrderBuilder.Utils.formatPrice(total),
        ""
    ].join("\n");

};
/**
 * =====================================================
 * Build Order Message
 * -----------------------------------------------------
 * Ghép toàn bộ nội dung đơn hàng
 * =====================================================
 */

CafePhoXuaOrderBuilder.buildOrderMessage = function (order) {

    order = order || {};

    const customer = order.customer || {};
    const items = order.items || [];
    const total = order.total || 0;

    return [

        "☕ CAFE PHỐ XƯA",
        "",
        "🛒 ĐƠN ĐẶT ĐỒ UỐNG",
        "",
        "📅 Thời gian",
        CafePhoXuaOrderBuilder.Utils.formatDate(),
        "",
        "━━━━━━━━━━━━━━━━━━",
        "",

        CafePhoXuaOrderBuilder.Builder.buildCustomerInfo(customer),

        "━━━━━━━━━━━━━━━━━━",
        "",

        CafePhoXuaOrderBuilder.Builder.buildItems(items),

        "━━━━━━━━━━━━━━━━━━",
        "",

        CafePhoXuaOrderBuilder.Builder.buildSummary(total),

        "━━━━━━━━━━━━━━━━━━",
        "",
        "❤️ Cảm ơn Quý khách!",
        "Cafe Phố Xưa sẽ xác nhận đơn trong thời gian sớm nhất."

    ].join("\n");

};
