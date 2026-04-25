<?php
/**
 * Trang Cá Nhân - Profile Page
 * Hiển thị thông tin user, danh sách sản phẩm đã đăng, và chức năng sửa/xóa
 */

$pageTitle = 'Hồ sơ cá nhân';
$currentPage = 'profile';

include __DIR__ . '/../includes/head.php';
include __DIR__ . '/../includes/navbar.php';
?>

<style>
    /* Profile specific styles */
    .profile-section {
        padding: 40px 0;
    }
    
    .profile-card {
        background: white;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        padding: 30px;
        margin-bottom: 30px;
    }
    
    .profile-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #667eea;
        margin-bottom: 20px;
    }
    
    .profile-name {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 5px;
    }
    
    .profile-email {
        color: #666;
        font-size: 14px;
        margin-bottom: 15px;
    }
    
    .profile-stats {
        display: flex;
        gap: 20px;
        margin-top: 20px;
    }
    
    .stat-item {
        text-align: center;
        padding: 15px 25px;
        background: #f8f9fa;
        border-radius: 10px;
        flex: 1;
    }
    
    .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #667eea;
    }
    
    .stat-label {
        font-size: 13px;
        color: #666;
        margin-top: 5px;
    }
    
    .product-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        transition: transform 0.3s, box-shadow 0.3s;
        margin-bottom: 20px;
    }
    
    .product-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    }
    
    .product-img {
        width: 100%;
        height: 180px;
        object-fit: cover;
    }
    
    .product-body {
        padding: 15px;
    }
    
    .product-name {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #333;
    }
    
    .product-price {
        font-size: 18px;
        font-weight: 700;
        color: #e74c3c;
        margin-bottom: 10px;
    }
    
    .product-actions {
        display: flex;
        gap: 8px;
    }
    
    .btn-edit {
        flex: 1;
        padding: 8px 12px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        text-decoration: none;
        text-align: center;
    }
    
    .btn-edit:hover {
        background: #5568d3;
        color: white;
    }
    
    .btn-delete {
        flex: 1;
        padding: 8px 12px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .btn-delete:hover {
        background: #c82333;
        color: white;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: #333;
    }
    
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.3s;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #667eea;
    }
    
    .avatar-preview-container {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .avatar-preview {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #e0e0e0;
    }
    
    .btn-update {
        padding: 12px 30px;
        background: linear-gradient(135deg, #667eea 0%, #5568d3 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .btn-update:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102,126,234,0.3);
    }
    
    .btn-update:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
    
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #999;
    }
    
    .empty-state i {
        font-size: 64px;
        margin-bottom: 20px;
        color: #e0e0e0;
    }
    
    .empty-state h4 {
        margin-bottom: 10px;
        color: #666;
    }
    
    .section-title {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 20px;
        color: #333;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .section-title i {
        color: #667eea;
    }
    
    .tab-nav {
        display: flex;
        gap: 10px;
        margin-bottom: 25px;
        border-bottom: 2px solid #e0e0e0;
    }
    
    .tab-btn {
        padding: 12px 24px;
        background: none;
        border: none;
        font-size: 14px;
        font-weight: 600;
        color: #666;
        cursor: pointer;
        transition: all 0.3s;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
    }
    
    .tab-btn.active {
        color: #667eea;
        border-bottom-color: #667eea;
    }
    
    .tab-btn:hover {
        color: #667eea;
    }
    
    .tab-content {
        display: none;
    }
    
    .tab-content.active {
        display: block;
    }
</style>

<div class="container profile-section">
    <div class="row">
        <!-- Left Column - Profile Info -->
        <div class="col-lg-4">
            <div class="profile-card">
                <div class="text-center">
                    <img src="assets/images/user-avatar.png" alt="Avatar" class="profile-avatar" id="profileAvatar" />
                    <h3 class="profile-name" id="profileName">Đang tải...</h3>
                    <p class="profile-email" id="profileEmail">-</p>
                </div>
                <div class="profile-stats">
                    <div class="stat-item">
                        <div class="stat-value" id="statProducts">0</div>
                        <div class="stat-label">Sản phẩm</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="statFavorites">0</div>
                        <div class="stat-label">Yêu thích</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="statOrders">0</div>
                        <div class="stat-label">Đơn hàng</div>
                    </div>
                </div>
            </div>
            
            <!-- Edit Profile Form -->
            <div class="profile-card">
                <h4 class="section-title"><i class="fa fa-user-circle"></i> Chỉnh sửa thông tin</h4>
                <form id="profileForm">
                    <div class="form-group">
                        <label for="editName">Họ và tên</label>
                        <input type="text" id="editName" name="name" placeholder="Nhập họ tên" required />
                    </div>
                    <div class="form-group">
                        <label for="editPhone">Số điện thoại</label>
                        <input type="tel" id="editPhone" name="phone" placeholder="Nhập số điện thoại" />
                    </div>
                    <div class="form-group">
                        <label>Avatar</label>
                        <div class="avatar-preview-container">
                            <img src="assets/images/user-avatar.png" alt="Preview" class="avatar-preview" id="avatarPreview" />
                            <input type="file" id="avatarInput" accept="image/*" style="flex: 1;" />
                        </div>
                    </div>
                    <button type="submit" class="btn-update" id="btnUpdateProfile">
                        <i class="fa fa-save"></i> Cập nhật thông tin
                    </button>
                </form>
            </div>
        </div>
        
        <!-- Right Column - Products -->
        <div class="col-lg-8">
            <div class="profile-card">
                <h4 class="section-title"><i class="fa fa-bicycle"></i> Sản phẩm của tôi</h4>
                
                <!-- Tabs -->
                <div class="tab-nav">
                    <button class="tab-btn active" data-tab="all">Tất cả</button>
                    <button class="tab-btn" data-tab="active">Đang bán</button>
                    <button class="tab-btn" data-tab="sold">Đã bán</button>
                </div>
                
                <!-- Products Grid -->
                <div class="row" id="myProductsGrid">
                    <!-- Products will be loaded here -->
                </div>
                
                <!-- Empty State -->
                <div class="empty-state" id="emptyState" style="display: none;">
                    <i class="fa fa-bicycle"></i>
                    <h4>Chưa có sản phẩm nào</h4>
                    <p>Bạn chưa đăng bán sản phẩm nào. Hãy bắt đầu đăng bán xe đạp của bạn!</p>
                    <a href="create_product.php" class="btn1" style="margin-top: 15px; display: inline-block;">Đăng bán ngay</a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
include __DIR__ . '/../includes/footer.php';
?>

<!-- Custom Script for Profile Page -->
<script>
(function() {
    'use strict';
    
    // State
    var myProducts = [];
    var currentTab = 'all';
    
    /**
     * Initialize profile page
     */
    async function initProfile() {
        // Load user info
        loadUserInfo();
        
        // Load user's products
        await loadMyProducts();
        
        // Setup event listeners
        setupEventListeners();
    }
    
    /**
     * Load user information from localStorage
     */
    function loadUserInfo() {
        var user = getCurrentUser();
        
        if (!user) {
            // If no user, redirect to login
            showToast('Vui lòng đăng nhập để xem trang cá nhân', 'error');
            setTimeout(function() {
                window.location.href = 'login.php';
            }, 1500);
            return;
        }
        
        // Update UI
        document.getElementById('profileName').textContent = user.name || user.username || 'Người dùng';
        document.getElementById('profileEmail').textContent = user.email || '-';
        
        // Update form
        document.getElementById('editName').value = user.name || user.username || '';
        document.getElementById('editPhone').value = user.phone || '';
        
        // Update avatar if exists
        if (user.avatar) {
            document.getElementById('profileAvatar').src = user.avatar;
            document.getElementById('avatarPreview').src = user.avatar;
        }
        
        // Update stats
        document.getElementById('statFavorites').textContent = user.favorites_count || 0;
        document.getElementById('statOrders').textContent = user.orders_count || 0;
    }
    
    /**
     * Load user's products from API
     */
    async function loadMyProducts() {
        try {
            var userId = getCurrentUserId();
            if (!userId) {
                document.getElementById('myProductsGrid').innerHTML = '';
                document.getElementById('emptyState').style.display = 'block';
                return;
            }
            
            // Show skeleton
            renderSkeletons('myProductsGrid', 4);
            
            // Fetch products with seller_id filter
            var response = await BikeApi.request('/products?seller_id=' + userId);
            myProducts = BikeApi.pickList(response);
            
            // Update product count
            document.getElementById('statProducts').textContent = myProducts.length;
            
            // Render products
            renderMyProducts();
            
        } catch (error) {
            console.error('Error loading products:', error);
            showToast('Không thể tải danh sách sản phẩm', 'error');
            
            document.getElementById('myProductsGrid').innerHTML = '';
            document.getElementById('emptyState').style.display = 'block';
        }
    }
    
    /**
     * Render user's products
     */
    function renderMyProducts() {
        var grid = document.getElementById('myProductsGrid');
        var emptyState = document.getElementById('emptyState');
        
        // Filter by tab
        var filtered = myProducts;
        if (currentTab === 'active') {
            filtered = myProducts.filter(function(p) { return p.status !== 'sold'; });
        } else if (currentTab === 'sold') {
            filtered = myProducts.filter(function(p) { return p.status === 'sold'; });
        }
        
        if (!filtered || filtered.length === 0) {
            grid.innerHTML = '';
            emptyState.style.display = 'block';
            if (currentTab === 'active') {
                emptyState.querySelector('h4').textContent = 'Không có sản phẩm đang bán';
            } else if (currentTab === 'sold') {
                emptyState.querySelector('h4').textContent = 'Chưa có sản phẩm nào đã bán';
            } else {
                emptyState.querySelector('h4').textContent = 'Chưa có sản phẩm nào';
            }
            return;
        }
        
        emptyState.style.display = 'none';
        
        var html = '';
        filtered.forEach(function(product) {
            var imageSrc = product.image || 'assets/images/f6.png';
            var price = formatCurrency(product.price);
            var name = product.name || 'Không rõ tên';
            var statusBadge = product.status === 'sold' 
                ? '<span class="badge badge-danger" style="font-size: 11px;">Đã bán</span>'
                : '<span class="badge badge-success" style="font-size: 11px;">Đang bán</span>';
            
            html += '<div class="col-md-6">' +
                '<div class="product-card">' +
                    '<img src="' + imageSrc + '" alt="' + name + '" class="product-img" loading="lazy" />' +
                    '<div class="product-body">' +
                        '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">' +
                            '<h5 class="product-name" style="margin: 0;">' + name + '</h5>' +
                            statusBadge +
                        '</div>' +
                        '<div class="product-price">' + price + '</div>' +
                        '<div class="product-actions">' +
                            '<a href="create_product.php?edit_id=' + (product.id || '') + '" class="btn-edit">' +
                                '<i class="fa fa-edit"></i> Sửa' +
                            '</a>' +
                            '<button class="btn-delete" data-id="' + (product.id || '') + '" data-name="' + name + '">' +
                                '<i class="fa fa-trash"></i> Xóa' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        });
        
        grid.innerHTML = html;
        
        // Attach delete event listeners
        grid.querySelectorAll('.btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = this.getAttribute('data-id');
                var name = this.getAttribute('data-name');
                deleteProduct(id, name);
            });
        });
    }
    
    /**
     * Delete product
     */
    async function deleteProduct(id, name) {
        if (!confirmAction('Bạn có chắc chắn muốn xóa sản phẩm "' + name + '"?')) {
            return;
        }
        
        try {
            showLoading();
            
            await BikeApi.request('/products/' + id, {
                method: 'DELETE',
                auth: true
            });
            
            hideLoading();
            showToast('Đã xóa sản phẩm "' + name + '"', 'success');
            
            // Reload products
            await loadMyProducts();
            
        } catch (error) {
            hideLoading();
            console.error('Error deleting product:', error);
            showToast('Không thể xóa sản phẩm: ' + error.message, 'error');
        }
    }
    
    /**
     * Update user profile
     */
    async function updateProfile(e) {
        e.preventDefault();
        
        var name = document.getElementById('editName').value.trim();
        var phone = document.getElementById('editPhone').value.trim();
        var avatarFile = document.getElementById('avatarInput').files[0];
        
        if (!name) {
            showToast('Vui lòng nhập họ tên', 'error');
            return;
        }
        
        try {
            var btn = document.getElementById('btnUpdateProfile');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Đang cập nhật...';
            
            // Prepare FormData
            var formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            
            // Call API
            var response = await BikeApi.request('/user/update', {
                method: 'POST',
                body: formData,
                auth: true
            });
            
            // Update localStorage
            var user = getCurrentUser();
            if (user) {
                user.name = name;
                user.phone = phone;
                if (response.avatar) {
                    user.avatar = response.avatar;
                }
                localStorage.setItem('current_user', JSON.stringify(user));
            }
            
            hideLoading();
            showToast('Cập nhật thông tin thành công!', 'success');
            
            // Update UI
            document.getElementById('profileName').textContent = name;
            if (response.avatar) {
                document.getElementById('profileAvatar').src = response.avatar;
                document.getElementById('avatarPreview').src = response.avatar;
            }
            
        } catch (error) {
            hideLoading();
            console.error('Error updating profile:', error);
            showToast('Không thể cập nhật: ' + error.message, 'error');
        } finally {
            var btn = document.getElementById('btnUpdateProfile');
            btn.disabled = false;
            btn.innerHTML = '<i class="fa fa-save"></i> Cập nhật thông tin';
        }
    }
    
    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                currentTab = this.getAttribute('data-tab');
                renderMyProducts();
            });
        });
        
        // Profile form
        document.getElementById('profileForm').addEventListener('submit', updateProfile);
        
        // Avatar preview
        previewImage('avatarInput', 'avatarPreview');
    }
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', initProfile);
})();
</script>

<?php
include __DIR__ . '/../includes/scripts.php';
?>