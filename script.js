// =====================================================
// CAFE PHỐ XƯA
// VERSION 2.0 STABLE
// BLOCK 01/10
// KHỞI TẠO HỆ THỐNG
// =====================================================

// ---------------------------
// Giỏ hàng
// ---------------------------
let cart = [];

// =====================================================
// KẾT THÚC BLOCK 01
// =====================================================
// =====================================================
// BLOCK 02/10
// LẤY CÁC PHẦN TỬ HTML
// =====================================================

const cartIcon = document.getElementById("cart-icon");
const cartPopup = document.getElementById("cart-popup");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const closeCart = document.getElementById("close-cart");

const orderButtons = document.querySelectorAll(".menu-order-btn");

// =====================================================
// KẾT THÚC BLOCK 02
// =====================================================
// =====================================================
// BLOCK 03/10
// CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG
// =====================================================

function updateCartCount() {

    let total = 0;

    for (const item of cart) {

        total += item.quantity;

    }

    cartCount.textContent = total;

}

// =====================================================
// KẾT THÚC BLOCK 03
// =====================================================
// =====================================================
// BLOCK 04/10
// TÍNH TỔNG TIỀN
// =====================================================

function calculateTotal() {

    let total = 0;

    for (const item of cart) {

        total += item.price * item.quantity;

    }

    cartTotal.textContent = "Tổng tiền: " + total.toLocaleString() + "đ";

}

// =====================================================
// KẾT THÚC BLOCK 04
// =====================================================
// =====================================================
// BLOCK 05/10
// HIỂN THỊ GIỎ HÀNG
// =====================================================

