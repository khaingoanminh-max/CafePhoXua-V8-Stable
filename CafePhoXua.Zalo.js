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
/**
 * =====================================================
 * Configuration
 * -----------------------------------------------------
 * Cấu hình mặc định của Zalo Connector.
 *
 * Chỉ lưu các thông tin cố định của quán.
 * =====================================================
 */

CafePhoXuaZalo.Config = {

    /**
     * Số điện thoại Zalo của quán
     */
    phone: "0868708799",

    /**
     * Đường dẫn Zalo chính thức
     */
    baseUrl: "https://zalo.me/0868708799"

};
/**
 * =====================================================
 * Send
 * -----------------------------------------------------
 * Mở Zalo với nội dung đơn hàng.
 * =====================================================
 */

CafePhoXuaZalo.send = function (message) {

    const url = CafePhoXuaZalo.Builder.buildUrl(

        CafePhoXuaZalo.Config.baseUrl,

        message

    );

    if (!url) {
        return false;
    }

    window.open(url, "_blank");

    return true;

};
