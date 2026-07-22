/*!
 * ==========================================================
 * CafePhoXua.Render.js
 * ----------------------------------------------------------
 * CafePhoXua V8 Stable
 * Render Engine
 * ----------------------------------------------------------
 * Chức năng:
 * - Render Category
 * - Render Menu
 * - Render Cart
 * - Render Summary
 * - Partial Refresh
 * - Event Binding
 * - Performance Optimization
 * ----------------------------------------------------------
 * Phụ thuộc:
 * - CafePhoXua.Core.js
 * ----------------------------------------------------------
 * Không xử lý:
 * - Business Logic
 * - Cart Calculation
 * - Checkout
 * - Payment
 * - Zalo Integration
 * ----------------------------------------------------------
 * Author  : Khải
 * Version : 8.0.0 Stable
 * License : MIT
 * ==========================================================
 */
(function (window) {
    'use strict';

    // Kiểm tra Core đã được nạp chưa
    if (!window.CafePhoXua) {
        throw new Error(
            '[CafePhoXua.Render] CafePhoXua.Core.js chưa được tải.'
        );
    }

    const Core = window.CafePhoXua;

    // Ngăn nạp trùng Render
    if (Core.Render) {
        Core.log.warn('Render Engine already loaded.');
        return;
    }

    const Render = {};

    // Các phần tiếp theo sẽ được bổ sung tại đây...

    Core.Render = Render;

})(window);
/* ==========================================================
 * PRIVATE VARIABLES
 * ========================================================== */

// Cache các phần tử DOM
const dom = {};

// Registry lưu các renderer
const registry = new Map();

// Hàng đợi render
const renderQueue = new Set();

// ID của requestAnimationFrame
let frameId = null;

// Trạng thái Render Engine
let initialized = false;

// Template cache
const templates = new Map();

// Cache dữ liệu render gần nhất
const renderState = {
    category: null,
    menu: null,
    cart: null,
    summary: null,
    badge: null,
    customer: null,
    payment: null
};
/* ==========================================================
 * RENDER CONFIG
 * ========================================================== */

const config = {

    // Bật/tắt debug
    debug: false,

    // Có sử dụng requestAnimationFrame hay không
    useAnimationFrame: true,

    // Có cache DOM
    cacheDOM: true,

    // Có cache Template
    cacheTemplate: true,

    // Partial Refresh
    partialRender: true

};
/* ==========================================================
 * DOM CACHE MANAGER
 * ========================================================== */

/**
 * Cache một phần tử DOM
 * @param {string} key
 * @param {string|Element} selector
 * @returns {Element|null}
 */
function cacheElement(key, selector) {

    if (!config.cacheDOM) return null;

    let element = null;

    if (typeof selector === "string") {
        element = document.querySelector(selector);
    } else if (selector instanceof Element) {
        element = selector;
    }

    dom[key] = element;

    return element;
}

/**
 * Cache nhiều phần tử cùng lúc
 * @param {Object} selectors
 */
function cacheElements(selectors = {}) {

    Object.entries(selectors).forEach(([key, selector]) => {
        cacheElement(key, selector);
    });

}

/**
 * Lấy phần tử đã cache
 * @param {string} key
 * @returns {Element|null}
 */
function getElement(key) {

    return dom[key] || null;

}

/**
 * Kiểm tra phần tử đã tồn tại trong cache
 * @param {string} key
 * @returns {boolean}
 */
function hasElement(key) {

    return !!dom[key];

}

/**
 * Xóa cache DOM
 */
function clearCache() {

    Object.keys(dom).forEach(key => {
        delete dom[key];
    });

}

/**
 * Cập nhật lại cache DOM
 * @param {Object} selectors
 */
function refreshCache(selectors = {}) {

    clearCache();

    cacheElements(selectors);

}
/* ==========================================================
 * REGISTRY MANAGER
 * ========================================================== */

/**
 * Đăng ký một renderer
 * @param {string} name
 * @param {Function} renderer
 * @returns {boolean}
 */
function registerRenderer(name, renderer) {

    if (typeof name !== "string" || !name.trim()) {
        throw new TypeError("[Render] Renderer name must be a non-empty string.");
    }

    if (typeof renderer !== "function") {
        throw new TypeError("[Render] Renderer must be a function.");
    }

    if (registry.has(name)) {

        if (config.debug) {
            console.warn(`[Render] Renderer "${name}" already exists.`);
        }

        return false;
    }

    registry.set(name, renderer);

    if (config.debug) {
        console.log(`[Render] Renderer "${name}" registered.`);
    }

    return true;
}

