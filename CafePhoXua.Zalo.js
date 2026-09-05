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

CafePhoXuaZalo.Utils = {};
CafePhoXuaZalo.Builder = {};

CafePhoXuaZalo.Utils.encodeMessage = function (message) {
    message = String(message || "");
    return encodeURIComponent(message);
};

CafePhoXuaZalo.Builder.buildUrl = function (baseUrl, message) {
    baseUrl = String(baseUrl || "").trim();
    message = CafePhoXuaZalo.Utils.encodeMessage(message);

    if (!baseUrl) {
        return "";
    }

    const separator = baseUrl.includes("?") ? "&" : "?";
    return baseUrl + separator + "text=" + message;
};

CafePhoXuaZalo.Config = {
    phone: "0868708799",
    baseUrl: "https://zalo.me/0868708799"
};

CafePhoXuaZalo.send = function (message) {
    const url = CafePhoXuaZalo.Builder.buildUrl(
        CafePhoXuaZalo.Config.baseUrl,
        message
    );

    if (!url) {
        return false;
    }

    const popup = window.open(url, "_blank", "noopener,noreferrer");

    return popup !== null;
};
