// Dữ liệu sản phẩm
let products = [
    {
        id: 1,
        name: "Xe Road Giant TCR Advanced",
        price: 45000000,
        type: "road",
        brand: "Giant",
        img: "../images/Mountain.jpg",
        phone: "0901234567",
        description: "Xe đạp road cao cấp với khung carbon fiber, trọng lượng nhẹ, phù hợp cho những vận động viên chuyên nghiệp",
        rating: 4.8,
        reviews: 245,
        installment: 3750000,
        isNew: false,
        discount: 0,
        popularity: 95,
        hotDeal: false
    },
    {
        id: 2,
        name: "Xe Đạp XC 9",
        price: 22000000,
        type: "xc",
        brand: "Trek",
        img: "../images/Xe Đạp XC 9.jpg",
        phone: "0987654321",
        description: "XC Cross Country nhẹ, nhanh, phù hợp đường rừng và địa hình bằng. Lốp mỏng, khung cứng tối ưu tốc độ.",
        rating: 4.6,
        reviews: 189,
        installment: 1833333,
        isNew: true,
        discount: 0,
        popularity: 88,
        hotDeal: false
    },
    {
        id: 6,
        name: "Xe Đạp XC 10",
        price: 18000000,
        type: "xc",
        brand: "Polygon",
        img: "../images/Xe Đạp XC 10.jpg",
        phone: "0934567890",
        description: "XC giá tốt với khung nhẹ, phù hợp người chơi XC vào thứ 2, 3. Tốt cho huấn luyện và xạ thao công.",
        rating: 4.5,
        reviews: 142,
        installment: 1500000,
        isNew: false,
        discount: 0,
        popularity: 78,
        hotDeal: false
    },
    {
        id: 10,
        name: "Xe Hybrid Cube Nature",
        price: 12000000,
        type: "hybrid",
        brand: "Cube",
        img: "../images/Mountain.jpg",
        phone: "0938123456",
        description: "Xe đạp hybrid kết hợp giữa road và mountain bike, thích hợp cho sử dụng hàng ngày",
        rating: 4.4,
        reviews: 128,
        installment: 1000000,
        isNew: true,
        discount: 0,
        popularity: 82,
        hotDeal: false
    },
    {
        id: 11,
        name: "Xe Road Specialized Tarmac",
        price: 52000000,
        type: "road",
        brand: "Specialized",
        img: "../images/Mountain.jpg",
        phone: "0912345678",
        description: "Xe road của thương hiệu nổi tiếng Specialized, nhẹ, nhanh và linh hoạt",
        rating: 4.7,
        reviews: 224,
        installment: 4333333,
        isNew: false,
        discount: 12,
        popularity: 93,
        hotDeal: true
    },
    {
        id: 12,
        name: "Xe Trẻ em Trek Precaliber",
        price: 3500000,
        type: "kids",
        brand: "Trek",
        img: "../images/Cross Country.jpg",
        phone: "0934567890",
        description: "Xe đạp an toàn cho trẻ em với chất lượng tốt từ Trek",
        rating: 4.6,
        reviews: 95,
        installment: 291667,
        isNew: true,
        discount: 0,
        popularity: 76,
        hotDeal: false
    },
    {
        id: 13,
        name: "Xe Đạp XC 11",
        price: 20000000,
        type: "xc",
        brand: "Specialized",
        img: "../images/Xe Đạp XC 11.jpg",
        phone: "0923456789",
        description: "XC Cross Country cao cấp với thiết kế hiện đại, phù hợp cho những vận động viên chuyên nghiệp",
        rating: 4.7,
        reviews: 167,
        installment: 1666667,
        isNew: false,
        discount: 0,
        popularity: 85,
        hotDeal: false
    },
    {
        id: 14,
        name: "Xe Đạp Downhill 1",
        price: 62000000,
        type: "downhill",
        brand: "Giant",
        img: "../images/Xe Đạp Downhill 4.jpg",
        phone: "0943210123",
        description: "Xe Downhill cao cấp với khung cứng vàng, treo dài 200mm, thiết kế hiện đại phù hợp cho các cuộc thi chuyên nghiệp",
        rating: 4.8,
        reviews: 156,
        installment: 5166667,
        isNew: true,
        discount: 5,
        popularity: 90,
        hotDeal: true
    },
    {
        id: 15,
        name: "Xe Đạp Downhill 2",
        price: 59000000,
        type: "downhill",
        brand: "Trek",
        img: "../images/Xe Đạp Downhill 2.jpg",
        phone: "0987123456",
        description: "Xe Downhill tầm trung với hiệu suất cao, treo dài 195mm, bền bỉ cho các địa hình mạnh mẽ",
        rating: 4.7,
        reviews: 142,
        installment: 4916667,
        isNew: true,
        discount: 8,
        popularity: 88,
        hotDeal: true
    },
    {
        id: 16,
        name: "Xe Đạp Downhill 3",
        price: 55000000,
        type: "downhill",
        brand: "Specialized",
        img: "../images/Xe Đạp Downhill 3.jpg",
        phone: "0901654321",
        description: "Xe Downhill chất lượng tốt với khung bền vàng, treo linh hoạt 190mm, thích hợp cho những vận động viên đam mê lao xuống",
        rating: 4.6,
        reviews: 128,
        installment: 4583333,
        isNew: true,
        discount: 10,
        popularity: 86,
        hotDeal: true
    },
    {
        id: 17,
        name: "Xe Đạp Mountain 2",
        price: 38000000,
        type: "mountain",
        brand: "Giant",
        img: "../images/Mountain.jpg",
        phone: "0912345678",
        description: "Xe Mountain bike cao cấp với khung nhôm, treo cân bằng 150mm, tốt cho các đường rừng kỹ thuật",
        rating: 4.7,
        reviews: 165,
        installment: 3166667,
        isNew: true,
        discount: 5,
        popularity: 87,
        hotDeal: true
    },
    {
        id: 18,
        name: "Xe Đạp Mountain 3",
        price: 42000000,
        type: "mountain",
        brand: "Specialized",
        img: "../images/Mountain.jpg",
        phone: "0923456789",
        description: "Xe Mountain bike hiệu suất cao với khung carbon, treo linh hoạt 160mm, phù hợp cho các địa hình phức tạp",
        rating: 4.8,
        reviews: 178,
        installment: 3500000,
        isNew: true,
        discount: 8,
        popularity: 89,
        hotDeal: true
    },
    {
        id: 19,
        name: "Xe Đạp Mountain 4",
        price: 45000000,
        type: "mountain",
        brand: "Trek",
        img: "../images/Mountain.jpg",
        phone: "0934567890",
        description: "Xe Mountain bike đa năng với khung cứng, treo trước 170mm, tối ưu cho cả leo dốc lẫn lao xuống",
        rating: 4.6,
        reviews: 152,
        installment: 3750000,
        isNew: true,
        discount: 10,
        popularity: 85,
        hotDeal: true
    },
    {
        id: 20,
        name: "Xe Đạp Enduro 2",
        price: 48000000,
        type: "enduro",
        brand: "Specialized",
        img: "../images/Xe Đạp Enduro 2.jpg",
        phone: "0956789012",
        description: "Xe Enduro cao cấp với khung carbon, treo dài 165mm, phù hợp cho các địa hình phức tạp",
        rating: 4.7,
        reviews: 162,
        installment: 4000000,
        isNew: true,
        discount: 6,
        popularity: 88,
        hotDeal: true
    },
    {
        id: 21,
        name: "Xe Đạp Enduro 3",
        price: 52000000,
        type: "enduro",
        brand: "Giants",
        img: "../images/Xe Đạp Enduro 3.jpg",
        phone: "0967890123",
        description: "Xe Enduro hiếu suất cao với khung nhôm, treo điều chỉnh 160mm, tốt cho leo dốc và kỹ thuật",
        rating: 4.8,
        reviews: 175,
        installment: 4333333,
        isNew: true,
        discount: 7,
        popularity: 91,
        hotDeal: true
    },
    {
        id: 22,
        name: "Xe Đạp Enduro 4",
        price: 50000000,
        type: "enduro",
        brand: "Trek",
        img: "../images/Xe Đạp Enduro 4.jpg",
        phone: "0978901234",
        description: "Xe Enduro chất lượng với khung bền, treo linh hoạt 158mm, thích hợp cho những đở mão thép",
        rating: 4.6,
        reviews: 148,
        installment: 4166667,
        isNew: true,
        discount: 9,
        popularity: 87,
        hotDeal: true
    },
    {
        id: 23,
        name: "Xe Đạp Trail 5",
        price: 32000000,
        type: "trail",
        brand: "Specialized",
        img: "../images/Xe Đạp Trail 5.jpg",
        phone: "0989012345",
        description: "Xe Trail cao cấp với khung carbon, treo 155mm, phù hợp cho các đường địa hình vùng quỹ tắc",
        rating: 4.7,
        reviews: 158,
        installment: 2666667,
        isNew: true,
        discount: 6,
        popularity: 86,
        hotDeal: true
    },
    {
        id: 24,
        name: "Xe Đạp Trail 6",
        price: 35000000,
        type: "trail",
        brand: "Giant",
        img: "../images/Xe Đạp Trail 6.jpg",
        phone: "0990123456",
        description: "Xe Trail hiệu suất cao với khung nhôm, treo chỉnh chỉnh 160mm, tốt cho leo dốc và kỹ thuật",
        rating: 4.6,
        reviews: 172,
        installment: 2916667,
        isNew: true,
        discount: 7,
        popularity: 84,
        hotDeal: true
    },
    {
        id: 25,
        name: "Xe Đạp Trail 7",
        price: 38000000,
        type: "trail",
        brand: "Trek",
        img: "../images/Xe Đạp Trail 7.jpg",
        phone: "0901234567",
        description: "Xe Trail đạo châu với khung bền, treo linh hoạt 165mm, thích hợp cho thách thức",
        rating: 4.8,
        reviews: 185,
        installment: 3166667,
        isNew: true,
        discount: 8,
        popularity: 89,
        hotDeal: true
    }
];

