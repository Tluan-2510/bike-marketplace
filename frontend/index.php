<?php
/**
 * Trang chủ - Bike Marketplace
 * Hiển thị danh sách sản phẩm nổi bật
 */

$pageTitle = 'Trang chủ';
$currentPage = 'home';

include __DIR__ . '/includes/head.php';
include __DIR__ . '/includes/navbar.php';
?>

<!-- Search Section -->
<section class="search_section layout_padding" id="tim-kiem">
    <div class="container">
        <div class="heading_container heading_center">
            <h2>Tìm kiếm xe đạp nhanh</h2>
            <p>Lọc theo từ khóa, khoảng giá và loại xe để tìm đúng mẫu phù hợp.</p>
        </div>
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="form_container">
                    <form id="bikeSearchForm" novalidate>
                        <div>
                            <input id="searchKeyword" type="text" class="form-control" placeholder="Tìm theo tên xe hoặc hãng xe" />
                        </div>
                        <div>
                            <select id="searchPrice" class="form-control">
                                <option value="all">Mọi khoảng giá</option>
                                <option value="lt5">Dưới 5 triệu</option>
                                <option value="5to10">5 - 10 triệu</option>
                                <option value="10to20">10 - 20 triệu</option>
                                <option value="gt20">Trên 20 triệu</option>
                            </select>
                        </div>
                        <div>
                            <select id="searchType" class="form-control">
                                <option value="all">Mọi loại xe</option>
                                <option value="mtb">MTB</option>
                                <option value="road">Road Bike</option>
                                <option value="gravel">Gravel</option>
                                <option value="city">City Bike</option>
                                <option value="folding">Folding Bike</option>
                            </select>
                        </div>
                        <div class="btn_box">
                            <button id="searchButton" type="submit">Lọc kết quả</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Category Section -->
<section class="offer_section layout_padding-bottom" id="danh-muc">
    <div class="offer_container">
        <div class="container">
            <div class="heading_container heading_center">
                <h2>Danh mục xe đạp phổ biến</h2>
            </div>
            <div class="row justify-content-center">
                <div class="col-sm-6 col-lg-4">
                    <div class="box">
                        <div class="img-box d-flex justify-content-center align-items-center">
                            <img src="assets/images/f1.png" class="img-fluid" alt="Danh mục xe MTB" />
                        </div>
                        <div class="detail-box">
                            <h5>MTB</h5>
                            <h6><span id="countMTB">0</span> tin đang bán</h6>
                            <a href="#xe-noi-bat" data-filter="mtb">Xem ngay</a>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-4">
                    <div class="box">
                        <div class="img-box d-flex justify-content-center align-items-center">
                            <img class="img-fluid" src="assets/images/f2.png" alt="Danh mục xe Road Bike" />
                        </div>
                        <div class="detail-box">
                            <h5>Road Bike</h5>
                            <h6><span id="countRoad">0</span> tin đang bán</h6>
                            <a href="#xe-noi-bat" data-filter="road">Xem ngay</a>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-4">
                    <div class="box">
                        <div class="img-box d-flex justify-content-center align-items-center">
                            <img src="assets/images/f3.png" class="img-fluid" alt="Danh mục xe Gravel" />
                        </div>
                        <div class="detail-box">
                            <h5>Gravel</h5>
                            <h6><span id="countGravel">0</span> tin đang bán</h6>
                            <a href="#xe-noi-bat" data-filter="gravel">Xem ngay</a>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-4">
                    <div class="box">
                        <div class="img-box d-flex justify-content-center align-items-center">
                            <img class="img-fluid" src="assets/images/f4.png" alt="Danh mục xe City Bike" />
                        </div>
                        <div class="detail-box">
                            <h5>City Bike</h5>
                            <h6><span id="countCity">0</span> tin đang bán</h6>
                            <a href="#xe-noi-bat" data-filter="city">Xem ngay</a>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-4">
                    <div class="box">
                        <div class="img-box d-flex justify-content-center align-items-center">
                            <img class="img-fluid" src="assets/images/f5.png" alt="Danh mục xe Folding Bike" />
                        </div>
                        <div class="detail-box">
                            <h5>Folding Bike</h5>
                            <h6><span id="countFolding">0</span> tin đang bán</h6>
                            <a href="#xe-noi-bat" data-filter="folding">Xem ngay</a>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-4">
                    <div class="box">
                        <div class="img-box d-flex justify-content-center align-items-center">
                            <img class="img-fluid" src="assets/images/f6.png" alt="Xem tất cả sản phẩm xe đạp" />
                        </div>
                        <div class="detail-box">
                            <h5>Tất cả xe</h5>
                            <h6><span id="countAll">0</span> tin đang bán</h6>
                            <a href="#xe-noi-bat">Khám phá</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Products Section -->
