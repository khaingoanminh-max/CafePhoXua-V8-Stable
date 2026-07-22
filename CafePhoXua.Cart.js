/*!
 * ==========================================================
 * CafePhoXua.Cart.js
 * ==========================================================
 *
 * CafePhoXua V8 Stable
 * Cart Engine
 *
 * ----------------------------------------------------------
 * Chức năng:
 * - Quản lý Cart
 * - Add Item
 * - Remove Item
 * - Update Quantity
 * - Update Note
 * - Clear Cart
 * - Find Item
 * - Summary Builder
 * - Price Calculator
 * - Discount Engine
 * - Event Emitter
 * ----------------------------------------------------------
 *
 * Phụ thuộc:
 * - CafePhoXua.Core.js
 * - CafePhoXua.Render.js
 * ----------------------------------------------------------
 *
 * Không xử lý:
 * - Render UI
 * - Checkout
 * - Payment
 * - Order Builder
 * - Zalo Integration
 * ----------------------------------------------------------
 *
 * Author : Khải
 * Version : 8.0.0 Stable
 * License : MIT
 * ==========================================================
 */
(function (window) {

    'use strict';
      /**
     * ==========================================================
     * PHẦN 1.3 — CORE CHECK
     * ----------------------------------------------------------
     * Kiểm tra Core Engine
     * Ngăn nạp trùng Cart Engine
     * Khởi tạo namespace Cart
     * ==========================================================
     */

    // Kiểm tra CafePhoXua.Core đã được nạp
    if (!window.CafePhoXua) {
        throw new Error(
            "[CafePhoXua.Cart] CafePhoXua.Core.js chưa được tải."
        );
    }

    const Core = window.CafePhoXua;

    // Ngăn khởi tạo Cart nhiều lần
    if (Core.Cart) {
        console.warn(
            "[CafePhoXua.Cart] Cart Engine already loaded."
        );
        return;
    }

    // Namespace Cart
    const Cart = {};

    // Gắn namespace vào Core
    Core.Cart = Cart;
  /**
 * ==========================================================
 * PHẦN 1.4 — PRIVATE VARIABLES
 * ----------------------------------------------------------
 * Biến nội bộ Cart Engine
 * ==========================================================
 */

// Danh sách sản phẩm trong giỏ
let cartItems = [];

// Cache dữ liệu Summary
let summaryCache = null;

// Danh sách Event Listener
const listeners = new Map();

// Trạng thái Cart
let cartState = {
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    total: 0
};

// Trạng thái khởi tạo
let initialized = false;

// Cấu hình Cart Engine
const config = {

    // Bật/Tắt Debug
    debug: false,

    // Tự động cập nhật Summary
    autoSummary: true,

    // Tự động Render
    autoRender: true,

    // Cho phép Event
    enableEvents: true

};
  /**
 * ==========================================================
 * PHẦN 1.5 — INTERNAL CONSTANTS
 * ----------------------------------------------------------
 * Hằng số nội bộ Cart Engine
 * ==========================================================
 */

// Các loại Event
const EVENTS = Object.freeze({

    ADD: "cart:add",

    REMOVE: "cart:remove",

    UPDATE: "cart:update",

    CLEAR: "cart:clear",

    SUMMARY: "cart:summary",

    CHANGE: "cart:change"

});

// Trạng thái Item
const ITEM_STATUS = Object.freeze({

    ACTIVE: "active",

    REMOVED: "removed"

});

// Giá trị mặc định
const DEFAULTS = Object.freeze({

    quantity: 1,

    note: "",

    sugar: 100,

    ice: 100,

    toppings: []

});

// Giới hạn
const LIMITS = Object.freeze({

    MIN_QUANTITY: 1,

    MAX_QUANTITY: 999

});
  /**
 * ==========================================================
 * PHẦN 1.6 — INTERNAL HELPERS
 * ----------------------------------------------------------
 * Các hàm tiện ích nội bộ
 * ==========================================================
 */

/**
 * Debug Log
 * @param  {...any} args
 */
function debug(...args) {

    if (!config.debug) {
        return;
    }

    console.log("[CafePhoXua.Cart]", ...args);

}

/**
 * Warning Log
 * @param  {...any} args
 */
function warn(...args) {

    console.warn("[CafePhoXua.Cart]", ...args);

}

/**
 * Error Log
 * @param  {...any} args
 */
function error(...args) {

    console.error("[CafePhoXua.Cart]", ...args);

}

/**
 * Kiểm tra Object
 * @param {*} value
 * @returns {boolean}
 */
function isObject(value) {

    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );

}

/**
 * Clone Object
 * @param {*} value
 * @returns {*}
 */
function clone(value) {

    return structuredClone(value);

}

/**
 * Sinh ID duy nhất
 * @returns {string}
 */
function createId() {

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
    );

}