let cart = [];
let favorites = [];
let adminLoggedIn = false;

// Load từ localStorage
function loadFromStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedFavs = localStorage.getItem('favorites');
    const adminStatus = localStorage.getItem('adminLoggedIn');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedFavs) favorites = JSON.parse(savedFavs);
    if (adminStatus) adminLoggedIn = JSON.parse(adminStatus);
    
    updateCartUI();
    updateAdminUI();
}

// Lưu vào localStorage
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('adminLoggedIn', JSON.stringify(adminLoggedIn));
}

// Render 4 sản phẩm nổi bật
function renderFeaturedProducts() {
    const featuredContainer = document.getElementById("featuredProducts");
    if (!featuredContainer) {
        console.log("❌ featuredContainer không tìm thấy");
        return;
    }
    
    console.log("✅ renderFeaturedProducts được gọi, products count:", products.length);
    
    // Lấy 1 sản phẩm từ mỗi loại: XC, Downhill, Enduro, Trail
    const xc = products.find(p => p.type === "xc");
    const downhill = products.find(p => p.type === "downhill");
    const enduro = products.find(p => p.type === "enduro");
    const trail = products.find(p => p.type === "trail");
    
    const featured = [xc, downhill, enduro, trail].filter(p => p);
    console.log("✅ Featured products found:", featured.length);
    
    let html = "";
    featured.forEach(p => {
        const stars = '⭐'.repeat(Math.floor(p.rating));
        
        html += `
        <div class="featured-product-card" onclick="openModal(${p.id})">
            <img src="${p.img}" alt="${p.name}" class="featured-product-image">
            <div class="featured-product-info">
                <h3 class="featured-product-name">${p.name}</h3>
                
                <div class="featured-product-rating">
                    <span class="featured-product-stars">${stars}</span>
                    <span class="featured-product-rating-value">⭐${p.rating}</span>
                    <span class="featured-product-review">(${p.reviews})</span>
                </div>
                
                <div class="featured-product-price">
                    <span class="featured-price-main">${p.price.toLocaleString('vi-VN')} VNĐ</span>
                    <span class="featured-price-installment">💳 Trả góp: ${p.installment.toLocaleString('vi-VN')}/tháng</span>
                </div>
                
                <div class="featured-product-actions">
                    <button class="featured-btn-cart" onclick="event.stopPropagation(); addToCartFromCard(${p.id})">
                        🛒 Giỏ hàng
                    </button>
                    <button class="featured-btn-rate" onclick="event.stopPropagation(); likeProduct(${p.id})">
                        👍 Đánh giá
                    </button>
                </div>
            </div>
        </div>`;
    });
    
    featuredContainer.innerHTML = html;
    console.log("✅ renderFeaturedProducts hoàn tất");
}