<section class="bike_section layout_padding-bottom" id="xe-noi-bat">
    <div class="container">
        <div class="heading_container heading_center">
            <h2>Xe đạp nổi bật / Mới đăng</h2>
        </div>

        <ul class="filters_menu" id="filtersMenu">
            <li class="active" data-filter="*">Tất cả</li>
            <li data-filter="mtb">MTB</li>
            <li data-filter="road">Road</li>
            <li data-filter="gravel">Gravel</li>
            <li data-filter="city">City</li>
            <li data-filter="folding">Folding</li>
        </ul>

        <div class="filters-content">
            <div class="row grid" id="productGrid">
                <!-- Products will be loaded here dynamically -->
            </div>
        </div>

        <div id="searchEmptyState" class="search_empty_state" style="display: none;">
            Không tìm thấy mẫu xe phù hợp với bộ lọc hiện tại.
        </div>

        <div class="btn-box font-weight-bold">
            <a href="pages/products.php">Xem tất cả xe</a>
        </div>
    </div>
</section>

<!-- About Section -->
<section class="about_section layout_padding" id="tai-sao-chon">
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <div class="img-box">
                    <img src="assets/images/about-img.png" alt="Minh họa kiểm tra xe đạp trước giao dịch" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="detail-box">
                    <div class="heading_container">
                        <h2>Tại sao chọn chúng tôi?</h2>
                    </div>
                    <p>Thông tin đăng bán rõ ràng, quy trình liên hệ nhanh và ưu tiên minh bạch tình trạng xe.</p>
                    <p><i class="fa fa-check-circle" aria-hidden="true"></i> Dễ so sánh giá theo thị trường thực tế.</p>
                    <p><i class="fa fa-check-circle" aria-hidden="true"></i> Bộ lọc rõ ràng theo loại xe và ngân sách.</p>
                    <p><i class="fa fa-check-circle" aria-hidden="true"></i> Tăng độ an tâm trước khi gặp trực tiếp người bán.</p>
                    <a href="#tim-kiem">Bắt đầu đăng tin</a>
                </div>
            </div>
        </div>
    </div>
</section>

<?php
include __DIR__ . '/includes/footer.php';
?>

