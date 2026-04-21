(function () {
  "use strict";

  const BikeApi = window.BikeApi;

  async function loadHomeProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    try {
      const response = await BikeApi.getProducts({ limit: 6, sort: 'newest' });
      const products = BikeApi.pickList(response);

      if (products.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><p>Hiện chưa có xe nào được đăng bán.</p></div>';
        return;
      }

      grid.innerHTML = "";
      products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
      });
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm trang chủ:", error);
      grid.innerHTML = '<div class="col-12 text-center py-5 text-danger"><p>Không thể tải danh sách xe. Vui lòng thử lại sau.</p></div>';
    }
  }

  function createProductCard(product) {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4 mb-4";
    
    const imageUrl = BikeApi.resolveImageUrl(product.image_url || (product.images && product.images[0] ? product.images[0].image_url : null));
    const price = BikeApi.formatCurrency(product.price);
    
    col.innerHTML = `
      <div class="box h-100 d-flex flex-column">
        <div class="img-box position-relative">
          <a href="./product-detail.html?id=${product.id}" class="d-block w-100 h-100">
            <img src="${imageUrl}" alt="${product.name}" class="img-fluid">
          </a>
          <div class="position-absolute" style="top: 10px; left: 10px;">
             <span class="badge badge-warning px-2 py-1 small">${product.category_name || 'Xe đạp'}</span>
          </div>
          <button class="fav-btn" data-id="${product.id}" title="Yêu thích">
             <i class="fa-light fa-heart"></i>
          </button>
        </div>
        <div class="detail-box flex-grow-1 d-flex flex-column">
          <div class="mb-1 small text-uppercase font-weight-bold text-muted" style="letter-spacing: 1px;">
            ${product.brand_name || 'Thương hiệu'}
          </div>
          <h5><a href="./product-detail.html?id=${product.id}" class="text-dark">${product.name}</a></h5>
          <p class="text-muted small mb-3" style="height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical;">
            ${product.description || 'Chưa có mô tả chi tiết.'}
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
    favBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleFavorite(product.id, favBtn);
    });

    return col;
  }

  async function toggleFavorite(productId, btn) {
    try {
      const response = await BikeApi.toggleFavorite(productId);
      const icon = btn.querySelector("i");
      if (response.message.includes("đã thêm")) {
        icon.className = "fa fa-heart text-danger";
      } else {
        icon.className = "fa fa-heart-o";
      }
    } catch (error) {
      if (error.status === 401) {
        alert("Vui lòng đăng nhập để lưu sản phẩm yêu thích.");
      } else {
        console.error("Lỗi khi yêu thích:", error);
      }
    }
  }

  // document.addEventListener("DOMContentLoaded", loadHomeProducts);
})();