// Render danh sách sản phẩm
function renderProducts(list) {
    let html = "";
    list.forEach(p => {
        const isFav = favorites.includes(p.id);
        const stars = '⭐'.repeat(Math.floor(p.rating));
        const newBadge = p.isNew ? '<span class="product-badge new">🆕 MỚI</span>' : '';
        const hotBadge = p.hotDeal ? '<span class="product-badge hot">🔥 KHUYẾN MÃI</span>' : '';
        
        html += `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${p.img}" alt="${p.name}" class="product-img" onclick="openModal(${p.id})">
                <div class="product-badges">
                    ${newBadge}
                    ${hotBadge}
                </div>
            </div>
            
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-value">⭐${p.rating}</span>
                    <span class="review-count">(${p.reviews} đánh giá)</span>
                </div>
                
                <div class="product-price">
                    <span class="price-main">${p.price.toLocaleString('vi-VN')} VNĐ</span>
                    <span class="price-installment">📊 Trả góp: ${p.installment.toLocaleString('vi-VN')}/tháng</span>
                </div>
                
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCartFromCard(${p.id})">
                        🛒 Giỏ hàng
                    </button>
                    <button class="btn-like" onclick="likeProduct(${p.id})" title="Đánh giá">
                        👍 Đánh giá
                    </button>
                </div>
            </div>
        </div>`;
    });
    document.getElementById("productList").innerHTML = html || "<p>Không tìm thấy sản phẩm</p>";
}

// Tìm kiếm sản phẩm
function searchProduct() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();
    let type = document.getElementById("filterType").value;
    let min = parseFloat(document.getElementById("minPrice").value) || 0;
    let max = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    let result = products.filter(p => {
        return (!keyword || p.name.toLowerCase().includes(keyword)) &&
               (!type || p.type === type) &&
               (p.price >= min) &&
               (p.price <= max);
    });

    renderProducts(result);
    hideSuggestions();
    updateSearchInfo(result.length);
}

// Hiển thị gợi ý tìm kiếm thời gian thực
function showSearchSuggestions(keyword) {
    if (!keyword || keyword.length < 1) {
        hideSuggestions();
        return;
    }

    let suggestions = products.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 5); // Hiển thị 5 gợi ý đầu tiên

    const suggestionsContainer = document.getElementById("searchSuggestions");
    
    if (suggestions.length === 0) {
        suggestionsContainer.innerHTML = '<div style="padding: 12px 16px; color: #999;">Không tìm thấy sản phẩm</div>';
        suggestionsContainer.classList.add('show');
        return;
    }

    let html = suggestions.map(p => `
        <div class="suggestion-item" onclick="selectSuggestion('${p.name}', ${p.id})">
            <span class="suggestion-name">${p.name}</span>
            <span class="suggestion-price">${p.price.toLocaleString('vi-VN')} VNĐ</span>
        </div>
    `).join('');

    suggestionsContainer.innerHTML = html;
    suggestionsContainer.classList.add('show');
}