/**
 * Hủy đăng ký renderer
 * @param {string} name
 * @returns {boolean}
 */
function unregisterRenderer(name) {

    if (!registry.has(name)) {
        return false;
    }

    registry.delete(name);

    if (config.debug) {
        console.log(`[Render] Renderer "${name}" removed.`);
    }

    return true;
}

/**
 * Lấy renderer theo tên
 * @param {string} name
 * @returns {Function|null}
 */
function getRenderer(name) {

    return registry.get(name) || null;

}

/**
 * Kiểm tra renderer tồn tại
 * @param {string} name
 * @returns {boolean}
 */
function hasRenderer(name) {

    return registry.has(name);

}

/**
 * Xóa toàn bộ registry
 */
function clearRegistry() {

    registry.clear();

    if (config.debug) {
        console.log("[Render] Registry cleared.");
    }

}

/**
 * Danh sách renderer đã đăng ký
 * @returns {string[]}
 */
function getRegisteredRenderers() {

    return [...registry.keys()];

}
/* ==========================================================
 * RENDER QUEUE
 * ========================================================== */

/**
 * Thêm renderer vào hàng đợi
 * @param {string} name
 * @returns {boolean}
 */
function enqueue(name) {

    if (!hasRenderer(name)) {

        if (config.debug) {
            console.warn(`[Render] Renderer "${name}" not found.`);
        }

        return false;
    }

    renderQueue.add(name);

    scheduleRender();

    return true;

}

/**
 * Xóa renderer khỏi hàng đợi
 * @param {string} name
 * @returns {boolean}
 */
function dequeue(name) {

    return renderQueue.delete(name);

}

/**
 * Thực thi toàn bộ renderer trong queue
 */
function flushQueue() {

    frameId = null;

    renderQueue.forEach(name => {

        const renderer = getRenderer(name);

        if (typeof renderer === "function") {

            try {

                renderer();

            } catch (error) {

                console.error(
                    `[Render] Error while rendering "${name}".`,
                    error
                );

            }

        }

    });

    renderQueue.clear();

}

/**
 * Lập lịch render
 */
function scheduleRender() {

    if (frameId !== null) {
        return;
    }

    if (!config.useAnimationFrame) {

        flushQueue();

        return;

    }

    frameId = requestAnimationFrame(flushQueue);

}

/**
 * Hủy render đang chờ
 */
function cancelRender() {

    if (frameId === null) {
        return;
    }

    cancelAnimationFrame(frameId);

    frameId = null;

}

/**
 * Xóa toàn bộ queue
 */
function clearQueue() {

    renderQueue.clear();

    cancelRender();

}

/**
 * Kiểm tra queue đang chờ render
 * @returns {boolean}
 */
function isQueuePending() {

    return frameId !== null;

}

/**
 * Số lượng renderer đang nằm trong queue
 * @returns {number}
 */
function getQueueSize() {

    return renderQueue.size;

}
/* ==========================================================
 * INTERNAL HELPERS
 * ========================================================== */

/**
 * Kiểm tra có phải Function
 * @param {*} value
 * @returns {boolean}
 */
function isFunction(value) {

    return typeof value === "function";

}

/**
 * Kiểm tra có phải DOM Element
 * @param {*} value
 * @returns {boolean}
 */
function isElement(value) {

    return value instanceof Element;

}

/**
 * Kiểm tra Object rỗng
 * @param {Object} obj
 * @returns {boolean}
 */
function isEmpty(obj) {

    if (!obj) return true;

    return Object.keys(obj).length === 0;

}

/**
 * Clone Object
 * @param {*} value
 * @returns {*}
 */
function clone(value) {

    if (typeof structuredClone === "function") {
        return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));

}

/**
 * Thực thi Function an toàn
 * @param {Function} fn
 * @param {...*} args
 * @returns {*}
 */
function safeExecute(fn, ...args) {

    if (!isFunction(fn)) {
        return null;
    }

    try {

        return fn(...args);

    } catch (error) {

        errorLog(error);

        return null;

    }

}

/**
 * Debug Log
 * @param {...*} args
 */
function debug(...args) {

    if (!config.debug) {
        return;
    }

    console.log("[Render]", ...args);

}

/**
 * Warning Log
 * @param {...*} args
 */
