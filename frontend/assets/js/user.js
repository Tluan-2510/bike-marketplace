(function () {
  "use strict";

  const BikeApi = window.BikeApi;

  // Authentication Check
  function checkAuth() {
    const token = BikeApi ? BikeApi.getAuthToken() : localStorage.getItem('access_token');
    if (!token) {
      window.location.href = "./login.html";
      return null;
    }
    
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("auth_user"));
    } catch (e) {
      console.error("Lỗi khi đọc thông tin user từ localStorage");
    }

    if (!user) {
      // Fallback mock user if missing but token exists
      user = { id: 1, name: "Người dùng mới", email: "user@example.com", phone: "", address: "" };
    }
    return user;
  }

  // Render User Information
  function renderUserInfo(user) {
    document.getElementById("userName").textContent = user.name || user.username || "Người Dùng";
    document.getElementById("userEmail").textContent = user.email || "";
    
    // Avatar generation
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=FFD700&color=000&size=150`;
    document.getElementById("userAvatar").src = avatarUrl;

    // Fill settings form
    document.getElementById("inputName").value = user.name || user.username || "";
    document.getElementById("inputEmail").value = user.email || "";
    if (document.getElementById("inputPhone")) {
       document.getElementById("inputPhone").value = user.phone || "";
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
      const myProducts = allProducts.filter(p => p.seller_id === user.id);

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
                <div class="position-absolute" style="top: 10px; right: 10px;">
                  <button class="btn btn-sm btn-light shadow-sm text-primary rounded-circle"><i class="fa-light fa-pen"></i></button>
                  <button class="btn btn-sm btn-light shadow-sm text-danger rounded-circle ml-1"><i class="fa-light fa-trash"></i></button>
                </div>
              </div>
              <div class="detail-box flex-grow-1 d-flex flex-column p-3">
                <div class="mb-1 small text-muted">${product.category_name || 'Khác'}</div>
                <h6 class="font-weight-bold mb-2 text-truncate">${product.name}</h6>
                <div class="mt-auto d-flex justify-content-between align-items-center">
                   <span class="font-weight-bold text-dark">${price}</span>
                   <span class="badge badge-success px-2 py-1">Đang bán</span>
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
      document.getElementById("recentListingsEmpty").classList.add("d-none");

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
  });

})();