// Chọn gợi ý tìm kiếm
function selectSuggestion(name, id) {
    document.getElementById("searchInput").value = name;
    hideSuggestions();
    searchProduct();
}

// Ẩn gợi ý tìm kiếm
function hideSuggestions() {
    const suggestionsContainer = document.getElementById("searchSuggestions");
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('show');
    }
}

// Cập nhật thông tin kết quả tìm kiếm
function updateSearchInfo(count) {
    const infoElement = document.getElementById("searchInfo");
    if (infoElement) {
        if (count === 0) {
            infoElement.textContent = "❌ Không tìm thấy sản phẩm. Hãy thử từ khóa khác.";
        } else if (count === 1) {
            infoElement.textContent = "✅ Tìm thấy 1 sản phẩm";
        } else {
            infoElement.textContent = `✅ Tìm thấy ${count} sản phẩm`;
        }
    }
}

// Filter by category - chuyển đến shop page
function filterByCategory(type) {
    window.location.href = `./shop.html?cat=${type}`;
}

// Scroll to products section
function scrollToProducts() {
    const productList = document.getElementById("productList");
    if (productList) {
        productList.scrollIntoView({ behavior: 'smooth' });
    }
}

// Đặt lại tìm kiếm
function resetSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("filterType").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    renderProducts(products);
}

// Chuyển đến trang phù hợp (shop hoặc product detail)
function goToDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // Detect page hiện tại
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('shop.html')) {
        // Nếu ở shop.html, mở modal chi tiết
        openModal(id);
    } else {
        // Nếu ở index.html, chuyển đến shop.html
        window.location.href = `./shop.html?cat=${product.type}`;
    }
}

// Toggle modal
function openModal(id) {
    let p = products.find(x => x.id === id);
    if (p) {
        const modal = document.getElementById("modal");
        const stars = '⭐'.repeat(Math.floor(p.rating));
        const newBadge = p.isNew ? '🆕 <strong>MỚI</strong>' : '';
        const hotBadge = p.hotDeal ? '🔥 <strong>KHUYẾN MÃI</strong>' : '';
        
        // Lấy sản phẩm liên quan
        let relatedHTML = '';
        if (p.relatedProducts && p.relatedProducts.length > 0) {
            relatedHTML = '<h3 style="margin-top: 30px; border-top: 2px solid #e0e0e0; padding-top: 15px;">📦 Sản Phẩm Liên Quan:</h3>';
            p.relatedProducts.forEach(relId => {
                let relProduct = products.find(x => x.id === relId);
                if (relProduct) {
                    relatedHTML += `<div style="display: inline-block; margin: 10px; width: 150px; text-align: center; padding: 10px; background: #f5f5f5; border-radius: 8px; cursor: pointer;" onclick="openModal(${relProduct.id})">
                        <img src="${relProduct.img}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 5px;">
                        <p style="margin: 8px 0 5px 0; font-weight: 600; font-size: 13px;">${relProduct.name}</p>
                        <p style="margin: 0; color: #ff6b6b; font-weight: 700;">${relProduct.price.toLocaleString('vi-VN')} VNĐ</p>
                    </div>`;
                }
            });
        }
        
        document.getElementById("modalBody").innerHTML = `
            <div style="max-height: 80vh; overflow-y: auto; padding-right: 10px;">
                <h2 style="margin-bottom: 10px;">${p.name}</h2>
                ${newBadge || hotBadge ? `<p style="margin-bottom: 15px; font-size: 14px;">${newBadge} ${hotBadge}</p>` : ''}
                
                <img src="${p.img}" style="width:100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
                
                <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #ffc107;">
                    <strong style="font-size: 14px;">⭐ Đánh giá: ${stars} ${p.rating}/5 (${p.reviews} đánh giá)</strong>
                </div>
                
                <div style="background: #e8f5e9; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="margin: 0; color: #2e7d32; font-weight: 600;">💰 Giá: <span style="color:#ff6b6b; font-size: 20px;">${p.price.toLocaleString('vi-VN')} VNĐ</span></p>
                    <p style="margin: 8px 0 0 0; color: #2a5298;">📊 Trả góp: <strong>${p.installment.toLocaleString('vi-VN')}/tháng</strong></p>
                </div>
                
                ${p.promotionVoucher ? `<div style="background: #ffe0b2; padding: 10px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #ff9800;">
                    <strong>🎁 Voucher: ${p.promotionVoucher}</strong>
                </div>` : ''}
                
                ${p.promotion ? `<div style="background: #f3e5f5; padding: 10px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #9c27b0;">
                    <strong>🎉 Khuyến mãi: ${p.promotion}</strong>
                </div>` : ''}
                
                ${p.commitment ? `<div style="margin-bottom: 15px;">
                    <h4 style="margin: 10px 0 8px 0; color: #2a5298;">✅ CAM KẾT SẢN PHẨM:</h4>
                    <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #333;">${p.commitment}</p>
                </div>` : ''}
                
                ${p.tradeInProgram ? `<div style="background: #cfd8dc; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <strong>🔄 Thu Cũ Lên Đời: ${p.tradeInProgram}</strong>
                </div>` : ''}
                
                ${p.versions ? `<div style="margin-bottom: 15px;">
                    <h4 style="margin: 10px 0 8px 0; color: #2a5298;">🎨 PHIÊN BẢN & MÀU SẮC:</h4>
                    <p style="margin: 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">${p.versions}</p>
                </div>` : ''}
                
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 10px 0 8px 0; color: #2a5298;">ℹ️ THÔNG TIN CHI TIẾT:</h4>
                    <p style="margin: 5px 0;"><strong>Loại:</strong> ${p.type}</p>
                    <p style="margin: 5px 0;"><strong>Thương hiệu:</strong> ${p.brand}</p>
                    <p style="margin: 5px 0;"><strong>Mô tả:</strong> ${p.description}</p>
                </div>
                
                ${p.specs ? `<div style="background: #eceff1; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 8px 0; color: #01579b;">⚙️ THÔNG SỐ KỸ THUẬT:</h4>
                    <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; font-size: 13px;">${p.specs}</p>
                </div>` : ''}
                
                <div style="background: #e3f2fd; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 8px 0; color: #01579b;">📞 LIÊN HỆ TƯ VẤN:</h4>
                    <p style="margin: 0; font-weight: 600; color: #667eea;">${p.phone}</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Mở cửa: 8h00 - 21h00 (Hàng ngày)</p>
                </div>
                
                ${relatedHTML}
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                    <button onclick="cartBtnClick(${p.id})" style="padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">🛒 Giỏ Hàng</button>
                    <button onclick="buyNowBtnClick(${p.id})" style="padding: 12px; background: #ff6b6b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">⚡ Mua Ngay</button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; margin-bottom: 20px;">
                    <button onclick="alert('📊 Trả góp: ${p.installment.toLocaleString('vi-VN')}/tháng\\nGiờ mở: 8h-21h\\nGọi: ${p.phone}');" style="padding: 12px; background: #4caf50; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">📊 Trả Góp</button>
                    <button onclick="alert('📞 Yêu cầu tư vấn đã gửi!\\nSẽ liên hệ: ${p.phone}\\nGiờ làm: 8h-21h');" style="padding: 12px; background: #2196f3; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">📞 Tư Vấn</button>
                </div>
            </div>
        `;
        modal.classList.add('show');
    }
}