function warn(...args) {

    console.warn("[Render]", ...args);

}

/**
 * Error Log
 * @param {...*} args
 */
function errorLog(...args) {

    console.error("[Render]", ...args);

}
/* ==========================================================
 * PUBLIC API
 * ========================================================== */

/**
 * Khởi tạo Render Engine
 * @returns {object}
 */
Render.init = function () {

    if (initialized) {

        debug("Render Engine already initialized.");

        return Render;

    }

    initialized = true;

    debug("Render Engine initialized.");

    return Render;

};

/**
 * Cache các phần tử DOM
 * @param {Object} selectors
 * @returns {object}
 */
Render.cache = function (selectors = {}) {

    cacheElements(selectors);

    return Render;

};

/**
 * Đăng ký renderer
 * @param {string} name
 * @param {Function} renderer
 * @returns {boolean}
 */
Render.register = function (name, renderer) {

    return registerRenderer(name, renderer);

};

/**
 * Hủy đăng ký renderer
 * @param {string} name
 * @returns {boolean}
 */
Render.unregister = function (name) {

    return unregisterRenderer(name);

};

/**
 * Render một khu vực
 * @param {string} name
 * @returns {boolean}
 */
Render.render = function (name) {

    return enqueue(name);

};

/**
 * Làm mới một renderer
 * @param {string} name
 * @returns {boolean}
 */
Render.refresh = function (name) {

    return enqueue(name);

};

/**
 * Làm mới nhiều renderer
 * @param {string[]} names
 * @returns {object}
 */
Render.refreshMany = function (names = []) {

    if (!Array.isArray(names)) {

        return Render;

    }

    names.forEach(enqueue);

    return Render;

};

/**
 * Xóa cache và queue
 * @returns {object}
 */
Render.clear = function () {

    clearQueue();

    clearCache();

    return Render;

};

/**
 * Hủy Render Engine
 * @returns {object}
 */
Render.destroy = function () {

    clearQueue();

    clearCache();

    clearRegistry();

    initialized = false;

    debug("Render Engine destroyed.");

    return Render;

};
/* ==========================================================
 * EVENT BINDING
 * ========================================================== */

/**
 * Lưu các sự kiện đã đăng ký
 */
const eventBindings = [];

/**
 * Đăng ký một sự kiện từ Core
 * @param {string} eventName
 * @param {Function} handler
 */
function bindCoreEvent(eventName, handler) {

    if (!Core.events || !isFunction(Core.events.on)) {
        return;
    }

    Core.events.on(eventName, handler);

    eventBindings.push({
        event: eventName,
        handler: handler
    });

    debug(`Bound Core Event: ${eventName}`);

}

/**
 * Hủy đăng ký một sự kiện từ Core
 * @param {string} eventName
 * @param {Function} handler
 */
function unbindCoreEvent(eventName, handler) {

    if (!Core.events || !isFunction(Core.events.off)) {
        return;
    }

    Core.events.off(eventName, handler);

    debug(`Unbound Core Event: ${eventName}`);

}

/**
 * Đăng ký toàn bộ sự kiện của Render Engine
 */
function bindCoreEvents() {

    bindCoreEvent("menu:loaded", function () {

        enqueue(RENDERERS.MENU);

    });

    bindCoreEvent("category:loaded", function () {

        enqueue(RENDERERS.CATEGORY);

    });

    bindCoreEvent("cart:changed", function () {

        enqueue(RENDERERS.CART);
        enqueue(RENDERERS.SUMMARY);
        enqueue(RENDERERS.BADGE);

    });

    bindCoreEvent("customer:changed", function () {

        enqueue(RENDERERS.CUSTOMER);

    });

    bindCoreEvent("payment:changed", function () {

        enqueue(RENDERERS.PAYMENT);

    });

    debug("Core events bound.");

}

/**
 * Hủy toàn bộ Core Events
 */
function unbindCoreEvents() {

    eventBindings.forEach(binding => {

        unbindCoreEvent(
            binding.event,
            binding.handler
        );

    });

    eventBindings.length = 0;

    debug("Core events unbound.");

}

/**
 * Đăng ký DOM Events
 * (Để mở rộng trong tương lai)
 */
function bindDOMEvents() {

    debug("DOM events bound.");

}

/**
 * Hủy DOM Events
 */
function unbindDOMEvents() {

    debug("DOM events unbound.");

}

/**
 * Hủy toàn bộ Event Binding
 */