/**
 * Giới hạn giá trị
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}

/**
 * Ép kiểu số
 * @param {*} value
 * @returns {number}
 */
function toNumber(value) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

}
  /**
 * ==========================================================
 * PHẦN 1.7 — EVENT MANAGER
 * ----------------------------------------------------------
 * Quản lý Event nội bộ Cart Engine
 * ==========================================================
 */

/**
 * Đăng ký Event
 * @param {string} event
 * @param {Function} callback
 * @returns {object}
 */
function on(event, callback) {

    if (typeof callback !== "function") {
        return Cart;
    }

    if (!listeners.has(event)) {
        listeners.set(event, new Set());
    }

    listeners.get(event).add(callback);

    debug("Event registered:", event);

    return Cart;

}

/**
 * Hủy Event
 * @param {string} event
 * @param {Function} callback
 * @returns {object}
 */
function off(event, callback) {

    if (!listeners.has(event)) {
        return Cart;
    }

    listeners.get(event).delete(callback);

    if (listeners.get(event).size === 0) {
        listeners.delete(event);
    }

    debug("Event removed:", event);

    return Cart;

}

/**
 * Phát Event
 * @param {string} event
 * @param {*} payload
 * @returns {object}
 */
function emit(event, payload = null) {

    if (!config.enableEvents) {
        return Cart;
    }

    const callbacks = listeners.get(event);

    if (!callbacks) {
        return Cart;
    }

    callbacks.forEach(callback => {

        try {

            callback(payload);

        } catch (err) {

            error(err);

        }

    });

    return Cart;

}

/**
 * Kiểm tra Event tồn tại
 * @param {string} event
 * @returns {boolean}
 */
function hasEvent(event) {

    return listeners.has(event);

}

/**
 * Xóa toàn bộ Event
 * @returns {object}
 */
function clearEvents() {

    listeners.clear();

    debug("All events cleared.");

    return Cart;

}

/**
 * Danh sách Event
 * @returns {string[]}
 */
function getEvents() {

    return [...listeners.keys()];

}
  /**
 * ==========================================================
 * PHẦN 1.8 — ITEM HELPERS
 * ----------------------------------------------------------
 * Các hàm thao tác nội bộ với Cart Item
 * ==========================================================
 */

/**
 * Tìm Item theo ID
 * @param {string} id
 * @returns {object|null}
 */
function findItem(id) {

    return cartItems.find(item => item.id === id) || null;

}

/**
 * Tìm vị trí Item
 * @param {string} id
 * @returns {number}
 */
function findItemIndex(id) {

    return cartItems.findIndex(item => item.id === id);

}

/**
 * Item có tồn tại
 * @param {string} id
 * @returns {boolean}
 */
function hasItem(id) {

    return findItemIndex(id) !== -1;

}

/**
 * Thêm Item nội bộ
 * @param {object} item
 * @returns {object}
 */
function pushItem(item) {

    cartItems.push(item);

    return item;

}

/**
 * Xóa Item nội bộ
 * @param {string} id
 * @returns {boolean}
 */
function removeItemInternal(id) {

    const index = findItemIndex(id);

    if (index === -1) {
        return false;
    }

    cartItems.splice(index, 1);

    return true;

}

