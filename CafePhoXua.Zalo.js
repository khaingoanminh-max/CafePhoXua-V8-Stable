/**
 * =====================================================
 * Cafe Phố Xưa - Zalo Connector
 * -----------------------------------------------------
 * Chịu trách nhiệm kết nối website với Zalo.
 *
 * Chức năng:
 * - Mã hóa nội dung đơn hàng
 * - Tạo URL Zalo
 * - Gửi đơn hàng sang Zalo
 *
 * Không xử lý:
 * - Giao diện
 * - Giỏ hàng
 * - Tạo nội dung đơn hàng
 * =====================================================
 */

const CafePhoXuaZalo = {};
/**
 * =====================================================
 * Utilities
 * -----------------------------------------------------
 * Chứa các hàm tiện ích dùng trong Zalo Connector.
 * =====================================================
 */

CafePhoXuaZalo.Utils = {};

/**
 * =====================================================
 * Builder
 * -----------------------------------------------------
 * Chịu trách nhiệm tạo URL Zalo.
 * =====================================================
 */

CafePhoXuaZalo.Builder = {};
/**
 * =====================================================
 * Encode Message
 * -----------------------------------------------------
 * Mã hóa nội dung đơn hàng để sử dụng trong URL Zalo.
 * =====================================================
 */

CafePhoXuaZalo.Utils.encodeMessage = function (message) {

    message = String(message || "");

    return encodeURIComponent(message);

};
/**
 * =====================================================
 * Build URL
 * -----------------------------------------------------
 * Tạo URL Zalo hoàn chỉnh từ đường link gốc và nội dung
 * đã được mã hóa.
 * =====================================================
 */

CafePhoXuaZalo.Builder.buildUrl = function (baseUrl, message) {

    baseUrl = String(baseUrl || "").trim();

    message = CafePhoXuaZalo.Utils.encodeMessage(message);

    if (!baseUrl) {
        return "";
    }

    const separator = baseUrl.includes("?") ? "&" : "?";

    return baseUrl + separator + "text=" + message;

};
