// Load product detail
function loadProductDetail() {
    const productId = sessionStorage.getItem('selectedProductId');
    if (!productId) {
        window.location.href = './index.html';
        return;
    }

    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        window.location.href = './index.html';
        return;
    }

    // Update breadcrumb
    document.getElementById('productBreadcrumb').textContent = product.name;

    // Update product details
    document.getElementById('detailImage').src = product.img;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('detailPrice').textContent = product.price.toLocaleString('vi-VN') + ' VNĐ';
    document.getElementById('specBrand').textContent = product.brand;
    document.getElementById('specType').textContent = getTypeLabel(product.type);
    document.getElementById('sellerPhone').textContent = product.phone;
    document.getElementById('productDesc').textContent = product.description;

    // Update type badge
    const typeBadge = document.getElementById('typeBadge');
    typeBadge.textContent = getTypeLabel(product.type);
    typeBadge.className = `badge-type badge-${product.type}`;

    // Update favorite button
    updateFavButton(product.id);

    // Load related products
    loadRelatedProducts(product.type, product.id);
}

function getTypeLabel(type) {
    const labels = {
        'road': '🏃 Road Bike',
        'xc': '🏃 XC - Cross Country',
        'trail': '🥾 Trail',
        'enduro': '🦾 Enduro/ All Mountain',
        'downhill': '🚡 Downhill',
        'hybrid': '🚲 Hybrid',
        'kids': '👶 Xe trẻ em'
    };
    return labels[type] || type;
}

function updateFavButton(productId) {
    const isFav = favorites.includes(productId);
    const favBtn = document.getElementById('favBtn');
    if (isFav) {
        favBtn.textContent = '❤️ Đã yêu thích';
        favBtn.style.background = '#ff6b6b';
        favBtn.style.color = 'white';
    }
}

function toggleFavorite() {
    const productId = parseInt(sessionStorage.getItem('selectedProductId'));
    if (favorites.includes(productId)) {
        favorites = favorites.filter(x => x !== productId);
        document.getElementById('favBtn').textContent = '🤍 Yêu thích';
        document.getElementById('favBtn').style.background = '#f5f5f5';
        document.getElementById('favBtn').style.color = '#666';
    } else {
        favorites.push(productId);
        document.getElementById('favBtn').textContent = '❤️ Đã yêu thích';
        document.getElementById('favBtn').style.background = '#ff6b6b';
        document.getElementById('favBtn').style.color = 'white';
    }
    saveToStorage();
}

function loadRelatedProducts(type, currentId) {
    const mtbTypes = ['xc', 'trail', 'enduro', 'downhill'];
    let related = [];

    // Nếu là loại MTB, tìm sản phẩm tương tự trong các loại MTB khác
    if (mtbTypes.includes(type)) {
        related = products.filter(p => mtbTypes.includes(p.type) && p.id !== currentId).slice(0, 4);
    } else {
        // Nếu không phải MTB, tìm sản phẩm cùng loại
        related = products.filter(p => p.type === type && p.id !== currentId).slice(0, 4);
    }
    
    let html = "";
    related.forEach(p => {
        const isFav = favorites.includes(p.id);
        html += `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onclick="selectProduct(${p.id})">
            <h3>${p.name}</h3>
            <p>${p.price.toLocaleString('vi-VN')} VNĐ</p>
            <div class="card-buttons">
                <button class="btn-view" onclick="selectProduct(${p.id})">👁️ Xem</button>
                <button class="btn-heart ${isFav ? 'fav-active' : ''}" onclick="toggleFavFromRelated(${p.id})">
                    ${isFav ? '❤️' : '🤍'}
                </button>
            </div>
        </div>`;
    });
    
    if (html) {
        document.getElementById('relatedList').innerHTML = html;
    } else {
        document.getElementById('relatedList').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Không có sản phẩm tương tự</p>';
    }
}

function selectProduct(id) {
    sessionStorage.setItem('selectedProductId', id);
    window.location.reload();
}

function toggleFavFromRelated(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(x => x !== id);
    } else {
        favorites.push(id);
    }
    saveToStorage();
    const product = products.find(p => p.id === parseInt(sessionStorage.getItem('selectedProductId')));
    loadRelatedProducts(product.type, product.id);
}

function addToCart() {
    const productId = parseInt(sessionStorage.getItem('selectedProductId'));
    const product = products.find(p => p.id === productId);
    
    if (product) {
        let cartItem = cart.find(x => x.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                quantity: 1
            });
        }
        saveToStorage();
        updateCartUI();
    }
}

function buyNow() {
    addToCart();
    toggleCart();
    setTimeout(() => {
        showCheckoutInCart();
    }, 300);
}

// Mua ngay - chuyển tới trang order-checkout.html với đúng sản phẩm
function buyNowDirect() {
    const productId = parseInt(sessionStorage.getItem('selectedProductId'));
    if (productId) {
        window.location.href = './order-checkout.html?productId=' + productId;
    }
}

function callSeller() {
    const product = products.find(p => p.id === parseInt(sessionStorage.getItem('selectedProductId')));
    alert(`📞 Gọi ngay: ${product.phone}\n\n(Tính năng này chỉ để demo)`);
}

function chatSeller() {
    alert('💬 Tính năng chat sẽ được cập nhật sớm!');
}

function visitShop() {
    alert('🏪 Ghé shop để xem trực tiếp sản phẩm!\n\nĐiạ chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP.HCM');
}

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    loadProductDetail();
});