/**
 * Cập nhật Item
 * @param {string} id
 * @param {object} data
 * @returns {object|null}
 */
function updateItemInternal(id, data = {}) {

    const item = findItem(id);

    if (!item) {
        return null;
    }

    Object.assign(item, data);

    return item;

}

/**
 * Xóa toàn bộ Item
 */
function clearItems() {

    cartItems.length = 0;

}

/**
 * Lấy bản sao Cart
 * @returns {Array}
 */
function getItemsClone() {

    return clone(cartItems);

}
  /**
 * ==========================================================
 * PHẦN 1.9 — PRICE CALCULATOR
 * ----------------------------------------------------------
 * Tính toán giá sản phẩm
 * ==========================================================
 */

/**
 * Giá Topping
 * @param {Array} toppings
 * @returns {number}
 */
function calculateToppingPrice(toppings = []) {

    return toppings.reduce((total, topping) => {

        return total + toNumber(topping.price);

    }, 0);

}

/**
 * Giá của 1 Item
 * @param {object} item
 * @returns {number}
 */
function calculateItemPrice(item = {}) {

    const basePrice = toNumber(item.price);

    const toppingPrice = calculateToppingPrice(
        item.toppings || []
    );

    return basePrice + toppingPrice;

}

/**
 * Thành tiền của Item
 * @param {object} item
 * @returns {number}
 */
function calculateItemTotal(item = {}) {

    const quantity = clamp(
        toNumber(item.quantity),
        LIMITS.MIN_QUANTITY,
        LIMITS.MAX_QUANTITY
    );

    return calculateItemPrice(item) * quantity;

}

/**
 * Tổng tiền Cart
 * @returns {number}
 */
function calculateSubtotal() {

    return cartItems.reduce((total, item) => {

        return total + calculateItemTotal(item);

    }, 0);

}

/**
 * Tổng giảm giá
 * @returns {number}
 */
function calculateDiscount() {

    return cartItems.reduce((total, item) => {

        return total + toNumber(item.discount);

    }, 0);

}

/**
 * Thành tiền cuối cùng
 * @returns {number}
 */
function calculateTotal() {

    const subtotal = calculateSubtotal();

    const discount = calculateDiscount();

    return Math.max(
        subtotal - discount,
        0
    );

}

/**
 * Tổng số lượng sản phẩm
 * @returns {number}
 */
function calculateItemCount() {

    return cartItems.reduce((total, item) => {

        return total + toNumber(item.quantity);

    }, 0);

}
  /**
 * ==========================================================
 * PHẦN 2.0 — SUMMARY BUILDER
 * ----------------------------------------------------------
 * Xây dựng Summary của Cart
 * ==========================================================
 */

/**
 * Xây dựng Summary
 * @returns {object}
 */
function buildSummary() {

    summaryCache = {

        itemCount: calculateItemCount(),

        subtotal: calculateSubtotal(),

        discount: calculateDiscount(),

        total: calculateTotal()

    };

    cartState.itemCount = summaryCache.itemCount;

    cartState.subtotal = summaryCache.subtotal;

    cartState.discount = summaryCache.discount;

    cartState.total = summaryCache.total;

    return clone(summaryCache);

}

/**
 * Lấy Summary hiện tại
 * @returns {object}
 */
function getSummary() {

    if (!summaryCache) {

        buildSummary();

    }

    return clone(summaryCache);

}

/**
 * Làm mới Summary
 * @returns {object}
 */
function refreshSummary() {

    buildSummary();

    emit(
        EVENTS.SUMMARY,
        clone(summaryCache)
    );

    return clone(summaryCache);

}

/**
 * Xóa Summary
 * @returns {object}
 */
function clearSummary() {

    summaryCache = null;

    cartState.itemCount = 0;

    cartState.subtotal = 0;

    cartState.discount = 0;

    cartState.total = 0;

    return {

        itemCount: 0,

        subtotal: 0,

        discount: 0,

        total: 0

    };

}
  /**
 * ==========================================================
 * PHẦN 2.1 — ADD ITEM ENGINE
 * ----------------------------------------------------------
 * Thêm sản phẩm vào Cart
 * ==========================================================
 */