function destroyEvents() {

    unbindCoreEvents();

    unbindDOMEvents();

}
/* ==========================================================
 * TEMPLATE ENGINE
 * ========================================================== */

/**
 * Escape HTML
 * @param {string} value
 * @returns {string}
 */
function escapeHTML(value = "") {

    const div = document.createElement("div");

    div.textContent = String(value);

    return div.innerHTML;

}

/**
 * Build Category HTML
 * @param {Object} category
 * @returns {string}
 */
function buildCategoryHTML(category = {}) {

    return `
        <button
            class="category-item"
            data-id="${escapeHTML(category.id ?? "")}">
            ${escapeHTML(category.name ?? "")}
        </button>
    `;

}

/**
 * Build Menu Item HTML
 * @param {Object} item
 * @returns {string}
 */
function buildMenuHTML(item = {}) {

    return `
        <div class="menu-item" data-id="${escapeHTML(item.id ?? "")}">

            <div class="menu-name">
                ${escapeHTML(item.name ?? "")}
            </div>

            <div class="menu-price">
                ${Core.utils.money(item.price ?? 0)}
            </div>

        </div>
    `;

}

/**
 * Build Cart Item HTML
 * @param {Object} item
 * @returns {string}
 */
function buildCartHTML(item = {}) {

    return `
        <div class="cart-item" data-id="${escapeHTML(item.id ?? "")}">

            <span class="cart-name">
                ${escapeHTML(item.name ?? "")}
            </span>

            <span class="cart-qty">
                ${item.qty ?? 0}
            </span>

            <span class="cart-total">
                ${Core.utils.money(item.total ?? 0)}
            </span>

        </div>
    `;

}

/**
 * Build Summary HTML
 * @param {Object} summary
 * @returns {string}
 */
function buildSummaryHTML(summary = {}) {

    return `
        <div class="summary">

            <div>
                Tạm tính:
                <strong>${Core.utils.money(summary.subtotal ?? 0)}</strong>
            </div>

            <div>
                Giảm giá:
                <strong>${Core.utils.money(summary.discount ?? 0)}</strong>
            </div>

            <div>
                Thành tiền:
                <strong>${Core.utils.money(summary.total ?? 0)}</strong>
            </div>

        </div>
    `;

}

/**
 * Build Badge HTML
 * @param {number} count
 * @returns {string}
 */
function buildBadgeHTML(count = 0) {

    return `
        <span class="cart-badge">
            ${Number(count)}
        </span>
    `;

}
/* ==========================================================
 * CATEGORY RENDERER
 * ========================================================== */

/**
 * Render toàn bộ Category
 * @param {Array} categories
 * @returns {boolean}
 */
function renderCategory(categories = []) {

    const container = getElement("categoryContainer");

    if (!container) {

        warn("Category container not found.");

        return false;

    }

    if (!Array.isArray(categories)) {

        warn("Categories must be an array.");

        return false;

    }

    // Cache dữ liệu render gần nhất
    renderState.category = clone(categories);

    const html = categories
        .map(buildCategoryHTML)
        .join("");

    container.innerHTML = html;

    debug("Category rendered.");

    return true;

}

/**
 * Làm mới Category từ State
 * @returns {boolean}
 */
function refreshCategory() {

    return renderCategory(
        renderState.category || []
    );

}

/**
 * Xóa Category
 * @returns {boolean}
 */
function clearCategory() {

    const container = getElement("categoryContainer");

    if (!container) {

        return false;

    }

    container.innerHTML = "";

    renderState.category = [];

    debug("Category cleared.");

    return true;

}
/* ==========================================================
 * MENU RENDERER
 * ========================================================== */

/**
 * Render toàn bộ Menu
 * @param {Array} menu
 * @returns {boolean}
 */
function renderMenu(menu = []) {

    const container = getElement("menuContainer");

    if (!container) {

        warn("Menu container not found.");

        return false;

    }

    if (!Array.isArray(menu)) {

        warn("Menu must be an array.");

        return false;

    }

    // Cache dữ liệu render gần nhất
    renderState.menu = clone(menu);

    const html = menu
        .map(buildMenuHTML)
        .join("");

    container.innerHTML = html;

    debug("Menu rendered.");

    return true;

}

/**
 * Làm mới Menu từ State
 * @returns {boolean}
 */
function refreshMenu() {

    return renderMenu(
        renderState.menu || []
    );

}

/**
 * Xóa Menu
 * @returns {boolean}
 */
