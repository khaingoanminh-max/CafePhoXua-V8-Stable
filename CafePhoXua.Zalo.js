/**
 * Cafe Phố Xưa - Zalo Connector
 * Safe personal-Zalo handoff. No unsupported ?text= prefill.
 */
(function (window) {
    'use strict';

    const ZALO_PHONE = '0868708799';
    const ZALO_URL = 'https://zalo.me/' + ZALO_PHONE;

    const CafePhoXuaZalo = window.CafePhoXuaZalo || {};
    CafePhoXuaZalo.Config = { phone: ZALO_PHONE, baseUrl: ZALO_URL };
    CafePhoXuaZalo.Utils = CafePhoXuaZalo.Utils || {};
    CafePhoXuaZalo.Builder = CafePhoXuaZalo.Builder || {};

    CafePhoXuaZalo.Utils.copyMessage = async function (message) {
        const text = String(message || '');
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
    };

    CafePhoXuaZalo.Builder.buildUrl = function () {
        return ZALO_URL;
    };

    CafePhoXuaZalo.send = function (message) {
        CafePhoXuaZalo.Utils.copyMessage(message).finally(function () {
            window.location.href = ZALO_URL;
        });
        return true;
    };

    window.CafePhoXuaZalo = CafePhoXuaZalo;
})(window);