/**
 * Thêm Item vào Cart
 * @param {Object} item
 * @returns {Object|null}
 */
function addItem(item = {}) {

    if (!isObject(item)) {

        warn("Item must be an object.");

        return null;

    }

    const cartItem = {

        id: item.id || createId(),

        name: item.name || "",

        price: toNumber(item.price),

        quantity: clamp(
            toNumber(item.quantity ?? DEFAULTS.quantity),
            LIMITS.MIN_QUANTITY,
            LIMITS.MAX_QUANTITY
        ),

        note: item.note ?? DEFAULTS.note,

        sugar: item.sugar ?? DEFAULTS.sugar,

        ice: item.ice ?? DEFAULTS.ice,

        toppings: clone(
            item.toppings ?? DEFAULTS.toppings
        ),

        discount: toNumber(item.discount),

        status: ITEM_STATUS.ACTIVE

    };

    pushItem(cartItem);

    refreshSummary();

    if (config.enableEvents) {

        emit(EVENTS.ADD, clone(cartItem));

        emit(EVENTS.CHANGE, getSummary());

    }

    debug("Item added.", cartItem);

    return clone(cartItem);

}

/**
 * Thêm nhiều Item
 * @param {Array} items
 * @returns {number}
 */
function addItems(items = []) {

    if (!Array.isArray(items)) {

        warn("Items must be an array.");

        return 0;

    }

    let added = 0;

    items.forEach(item => {

        if (addItem(item)) {

            added++;

        }

    });

    return added;

}
  /**
 * ==========================================================
 * PHẦN 2.2 — REMOVE ITEM ENGINE
 * ----------------------------------------------------------
 * Xóa sản phẩm khỏi Cart
 * ==========================================================
 */

/**
 * Xóa Item theo ID
 * @param {string} id
 * @returns {boolean}
 */
function removeItem(id) {

    if (typeof id !== "string" || !id.trim()) {

        warn("Invalid item id.");

        return false;

    }

    const item = findItem(id);

    if (!item) {

        warn("Item not found:", id);

        return false;

    }

    const removedItem = clone(item);

    if (!removeItemInternal(id)) {

        return false;

    }

    refreshSummary();

    if (config.enableEvents) {

        emit(EVENTS.REMOVE, removedItem);

        emit(EVENTS.CHANGE, getSummary());

    }

    debug("Item removed.", removedItem);

    return true;

}

/**
 * Xóa nhiều Item
 * @param {Array<string>} ids
 * @returns {number}
 */
function removeItems(ids = []) {

    if (!Array.isArray(ids)) {

        warn("Ids must be an array.");

        return 0;

    }

    let removed = 0;

    ids.forEach(id => {

        if (removeItem(id)) {

            removed++;

        }

    });

    return removed;

}

/**
 * Xóa Item theo điều kiện
 * @param {Function} predicate
 * @returns {number}
 */
function removeWhere(predicate) {

    if (typeof predicate !== "function") {

        warn("Predicate must be a function.");

        return 0;

    }

    const ids = cartItems
        .filter(predicate)
        .map(item => item.id);

    return removeItems(ids);

}
  /**
 * ==========================================================
 * PHẦN 2.3 — UPDATE QUANTITY ENGINE
 * ----------------------------------------------------------
 * Cập nhật số lượng sản phẩm
 * ==========================================================
 */

/**
 * Cập nhật số lượng Item
 * @param {string} id
 * @param {number} quantity
 * @returns {Object|null}
 */
function updateQuantity(id, quantity) {

    if (typeof id !== "string" || !id.trim()) {

        warn("Invalid item id.");

        return null;

    }

    const item = findItem(id);

    if (!item) {

        warn("Item not found:", id);

        return null;

    }

    const newQuantity = clamp(
        toNumber(quantity),
        LIMITS.MIN_QUANTITY,
        LIMITS.MAX_QUANTITY
    );

    updateItemInternal(id, {

        quantity: newQuantity

    });

    refreshSummary();

    const updatedItem = clone(findItem(id));

    if (config.enableEvents) {

        emit(EVENTS.UPDATE, updatedItem);

        emit(EVENTS.CHANGE, getSummary());

    }

    debug("Quantity updated.", updatedItem);

    return updatedItem;

}

