(function () {
  "use strict";

  const BikeApi = window.BikeApi;

  async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
      window.location.href = "./products.html";
      return;
    }

    if (productId === "demo") {
      const demoProduct = {
        id: "demo",
        name: "Specialized Tarmac SL7 Pro - 2023",
        price: 145000000,
        category_name: "Road Bike",
        description: "Dòng xe đua hiệu năng cao, khung carbon nhẹ, bộ truyền động Shimano Ultegra Di2. Xe còn mới 99%.",
        brand_name: "Specialized",
        frame_material: "Carbon",
        wheel_size: "700c",
        groupset: "Shimano Ultegra Di2",
        brake_type: "Disc",
        condition_state: "Like New",
        seller_name: "Bike Market Official",
        location: "TP. Hồ Chí Minh",
        image_url: "../assets/images/demo-bike.png",
        images: []
      };
      renderProduct(demoProduct);
      setupFavoriteButton(demoProduct.id);
      return;
    }

    try {
      const response = await BikeApi.getProduct(productId);
      const product = response.data;

      if (!product) throw new Error("Sản phẩm không tồn tại.");

      renderProduct(product);
      await setupFavoriteButton(product.id);
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
    document.getElementById("productBadge").textContent = product.category_name || "Xe đạp";
    document.getElementById("productDesc").textContent = product.description || "Không có mô tả.";

    document.getElementById("specBrand").textContent = product.brand_name || "Chưa rõ";
    document.getElementById("specFrame").textContent = product.frame_material || "Chưa rõ";
    document.getElementById("specWheel").textContent = product.wheel_size || "Chưa rõ";
    document.getElementById("specGroupset").textContent = product.groupset || "Chưa rõ";
    document.getElementById("specBrake").textContent = product.brake_type === "Disc" ? "Phanh đĩa" : "Phanh vành";
    document.getElementById("specCondition").textContent = translateCondition(product.condition_state);

    document.getElementById("sellerName").textContent = product.seller_name || "Người bán ẩn danh";
    document.getElementById("sellerLocation").textContent = product.location || "Toàn quốc";

    const mainImg = document.getElementById("mainProductImg");
    const thumbContainer = document.getElementById("imageThumbnails");
    const allImages = product.images || [];
    const firstImg = allImages.length > 0 ? allImages[0].image_url : product.image_url;

    mainImg.src = BikeApi.resolveImageUrl(firstImg);

    if (allImages.length > 1) {
      thumbContainer.innerHTML = "";
      allImages.forEach((img) => {
        const thumb = document.createElement("img");
        thumb.src = BikeApi.resolveImageUrl(img.image_url);
        thumb.className = "img-thumbnail mr-2 mb-2 cursor-pointer";
        thumb.style.width = "80px";
        thumb.style.height = "80px";
        thumb.style.objectFit = "cover";
        thumb.onclick = () => {
          mainImg.src = thumb.src;
        };
        thumbContainer.appendChild(thumb);
      });
    }

    const btnBuy = document.getElementById("btnBuyRequest");
    btnBuy.onclick = () => {
      const token = BikeApi.getAuthToken();
      if (!token) {
        alert("Vui lòng đăng nhập để gửi yêu cầu mua xe.");
        window.location.href = "./login.html";
        return;
      }
      $("#buyRequestModal").modal("show");
    };
  }

  async function setupFavoriteButton(productId) {
    const btnFav = document.getElementById("btnFavorite");
    if (!btnFav) return;

    let isActive = false;
    if (BikeApi.getAuthToken() && productId !== "demo") {
      try {
        const response = await BikeApi.getFavorites();
        isActive = BikeApi.pickList(response).some((item) => String(item.id || item.product_id) === String(productId));
      } catch (error) {
        console.error("Không thể tải trạng thái lưu tin:", error);
      }
    }

    setFavoriteButtonState(btnFav, isActive);
    btnFav.onclick = () => toggleFavorite(productId, btnFav);
  }

  function setFavoriteButtonState(btn, isActive) {
    btn.classList.toggle("active", Boolean(isActive));
    btn.textContent = isActive ? "Đã lưu tin" : "Lưu tin này";
  }

  function translateCondition(condition) {
    const map = {
      New: "Mới 100%",
      "Like New": "Như mới",
      Good: "Tốt",
      Fair: "Khá",
      "Sử dụng tốt": "Sử dụng tốt",
      "Như mới": "Như mới",
      "Có hao mòn": "Có hao mòn"
    };
    return map[condition] || condition || "Chưa rõ";
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
        console.error("Lỗi khi lưu tin:", error);
      }
    }
  }

  async function handleBuyRequest(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const form = event.target;
    const messageBox = document.getElementById("modalMessage");
    const message = form.querySelector('textarea[name="message"]').value;

    try {
      const response = await BikeApi.sendBuyRequest({
        product_id: productId,
        message: message
      });

      if (response.success) {
        messageBox.textContent = "Gửi yêu cầu thành công. Người bán sẽ sớm liên hệ với bạn.";
        messageBox.className = "alert alert-success";
        messageBox.classList.remove("d-none");
        setTimeout(() => {
          $("#buyRequestModal").modal("hide");
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
