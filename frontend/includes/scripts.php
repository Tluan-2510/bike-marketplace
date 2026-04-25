<!-- JavaScript Files -->
<script src="assets/js/jquery-3.4.1.min.js"></script>
<script src="assets/js/bootstrap.js"></script>
<script src="assets/js/custom.js"></script>
<script src="assets/js/api-client.js"></script>

<script>
/**
 * Utility Functions for Bike Marketplace
 * Includes skeleton loading, toast notifications, and API helpers
 */

// Set API Base URL
window.BIKE_API_BASE_URL = 'http://localhost:8080/api';

/**
 * Show toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', or 'info'
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    var toast = document.getElementById('toastNotification');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast-notification ' + type;
    
    // Show toast
    setTimeout(function() {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after duration
    setTimeout(function() {
        toast.classList.remove('show');
    }, duration);
}

/**
 * Show loading overlay
 */
function showLoading() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

/**
 * Render skeleton cards for loading state
 * @param {string} containerId - The ID of the container element
 * @param {number} count - Number of skeleton cards to render
 */
function renderSkeletons(containerId, count) {
    var container = document.getElementById(containerId);
    if (!container) return;
    
    var skeletonHTML = '';
    for (var i = 0; i < count; i++) {
        skeletonHTML += '<div class="col-sm-6 col-lg-4">' +
            '<div class="skeleton-card">' +
                '<div class="skeleton-img"></div>' +
                '<div class="skeleton-title"></div>' +
                '<div class="skeleton-text"></div>' +
                '<div class="skeleton-text short"></div>' +
                '<div class="skeleton-price"></div>' +
            '</div>' +
        '</div>';
    }
    
    container.innerHTML = skeletonHTML;
}

/**
 * Format currency in Vietnamese Dong
 * @param {number} value - The price value
 * @returns {string} Formatted price string
 */
function formatCurrency(value) {
    var amount = Number(value || 0);
    return amount.toLocaleString('vi-VN') + 'đ';
}

/**
 * Get current user from localStorage
 * @returns {object|null} User object or null
 */
function getCurrentUser() {
    try {
        var userStr = localStorage.getItem('current_user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
}

/**
 * Get current user ID
 * @returns {number|null} User ID or null
 */
function getCurrentUserId() {
    var user = getCurrentUser();
    return user ? (user.id || user.user_id || null) : null;
}

/**
 * Format date to Vietnamese format
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDateVN(dateStr) {
    if (!dateStr) return '-';
    var date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Confirm action with custom message
 * @param {string} message - Confirmation message
 * @returns {boolean} True if confirmed
 */
function confirmAction(message) {
    return window.confirm(message || 'Bạn có chắc chắn muốn thực hiện hành động này?');
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
    var user = getCurrentUser();
    if (!user) {
        showToast('Vui lòng đăng nhập để tiếp tục', 'error');
        setTimeout(function() {
            window.location.href = 'pages/login.php';
        }, 1500);
        return false;
    }
    return true;
}

/**
 * Preview image before upload
 * @param {string} inputId - Input file element ID
 * @param {string} previewId - Preview image element ID
 */
function previewImage(inputId, previewId) {
    var input = document.getElementById(inputId);
    var preview = document.getElementById(previewId);
    
    if (!input || !preview) return;
    
    input.addEventListener('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
    });
}

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// Update current year in footer
document.addEventListener('DOMContentLoaded', function() {
    var yearSpan = document.getElementById('displayYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
</script>