/**
 * Tăng số lượng Item
 * @param {string} id
 * @param {number} step
 * @returns {Object|null}
 */
function increaseQuantity(id, step = 1) {

    const item = findItem(id);

    if (!item) {

        warn("Item not found:", id);

        return null;

    }

    return updateQuantity(
        id,
        item.quantity + toNumber(step)
    );

}

/**
 * Giảm số lượng Item
 * @param {string} id
 * @param {number} step
 * @returns {Object|null}
 */
function decreaseQuantity(id, step = 1) {

    const item = findItem(id);

    if (!item) {

        warn("Item not found:", id);

        return null;

    }

    return updateQuantity(
        id,
        item.quantity - toNumber(step)
    );

}
  /**
 * ==========================================================
 * PHẦN 2.4 — UPDATE ITEM ENGINE
 * ----------------------------------------------------------
 * Cập nhật thông tin sản phẩm
 * ==========================================================
 */

/**
 * Cập nhật Item
 * @param {string} id
 * @param {Object} data
 * @returns {Object|null}
 */
function updateItem(id, data = {}) {

    if (typeof id !== "string" || !id.trim()) {

        warn("Invalid item id.");

        return null;

    }

    if (!isObject(data)) {

        warn("Data must be an object.");

        return null;

    }

    const item = findItem(id);

    if (!item) {

        warn("Item not found:", id);

        return null;

    }

    const updates = {};

    if ("name" in data) {
        updates.name = data.name ?? "";
    }

    if ("price" in data) {
        updates.price = toNumber(data.price);
    }

    if ("note" in data) {
        updates.note = data.note ?? "";
    }

    if ("sugar" in data) {
        updates.sugar = data.sugar;
    }

    if ("ice" in data) {
        updates.ice = data.ice;
    }

    if ("toppings" in data) {
        updates.toppings = clone(data.toppings ?? []);
    }

    if ("discount" in data) {
        updates.discount = toNumber(data.discount);
    }

    if ("status" in data) {
        updates.status = data.status;
    }

    updateItemInternal(id, updates);

    refreshSummary();

    const updatedItem = clone(findItem(id));

    if (config.enableEvents) {

        emit(EVENTS.UPDATE, updatedItem);

        emit(EVENTS.CHANGE, getSummary());

    }

    debug("Item updated.", updatedItem);

    return updatedItem;

}

/**
 * Cập nhật nhiều Item
 * @param {Array<{id:string,data:Object}>} updates
 * @returns {number}
 */
function updateItems(updates = []) {

    if (!Array.isArray(updates)) {

        warn("Updates must be an array.");

        return 0;

    }

    let updated = 0;

    updates.forEach(entry => {

        if (
            isObject(entry) &&
            updateItem(entry.id, entry.data)
        ) {

            updated++;

        }

    });

    return updated;

}
  /**
 * ==========================================================
 * PHẦN 2.5 — CLEAR CART ENGINE
 * ----------------------------------------------------------
 * Xóa toàn bộ giỏ hàng
 * ==========================================================
 */

/**
 * Xóa toàn bộ Cart
 * @returns {boolean}
 */
function clearCart() {

    if (cartItems.length === 0) {

        debug("Cart is already empty.");

        return true;

    }

    const removedItems = getItemsClone();

    clearItems();

    clearSummary();

    refreshSummary();

    if (config.enableEvents) {

        emit(EVENTS.CLEAR, removedItems);

        emit(EVENTS.CHANGE, getSummary());

    }

    debug("Cart cleared.");

    return true;

}

/**
 * Cart có rỗng hay không
 * @returns {boolean}
 */
function isEmpty() {

    return cartItems.length === 0;

}

/**
 * Lấy số lượng Item trong Cart
 * @returns {number}
 */
