/**
 * Bike Market - Product Detail Logic
 */

(function () {
  "use strict";

  async function initDetail() {
    const api = window.BikeApi;
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    if (!productId || productId === "demo") return;

    try {
      const res = await api.getProduct(productId);
      const p = res.data;
      if (!p) return;

      // Basic Info
      document.getElementById("mainProductImg").src = api.resolveImageUrl(p.image_url);
      document.title = p.name + " - Bike Market";
      document.getElementById("breadcrumbName").textContent = p.name;
      document.getElementById("productName").textContent = p.name;
      document.getElementById("productPrice").textContent = api.formatCurrency(p.price);
      document.getElementById("productBadge").textContent = p.category_name || "Xe đạp";
      document.getElementById("productDesc").textContent = p.description;

      // Seller Info
      document.getElementById("sellerName").textContent = p.seller_name || "Người bán";
      document.getElementById("sellerLocation").textContent = p.seller_city || "Toàn quốc";

      // Specs
      document.getElementById("specBrand").textContent = p.brand || "N/A";
      document.getElementById("specFrame").textContent = p.frame || "N/A";
      document.getElementById("specWheel").textContent = p.wheel || "N/A";
      document.getElementById("specGroupset").textContent = p.groupset || "N/A";
      document.getElementById("specBrake").textContent = p.brake || "N/A";
      document.getElementById("specCondition").textContent = p.condition || "Đã qua sử dụng";

      // Contact Actions
      const phone = p.seller_phone || "";
      if (phone) {
          const btnCall = document.getElementById("btnCall");
          const btnCallSticky = document.getElementById("btnCallSticky");
          const btnZalo = document.getElementById("btnZalo");
          
          if (btnCall) btnCall.href = "tel:" + phone;
          if (btnCallSticky) btnCallSticky.href = "tel:" + phone;
          if (btnZalo) btnZalo.href = "https://zalo.me/" + phone;
      } else {
          document.querySelectorAll("#btnCall, #btnCallSticky, #btnZalo").forEach(el => el.classList.add("d-none"));
      }

      // Related Products (Mock for now or fetch by category)
      loadRelatedProducts(p.category_id, productId);

    } catch (e) {
      console.error("Lỗi tải chi tiết sản phẩm:", e);
    }
  }

  async function loadRelatedProducts(categoryId, excludeId) {
    const api = window.BikeApi;
    const grid = document.getElementById("relatedProductsGrid");
    if (!grid) return;

    try {
        const res = await api.getProducts({ category_id: categoryId, limit: 4 });
        const items = api.pickList(res).filter(item => item.id != excludeId).slice(0, 3);
        
        if (items.length) {
            grid.innerHTML = "";
            items.forEach(item => {
                grid.appendChild(window.renderProductCard(item));
            });
        } else {
            grid.innerHTML = '<div class="col-12 text-center text-muted">Không có sản phẩm tương tự.</div>';
        }
    } catch (e) {
        grid.innerHTML = "";
    }
  }

  document.addEventListener("DOMContentLoaded", initDetail);
})();
