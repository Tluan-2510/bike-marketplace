(function () {
  "use strict";

  const BikeApi = window.BikeApi;

  async function loadHomeProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
      const response = await BikeApi.getProducts({ limit: 6, sort: "newest" });
      const products = BikeApi.pickList(response);

      if (products.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><p>Hiện chưa có xe nào được đăng bán.</p></div>';
        return;
      }

      const favoriteIds = await loadFavoriteIds();
      grid.innerHTML = "";
      products.forEach((product) => {
        grid.appendChild(createProductCard(product, favoriteIds));
      });
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm trang chủ:", error);
      grid.innerHTML = '<div class="col-12 text-center py-5 text-danger"><p>Không thể tải danh sách xe. Vui lòng thử lại sau.</p></div>';
    }
  }

  async function loadFavoriteIds() {
    if (!BikeApi.getAuthToken()) return new Set();
    try {
      const response = await BikeApi.getFavorites();
      return new Set(BikeApi.pickList(response).map((item) => String(item.id || item.product_id)));
    } catch (error) {
      console.error("Không thể tải danh sách yêu thích:", error);
      return new Set();
    }
  }

  function setFavoriteButtonState(btn, isActive) {
    btn.classList.toggle("active", Boolean(isActive));
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    btn.setAttribute("title", isActive ? "Bỏ yêu thích" : "Yêu thích");
  }

  function createProductCard(product, favoriteIds) {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4 mb-4";
    col.dataset.name = [product.name, product.title, product.brand_name, product.description].join(" ");
    col.dataset.category = resolveCategoryKey(product);
    col.dataset.price = Number(product.price || 0);

    const imageUrl = BikeApi.resolveImageUrl(product.image_url || (product.images && product.images[0] ? product.images[0].image_url : null));
    const price = BikeApi.formatCurrency(product.price);

    col.innerHTML = `
      <div class="box h-100 d-flex flex-column">
        <div class="img-box position-relative">
          <a href="./product-detail.html?id=${product.id}" class="d-block w-100 h-100">
            <img src="${imageUrl}" alt="${product.name || product.title || "Xe đạp"}" class="img-fluid">
          </a>
          <div class="position-absolute product-badge-wrap">
             <span class="badge badge-warning px-2 py-1 small">${product.category_name || "Xe đạp"}</span>
          </div>
          <button class="fav-btn" data-id="${product.id}" type="button" aria-label="Yêu thích" aria-pressed="false"></button>
        </div>
        <div class="detail-box flex-grow-1 d-flex flex-column">
          <div class="mb-1 small text-uppercase font-weight-bold text-muted" style="letter-spacing: 1px;">
            ${product.brand_name || "Thương hiệu"}
          </div>
          <h5><a href="./product-detail.html?id=${product.id}" class="text-dark">${product.name || product.title}</a></h5>
          <p class="text-muted small mb-3" style="height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical;">
            ${product.description || "Chưa có mô tả chi tiết."}
          </p>
          <div class="mt-auto">
             <div class="d-flex justify-content-between align-items-center options">
                <h6 class="mb-0">${price}</h6>
                <a href="./product-detail.html?id=${product.id}" class="btn-view-detail">Chi tiết</a>
             </div>
          </div>
        </div>
      </div>
    `;

    const favBtn = col.querySelector(".fav-btn");
    setFavoriteButtonState(favBtn, favoriteIds.has(String(product.id)));
    favBtn.addEventListener("click", (event) => {
      event.preventDefault();
      toggleFavorite(product.id, favBtn);
    });

    return col;
  }

  async function toggleFavorite(productId, btn) {
    try {
      const nextActive = !btn.classList.contains("active");
      await BikeApi.toggleFavorite(productId, nextActive ? "add" : "remove");
      setFavoriteButtonState(btn, nextActive);
    } catch (error) {
      if (error.status === 401 || String(error.message || "").includes("người dùng")) {
        alert("Vui lòng đăng nhập để lưu sản phẩm yêu thích.");
      } else {
        console.error("Lỗi khi yêu thích:", error);
      }
    }
  }

  function resolveCategoryKey(product) {
    const raw = String(product.category_slug || product.category_name || product.category_id || "").toLowerCase();
    if (raw.includes("mtb") || raw.includes("địa hình") || raw === "1") return "mtb";
    if (raw.includes("road") || raw.includes("đua") || raw === "2") return "road";
    if (raw.includes("touring") || raw === "3") return "touring";
    if (raw.includes("fixed") || raw === "4") return "fixed";
    if (raw.includes("bmx") || raw === "5") return "bmx";
    return "other";
  }

  document.addEventListener("DOMContentLoaded", loadHomeProducts);
})();