function closeModal() {
    document.getElementById("modal").classList.remove('show');
}

// Thêm vào giỏ hàng
function addToCart(id) {
    let p = products.find(x => x.id === id);
    if (p) {
        let cartItem = cart.find(x => x.id === id);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({
                id: p.id,
                name: p.name,
                price: p.price,
                img: p.img,
                quantity: 1
            });
        }
        saveToStorage();
        updateCartUI();
        closeModal();
        alert('✅ Đã thêm vào giỏ hàng!');
    }
}

function addToCartFromDetail(id) {
    addToCart(id);
}

// Alias cho addToCartFromCard
function addToCartFromCard(id) {
    addToCart(id);
}

// Cập nhật giao diện giỏ hàng
function updateCartUI() {
    let cartCount = document.getElementById("cartCount");
    let cartItems = document.getElementById("cartItems");
    let cartTotal = document.getElementById("cartTotal");
    
    if (cartCount) cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = '<p class="empty-cart">Giỏ hàng trống</p>';
    } else {
        let html = "";
        let total = 0;
        cart.forEach(item => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
            <div class="cart-item">
                <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('vi-VN')} VNĐ</div>
                    <div class="cart-item-qty">
                        <button onclick="decreaseQuantity(${item.id})" style="background: none; border: none; cursor: pointer; font-size: 16px;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQuantity(${item.id})" style="background: none; border: none; cursor: pointer; font-size: 16px;">+</button>
                    </div>
                </div>
                <button class="cart-remove" onclick="removeFromCart(${item.id})">🗑️</button>
            </div>`;
        });
        if (cartItems) cartItems.innerHTML = html;
    }
    
    if (cartTotal) cartTotal.textContent = (total || 0).toLocaleString('vi-VN');
}

function increaseQuantity(id) {
    let item = cart.find(x => x.id === id);
    if (item) {
        item.quantity += 1;
        saveToStorage();
        updateCartUI();
    }
}

function decreaseQuantity(id) {
    let item = cart.find(x => x.id === id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveToStorage();
        updateCartUI();
    }
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    saveToStorage();
    updateCartUI();
}

// Toggle giỏ hàng
function toggleCart() {
    let cartSlide = document.getElementById("cartSlide");
    if (cartSlide) {
        cartSlide.classList.toggle('open');
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    let mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
        mobileMenu.classList.toggle('show');
    }
}

// Mua ngay từ modal - chuyển đến trang thanh toán
function buyNowCheckout(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        addToCart(id);
        closeModal();
        alert('✅ Đã thêm ' + product.name + ' vào giỏ\n\nBấm OK để đi đến trang thanh toán');
        window.location.href = './checkout.html';
    }
}

// Hàm helper cho nút Giỏ hàng trong modal
function cartBtnClick(id) {
    addToCart(id);
    closeModal();
    toggleCart();
}

// Hàm helper cho nút Mua ngay trong modal
function buyNowBtnClick(id) {
    closeModal();
    window.location.href = './order-checkout.html?productId=' + id;
}

// Mua ngay
function buyNow(id) {
    addToCart(id);
    toggleCart();
    setTimeout(() => {
        showCheckoutInCart();
    }, 300);
}

// Hiển thị trang checkout trong giỏ hàng
function showCheckoutInCart() {
    console.log('showCheckoutInCart called');
    const cartView = document.getElementById('cartView');
    const checkoutView = document.getElementById('checkoutView');
    const cartSlide = document.getElementById('cartSlide');
    
    console.log('cartView:', cartView, 'checkoutView:', checkoutView, 'cartSlide:', cartSlide);
    
    if (cartView && checkoutView && cartSlide) {
        cartView.style.display = 'none';
        checkoutView.style.display = 'flex';
        cartSlide.classList.add('checkout-mode');
        updateCartCheckoutTotal();
        setupCartCheckoutForm();
        console.log('showCheckoutInCart completed');
    } else {
        console.log('showCheckoutInCart: missing elements!');
    }
}

// Quay lại giỏ hàng
function backToCart() {
    const cartView = document.getElementById('cartView');
    const checkoutView = document.getElementById('checkoutView');
    const cartSlide = document.getElementById('cartSlide');
    
    if (cartView && checkoutView && cartSlide) {
        checkoutView.style.display = 'none';
        cartView.style.display = 'flex';
        cartSlide.classList.remove('checkout-mode');
    }
}

// Cập nhật tổng tiền trong checkout
function updateCartCheckoutTotal() {
    const totalEl = document.getElementById('cartCheckoutTotal');
    const subtotalEl = document.getElementById('cartCheckoutSubtotal');
    const itemsEl = document.getElementById('cartCheckoutItems');
    
    if (!totalEl || !subtotalEl || !itemsEl) return;

    let subtotal = 0;
    let itemsHTML = '';

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const totalPrice = product.price * item.quantity;
            subtotal += totalPrice;
            
            itemsHTML += `
                <div class="cart-checkout-item">
                    <img src="${product.img}" alt="${product.name}" class="cart-checkout-item-img">
                    <div class="cart-checkout-item-info">
                        <div class="cart-checkout-item-name">${product.name}</div>
                        <div class="cart-checkout-item-qty">SL: ${item.quantity} x ${product.price.toLocaleString('vi-VN')} VNĐ</div>
                        <div class="cart-checkout-item-price">${totalPrice.toLocaleString('vi-VN')} VNĐ</div>
                    </div>
                </div>
            `;
        }
    });

    itemsEl.innerHTML = itemsHTML || '<p style="text-align: center; color: #999;">Giỏ hàng trống</p>';
    
    const total = subtotal + 50000; // Phí vận chuyển

    subtotalEl.textContent = subtotal.toLocaleString('vi-VN') + ' VNĐ';
    totalEl.textContent = total.toLocaleString('vi-VN') + ' VNĐ';
}

// Thiết lập form checkout trong giỏ hàng
function setupCartCheckoutForm() {
    const form = document.getElementById('cartCheckoutForm');
    if (!form) return;

    form.onsubmit = function(e) {
        e.preventDefault();
        submitCartCheckout();
    };
}

// Gửi checkout từ giỏ hàng
function submitCartCheckout() {
    const fullName = document.getElementById('cartFullName').value.trim();
    const phone = document.getElementById('cartPhone').value.trim();
    const email = document.getElementById('cartEmail').value.trim();
    const address = document.getElementById('cartAddress').value.trim();
    const city = document.getElementById('cartCity').value;
    const notes = document.getElementById('cartNotes').value.trim();

    // Kiểm tra bắt buộc
    if (!fullName || !phone || !email || !address || !city) {
        alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('❌ Email không hợp lệ!');
        return;
    }

    // Kiểm tra SĐT
    const phoneRegex = /^(\+84|0)[0-9]{8,9}$/;
    if (!phoneRegex.test(phone)) {
        alert('❌ Số điện thoại không hợp lệ!');
        return;
    }

    // Kiểm tra giỏ hàng
    if (cart.length === 0) {
        alert('❌ Giỏ hàng trống!');
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
    total += 50000;

    // Tạo thông điệp xác nhận
    let orderDetails = `📦 ĐƠN HÀNG XÁC NHẬN\n\n`;
    orderDetails += `👤 Họ và tên: ${fullName}\n`;
    orderDetails += `📱 Số điện thoại: ${phone}\n`;
    orderDetails += `✉️ Email: ${email}\n`;
    orderDetails += `📍 Địa chỉ: ${address}, ${city}\n`;
    if (notes) {
        orderDetails += `📝 Ghi chú: ${notes}\n`;
    }
    orderDetails += `\n💰 Tổng tiền: ${total.toLocaleString('vi-VN')} VNĐ`;

    if (confirm(orderDetails + '\n\nBạn chắc chắn muốn đặt hàng?')) {
        // Lưu đơn hàng
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
        
        // Đóng giỏ hàng
        toggleCart();
        
        alert('✅ Đặt hàng thành công!\n\nMã đơn: #' + order.id);
    }
}

// Toggle yêu thích
function toggleFavoriteFromCard(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(x => x !== id);
    } else {
        favorites.push(id);
    }
    saveToStorage();
    renderProducts(products);
}

function showFavorites() {
    let favProducts = products.filter(p => favorites.includes(p.id));
    renderProducts(favProducts);
}

// Đánh giá sản phẩm
function likeProduct(id) {
    alert('Cảm ơn bạn đã đánh giá sản phẩm này! 👍');
}

// Admin login
function toggleLoginModal() {
    let modal = document.getElementById("loginModal");
    if (modal) {
        modal.classList.add('show');
    }
}

function closeLoginModal() {
    let modal = document.getElementById("loginModal");
    if (modal) {
        modal.classList.remove('show');
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    let user = document.getElementById("adminUser").value;
    let pass = document.getElementById("adminPass").value;
    
    if (user === "admin" && pass === "123456") {
        adminLoggedIn = true;
        saveToStorage();
        updateAdminUI();
        closeLoginModal();
        alert('✅ Đăng nhập thành công!');
    } else {
        alert('❌ Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

function updateAdminUI() {
    let loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        if (adminLoggedIn) {
            loginBtn.textContent = '✅ Admin (Đã đăng nhập)';
            loginBtn.style.background = '#51cf66';
        } else {
            loginBtn.textContent = '👤 Đăng nhập Admin';
            loginBtn.style.background = '#ff6b6b';
        }
    }
}

// Thanh toán
function checkout() {
    if (cart.length === 0) {
        alert('⚠️ Giỏ hàng trống!');
        return;
    }
    
    // Chuyển đến trang checkout riêng
    window.location.href = 'checkout.html';
}

// Liên hệ bán hàng
function contactSeller(phone) {
    alert(`📞 Liên hệ: ${phone}\n\n(Tính năng này chỉ để demo)`);
}

// Lấy category từ URL
function getCurrentCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('cat');
}

// Lọc sản phẩm theo category nếu có
function getFilteredProducts(productList) {
    const category = getCurrentCategory();
    if (category) {
        return productList.filter(p => p.type === category);
    }
    return productList;
}

// === CÁC HÀM SẮP XẾP ===
function sortByPopularity() {
    let sorted = [...products].sort((a, b) => b.popularity - a.popularity);
    sorted = getFilteredProducts(sorted);
    renderProducts(sorted);
    highlightActiveButton('Phổ Biến');
}

function sortByHotDeal() {
    let sorted = [...products].sort((a, b) => {
        if (a.hotDeal === b.hotDeal) return b.discount - a.discount;
        return b.hotDeal - a.hotDeal;
    });
    sorted = getFilteredProducts(sorted);
    renderProducts(sorted);
    highlightActiveButton('Khuyến Mãi HOT');
}

function sortByPriceLowHigh() {
    let sorted = [...products].sort((a, b) => a.price - b.price);
    sorted = getFilteredProducts(sorted);
    renderProducts(sorted);
    highlightActiveButton('Giá Thấp → Cao');
}

function sortByPriceHighLow() {
    let sorted = [...products].sort((a, b) => b.price - a.price);
    sorted = getFilteredProducts(sorted);
    renderProducts(sorted);
    highlightActiveButton('Giá Cao → Thấp');
}

// Highlight active sort button
function highlightActiveButton(buttonType) {
    const buttons = document.querySelectorAll('.filter-btn');
    if (buttons.length === 0) return; // Thoát nếu không tìm thấy buttons
    
    buttons.forEach(btn => {
        if (btn.textContent.includes(buttonType)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Khởi tạo
window.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    
    // Chỉ render products nếu đang ở trang index (không phải shop hoặc product detail)
    const currentPage = window.location.pathname;
    
    // Delay 100ms để đảm bảo products đã load
    setTimeout(function() {
        // Render featured products ở đầu trang chính
        if (document.getElementById("featuredProducts") && !currentPage.includes('shop.html') && !currentPage.includes('product-detail.html')) {
            console.log("Đang render featured products...");
            renderFeaturedProducts();
        }
        
        if (document.getElementById("productList") && !currentPage.includes('shop.html') && !currentPage.includes('product-detail.html')) {
            renderProducts(products);
        }
    }, 100);
    
    // Thêm event listeners cho search input
    const searchInput = document.getElementById("searchInput");
    const searchWrapper = document.querySelector(".search-wrapper");
    
    if (searchInput) {
        // Real-time search suggestions
        searchInput.addEventListener("input", function(e) {
            showSearchSuggestions(e.target.value);
        });
        
        // Enter key to search
        searchInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                searchProduct();
            }
        });
    }
    
    // Hide suggestions khi click outside
    document.addEventListener("click", function(e) {
        if (searchWrapper && !searchWrapper.contains(e.target)) {
            hideSuggestions();
        }
    });
});

// Mở modal order checkout
function openOrderCheckoutModal() {
    const modal = document.getElementById("orderCheckoutModal");
    const contentDiv = document.getElementById("orderCheckoutContent");
    
    if (!modal || !contentDiv) {
        alert('❌ Lỗi: Không tìm thấy modal!');
        return;
    }
    
    let html = `
        <div style="max-width: 1000px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="font-size: 32px; margin-bottom: 10px; color: #333;">🛒 Hoàn Tất Đơn Hàng</h1>
                <p style="color: #666; font-size: 14px;">Kiểm tra thông tin và hoàn tất thanh toán</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Product Summary -->
                <div style="background: white; border-radius: 15px; padding: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
                    <h2 style="font-size: 18px; color: #333; margin-bottom: 15px;">📦 Sản Phẩm Của Bạn</h2>
                    <div id="orderCartItems"></div>
                    <div style="height: 1px; background: #e0e0e0; margin: 15px 0;"></div>
                    <div style="display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #667eea; border-bottom: 2px solid #667eea;">
                        <span style="font-weight: 600; color: #333;">Tổng Tiền:</span>
                        <span style="font-size: 20px; font-weight: 700; color: #667eea;" id="orderTotalAmount">0 VNĐ</span>
                    </div>
                </div>

                <!-- Order Form -->
                <div style="background: white; border-radius: 15px; padding: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
                    <form id="orderFormModal" onsubmit="submitOrderForm(event)">
                        <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 14px;">👤 Thông Tin Cá Nhân</h3>
                        
                        <input type="text" id="orderFullName" placeholder="Họ và Tên *" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <input type="email" id="orderEmail" placeholder="Email *" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <input type="tel" id="orderPhone" placeholder="Số điện thoại *" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">

                        <h3 style="color: #667eea; margin: 15px 0 10px 0; font-size: 14px;">🏠 Địa Chỉ Giao Hàng</h3>
                        
                        <input type="text" id="orderAddress" placeholder="Địa chỉ *" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <select id="orderProvince" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="">-- Tỉnh/Thành phố --</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                            <option value="Hải Phòng">Hải Phòng</option>
                            <option value="Cần Thơ">Cần Thơ</option>
                        </select>

                        <h3 style="color: #667eea; margin: 15px 0 10px 0; font-size: 14px;">💳 Phương Thức Thanh Toán</h3>
                        
                        <label style="display: block; margin-bottom: 8px;">
                            <input type="radio" name="orderPayment" value="COD" checked> Thanh toán khi nhận hàng
                        </label>
                        <label style="display: block; margin-bottom: 10px;">
                            <input type="radio" name="orderPayment" value="BANK"> Chuyển khoản ngân hàng
                        </label>
                        
                        <textarea id="orderNotes" placeholder="Ghi chú (không bắt buộc)" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; height: 60px;"></textarea>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <button type="button" onclick="closeOrderCheckoutModal()" style="padding: 12px; background: #f0f0f0; color: #333; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">Hủy</button>
                            <button type="submit" style="padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">Xác Nhận Đặt Hàng</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    contentDiv.innerHTML = html;
    modal.classList.add('show');
    loadOrderCheckoutItems();
}