function renderCart() {

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p style="text-align:center;padding:20px;">
                Chưa có sản phẩm.
            </p>
        `;
         cartTotal.textContent = "Tổng tiền: 0đ";

        return;


    }

    let html = "";

    for (const item of cart) {

        html += `
            <div class="cart-item">

                <strong>${item.product}</strong><br>

                <div class="cart-qty">

                    <button
                        class="minus-btn"
                        data-product="${item.product}">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        class="plus-btn"
                        data-product="${item.product}">
                        +
                    </button>

                </div>

                <div>

                    ${(item.price * item.quantity).toLocaleString()}đ

                </div>

            </div>

            <hr>
        `;

    }

    cartItems.innerHTML = html;

}

// =====================================================
// KẾT THÚC BLOCK 05
// =====================================================
// =====================================================
// BLOCK 06/10
// MODULE GIỎ HÀNG
// =====================================================

// Cập nhật toàn bộ giao diện giỏ hàng
function refreshCart() {

    updateCartCount();
    calculateTotal();
    renderCart();
    saveCart();

}

// Thêm sản phẩm vào giỏ
function addToCart(product, price) {

    const exist = cart.find(item => item.product === product);

    if (exist) {

        exist.quantity++;

    } else {

        cart.push({
            product: product,
            price: price,
            quantity: 1
        });

    }

    refreshCart();

}

// Gắn sự kiện cho các nút "Đặt ngay"
orderButtons.forEach(button => {

    button.addEventListener("click", function (e) {

        e.preventDefault();

        // Thêm sản phẩm
        addToCart(
            this.dataset.product,
            Number(this.dataset.price)
        );
        // --------------------------
// Hiệu ứng giỏ hàng
// --------------------------
cartIcon.classList.add("cart-bounce");

setTimeout(function () {

    cartIcon.classList.remove("cart-bounce");

}, 400);

        // --------------------------
        // Hiệu ứng nút
        // --------------------------

        const btn = this;

        // Tránh bấm liên tục
        btn.disabled = true;

        // Lưu giao diện cũ
        const oldText = btn.innerHTML;
        const oldColor = btn.style.backgroundColor;
        const oldCursor = btn.style.cursor;

        // Hiệu ứng thành công
        btn.innerHTML = "✔ Đã thêm";
        btn.style.backgroundColor = "#28a745";
        btn.style.cursor = "default";

        // Sau 1 giây trở lại bình thường
        setTimeout(function () {

            btn.innerHTML = oldText;
            btn.style.backgroundColor = oldColor;
            btn.style.cursor = oldCursor;
            btn.disabled = false;

        }, 1000);

    });

});

// =====================================================
// KẾT THÚC BLOCK 06
// =====================================================
// =====================================================
// BLOCK 07/10
// ĐIỀU CHỈNH SỐ LƯỢNG (+ / -)
// =====================================================

// ---------------------------
// Tăng số lượng
// ---------------------------
document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("plus-btn")) {
        return;
    }

    const product = e.target.dataset.product;

    const item = cart.find(i => i.product === product);

    if (!item) {
        return;
    }

    item.quantity++;

    refreshCart();

});

// ---------------------------
// Giảm số lượng
// ---------------------------
document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("minus-btn")) {
        return;
    }

    const product = e.target.dataset.product;

    const index = cart.findIndex(i => i.product === product);

    if (index === -1) {
        return;
    }

    cart[index].quantity--;

    // Nếu số lượng bằng 0 thì xóa khỏi giỏ
    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    refreshCart();

});

// =====================================================
// KẾT THÚC BLOCK 07
// =====================================================
// =====================================================
// BLOCK 08/10
// QUẢN LÝ POPUP GIỎ HÀNG
// =====================================================

// ---------------------------
// Mở giỏ hàng
// ---------------------------
cartIcon.addEventListener("click", function () {

    cartPopup.style.display = "flex";

});

// ---------------------------
// Đóng bằng nút "Đóng"
// ---------------------------
closeCart.addEventListener("click", function () {

    cartPopup.style.display = "none";

});

// ---------------------------
// Click nền tối để đóng
// ---------------------------
cartPopup.addEventListener("click", function (e) {

    if (e.target === cartPopup) {

        cartPopup.style.display = "none";

    }

});

// =====================================================
// KẾT THÚC BLOCK 08
// =====================================================
// =====================================================
// BLOCK 09/10
// KHỞI TẠO GIAO DIỆN
// =====================================================

// Khởi tạo toàn bộ giao diện

loadCart();

refreshCart();

// =====================================================
// KẾT THÚC BLOCK 09
// =====================================================
// =====================================================
// BLOCK 10/10
// KHỞI ĐỘNG HỆ THỐNG
// =====================================================

// Kiểm tra các phần tử quan trọng
if (
    !cartIcon ||
    !cartPopup ||
    !cartItems ||
    !cartCount ||
    !cartTotal ||
    !closeCart
) {

    console.error("❌ Lỗi: Không tìm thấy phần tử HTML.");

} else {

    console.log("☕ Cafe Phố Xưa");
    console.log("🚀 Version 2.0 Stable");
    console.log("✅ READY");

}

// =====================================================
// KẾT THÚC BLOCK 10
// =====================================================
// =====================================================
// CAFE PHỐ XƯA
// VERSION 3.0
// BLOCK 03/10
// LOCAL STORAGE MODULE - PHẦN A
// =====================================================

// ---------------------------
// Lưu giỏ hàng
// ---------------------------
function saveCart() {

    localStorage.setItem(
        "cafePhoXuaCart",
        JSON.stringify(cart)
    );


}
// =====================================================
// VERSION 3.0
// BLOCK 03 - PHẦN C
// KHÔI PHỤC GIỎ HÀNG
// =====================================================

function loadCart() {

    const data = localStorage.getItem("cafePhoXuaCart");

    if (!data) {

        return;

    }

    try {

        cart = JSON.parse(data);

    } catch (error) {

        console.error("Không thể đọc dữ liệu giỏ hàng.");

        cart = [];

    }

}

// =====================================================
// KẾT THÚC BLOCK 03 - PHẦN C
// =====================================================

// =====================================================
// KẾT THÚC BLOCK 03 - PHẦN A
// =====================================================
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.4A
   Block   : 04
   Chức năng :
   JavaScript Mở / Đóng Popup Thanh toán

   Ghi chú :
   - Chỉ xử lý mở / đóng Popup.
   - Không xử lý dữ liệu.
   - Không gửi Zalo.
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const btnOpen = document.getElementById("btnOpenPaymentPopup");

    const btnClose = document.getElementById("closePaymentPopup");

    const paymentOverlay = document.getElementById("paymentOverlay");

    const paymentPopup = document.getElementById("paymentPopup");

    const cartPopup = document.getElementById("cart-popup");

    /* ==========================
       Mở Popup Thanh toán
    ========================== */

    if (btnOpen) {

        btnOpen.addEventListener("click", function () {

            if (cartPopup) {

                cartPopup.style.display = "none";

            }

            paymentOverlay.style.display = "flex";

        });

    }

    /* ==========================
       Đóng bằng nút X
    ========================== */

    if (btnClose) {

        btnClose.addEventListener("click", closePaymentPopup);

    }

    /* ==========================
       Đóng khi bấm nền tối
    ========================== */

    paymentOverlay.addEventListener("click", function (event) {

        if (event.target === paymentOverlay) {

            closePaymentPopup();

        }

    });

    /* ==========================
       Không đóng khi bấm Popup
    ========================== */

    paymentPopup.addEventListener("click", function (event) {

        event.stopPropagation();

    });

    /* ==========================
       Đóng bằng ESC
    ========================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closePaymentPopup();

        }

    });

    /* ==========================
       Hàm đóng Popup
    ========================== */

    function closePaymentPopup() {

        paymentOverlay.style.display = "none";

    }

});

/* ===== Kết thúc Block 3.0.4A-04 ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.4A
   Block   : 05
   Chức năng :
   Đồng bộ dữ liệu Giỏ hàng sang Popup Thanh toán

   Ghi chú :
   - Không sửa Block cũ.
   - Chỉ đọc dữ liệu từ mảng cart.
   - Chỉ cập nhật Popup Thanh toán.
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const btnPayment = document.getElementById("btnOpenPaymentPopup");

    const paymentOrderList =
        document.getElementById("paymentOrderList");

    const paymentTotalPrice =
        document.getElementById("paymentTotalPrice");

    if (!btnPayment) {

        return;

    }

    btnPayment.addEventListener("click", function () {

        updatePaymentPopup();

    });

    function updatePaymentPopup() {

        if (!paymentOrderList || !paymentTotalPrice) {

            return;

        }

        // -----------------------------
        // Không có sản phẩm
        // -----------------------------

        if (cart.length === 0) {

            paymentOrderList.innerHTML = `
                <p style="text-align:center;color:#888;">
                    Chưa có sản phẩm.
                </p>
            `;

            paymentTotalPrice.textContent = "0đ";

            return;

        }

        // -----------------------------
        // Tạo danh sách đơn hàng
        // -----------------------------

        let html = "";

        let total = 0;

        cart.forEach(function(item){

            const money = item.price * item.quantity;

            total += money;

            html += `
                <div class="payment-item">

                    <div>

                        <strong>${item.product}</strong>

                    </div>

                    <div>

                        SL: ${item.quantity}

                    </div>

                    <div>

                        ${money.toLocaleString()}đ

                    </div>

                    <hr>

                </div>
            `;

        });

       paymentOrderList.innerHTML = html;

paymentTotalPrice.textContent =
    total.toLocaleString() + "đ";

    }   // Đóng hàm updatePaymentPopup()

});     // Đóng DOMContentLoaded

/* ===== Kết thúc Block 3.0.4A-05 ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.4A
   Block   : 06
   Chức năng :
   Kiểm tra thông tin khách hàng
   và Gửi đơn qua Zalo

   Ghi chú :
   - Không sửa Block cũ.
   - Chỉ bổ sung JavaScript.
================================================== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.5
   Block   : 03
   Chức năng :
   Hiển thị Popup Thành công

   Ghi chú :
   - Không sửa Block cũ.
   - Chỉ hiển thị Popup Thành công.
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const btnSendOrder =
        document.getElementById("btnSendZaloOrder");

    const paymentOverlay =
        document.getElementById("paymentOverlay");

    const successOverlay =
        document.getElementById("successOverlay");

    if (!btnSendOrder || !paymentOverlay || !successOverlay) {

        return;

    }

    btnSendOrder.addEventListener("click", function () {

        // Đóng Popup Thanh toán
        paymentOverlay.style.display = "none";

        // Hiện Popup Thành công
        successOverlay.style.display = "flex";

    });

});

/* ===== Kết thúc Block 3.0.5-03 ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.5
   Block   : 04
   Chức năng :
   Dọn dẹp hệ thống sau khi đặt hàng

   Ghi chú :
   - Không sửa Block cũ.
   - Chỉ chạy khi bấm "Hoàn tất".
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const btnDone = document.getElementById("btnSuccessDone");
    const successOverlay = document.getElementById("successOverlay");

    if (!btnDone || !successOverlay) {
        return;
    }

    btnDone.addEventListener("click", function () {

        // Ẩn Popup thành công
        successOverlay.style.display = "none";

        // Xóa dữ liệu giỏ hàng
        cart = [];

        // Xóa Local Storage
        localStorage.removeItem("cafePhoXuaCart");

        // Cập nhật lại giao diện giỏ hàng
        refreshCart();

        // Xóa dữ liệu Form
        const ids = [
            "customerName",
            "customerPhone",
            "customerAddress",
            "customerNote"
        ];

        ids.forEach(function (id) {

            const input = document.getElementById(id);

            if (input) {
                input.value = "";
                input.style.borderColor = "";
            }

        });

    });

});

/* ===== Kết thúc Block 3.0.5-04 ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.5
   Block   : 05A
   Module  : Sinh mã đơn hàng

   Chức năng:
   - Tạo mã đơn hàng duy nhất.
   - Không phụ thuộc giao diện.
   - Không phụ thuộc Zalo.
================================================== */

function generateOrderCode() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const hour = String(now.getHours()).padStart(2, "0");

    const minute = String(now.getMinutes()).padStart(2, "0");

    const second = String(now.getSeconds()).padStart(2, "0");

    return `CPX-${year}${month}${day}-${hour}${minute}${second}`;

}

/* ===== Kết thúc Block 3.0.5-05A ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.5
   Block   : 05B
   Module  : Thời gian đặt hàng

   Chức năng:
   - Sinh thời gian hiện tại.
   - Định dạng: DD/MM/YYYY HH:MM:SS
   - Không phụ thuộc giao diện.
================================================== */

function generateOrderTime() {

    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const year = now.getFullYear();

    const hour = String(now.getHours()).padStart(2, "0");

    const minute = String(now.getMinutes()).padStart(2, "0");

    const second = String(now.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;

}

/* ===== Kết thúc Block 3.0.5-05B ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.5
   Block   : 05C
   Module  : Thu thập dữ liệu đơn hàng

   Chức năng:
   - Đọc dữ liệu từ cart.
   - Tính tổng số món.
   - Tính tổng tiền.
   - Trả về object dùng cho các Module tiếp theo.
================================================== */

function collectOrderData() {

    let totalItems = 0;
    let totalPrice = 0;

    const items = [];

    cart.forEach(function(item) {

        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;

        totalItems += quantity;

        const money = quantity * price;

        totalPrice += money;

        items.push({

            product: item.product,

            quantity: quantity,

            price: price,

            money: money

        });

    });

    return {

        items: items,

        totalItems: totalItems,

        totalPrice: totalPrice

    };

}

/* ===== Kết thúc Block 3.0.5-05C ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.5
   Block   : 05D
   Module  : Ghép nội dung tin nhắn

   Chức năng:
   - Ghép toàn bộ nội dung đơn hàng.
   - Trả về chuỗi (string).
================================================== */

function buildOrderMessage() {

    const orderCode = generateOrderCode();

    const orderTime = generateOrderTime();

    const orderData = collectOrderData();

    let message = "";

    message += "☕ CAFE PHỐ XƯA\n\n";

    message += "🧾 Mã đơn: " + orderCode + "\n";

    message += "🕒 Thời gian: " + orderTime + "\n\n";

    message += "━━━━━━━━━━━━━━\n\n";

    message += "🛒 DANH SÁCH MÓN\n\n";

    orderData.items.forEach(function(item, index){

        message += (index + 1) + ". " + item.product + "\n";

        message += "SL: " + item.quantity + "\n";

        message += "Thành tiền: "
            + item.money.toLocaleString("vi-VN")
            + "đ\n\n";

    });

    message += "━━━━━━━━━━━━━━\n\n";

    message += "📦 Tổng số món: "
        + orderData.totalItems + "\n";

    message += "💰 Tổng thanh toán: "
        + orderData.totalPrice.toLocaleString("vi-VN")
        + "đ\n\n";

    message += "━━━━━━━━━━━━━━\n\n";

    message += "👤 Khách hàng:\n";
    message += document.getElementById("customerName").value + "\n\n";

    message += "📞 Điện thoại:\n";
    message += document.getElementById("customerPhone").value + "\n\n";

    message += "📍 Địa chỉ:\n";
    message += document.getElementById("customerAddress").value + "\n\n";

    message += "📝 Ghi chú:\n";
    message += document.getElementById("customerNote").value + "\n\n";

    message += "━━━━━━━━━━━━━━\n\n";

    message += "❤️ Xin cảm ơn Quý khách đã lựa chọn\n";

    message += "Cafe Phố Xưa.";

    return message;

}

/* ===== Kết thúc Block 3.0.5-05D ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.5
   Block   : 05E
   Module  : Gửi đơn hàng sang Zalo

   Chức năng:
   - Lấy nội dung từ buildOrderMessage()
   - Mã hóa URL
   - Mở Zalo
================================================== */

function openOrderOnZalo() {

    const zaloNumber = "0868708799";

    const message = buildOrderMessage();

    const encodedMessage = encodeURIComponent(message);

    const zaloUrl =
        "https://zalo.me/" +
        zaloNumber +
        "?text=" +
        encodedMessage;

    window.open(zaloUrl, "_blank");

}

/* ===== Kết thúc Block 3.0.5-05E ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.5
   Block   : 06
   Chức năng:
   - Tích hợp hệ thống gửi đơn mới.
   - Gắn nút "Gửi đơn qua Zalo" với Module 05E.
   - Không sửa các Block đã khóa.
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sendButton = document.getElementById("btnSendZaloOrder");

    if (!sendButton) return;

    sendButton.addEventListener("click", function (event) {

        event.preventDefault();

        openOrderOnZalo();

    });

});

/* ===== Kết thúc Block 3.0.5-06 ===== */
/* ==================================================
   Cafe Phố Xưa
   Version : 3.0.5
   Block   : 07
   Chức năng:
   Điều phối hệ thống gửi đơn

   Ghi chú:
   - Không sửa Block cũ.
   - Chỉ cho phép Module mới chịu trách nhiệm gửi.
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const btn = document.getElementById("btnSendZaloOrder");

    if (!btn) return;

    // Clone nút để loại bỏ toàn bộ EventListener cũ
    const newBtn = btn.cloneNode(true);

    btn.parentNode.replaceChild(newBtn, btn);

    // Chỉ còn EventListener mới
    newBtn.addEventListener("click", function (event) {

        event.preventDefault();

        // Kiểm tra thông tin bắt buộc
        const fullName = document.getElementById("customerName");
        const phone = document.getElementById("customerPhone");
        const address = document.getElementById("customerAddress");

        [fullName, phone, address].forEach(function (input) {
            input.style.borderColor = "";
        });

        if (fullName.value.trim() === "") {
            alert("Vui lòng nhập họ và tên.");
            fullName.style.borderColor = "red";
            fullName.focus();
            return;
        }

        if (phone.value.trim() === "") {
            alert("Vui lòng nhập số điện thoại.");
            phone.style.borderColor = "red";
            phone.focus();
            return;
        }

        if (address.value.trim() === "") {
            alert("Vui lòng nhập địa chỉ giao hàng.");
            address.style.borderColor = "red";
            address.focus();
            return;
        }

        // Gửi bằng hệ thống mới
        openOrderOnZalo();

        // Hiển thị popup thành công
        const paymentOverlay = document.getElementById("paymentOverlay");
        const successOverlay = document.getElementById("successOverlay");

        if (paymentOverlay) {
            paymentOverlay.style.display = "none";
        }

        if (successOverlay) {
            successOverlay.style.display = "flex";
        }

    });

});

/* ===== Kết thúc Block 3.0.5-07 ===== */
