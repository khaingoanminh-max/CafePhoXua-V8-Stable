/** Cafe Phố Xưa - legacy Zalo Connector backup */
const CafePhoXuaZalo = {};
CafePhoXuaZalo.Utils = {};
CafePhoXuaZalo.Builder = {};
CafePhoXuaZalo.Utils.encodeMessage = function (message) { return encodeURIComponent(String(message || "")); };
CafePhoXuaZalo.Builder.buildUrl = function (baseUrl, message) { baseUrl = String(baseUrl || "").trim(); message = CafePhoXuaZalo.Utils.encodeMessage(message); if (!baseUrl) return ""; const separator = baseUrl.includes("?") ? "&" : "?"; return baseUrl + separator + "text=" + message; };
CafePhoXuaZalo.Config = { phone: "0868708799", baseUrl: "https://zalo.me/0868708799" };
CafePhoXuaZalo.send = function (message) { const url = CafePhoXuaZalo.Builder.buildUrl(CafePhoXuaZalo.Config.baseUrl, message); if (!url) return false; window.open(url, "_blank"); return true; };
window.CafePhoXuaZalo = CafePhoXuaZalo;
