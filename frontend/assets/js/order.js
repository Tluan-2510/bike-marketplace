// order.js - Lấy thông tin sản phẩm từ URL và hiển thị trên form
window.addEventListener('DOMContentLoaded', function() {
        // Xử lý preview ảnh minh họa khi chọn file
        const imgInput = document.getElementById('productImage');
        if (imgInput) {
            imgInput.addEventListener('change', function(e) {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(ev) {
                    let preview = document.getElementById('orderUserImagePreview');
                    if (!preview) {
                        preview = document.createElement('img');
                        preview.id = 'orderUserImagePreview';
                        preview.style.maxWidth = '120px';
                        preview.style.maxHeight = '120px';
                        preview.style.display = 'block';
                        preview.style.margin = '10px 0 18px 0';
                        imgInput.parentNode.insertBefore(preview, imgInput.nextSibling);
                    }
                    preview.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    const infoBox = document.getElementById('orderProductInfo');
    if (!productId || !infoBox) return;

    let product;
    if (window.products && Array.isArray(window.products)) {
        product = window.products.find(p => p.id == productId);
    }

    if (!product) {
        infoBox.innerHTML = `<div style='color:#888;font-size:16px;'>Không tìm thấy sản phẩm<br>Mã sản phẩm: <b>${productId}</b></div>`;
        return;
    }

    infoBox.innerHTML = `
        <div class="order-product-img-frame">
            <img src="${product.img}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-price" id="orderProductPrice">${product.price.toLocaleString('vi-VN')} VNĐ</div>
        <div style="margin:10px 0 8px 0;display:flex;align-items:center;gap:8px;justify-content:center;">
            <span style="color:#888;font-size:15px;">Số lượng:</span>
            <span id="orderProductQty" style="font-weight:700;font-size:16px;">1</span>
        </div>
        <div style="font-size:1.08rem;color:#1e3c72;font-weight:700;margin-bottom:8px;">Tổng: <span id="orderProductTotal">${product.price.toLocaleString('vi-VN')}</span> VNĐ</div>
        <div class="product-desc">${product.description || ''}</div>
    `;

    // Lắng nghe thay đổi số lượng để cập nhật tổng tiền
    const qtyInput = document.getElementById('quantity');
    const btnMinus = document.getElementById('btnQtyMinus');
    const btnPlus = document.getElementById('btnQtyPlus');
    function updateQtyAndTotal() {
        let qty = parseInt(qtyInput.value) || 1;
        if (qty < 1) qty = 1;
        qtyInput.value = qty;
        document.getElementById('orderProductQty').textContent = qty;
        document.getElementById('orderProductTotal').textContent = (product.price * qty).toLocaleString('vi-VN');
    }
    if (qtyInput) {
        qtyInput.addEventListener('input', updateQtyAndTotal);
    }
    if (btnMinus) {
        btnMinus.addEventListener('click', function() {
            let qty = parseInt(qtyInput.value) || 1;
            if (qty > 1) qty--;
            qtyInput.value = qty;
            updateQtyAndTotal();
        });
    }
    if (btnPlus) {
        btnPlus.addEventListener('click', function() {
            let qty = parseInt(qtyInput.value) || 1;
            qty++;
            qtyInput.value = qty;
            updateQtyAndTotal();
        });
    }
});