function clearMenu() {

    const container = getElement("menuContainer");

    if (!container) {

        return false;

    }

    container.innerHTML = "";

    renderState.menu = [];

    debug("Menu cleared.");

    return true;

}
/* ==========================================================
 * CART RENDERER
 * ========================================================== */

/**
 * Render toàn bộ Cart
 * @param {Array} cart
 * @returns {boolean}
 */
function renderCart(cart = []) {

    const container = getElement("cartContainer");

    if (!container) {

        warn("Cart container not found.");

        return false;

    }

    if (!Array.isArray(cart)) {

        warn("Cart must be an array.");

        return false;

    }

    // Cache dữ liệu render gần nhất
    renderState.cart = clone(cart);

    const html = cart
        .map(buildCartHTML)
        .join("");

    container.innerHTML = html;

    debug("Cart rendered.");

    return true;

}

/**
 * Làm mới Cart từ State
 * @returns {boolean}
 */
function refreshCart() {

    return renderCart(
        renderState.cart || []
    );

}

/**
 * Xóa Cart
 * @returns {boolean}
 */
function clearCart() {

    const container = getElement("cartContainer");

    if (!container) {

        return false;

    }

    container.innerHTML = "";

    renderState.cart = [];

    debug("Cart cleared.");

    return true;

}
/* ==========================================================
 * SUMMARY RENDERER
 * ========================================================== */

/**
 * Render Summary
 * @param {Object} summary
 * @returns {boolean}
 */
function renderSummary(summary = {}) {

    const container = getElement("summaryContainer");

    if (!container) {

        warn("Summary container not found.");

        return false;

    }

    if (
        summary === null ||
        typeof summary !== "object" ||
        Array.isArray(summary)
    ) {

        warn("Summary must be an object.");

        return false;

    }

    // Cache dữ liệu render gần nhất
    renderState.summary = clone(summary);

    container.innerHTML = buildSummaryHTML(summary);

    debug("Summary rendered.");

    return true;

}

/**
 * Làm mới Summary từ State
 * @returns {boolean}
 */
function refreshSummary() {

    return renderSummary(
        renderState.summary || {}
    );

}

/**
 * Xóa Summary
 * @returns {boolean}
 */
function clearSummary() {

    const container = getElement("summaryContainer");

    if (!container) {

        return false;

    }

    container.innerHTML = "";

    renderState.summary = {};

    debug("Summary cleared.");

    return true;

}
/* ==========================================================
 * BADGE RENDERER
 * ========================================================== */

/**
 * Render Badge
 * @param {number} count
 * @returns {boolean}
 */
function renderBadge(count = 0) {

    const container = getElement("badgeContainer");

    if (!container) {

        warn("Badge container not found.");

        return false;

    }

    const badgeCount = Number(count);

    if (Number.isNaN(badgeCount)) {

        warn("Badge count must be a number.");

        return false;

    }

    // Cache dữ liệu render gần nhất
    renderState.badge = badgeCount;

    container.innerHTML = buildBadgeHTML(badgeCount);

    debug("Badge rendered.");

    return true;

}

/**
 * Làm mới Badge từ State
 * @returns {boolean}
 */
function refreshBadge() {

    return renderBadge(
        renderState.badge ?? 0
    );

}

/**
 * Xóa Badge
 * @returns {boolean}
 */
function clearBadge() {

    const container = getElement("badgeContainer");

    if (!container) {

        return false;

    }

    container.innerHTML = "";

    renderState.badge = 0;

    debug("Badge cleared.");

    return true;

}
/* ==========================================================
 * FINAL EXPORT & FREEZE
 * ========================================================== */

/**
 * Đăng ký toàn bộ Renderer
 */
function registerDefaultRenderers() {

    registerRenderer(
        RENDERERS.CATEGORY,
        refreshCategory
    );

    registerRenderer(
        RENDERERS.MENU,
        refreshMenu
    );

    registerRenderer(
        RENDERERS.CART,
        refreshCart
    );

    registerRenderer(
        RENDERERS.SUMMARY,
        refreshSummary
    );

    registerRenderer(
        RENDERERS.BADGE,
        refreshBadge
    );

    debug("Default renderers registered.");

}

/**
 * Khởi tạo Render Engine
 */
(function initializeRenderEngine() {

    if (initialized) {
        return;
    }

    registerDefaultRenderers();

    initialized = true;

    debug("CafePhoXua.Render ready.");

})();
