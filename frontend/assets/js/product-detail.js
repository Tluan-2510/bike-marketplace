(function () {
  "use strict";

  if (!window.BikeApi) return;

  var elements = {
    message: document.getElementById("productDetailMessage"),
    image: document.getElementById("productDetailImage"),
    name: document.getElementById("productDetailName"),
    price: document.getElementById("productDetailPrice"),
    category: document.getElementById("productDetailCategory"),
    quantity: document.getElementById("productDetailQuantity"),
    status: document.getElementById("productDetailStatus"),
    seller: document.getElementById("productDetailSeller"),
    description: document.getElementById("productDetailDescription"),
    favoriteButton: document.getElementById("favoriteToggleButton"),
    favoriteLabel: document.getElementById("favoriteToggleLabel"),
    reviewsLoading: document.getElementById("reviewsLoading"),
    reviewsEmpty: document.getElementById("reviewsEmpty"),
    reviewsList: document.getElementById("reviewsList"),
  };

  var state = {
    productId: null,
    isFavorite: false,
    product: null,
  };

  function showMessage(text, type) {
    if (!elements.message) return;
    elements.message.textContent = text;
    elements.message.className = "alert alert-" + (type === "success" ? "success" : "danger");
  }

  function hideMessage() {
    if (!elements.message) return;
    elements.message.textContent = "";
    elements.message.className = "alert d-none";
  }

  function getProductIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    return id ? String(id).trim() : "";
  }

  function normalizeProduct(payload) {
    var data = payload && payload.data ? payload.data : payload;
    if (data && data.product) data = data.product;
    if (!data || typeof data !== "object") return null;

    return {
      id: data.id || data.product_id || state.productId,
      name: data.name || data.title || "Không rõ tên sản phẩm",
      price: Number(data.price || 0),
      category: data.category || data.type || "-",
      quantity: data.quantity || data.stock || "-",
      status: data.status || "-",
      description: data.description || data.content || "-",
      image:
        data.image_url ||
        data.image ||
        data.thumbnail ||
        "../assets/images/f1.png",
      seller:
        data.seller_name ||
        data.owner_name ||
        data.seller ||
        data.user_name ||
        "-",
    };
  }

  function renderProduct(product) {
    if (!product) return;
    state.product = product;

    if (elements.image) elements.image.src = product.image;
    if (elements.name) elements.name.textContent = product.name;
    if (elements.price) elements.price.textContent = window.BikeApi.formatCurrency(product.price);
    if (elements.category) elements.category.textContent = product.category;
    if (elements.quantity) elements.quantity.textContent = String(product.quantity);
    if (elements.status) elements.status.textContent = product.status;
    if (elements.seller) elements.seller.textContent = product.seller;
    if (elements.description) elements.description.textContent = product.description;
  }

  function normalizeReview(item) {
    return {
      user: item.user_name || item.username || item.user || "Người dùng",
      rating: Number(item.rating || 0),
      comment: item.comment || item.content || "",
      createdAt: item.created_at || item.createdAt || "",
    };
  }

  function renderReviews(list) {
    if (!elements.reviewsList || !elements.reviewsLoading || !elements.reviewsEmpty) return;
    elements.reviewsLoading.classList.add("d-none");
    elements.reviewsList.innerHTML = "";

    if (!list.length) {
      elements.reviewsEmpty.classList.remove("d-none");
      return;
    }

    elements.reviewsEmpty.classList.add("d-none");

    list.forEach(function (review) {
      var node = document.createElement("div");
      node.className = "border rounded p-3 mb-3";

      var stars = "";
      var rating = Math.max(0, Math.min(5, review.rating));
      for (var i = 0; i < 5; i += 1) {
        stars += i < rating ? "★" : "☆";
      }

      var createdText = review.createdAt ? " · " + review.createdAt : "";
      node.innerHTML =
        "<div><b>" +
        review.user +
        "</b> <span class=\"text-warning\">" +
        stars +
        "</span><span class=\"text-muted\">" +
        createdText +
        "</span></div>" +
        "<div class=\"mt-2\">" +
        (review.comment || "Không có nội dung đánh giá.") +
        "</div>";
      elements.reviewsList.appendChild(node);
    });
  }

  async function loadProduct() {
    var payload = await window.BikeApi.request("/products/" + state.productId, {
      method: "GET",
    });
    var product = normalizeProduct(payload);
    if (!product) {
      throw new Error("Không đọc được dữ liệu sản phẩm từ backend.");
    }
    renderProduct(product);
  }

  async function loadReviews() {
    try {
      var payload = await window.BikeApi.request("/reviews/" + state.productId, {
        method: "GET",
      });
      var list = window.BikeApi.pickList(payload).map(normalizeReview);
      renderReviews(list);
    } catch (error) {
      elements.reviewsLoading.classList.add("d-none");
      elements.reviewsEmpty.classList.remove("d-none");
      showMessage("Không thể tải đánh giá: " + error.message, "danger");
    }
  }

  function updateFavoriteButton() {
    if (!elements.favoriteLabel) return;
    elements.favoriteLabel.textContent = state.isFavorite
      ? "Bỏ yêu thích"
      : "Thêm yêu thích";
  }

  function isSameProduct(item, productId) {
    var candidate = String(item.id || item.product_id || item.productId || "");
    return candidate === String(productId);
  }

  async function loadFavoriteStatus() {
    if (!window.BikeApi.getAuthToken()) {
      state.isFavorite = false;
      updateFavoriteButton();
      return;
    }

    try {
      var payload = await window.BikeApi.request("/favorites", {
        method: "GET",
        auth: true,
      });
      var list = window.BikeApi.pickList(payload);
      state.isFavorite = list.some(function (item) {
        return isSameProduct(item, state.productId);
      });
      updateFavoriteButton();
    } catch (error) {
      state.isFavorite = false;
      updateFavoriteButton();
    }
  }

  async function addFavorite() {
    await window.BikeApi.request("/favorites", {
      method: "POST",
      auth: true,
      body: { product_id: state.productId },
    });
  }

  async function removeFavorite() {
    try {
      await window.BikeApi.request("/favorites/" + state.productId, {
        method: "DELETE",
        auth: true,
      });
      return;
    } catch (error) {
      if (error.status !== 404 && error.status !== 405) {
        throw error;
      }
    }

    await window.BikeApi.request("/favorites", {
      method: "POST",
      auth: true,
      body: { product_id: state.productId, action: "remove" },
    });
  }

  async function onFavoriteToggleClick() {
    hideMessage();

    if (!window.BikeApi.getAuthToken()) {
      showMessage("Bạn cần đăng nhập để sử dụng yêu thích.", "danger");
      return;
    }

    elements.favoriteButton.disabled = true;
    try {
      if (state.isFavorite) {
        await removeFavorite();
        state.isFavorite = false;
        showMessage("Đã bỏ sản phẩm khỏi yêu thích.", "success");
      } else {
        await addFavorite();
        state.isFavorite = true;
        showMessage("Đã thêm sản phẩm vào yêu thích.", "success");
      }
      updateFavoriteButton();
    } catch (error) {
      showMessage("Không thể cập nhật yêu thích: " + error.message, "danger");
    } finally {
      elements.favoriteButton.disabled = false;
    }
  }

  async function init() {
    state.productId = getProductIdFromUrl();
    if (!state.productId) {
      showMessage("Thiếu product id trên URL. Ví dụ: product-detail.html?id=1", "danger");
      if (elements.reviewsLoading) elements.reviewsLoading.classList.add("d-none");
      return;
    }

    if (elements.favoriteButton) {
      elements.favoriteButton.addEventListener("click", onFavoriteToggleClick);
    }

    hideMessage();

    try {
      await loadProduct();
    } catch (error) {
      showMessage("Không thể tải chi tiết sản phẩm: " + error.message, "danger");
    }

    await loadFavoriteStatus();
    await loadReviews();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