function getItemCount() {

    return cartItems.length;

}
  /**
 * ==========================================================
 * PHẦN 2.6 — QUERY ENGINE
 * ----------------------------------------------------------
 * Các hàm truy vấn dữ liệu Cart
 * ==========================================================
 */

/**
 * Lấy toàn bộ Item
 * @returns {Array}
 */
function getItems() {

    return getItemsClone();

}

/**
 * Lấy Item theo ID
 * @param {string} id
 * @returns {Object|null}
 */
function getItem(id) {

    const item = findItem(id);

    return item
        ? clone(item)
        : null;

}

/**
 * Kiểm tra Item tồn tại
 * @param {string} id
 * @returns {boolean}
 */
function exists(id) {

    return hasItem(id);

}

/**
 * Tìm Item theo điều kiện
 * @param {Function} predicate
 * @returns {Array}
 */
function findItems(predicate) {

    if (typeof predicate !== "function") {

        warn("Predicate must be a function.");

        return [];

    }

    return cartItems
        .filter(predicate)
        .map(item => clone(item));

}

/**
 * Lấy Item đầu tiên theo điều kiện
 * @param {Function} predicate
 * @returns {Object|null}
 */
function findFirst(predicate) {

    if (typeof predicate !== "function") {

        warn("Predicate must be a function.");

        return null;

    }

    const item = cartItems.find(predicate);

    return item
        ? clone(item)
        : null;

}

/**
 * Lấy Item cuối cùng theo điều kiện
 * @param {Function} predicate
 * @returns {Object|null}
 */
function findLast(predicate) {

    if (typeof predicate !== "function") {

        warn("Predicate must be a function.");

        return null;

    }

    for (let i = cartItems.length - 1; i >= 0; i--) {

        if (predicate(cartItems[i])) {

            return clone(cartItems[i]);

        }

    }

    return null;

}

/**
 * Kiểm tra Cart có Item hay không
 * @returns {boolean}
 */
function hasItems() {

    return cartItems.length > 0;

}

/**
 * Lấy trạng thái Cart
 * @returns {Object}
 */
function getState() {

    return clone(cartState);

}
  /**
 * ==========================================================
 * PHẦN 2.7 — PUBLIC API
 * ----------------------------------------------------------
 * API công khai của Cart Engine
 * ==========================================================
 */

Object.assign(Cart, {

    /**
     * Event
     */
    on,
    off,
    emit,

    /**
     * Add
     */
    addItem,
    addItems,

    /**
     * Remove
     */
    removeItem,
    removeItems,
    removeWhere,

    /**
     * Update
     */
    updateItem,
    updateItems,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,

    /**
     * Clear
     */
    clearCart,

    /**
     * Query
     */
    getItems,
    getItem,
    getItemCount,
    hasItems,
    isEmpty,
    exists,
    findItems,
    findFirst,
    findLast,

    /**
     * Summary
     */
    getSummary,
    refreshSummary,

    /**
     * State
     */
    getState,

    /**
     * Utility
     */
    clearEvents,
    getEvents

});
  /**
 * ==========================================================
 * PHẦN 2.8 — MODULE EXPORT
 * ----------------------------------------------------------
 * Xuất Cart Engine ra Core
 * ==========================================================
 */

/**
 * Gắn Cart vào Core
 */
Core.Cart = Cart;

/**
 * Đồng bộ Namespace
 */
window.CafePhoXua = Core;

/**
 * Debug
 */
debug("Cart module exported.");
  /**
 * ==========================================================
 * PHẦN 2.9 — FREEZE ENGINE
 * ----------------------------------------------------------
 * Khóa Public API của Cart Engine
 * ==========================================================
 */

/**
 * Đóng băng Public API
 */
Object.freeze(Cart);

/**
 * Đóng băng Module
 */
Object.freeze(Core.Cart);

/**
 * Thông báo khởi tạo
 */
debug("CafePhoXua.Cart initialized successfully.");

/**
 * Kết thúc Module
 */
})(window);
