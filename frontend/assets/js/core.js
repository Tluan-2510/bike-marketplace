
(function(window, document) {
    "use strict";

    // Global utility to resolve API base URL
    window.BikeApi = {
        resolveApiBaseUrl: function() {
            return "/backend/api";
        },
        
        getAuthHeader: function() {
            var token = this.getAuthToken();
            if (!token) {
                console.warn("[BikeApi] No token found for Authorization header");
                return {};
            }
            return { 'Authorization': 'Bearer ' + token };
        },

        getAuthUserId: function() {
            // First try to get from stored user object (most reliable)
            var user = this.getAuthUser();
            if (user && (user.id || user.user_id)) {
                var id = user.id || user.user_id;
                console.log("[BikeApi] Found User ID in localStorage:", id);
                return id;
            }

            // Fallback to manual JWT decoding
            var token = this.getAuthToken();
            console.log("[BikeApi] Token from localStorage:", token ? "Exists (length: " + token.length + ")" : "MISSING");
            
            if (!token) return null;
            try {
                var parts = token.split('.');
                if (parts.length !== 3) {
                    console.error("[BikeApi] Invalid token format (expected 3 parts)");
                    return null;
                }
                var base64Url = parts[1];
                
                // Convert Base64URL to Base64
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                
                // Add padding if missing
                var pad = base64.length % 4;
                if (pad) {
                    if (pad === 1) throw new Error("Invalid base64");
                    base64 += new Array(5 - pad).join('=');
                }
                
                var payload = JSON.parse(atob(base64));
                var id = payload.sub || payload.id || payload.user_id;
                console.log("[BikeApi] Decoded User ID from JWT:", id);
                return id;
            } catch (e) {
                console.error("[BikeApi] Failed to decode auth token:", e);
                return null;
            }
        },

        getAuthToken: function() {
            return localStorage.getItem('access_token');
        },

        getAuthUser: function() {
            try {
                var user = localStorage.getItem('auth_user');
                return user ? JSON.parse(user) : null;
            } catch (e) {
                return null;
            }
        },

        // Helper to extract data list from various API response formats
        pickList: function(response) {
            if (!response) return [];
            if (Array.isArray(response)) return response;
            if (response.data && Array.isArray(response.data)) return response.data;
            if (response.data && response.data.items && Array.isArray(response.data.items)) return response.data.items;
            if (response.items && Array.isArray(response.items)) return response.items;
            return [];
        },

        // Formatters
        formatCurrency: function(amount) {
            if (!amount) return "0 đ";
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount).replace('₫', 'đ');
        },

        resolveImageUrl: function(path) {
            if (!path) return "../assets/images/placeholder-bike.png";
            if (path.startsWith('http')) return path;
            if (path.startsWith('/backend/uploads/') || path.startsWith('backend/uploads/')) {
                return (path.startsWith('/') ? '' : '/') + path;
            }
            return "/backend/uploads/" + path;
        },

        // API Methods
        getProducts: async function(params) {
            var query = params ? '?' + new URLSearchParams(params).toString() : '';
            var headers = {};
            var authHeader = this.getAuthHeader();
            if (authHeader) {
                headers = authHeader;
            }
            console.log("[BikeApi] Fetching products:", query, "Headers:", headers);
            var res = await fetch(this.resolveApiBaseUrl() + '/products' + query, {
                headers: headers
            });
            return res.json();
        },

        getProductDetail: async function(id) {
            var res = await fetch(this.resolveApiBaseUrl() + '/products/' + id);
            return res.json();
        },

        // Alias for compatibility
        getProduct: async function(id) {
            return this.getProductDetail(id);
        },

        deleteProduct: async function(id) {
            var res = await fetch(this.resolveApiBaseUrl() + '/products/' + id, {
                method: 'DELETE',
                headers: this.getAuthHeader()
            });
            return res.json();
        },
        updateProductStatus: async function(id, status) {
            var res = await fetch(this.resolveApiBaseUrl() + '/products/' + id + '/status', {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }, this.getAuthHeader()),
                body: JSON.stringify({ status: status })
            });
            return res.json();
        },
        getAdminStats: async function() {
            var res = await fetch(this.resolveApiBaseUrl() + '/admin/stats', {
                headers: this.getAuthHeader()
            });
            return res.json();
        },

        getPendingProducts: async function(page) {
            var res = await fetch(this.resolveApiBaseUrl() + '/admin/pending-products?page=' + (page || 1), {
                headers: this.getAuthHeader()
            });
            return res.json();
        },

        approveProduct: async function(productId) {
            var res = await fetch(this.resolveApiBaseUrl() + '/admin/approve', {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }, this.getAuthHeader()),
                body: JSON.stringify({ product_id: productId })
            });
            return res.json();
        },

        createProduct: async function(formData) {
            var res = await fetch(this.resolveApiBaseUrl() + '/products', {
                method: 'POST',
                headers: this.getAuthHeader(),
                body: formData
            });
            
            var contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return res.json();
            } else {
                var text = await res.text();
                console.error("[BikeApi] Expected JSON but got:", text.substring(0, 100));
                return { 
                    success: false, 
                    message: "Lỗi hệ thống (HTTP " + res.status + "). Có thể file quá lớn hoặc lỗi máy chủ." 
                };
            }
        },

        getCategories: async function() {
            var res = await fetch(this.resolveApiBaseUrl() + '/categories');
            return res.json();
        },

        getBrands: async function() {
            var res = await fetch(this.resolveApiBaseUrl() + '/brands');
            return res.json();
        },

        getFavorites: async function() {
            var res = await fetch(this.resolveApiBaseUrl() + '/favorites', {
                headers: this.getAuthHeader()
            });
            return res.json();
        },

        getMe: async function() {
            var res = await fetch(this.resolveApiBaseUrl() + '/user/me', {
                headers: this.getAuthHeader()
            });
            return res.json();
        },

        updateProfile: async function(data) {
            var res = await fetch(this.resolveApiBaseUrl() + '/user/profile', {
                method: 'PUT',
                headers: Object.assign({ 'Content-Type': 'application/json' }, this.getAuthHeader()),
                body: JSON.stringify(data)
            });
            return res.json();
        },

        getAdminStats: async function() {
            var res = await fetch(this.resolveApiBaseUrl() + '/admin/stats', {
                headers: this.getAuthHeader()
            });
            return res.json();
        },

        createBuyRequest: async function(data) {
            var res = await fetch(this.resolveApiBaseUrl() + '/buy-requests', {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }, this.getAuthHeader()),
                body: JSON.stringify(data)
            });
            return res.json();
        },

        getBuyRequests: async function(role) {
            var url = this.resolveApiBaseUrl() + '/buy-requests' + (role ? '?role=' + role : '');
            var res = await fetch(url, {
                headers: this.getAuthHeader()
            });
            return res.json();
        },

        updateBuyRequestStatus: async function(id, status) {
            var res = await fetch(this.resolveApiBaseUrl() + '/buy-requests/' + id, {
                method: 'PUT',
                headers: Object.assign({ 'Content-Type': 'application/json' }, this.getAuthHeader()),
                body: JSON.stringify({ status: status })
            });
            return res.json();
        },

        toggleFavorite: async function(productId, action) {
            var method = (action === 'add' || action === 'POST') ? 'POST' : 'DELETE';
            var res = await fetch(this.resolveApiBaseUrl() + '/favorites', {
                method: method,
                headers: Object.assign({ 'Content-Type': 'application/json' }, this.getAuthHeader()),
                body: JSON.stringify({ product_id: productId })
            });
            return res.json();
        },

        getUser: async function(id) {
            return { success: false, message: "Endpoint not implemented" };
        },

        login: async function(payload) {
            var email = payload.email || "";
            var password = payload.password || "";
            var res = await fetch(this.resolveApiBaseUrl() + '/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });
            return res.json();
        },

        register: async function(userData) {
            var res = await fetch(this.resolveApiBaseUrl() + '/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return res.json();
        },

        showToast: function(message, type) {
            if (window.showToast) {
                window.showToast(message, type);
            } else if (window.BikeToast && window.BikeToast.show) {
                window.BikeToast.show(message, type);
            } else {
                console.log("Toast [" + type + "]: " + message);
            }
        }
    };

    var API_BASE_URL = window.BikeApi.resolveApiBaseUrl();

    // Export helpers to window for backward compatibility
    window.formatCurrency = window.BikeApi.formatCurrency;
    window.resolveImageUrl = window.BikeApi.resolveImageUrl;

    // Icon helper
    window.getHeartIconMarkup = function() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
    };

    // Component: Product Card
    window.renderProductCard = function (product) {
      var title = product.title || product.name || "Xe đạp";
      var imageUrl = window.resolveImageUrl(
        product.image_url ||
        product.primary_image ||
        (product.images && product.images[0] && product.images[0].image_url)
      );
      var price = window.formatCurrency(product.price);
      var brand = product.brand_name || product.brand || "Xe đạp";
      var category = product.category_name || "Thể thao";
      var productId = product.id || product.product_id;
  
      var isFavorite = Boolean(product.is_favorite || product.isFavorite || product.favorite_id);
      var column = document.createElement("div");
      column.className = "col-6 col-md-6 col-lg-4 mb-4";
      column.innerHTML = `
        <div class="box h-100 d-flex flex-column shadow-sm border rounded overflow-hidden product-card-modern">
          <div class="img-box product-card-media">
            <a href="./product-detail.php?id=${productId}" class="product-card-link">
              <img src="${imageUrl}" alt="${title}" class="img-fluid product-card-image">
            </a>
            <div class="card-badges">
              <span class="badge badge-primary badge-brand">${brand}</span>
              ${(product.is_approved == 0 || product.is_approved === '0' || product.is_approved === false) ? '<span class="badge badge-warning badge-pending ml-1" style="background: #ffc107; color: #212529; font-weight: bold; border: 1px solid rgba(0,0,0,0.1);">Chờ duyệt</span>' : ''}
            </div>
            <button class="fav-btn${isFavorite ? " active" : ""}" data-id="${productId}" aria-pressed="${isFavorite ? "true" : "false"}" aria-label="${isFavorite ? "Bỏ yêu thích" : "Yêu thích"}">
              <span class="fav-btn-icon" aria-hidden="true">${window.getHeartIconMarkup()}</span>
            </button>
          </div>
          <div class="detail-box flex-grow-1 d-flex flex-column p-3 bg-white">
            <h6 class="product-title-modern mb-2 font-weight-bold">
              <a href="./product-detail.php?id=${productId}" class="text-dark" style="text-decoration: none;">${title}</a>
            </h6>
            
            <div class="product-meta-row d-flex align-items-center mb-1">
              <span class="product-brand-tag"><i class="fa fa-tag mr-1"></i> ${brand}</span>
            </div>
            <div class="product-meta-row d-flex align-items-center mb-3">
              <span class="product-category-tag"><i class="fa fa-bicycle mr-1"></i> ${category}</span>
            </div>
  
            <div class="mt-auto pt-2 border-top d-flex align-items-center w-100">
              <div class="price-wrapper">
                <span class="price-label small text-muted d-block">Giá bán</span>
                <h5 class="mb-0 font-weight-bold text-dark product-price-modern">${price.replace('đ', '')} <span class="currency-symbol">đ</span></h5>
              </div>
              <div class="flex-grow-1"></div>
              ${product.is_owner ? `<button class="btn btn-sm btn-outline-danger mr-2 btn-delete-product" data-id="${productId}" title="Xóa tin đăng"><i class="fa fa-trash"></i></button>` : ''}
              <a href="./product-detail.php?id=${productId}" class="btn-detail-link" aria-label="Xem chi tiết"><i class="fa fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      `;
  
      return column;
    };

    window.renderProductSkeleton = function() {
        var column = document.createElement("div");
        column.className = "col-6 col-md-6 col-lg-4 mb-4";
        column.innerHTML = `
            <div class="box h-100 d-flex flex-column shadow-sm border rounded overflow-hidden">
                <div class="skeleton skeleton-img"></div>
                <div class="p-3 bg-white">
                    <div class="skeleton skeleton-text" style="width: 40%"></div>
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text" style="width: 60%"></div>
                    <div class="skeleton skeleton-text" style="width: 80%"></div>
                    <div class="mt-3 pt-2 border-top d-flex">
                        <div class="skeleton skeleton-text" style="width: 50%; height: 1.5rem"></div>
                    </div>
                </div>
            </div>
        `;
        return column;
    };

    // Global UI Initialization
    function initGlobalUI() {
        // Handle favorites toggle
        document.addEventListener('click', function(e) {
            var favBtn = e.target.closest('.fav-btn');
            if (favBtn) {
                var productId = favBtn.dataset.id;
                toggleFavorite(productId, favBtn);
            }
        });

        updateAuthUI();
    }

    function toggleFavorite(productId, btn) {
        var token = localStorage.getItem('access_token');
        if (!token) {
            window.BikeApi.showToast("Vui lòng đăng nhập để lưu tin", "warning");
            return;
        }

        var isActive = btn.classList.contains('active');
        window.BikeApi.toggleFavorite(productId, isActive ? 'remove' : 'add')
        .then(data => {
            if (data.success) {
                btn.classList.toggle('active');
                window.BikeApi.showToast(isActive ? "Đã bỏ lưu tin" : "Đã lưu tin thành công", "success");
            } else {
                window.BikeApi.showToast(data.message || "Lỗi khi xử lý", "error");
            }
        });
    }

    function updateAuthUI() {
        var token = localStorage.getItem('access_token');
        var navAuth = document.querySelector('.user_option');
        if (!navAuth) return;

        if (token) {
            navAuth.innerHTML = `
                <a href="favorites.php" class="user_link mr-3" title="Yêu thích">
                    <i class="fa fa-heart" style="font-size: 24px;" aria-hidden="true"></i>
                </a>
                <a href="user.php" class="user_link mr-3" title="Tài khoản">
                    <i class="fa fa-user" style="font-size: 24px;" aria-hidden="true"></i>
                </a>
                <a href="javascript:void(0)" onclick="logout()" class="user_link" title="Đăng xuất">
                    <i class="fa fa-sign-out" style="font-size: 24px;" aria-hidden="true"></i>
                </a>
            `;
        }
    }

    function updateActiveLinks() {
        var path = window.location.pathname;
        var links = document.querySelectorAll('.navbar-nav .nav-link, .user_option .user_link, .user_option .cart_link');
        
        links.forEach(function(link) {
            var href = link.getAttribute('href');
            if (!href || href === 'javascript:void(0)') return;
            
            // Normalize path and href for comparison
            var fileName = path.split('/').pop() || 'index.php';
            var target = href.split('/').pop();
            
            // Handle home path index.php vs /
            if ((fileName === 'index.php' || fileName === '') && target === 'index.php') {
                link.closest('.nav-item')?.classList.add('active');
                link.classList.add('text-warning');
                return;
            }

            if (fileName === target || (fileName === 'user.php' && (target === 'login.php' || target === 'register.php'))) {
                var navItem = link.closest('.nav-item');
                if (navItem) {
                    navItem.classList.add('active');
                } else {
                    link.classList.add('text-warning');
                }
            } else {
                var navItem = link.closest('.nav-item');
                if (navItem) navItem.classList.remove('active');
                link.classList.remove('text-warning');
            }
        });
    }

    window.logout = function() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        localStorage.removeItem('auth_user');
        location.href = 'index.php';
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            initGlobalUI();
            updateActiveLinks();
        });
    } else {
        initGlobalUI();
        updateActiveLinks();
    }

    // Auto-show Admin link if user is admin
    document.addEventListener("DOMContentLoaded", function() {
        var user = window.BikeApi.getAuthUser();
        if (user && user.role === 'admin') {
            var adminLink = document.getElementById('navAdminLink');
            if (adminLink) adminLink.classList.remove('d-none');
        }
        updateActiveLinks(); // Run again after showing admin link
    });

})(window, document);
