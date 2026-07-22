/**
 * =====================================================
 * Cafe Phố Xưa - Checkout Module
 * -----------------------------------------------------
 * Chịu trách nhiệm điều phối toàn bộ quy trình
 * đặt hàng của khách.
 *
 * Chức năng:
 * - Thu thập dữ liệu đơn hàng
 * - Gọi OrderBuilder
 * - Gọi Zalo Connector
 * - Hiển thị trạng thái đặt hàng
 * - Reset sau khi hoàn tất
 *
 * Không xử lý:
 * - Render giao diện
 * - Quản lý giỏ hàng
 * - Tạo nội dung đơn hàng
 * - Tạo URL Zalo
 * =====================================================
 */

const CafePhoXuaCheckout = {};
/**
 * =====================================================
 * Utilities
 * -----------------------------------------------------
 * Chứa các hàm tiện ích dùng trong Checkout.
 * =====================================================
 */

CafePhoXuaCheckout.Utils = {};

/**
 * =====================================================
 * Builder
 * -----------------------------------------------------
 * Chịu trách nhiệm xây dựng dữ liệu Checkout.
 * =====================================================
 */

CafePhoXuaCheckout.Builder = {};

/**
 * =====================================================
 * Actions
 * -----------------------------------------------------
 * Chứa các nghiệp vụ chính của Checkout.
 * =====================================================
 */

CafePhoXuaCheckout.Actions = {};

/**
 * =====================================================
 * Events
 * -----------------------------------------------------
 * Quản lý các sự kiện của Checkout.
 * =====================================================
 */

CafePhoXuaCheckout.Events = {};
/**
 * =====================================================
 * Build Customer
 * -----------------------------------------------------
 * Thu thập thông tin khách hàng từ form thanh toán.
 *
 * Trả về:
 * {
 *     name,
 *     phone,
 *     address,
 *     note
 * }
 * =====================================================
 */

CafePhoXuaCheckout.Builder.buildCustomer = function () {

    const name =
    document.getElementById("customerName")?.value?.trim() || "";

const phone =
    document.getElementById("customerPhone")?.value?.trim() || "";

const address =
    document.getElementById("customerAddress")?.value?.trim() || "";

const note =
    document.getElementById("customerNote")?.value?.trim() || "";

    return {

        name,

        phone,

        address,

        note

    };

};
/**
 * =====================================================
 * Build Order
 * -----------------------------------------------------
 * Xây dựng đối tượng đơn hàng hoàn chỉnh.
 *
 * Tham số:
 * - customer
 * - items
 * - total
 *
 * Trả về:
 * {
 *     customer,
 *     items,
 *     total
 * }
 * =====================================================
 */

CafePhoXuaCheckout.Builder.buildOrder = function (
    customer,
    items,
    total
) {

    customer = customer || {};

    items = Array.isArray(items) ? items : [];

    total = Number(total);

    if (Number.isNaN(total)) {
        total = 0;
    }

    return {

        customer,

        items,

        total

    };

};
/**
 * =====================================================
 * Collect Order
 * -----------------------------------------------------
 * Thu thập toàn bộ dữ liệu đơn hàng.
 *
 * Trả về:
 * {
 *     customer,
 *     items,
 *     total
 * }
 * =====================================================
 */

CafePhoXuaCheckout.Actions.collectOrder = function () {

    const customer =
        CafePhoXuaCheckout.Builder.buildCustomer();

    const items = Array.isArray(CafePhoXuaCart.items)
        ? [...CafePhoXuaCart.items]
        : [];

    const total = Number(CafePhoXuaCart.total) || 0;

    return CafePhoXuaCheckout.Builder.buildOrder(

        customer,

        items,

        total

    );

};
/**
 * =====================================================
 * Send Order
 * -----------------------------------------------------
 * Điều phối toàn bộ quy trình gửi đơn hàng.
 *
 * Quy trình:
 * 1. Thu thập dữ liệu đơn hàng
 * 2. Tạo nội dung đơn hàng
 * 3. Gửi sang Zalo
 *
 * Trả về:
 * true  - Gửi thành công
 * false - Gửi thất bại
 * =====================================================
 */

CafePhoXuaCheckout.Actions.sendOrder = function () {

    const order =
        CafePhoXuaCheckout.Actions.collectOrder();

    const message =
        CafePhoXuaOrderBuilder.Builder.buildOrderMessage(order);

    return CafePhoXuaZalo.send(message);

};
/**
 * =====================================================
 * Bind Send Button
 * -----------------------------------------------------
 * Gắn sự kiện cho nút "Gửi đơn qua Zalo".
 *
 * Khi người dùng nhấn nút:
 * - Gọi Checkout.Actions.sendOrder()
 * =====================================================
 */

CafePhoXuaCheckout.Events.bindSendButton = function () {

    const button = document.getElementById("sendOrderButton");

    if (!button) {
        return false;
    }

    button.addEventListener("click", function () {

        CafePhoXuaCheckout.Actions.sendOrder();

    });

    return true;

};