<!-- Custom Script for Homepage -->
<script>
(function() {
    'use strict';
    
    // State
    var allProducts = [];
    var currentFilter = '*';
    
    /**
     * Fetch products from API
     */
    async function fetchProducts() {
        try {
            // Show skeleton loading
            renderSkeletons('productGrid', 6);
            
            var response = await BikeApi.request('/products');
            allProducts = BikeApi.pickList(response);
            
            // Update category counts
            updateCategoryCounts(allProducts);
            
            // Render products
            renderProducts(allProducts);
            
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.', 'error');
            
            // Show empty state
            document.getElementById('productGrid').innerHTML = '';
            document.getElementById('searchEmptyState').style.display = 'block';
            document.getElementById('searchEmptyState').textContent = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
        }
    }
    
    /**
     * Update category counts
     */
    function updateCategoryCounts(products) {
        var counts = {
            all: products.length,
            mtb: 0,
            road: 0,
            gravel: 0,
            city: 0,
            folding: 0
        };
        
        products.forEach(function(product) {
            var category = (product.category || '').toLowerCase();
            if (counts.hasOwnProperty(category)) {
                counts[category]++;
            }
        });
        
        // Update UI
        var elements = {
            'countAll': counts.all,
            'countMTB': counts.mtb,
            'countRoad': counts.road,
            'countGravel': counts.gravel,
            'countCity': counts.city,
            'countFolding': counts.folding
        };
        
        for (var key in elements) {
            var el = document.getElementById(key);
            if (el) el.textContent = elements[key];
        }
    }
    
    /**
     * Render products to grid
     */
    function renderProducts(products) {
        var grid = document.getElementById('productGrid');
        var emptyState = document.getElementById('searchEmptyState');
        
        if (!products || products.length === 0) {
            grid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        var html = '';
        products.forEach(function(product) {
            var category = (product.category || 'all').toLowerCase();
            var imageSrc = product.image || 'assets/images/f6.png';
            var price = formatCurrency(product.price);
            var name = product.name || 'Không rõ tên';
            var description = product.description || '';
            var shortDesc = description.length > 60 ? description.substring(0, 60) + '...' : description;
            
            html += '<div class="col-sm-6 col-lg-4 all ' + category + '" data-category="' + category + '" data-price="' + (product.price || 0) + '" data-name="' + name + '">' +
                '<div class="box">' +
                    '<div>' +
                        '<div class="img-box">' +
                            '<img src="' + imageSrc + '" alt="' + name + '" loading="lazy" />' +
                        '</div>' +
                        '<div class="detail-box">' +
                            '<h5>' + name + '</h5>' +
                            '<p>' + shortDesc + '</p>' +
                            '<div class="options">' +
                                '<h6>' + price + '</h6>' +
                                '<a href="pages/product-detail.php?id=' + (product.id || '') + '" aria-label="Xem chi tiết ' + name + '">' +
                                    '<i class="fa fa-2x fa-heart" aria-hidden="true"></i>' +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        });
        
        grid.innerHTML = html;
    }
    
    /**
     * Filter products by category
     */
    function filterProducts(category) {
        currentFilter = category;
        
        // Update active filter button
        var filterButtons = document.querySelectorAll('#filtersMenu li');
        filterButtons.forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            }
        });
        
        // Filter and render
        if (category === '*') {
            renderProducts(allProducts);
        } else {
            var filtered = allProducts.filter(function(p) {
                return (p.category || '').toLowerCase() === category;
            });
            renderProducts(filtered);
        }
    }
    
    /**
     * Search products
     */
    function searchProducts() {
        var keyword = document.getElementById('searchKeyword').value.toLowerCase().trim();
        var priceFilter = document.getElementById('searchPrice').value;
        var typeFilter = document.getElementById('searchType').value;
        
        var filtered = allProducts.filter(function(product) {
            // Keyword filter
            var name = (product.name || '').toLowerCase();
            var desc = (product.description || '').toLowerCase();
            var matchKeyword = !keyword || name.indexOf(keyword) > -1 || desc.indexOf(keyword) > -1;
            
            // Type filter
            var matchType = typeFilter === 'all' || (product.category || '').toLowerCase() === typeFilter;
            
            // Price filter
            var price = Number(product.price || 0);
            var matchPrice = true;
            switch (priceFilter) {
                case 'lt5': matchPrice = price < 5000000; break;
                case '5to10': matchPrice = price >= 5000000 && price <= 10000000; break;
                case '10to20': matchPrice = price > 10000000 && price <= 20000000; break;
                case 'gt20': matchPrice = price > 20000000; break;
            }
            
            return matchKeyword && matchType && matchPrice;
        });
        
        renderProducts(filtered);
        
        if (filtered.length === 0) {
            showToast('Không tìm thấy sản phẩm phù hợp', 'info');
        } else {
            showToast('Tìm thấy ' + filtered.length + ' sản phẩm', 'success');
        }
    }
    
    // Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
        // Fetch products on load
        fetchProducts();
        
        // Filter buttons
        document.getElementById('filtersMenu').addEventListener('click', function(e) {
            if (e.target.tagName === 'LI') {
                filterProducts(e.target.getAttribute('data-filter'));
            }
        });
        
        // Search form
        document.getElementById('bikeSearchForm').addEventListener('submit', function(e) {
            e.preventDefault();
            searchProducts();
        });
        
        // Category links
        document.querySelectorAll('#danh-muc a[data-filter]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var filter = this.getAttribute('data-filter');
                filterProducts(filter);
            });
        });
    });
})();
</script>

<?php
include __DIR__ . '/includes/scripts.php';
?>