// Load sản phẩm vào modal order checkout
function loadOrderCheckoutItems() {
    const cartItemsDiv = document.getElementById('orderCartItems');
    const totalAmountSpan = document.getElementById('orderTotalAmount');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="color: #999; text-align: center;">Giỏ hàng trống</p>';
        totalAmountSpan.textContent = '0 VNĐ';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div style="display: flex; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px; margin-bottom: 15px;">
                <img src="${item.img}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h3 style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;">${item.name}</h3>
                    <p style="font-size: 12px; color: #666; margin-bottom: 5px;"><strong>Giá:</strong> ${item.price.toLocaleString('vi-VN')} VNĐ</p>
                    <p style="font-size: 12px; color: #666; margin-bottom: 5px;"><strong>Số lượng:</strong> ${item.quantity}</p>
                    <p style="font-size: 14px; font-weight: 700; color: #e74c3c;">Tổng: ${itemTotal.toLocaleString('vi-VN')} VNĐ</p>
                </div>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = html;
    totalAmountSpan.textContent = total.toLocaleString('vi-VN') + ' VNĐ';
}

// Đóng modal order checkout
function closeOrderCheckoutModal() {
    console.log('✅ closeOrderCheckoutModal gọi');
    const modal = document.getElementById('orderCheckoutModal');
    console.log('Modal để đóng:', modal);
    if (modal) {
        modal.classList.remove('show');
        console.log('✅ Đã remove class show');
    }
}

// Xử lý form đặt hàng
function submitOrderForm(event) {
    console.log('✅ submitOrderForm gọi');
    event.preventDefault();

    const formData = {
        fullName: document.getElementById('orderFullName').value,
        email: document.getElementById('orderEmail').value,
        phone: document.getElementById('orderPhone').value,
        birthDate: document.getElementById('orderBirthDate').value,
        address: document.getElementById('orderAddress').value,
        province: document.getElementById('orderProvince').value,
        postCode: document.getElementById('orderPostCode').value,
        paymentMethod: document.querySelector('input[name="orderPayment"]:checked').value,
        notes: document.getElementById('orderNotes').value,
        orderDate: new Date().toLocaleString('vi-VN'),
        items: cart
    };

    // Lưu đơn hàng vào localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(formData);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Xóa giỏ hàng
    cart = [];
    saveToStorage();

    // Đóng modal
    closeOrderCheckoutModal();

    // Thông báo thành công
    alert('✅ Đặt hàng thành công!\n\nChúng tôi sẽ liên hệ bạn trong 24 giờ.\nCảm ơn bạn đã mua hàng!');
}
