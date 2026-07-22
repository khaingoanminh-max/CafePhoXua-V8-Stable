/*!
 * CafePhoXua.Core.js
 * CafePhoXua V8 Stable
 * ----------------------------------------------------
 * Core Foundation
 * ----------------------------------------------------
 */

(function (window) {
    'use strict';

    if (window.CafePhoXua) {
        console.warn('[CafePhoXua] Core already loaded.');
        return;
    }

    const CafePhoXua = {};

    /* ==========================================================
       VERSION
    ========================================================== */

    CafePhoXua.version = "8.0.0";

    /* ==========================================================
       CONFIG
    ========================================================== */

    CafePhoXua.config = {

        debug: false,

        currency: "VNĐ",

        currencyFormat: "vi-VN",

        storagePrefix: "CafePhoXua.",

        autoSaveCart: true,

        animation: true

    };

    /* ==========================================================
       STATE
    ========================================================== */

    CafePhoXua.state = {

        menu: [],

        categories: [],

        cart: [],

        customer: null,

        discount: null,

        voucher: null,

        payment: null

    };

    /* ==========================================================
       LOGGER
    ========================================================== */

    CafePhoXua.log = {

        info(...args) {

            if (!CafePhoXua.config.debug) return;

            console.log("[CafePhoXua]", ...args);

        },

        warn(...args) {

            console.warn("[CafePhoXua]", ...args);

        },

        error(...args) {

            console.error("[CafePhoXua]", ...args);

        }

    };

    /* ==========================================================
       EVENT BUS
    ========================================================== */

    const events = {};

    CafePhoXua.events = {

        on(name, callback) {

            if (!events[name]) {

                events[name] = [];

            }

            events[name].push(callback);

        },

        off(name, callback) {

            if (!events[name]) return;

            events[name] =
                events[name].filter(fn => fn !== callback);

        },

        emit(name, payload) {

            if (!events[name]) return;

            events[name].forEach(fn => {

                try {

                    fn(payload);

                } catch (err) {

                    console.error(err);

                }

            });

        }

    };

    /* ==========================================================
       STORAGE
    ========================================================== */

    CafePhoXua.storage = {

        set(key, value) {

            localStorage.setItem(

                CafePhoXua.config.storagePrefix + key,

                JSON.stringify(value)

            );

        },

        get(key, fallback = null) {

            const value = localStorage.getItem(

                CafePhoXua.config.storagePrefix + key

            );

            if (!value) return fallback;

            try {

                return JSON.parse(value);

            } catch {

                return fallback;

            }

        },

        remove(key) {

            localStorage.removeItem(

                CafePhoXua.config.storagePrefix + key

            );

        },

        clear() {

            Object.keys(localStorage)

                .filter(k =>
                    k.startsWith(CafePhoXua.config.storagePrefix)
                )
                .forEach(k =>
                    localStorage.removeItem(k)
                );

        }

    };

    /* ==========================================================
       UTILS
    ========================================================== */

    CafePhoXua.utils = {

        uuid() {

            return crypto.randomUUID();

        },

        clone(obj) {

            return structuredClone(obj);

        },

        money(value) {

            return Number(value || 0).toLocaleString(

                CafePhoXua.config.currencyFormat

            ) + " " + CafePhoXua.config.currency;

        },

        now() {

            return Date.now();

        },

        debounce(fn, delay = 300) {

            let timer;

            return function (...args) {

                clearTimeout(timer);

                timer = setTimeout(() => {

                    fn.apply(this, args);

                }, delay);

            };

        }

    };

    /* ==========================================================
       INIT
    ========================================================== */

    CafePhoXua.init = function () {

        CafePhoXua.log.info(

            "CafePhoXua Core Initialized",

            CafePhoXua.version

        );

        CafePhoXua.events.emit("core:ready");

    };

    /* ==========================================================
       EXPORT
    ========================================================== */

    window.CafePhoXua = CafePhoXua;

})(window);
