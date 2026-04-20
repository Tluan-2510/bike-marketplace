// Shop page logic
function initializeShop() {
    loadFromStorage();
    
    // Get category and collection from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');
    const collection = urlParams.get('collection');

    // Đảm bảo product-list element tồn tại
    const productListEl = document.getElementById('productList');
    if (!productListEl) {
        return;
    }

    if (collection === 'new') {
        // Hiển thị toàn bộ sản phẩm khi vào bộ sưu tập mới
        const categoryTitleEl = document.getElementById('categoryTitle');
        if (categoryTitleEl) categoryTitleEl.textContent = 'Bộ Sưu Tập Mới';

        const shopTitleEl = document.getElementById('shopTitle');
        if (shopTitleEl) shopTitleEl.textContent = 'Bộ Sưu Tập Mới';

        const countEl = document.getElementById('productCountSpan');
        if (countEl) countEl.textContent = products.length;

        const bannerTitleEl = document.getElementById('promoBannerTitle');
        if (bannerTitleEl) bannerTitleEl.textContent = 'Khám Phá Bộ Sưu Tập Mới';

        const bannerDescEl = document.getElementById('promoBannerDesc');
        if (bannerDescEl) bannerDescEl.textContent = 'Tất cả sản phẩm nổi bật, chất lượng cao, bảo hành chính hãng.';

        let sorted = [...products].sort((a, b) => b.popularity - a.popularity);
        renderProducts(sorted);
        highlightActiveButton('Phổ Biến');
    } else if (category) {
        // Lọc sản phẩm theo category
        const filtered = products.filter(p => p.type === category);
        updateCategoryInfo(category, filtered.length);
        let sorted = filtered.sort((a, b) => b.popularity - a.popularity);
        renderProducts(sorted);
        highlightActiveButton('Phổ Biến');
    } else {
        // Hiển thị toàn bộ sản phẩm nếu không có category
        const categoryTitleEl = document.getElementById('categoryTitle');
        if (categoryTitleEl) categoryTitleEl.textContent = 'Xe Đạp';
        const shopTitleEl = document.getElementById('shopTitle');
        if (shopTitleEl) shopTitleEl.textContent = 'Xe Đạp';
        const countEl = document.getElementById('productCountSpan');
        if (countEl) countEl.textContent = products.length;
        const bannerTitleEl = document.getElementById('promoBannerTitle');
        if (bannerTitleEl) bannerTitleEl.textContent = 'Khám Phá Bộ Sưu Tập Xe Đạp Mới';
        const bannerDescEl = document.getElementById('promoBannerDesc');
        if (bannerDescEl) bannerDescEl.textContent = 'Quà tặng hấp dẫn & Bảo hành chính hãng';
        let sorted = [...products].sort((a, b) => b.popularity - a.popularity);
        renderProducts(sorted);
        highlightActiveButton('Phổ Biến');
    }
}

function updateCategoryInfo(category, count) {
    const categoryNames = {
        'road': 'Xe Đạp Road',
        'xc': 'Xe Đạp XC',
        'trail': 'Xe Đạp Trail',
        'enduro': 'Xe Đạp Mountain',
        'downhill': 'Xe Đạp Downhill',
        'hybrid': 'Xe Đạp Hybrid',
        'kids': 'Xe Đạp Trẻ Em'
    };
    
    const categoryName = categoryNames[category] || 'Xe Đạp';
    
    // Cập nhật breadcrumb
    const categoryTitleEl = document.getElementById('categoryTitle');
    if (categoryTitleEl) categoryTitleEl.textContent = categoryName;
    
    // Cập nhật tiêu đề
    const shopTitleEl = document.getElementById('shopTitle');
    if (shopTitleEl) shopTitleEl.textContent = categoryName;
    
    // Cập nhật số sản phẩm
    const countEl = document.getElementById('productCountSpan');
    if (countEl) countEl.textContent = count;
    
    // Cập nhật banner
    const bannerTitleEl = document.getElementById('promoBannerTitle');
    if (bannerTitleEl) bannerTitleEl.textContent = `Ưu Đãi ${categoryName} Mới`;
    
    const bannerDescEl = document.getElementById('promoBannerDesc');
    if (bannerDescEl) bannerDescEl.textContent = 'Quà tặng hấp dẫn & Bảo hành chính hãng';
}

// Scroll to products section
function scrollToProducts() {
    const productList = document.getElementById('productList');
    if (productList) {
        // Scroll to the filter-sort section (top of products area)
        const filterSection = document.querySelector('.filter-sort-container');
        if (filterSection) {
            filterSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }
}

// Initialize on page load - ngay lập tức
function startShopInitialization() {
    // Kiểm tra products array có available không
    if (typeof products === 'undefined' || !Array.isArray(products) || products.length === 0) {
        // Nếu chưa có, đợi và thử lại
        setTimeout(startShopInitialization, 5);
        return;
    }
    // Products sẵn sàng - khởi tạo shop ngay
    initializeShop();
}

// Thử khởi tạo ngay tức khắc
try {
    if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
        // Products đã load - khởi tạo ngay
        initializeShop();
    } else {
        // Chờ DOM hoặc products ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startShopInitialization);
        } else {
            startShopInitialization();
        }
    }
} catch (e) {
    console.error('Error in shop initialization:', e);
}

// Fallback: force render sau 100ms nếu chưa có sản phẩm
setTimeout(() => {
    const productList = document.getElementById('productList');
    if (productList && productList.innerHTML.trim() === '') {
        if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
            initializeShop();
        }
    }
}, 100);

// Thêm event listener cho khi script load xong
if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener('load', () => {
        const productList = document.getElementById('productList');
        if (productList && productList.innerHTML.trim() === '') {
            if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
                initializeShop();
            }
        }
    });
}

// Direct call to sortByPopularity to ensure products render on page load
setTimeout(() => {
    if (typeof sortByPopularity === 'function') {
        console.log('Calling sortByPopularity directly');
        sortByPopularity();
    }
}, 150);

// Also handle collection=new specifically
setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('collection') === 'new' && typeof sortByPopularity === 'function') {
        console.log('Collection=new: Calling sortByPopularity');
        sortByPopularity();
    }
}, 250);

// Additional aggressive fallback - ensure products render on page load
setTimeout(() => {
    const productList = document.getElementById('productList');
    if (productList && productList.innerHTML.trim() === '') {
        if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
            console.log('Fallback initialization triggered');
            initializeShop();
        }
    }
}, 300);

setTimeout(() => {
    const productList = document.getElementById('productList');
    if (productList && productList.innerHTML.trim() === '') {
        if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
            console.log('Final fallback initialization triggered');
            initializeShop();
        }
    }
}, 600);

// Special fallback for collection=new page to ensure products render
setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('collection') === 'new') {
        const productList = document.getElementById('productList');
        if (productList && productList.innerHTML.trim() === '') {
            if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
                console.log('Collection=new fallback: Initializing shop');
                initializeShop();
            }
        }
    }
}, 800);

// Final render attempt for collection=new
setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('collection') === 'new') {
        if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0 && typeof renderProducts === 'function') {
            const productList = document.getElementById('productList');
            if (!productList || productList.innerHTML.trim() === '') {
                console.log('Collection=new final attempt: Direct render');
                let sorted = [...products].sort((a, b) => b.popularity - a.popularity);
                renderProducts(sorted);
            }
        }
    }
}, 1200);
