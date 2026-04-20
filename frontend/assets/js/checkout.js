// Checkout Page Logic

// Hằng số
const SHIPPING_FEE = 50000; // VNĐ

// Khởi tạo trang checkout
function initializeCheckout() {
    loadFromStorage();
    displayOrderItems();
    displayOrderSummary();
    setupFormValidation();
}

// Hiển thị các sản phẩm trong đơn hàng
function displayOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (!orderItemsContainer) return;

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<div class="empty-cart-message">🛒 Giỏ hàng trống. <br> <a href="index.html" style="color: #2a5298; text-decoration: underline;">Quay lại mua hàng</a></div>';
        return;
    }

    let itemsHTML = '';
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const totalPrice = product.price * item.quantity;
            itemsHTML += `
                <div class="order-item">
                    <img src="${product.img}" alt="${product.name}" class="order-item-image">
                    <div class="order-item-details">
                        <div class="order-item-name">${product.name}</div>
                        <div class="order-item-info">SL: ${item.quantity} x ${product.price.toLocaleString('vi-VN')} VNĐ</div>
                        <div class="order-item-price">${totalPrice.toLocaleString('vi-VN')} VNĐ</div>
                    </div>
                </div>
            `;
        }
    });

    orderItemsContainer.innerHTML = itemsHTML;
}

// Hiển thị tóm tắt đơn hàng
function displayOrderSummary() {
    const subtotalEl = document.getElementById('subtotal');
    const totalAmountEl = document.getElementById('totalAmount');

    if (!subtotalEl || !totalAmountEl) return;

    // Tính tổng phụ
    let subtotal = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            subtotal += product.price * item.quantity;
        }
    });

    // Tính tổng tiền (bao gồm phí vận chuyển)
    const total = subtotal + SHIPPING_FEE;

    // Cập nhật giao diện
    subtotalEl.textContent = subtotal.toLocaleString('vi-VN') + ' VNĐ';
    totalAmountEl.textContent = total.toLocaleString('vi-VN') + ' VNĐ';
}

// Thiết lập xác thực form
function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitCheckoutForm();
    });
}

// Gửi form thanh toán
function submitCheckoutForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value;
    const notes = document.getElementById('notes').value.trim();

    // Kiểm tra trường bắt buộc
    if (!fullName || !phone || !email || !address || !city) {
        alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('❌ Email không hợp lệ!');
        return;
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^(\+84|0)[0-9]{8,9}$/;
    if (!phoneRegex.test(phone)) {
        alert('❌ Số điện thoại không hợp lệ! (VD: 0901234567)');
        return;
    }

    // Kiểm tra giỏ hàng
    if (cart.length === 0) {
        alert('❌ Giỏ hàng trống! Không thể đặt hàng.');
        return;
    }

    // Tính tổng tiền
    let total = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            total += product.price * item.quantity;
        }
    });
    total += SHIPPING_FEE;

    // Tạo thông điệp xác nhận
    let orderDetails = `📦 ĐƠN HÀNG HỌC LẠI\n\n`;
    orderDetails += `👤 Họ và tên: ${fullName}\n`;
    orderDetails += `📱 Số điện thoại: ${phone}\n`;
    orderDetails += `✉️ Email: ${email}\n`;
    orderDetails += `📍 Địa chỉ: ${address}, ${city}\n`;
    if (notes) {
        orderDetails += `📝 Ghi chú: ${notes}\n`;
    }
    orderDetails += `\n💰 Tổng tiền cần thanh toán: ${total.toLocaleString('vi-VN')} VNĐ\n`;
    orderDetails += `\nCảm ơn bạn đã mua hàng! ❤️`;

    // Xác nhận đặt hàng
    if (confirm(orderDetails + '\n\nBạn có chắc muốn đặt hàng không?')) {
        // Lưu thông tin đơn hàng vào storage
        const order = {
            id: Date.now(),
            fullName,
            phone,
            email,
            address,
            city,
            notes,
            items: cart,
            total,
            date: new Date().toLocaleString('vi-VN'),
            status: 'Chờ xác nhận'
        };

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Xóa giỏ hàng
        cart = [];
        saveToStorage();

        // Hiển thị thông báo thành công
        alert('✅ Đặt hàng thành công!\n\nMã đơn hàng: #' + order.id + '\n\nChúng tôi sẽ liên hệ bạn sớm nhất!');

        // Quay về trang chủ
        window.location.href = 'index.html';
    }
}

// Chạy khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});
