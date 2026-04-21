(function () {
  "use strict";

  const BikeApi = window.BikeApi;

  async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
      window.location.href = "./products.html";
      return;
    }

    if (productId === 'demo') {
      renderProduct({
        id: 'demo',
        name: 'Specialized Tarmac SL7 Pro - 2023',
        price: 145000000,
        category_name: 'Road Bike',
        description: 'Dòng xe đua đỉnh cao, khung carbon siêu nhẹ, bộ truyền động Shimano Ultegra Di2. Xe còn mới 99%.',
        brand_name: 'Specialized',
        frame_material: 'Carbon',
        wheel_size: '700c',
        groupset: 'Shimano Ultegra Di2',
        brake_type: 'Disc',
        condition_state: 'Like New',
        seller_name: 'Bike Market Official',
        location: 'TP. Hồ Chí Minh',
        image_url: '../assets/images/demo-bike.png',
        images: []
      });
      return;
    }

    try {
      const response = await BikeApi.getProduct(productId);
      const product = response.data;

      if (!product) throw new Error("Sản phẩm không tồn tại.");

      renderProduct(product);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      alert("Không thể tải thông tin sản phẩm: " + error.message);
    }
  }

  function renderProduct(product) {
    document.title = product.name + " - Bike Market";
    document.getElementById("breadcrumbName").textContent = product.name;
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productPrice").textContent = BikeApi.formatCurrency(product.price);
    document.getElementById("productBadge").textContent = product.category_name;
    document.getElementById("productDesc").textContent = product.description || "Không có mô tả.";

    // Specs
    document.getElementById("specBrand").textContent = product.brand_name || "N/A";
    document.getElementById("specFrame").textContent = product.frame_material || "N/A";
    document.getElementById("specWheel").textContent = product.wheel_size || "N/A";
    document.getElementById("specGroupset").textContent = product.groupset || "N/A";
    document.getElementById("specBrake").textContent = product.brake_type === 'Disc' ? 'Phanh đĩa' : 'Phanh vành';
    document.getElementById("specCondition").textContent = translateCondition(product.condition_state);

    // Seller
    document.getElementById("sellerName").textContent = product.seller_name || "Người bán ẩn danh";
    document.getElementById("sellerLocation").textContent = product.location || "Toàn quốc";

    // Images
    const mainImg = document.getElementById("mainProductImg");
    const thumbContainer = document.getElementById("imageThumbnails");
    
    const allImages = product.images || [];
    const firstImg = allImages.length > 0 ? allImages[0].image_url : product.image_url;
    
    mainImg.src = BikeApi.resolveImageUrl(firstImg);

    if (allImages.length > 1) {
      thumbContainer.innerHTML = "";
      allImages.forEach(img => {
        const t = document.createElement("img");
        t.src = BikeApi.resolveImageUrl(img.image_url);
        t.className = "img-thumbnail mr-2 mb-2 cursor-pointer";
        t.style.width = "80px";
        t.style.height = "80px";
        t.style.objectFit = "cover";
        t.onclick = () => { mainImg.src = t.src; };
        thumbContainer.appendChild(t);
      });
    }

    // Buttons
    const btnBuy = document.getElementById("btnBuyRequest");
    btnBuy.onclick = () => {
      const token = BikeApi.getAuthToken();
      if (!token) {
        alert("Vui lòng đăng nhập để gửi yêu cầu mua xe.");
        window.location.href = "./login.html";
        return;
      }
      $('#buyRequestModal').modal('show');
    };

    const btnFav = document.getElementById("btnFavorite");
    btnFav.onclick = () => toggleFavorite(product.id, btnFav);
  }

  function translateCondition(c) {
    const map = { 'New': 'Mới 100%', 'Like New': 'Như mới', 'Good': 'Tốt', 'Fair': 'Khá' };
    return map[c] || c;
  }

  async function toggleFavorite(productId, btn) {
    try {
      const response = await BikeApi.toggleFavorite(productId);
      const icon = btn.querySelector("i");
      if (response.message.includes("đã thêm")) {
        icon.className = "fa-solid fa-heart text-danger";
        btn.classList.add("bg-warning");
      } else {
        icon.className = "fa-light fa-heart";
        btn.classList.remove("bg-warning");
      }
    } catch (error) {
       if (error.status === 401) {
          alert("Vui lòng đăng nhập để lưu sản phẩm yêu thích.");
       } else {
          console.error("Lỗi khi yêu thích:", error);
       }
    }
  }

  async function handleBuyRequest(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const form = e.target;
    const messageBox = document.getElementById("modalMessage");
    const message = form.querySelector('textarea[name="message"]').value;

    try {
      const response = await BikeApi.sendBuyRequest({
        product_id: productId,
        message: message
      });

      if (response.success) {
        messageBox.textContent = "Gửi yêu cầu thành công! Người bán sẽ sớm liên hệ với bạn.";
        messageBox.className = "alert alert-success";
        messageBox.classList.remove("d-none");
        setTimeout(() => {
          $('#buyRequestModal').modal('hide');
        }, 2000);
      }
    } catch (error) {
      messageBox.textContent = error.message;
      messageBox.className = "alert alert-danger";
      messageBox.classList.remove("d-none");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadProductDetail();
    const buyForm = document.getElementById("buyRequestForm");
    if (buyForm) buyForm.addEventListener("submit", handleBuyRequest);
  });
})();
