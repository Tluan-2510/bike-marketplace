(function () {
  "use strict";

  const BikeApi = window.BikeApi;

  // Authentication Check
  function checkAuth() {
    const token = BikeApi ? BikeApi.getAuthToken() : localStorage.getItem('access_token');
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("auth_user"));
    } catch (e) {
      console.error("Lỗi khi đọc thông tin user từ localStorage");
    }

    if (!token && !user) {
      window.location.href = "./login.html";
      return null;
    }

    if (!user) {
      // Fallback mock user if missing but token exists
      user = { id: 1, name: "Người dùng mới", email: "user@example.com", phone: "", address: "" };
    }
    return user;
  }

  function getUserDisplayName(user) {
    return user.full_name || user.name || user.username || "Người dùng";
  }

  function getUserPhone(user) {
    return user.phone_number || user.phone || "";
  }

  // Render User Information
  function renderUserInfo(user) {
    const displayName = getUserDisplayName(user);
    document.getElementById("userName").textContent = displayName;
    document.getElementById("userEmail").textContent = user.email || "";
    
    // Avatar generation
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'U')}&background=FFD700&color=000&size=150`;
    document.getElementById("userAvatar").src = avatarUrl;

    // Fill settings form
    document.getElementById("inputName").value = displayName;
    document.getElementById("inputEmail").value = user.email || "";
    if (document.getElementById("inputPhone")) {
       document.getElementById("inputPhone").value = getUserPhone(user);
    }
  }

  // Handle Logout
  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    window.location.href = "./login.html";
  }

  // Load User Listings (Mock logic since API might not have getMyListings yet)
  async function loadUserListings(user) {
    const container = document.getElementById("myListingsContainer");
    const recentContainer = document.getElementById("recentListingsContainer");
    
    try {
      // Fetch all products, assuming backend might support filtering by seller_id later
      // For now, if no API, we just show empty state
      if (!BikeApi) throw new Error("API Client không khả dụng");
      
      const res = await BikeApi.getProducts();
      const allProducts = res.data || [];
      
      // Filter products by this user's ID
      // If user.id is not matched, it returns empty array
      const userId = String(user.id || user.user_id || "");
      const myProducts = allProducts.filter(p => String(p.seller_id || "") === userId);

      document.getElementById("statListings").textContent = myProducts.length;

      if (myProducts.length === 0) {
        container.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="fa-light fa-box-open fa-3x text-muted mb-3"></i>
            <p class="text-muted">Bạn chưa đăng bán sản phẩm nào.</p>
            <a href="./create_product.html" class="btn-premium mt-2">Đăng bán xe ngay</a>
          </div>
        `;
        return;
      }

      let html = "";
      myProducts.forEach(product => {
        const imageUrl = BikeApi.resolveImageUrl(product.image_url);
        const price = BikeApi.formatCurrency(product.price);
        
        html += `
          <div class="col-sm-6 col-md-4 mb-4">
            <div class="box h-100 d-flex flex-column">
              <div class="img-box position-relative" style="height: 200px;">
                <a href="./product-detail.html?id=${product.id}" class="d-block w-100 h-100">
                  <img src="${imageUrl}" alt="${product.name}" class="img-fluid h-100 w-100" style="object-fit: contain;">
                </a>
              </div>
              <div class="detail-box flex-grow-1 d-flex flex-column p-3">
                <div class="mb-1 small text-muted">${product.category_name || 'Khác'}</div>
                <h6 class="font-weight-bold mb-2 text-truncate">${product.name}</h6>
                <div class="mt-auto d-flex justify-content-between align-items-center">
                   <span class="font-weight-bold text-dark">${price}</span>
                   <a href="./product-detail.html?id=${product.id}" class="badge badge-warning px-2 py-1">Chi tiết</a>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
      
      // Update recent listings on Dashboard tab
      const recentHtml = myProducts.slice(0, 3).map(product => {
         return `
          <div class="col-md-4 mb-3">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body p-3">
                <div class="font-weight-bold text-truncate mb-1">${product.name}</div>
                <div class="text-muted small">${BikeApi.formatCurrency(product.price)}</div>
              </div>
            </div>
          </div>
         `;
      }).join("");

      recentContainer.innerHTML = recentHtml;
      const recentEmpty = document.getElementById("recentListingsEmpty");
      if (recentEmpty) {
        recentEmpty.classList.add("d-none");
      }

    } catch (error) {
      console.error("Lỗi khi tải danh sách xe đang bán:", error);
      container.innerHTML = `<div class="col-12 text-center py-4 text-danger">Không thể tải danh sách sản phẩm.</div>`;
    }
  }

  // Load User Favorites Count
  async function loadFavoritesCount() {
    try {
      if (!BikeApi) return;
      const res = await BikeApi.getFavorites();
      const count = (res.data || []).length;
      document.getElementById("statFavorites").textContent = count;
    } catch (error) {
      console.error("Lỗi khi tải số lượng yêu thích:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const user = checkAuth();
    if (!user) return; // Will redirect

    renderUserInfo(user);
    loadUserListings(user);
    loadFavoritesCount();

    // Event Listeners
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
      btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        handleLogout();
      });
    }

    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Tính năng cập nhật thông tin đang được phát triển.");
      });
    }

    document.querySelectorAll("[data-profile-tab]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const tab = document.getElementById(link.getAttribute("data-profile-tab"));
        if (tab && window.jQuery) {
          window.jQuery(tab).tab("show");
        }
      });
    });

    const hash = window.location.hash;
    if (hash) {
      const tabLink = document.querySelector(`[data-toggle="pill"][href="${hash}"]`);
      if (tabLink && window.jQuery) {
        window.jQuery(tabLink).tab("show");
      }
    }
  });

})();
