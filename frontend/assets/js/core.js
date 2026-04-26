/**
 * Bike Market - Core Utils
 * Shared API client and global UI interactions.
 */

(function () {
  "use strict";

  function trimSlashesRight(value) {
    return String(value || "").replace(/\/+$/, "");
  }

  function isLegacyInvalidApiBaseUrl(value) {
    return value === "http://localhost/api" || /\/backend\/api$/.test(value);
  }

  function resolveApiBaseUrl() {
    var fromWindow = trimSlashesRight(window.BIKE_API_BASE_URL || "");
    var fromStorage = "";

    try {
      fromStorage = trimSlashesRight(localStorage.getItem("bike_api_base_url") || "");
      if (isLegacyInvalidApiBaseUrl(fromStorage)) {
        localStorage.removeItem("bike_api_base_url");
        fromStorage = "";
      }
    } catch (error) {
      fromStorage = "";
    }

    if (fromWindow) return fromWindow;
    if (fromStorage) return fromStorage;
    return "http://localhost/bike-marketplace/backend/index.php?route=/api";
  }

  function buildApiUrl(path) {
    var cleanPath = String(path || "");
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

    var baseUrl = resolveApiBaseUrl();
    if (baseUrl.indexOf("?") !== -1) {
      var pathParts = cleanPath.split("?");
      var url = baseUrl + pathParts[0];
      if (pathParts[1]) url += "&" + pathParts[1];
      return url;
    }

    return baseUrl + cleanPath;
  }

  function getAuthToken() {
    try {
      return localStorage.getItem("access_token") || localStorage.getItem("token") || "";
    } catch (error) {
      return "";
    }
  }

  function getAuthUser() {
    try {
      return JSON.parse(localStorage.getItem("auth_user") || "null");
    } catch (error) {
      return null;
    }
  }

  function getAuthUserId() {
    var user = getAuthUser();
    return user ? (user.id || user.user_id || "") : "";
  }

  function requireAuthUserId() {
    var userId = getAuthUserId();
    if (!userId) throw new Error("Thiếu thông tin người dùng");
    return userId;
  }

  function showToast(message, type) {
    if (window.BikeToast && typeof window.BikeToast.show === "function") {
      return window.BikeToast.show(message, type);
    }
    return null;
  }

  function parseJSON(text) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return {};
    }
  }

  function normalizeApiError(payload, status) {
    if (payload && typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (status === 401) return "Bạn cần đăng nhập để tiếp tục.";
    if (status === 404) return "API không tồn tại trên backend hiện tại.";
    if (status === 405) return "Sai phương thức gọi API.";
    if (status >= 500) return "Backend đang lỗi hoặc chưa kết nối database.";
    return "Yêu cầu không thành công.";
  }

  async function request(path, options) {
    var config = options || {};
    var method = config.method || "GET";
    var body = config.body;
    var auth = Boolean(config.auth);
    var timeoutMs = Number(config.timeoutMs || 15000);

    var controller = new AbortController();
    var timer = window.setTimeout(function () {
      controller.abort();
    }, timeoutMs);

    try {
      var headers = { Accept: "application/json" };

      if (auth) {
        var token = getAuthToken();
        if (!token) throw new Error("Bạn cần đăng nhập để tiếp tục.");
        headers.Authorization = "Bearer " + token;
      }

      var requestBody = null;
      if (body instanceof FormData) {
        requestBody = body;
      } else if (typeof body !== "undefined") {
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify(body);
      }

      var response = await fetch(buildApiUrl(path), {
        method: method,
        headers: headers,
        body: requestBody,
        signal: controller.signal,
      });

      var raw = await response.text();
      var payload = parseJSON(raw);

      if (!response.ok || payload.success === false) {
        var error = new Error(normalizeApiError(payload, response.status));
        error.status = response.status;
        error.payload = payload;
        throw error;
      }

      return payload;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("Kết nối quá thời gian.");
      if (error instanceof TypeError) throw new Error("Không thể kết nối đến backend API.");
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  function pickList(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    if (Array.isArray(payload.data)) return payload.data;
    if (payload.data && Array.isArray(payload.data.items)) return payload.data.items;
    if (payload.data && Array.isArray(payload.data.data)) return payload.data.data;
    if (Array.isArray(payload.items)) return payload.items;
    return [];
  }

  function formatCurrency(value) {
    var amount = Number(value || 0);
    return amount.toLocaleString("vi-VN") + "đ";
  }

  function resolveImageUrl(path) {
    if (!path) return "../assets/images/placeholder-bike.png";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/backend/uploads/")) return "http://localhost/bike-marketplace" + path;
    if (path.startsWith("/bike-marketplace/")) return "http://localhost" + path;
    return "http://localhost/bike-marketplace/backend/uploads/" + path;
  }

  window.BikeApi = {
    resolveApiBaseUrl,
    buildApiUrl,
    getAuthToken,
    getAuthUser,
    getAuthUserId,
    requireAuthUserId,
    request,
    pickList,
    formatCurrency,
    resolveImageUrl,
    showToast,
    getProducts: (params) => request("/products" + (params ? "?" + new URLSearchParams(params).toString() : "")),
    getProduct: (id) => request("/products?id=" + encodeURIComponent(id)),
    getUser: (id) => request("/users?id=" + encodeURIComponent(id)),
    getCategories: () => request("/categories"),
    getBrands: () => request("/brands"),
    login: (data) => request("/auth/login", { method: "POST", body: data }),
    register: (data) => request("/auth/register", { method: "POST", body: data }),
    createProduct: (data) => request("/products", { method: "POST", body: data, auth: true }),
    sendBuyRequest: (data) => {
      var payload = Object.assign({}, data || {}, { buyer_id: requireAuthUserId() });
      return request("/buy-requests", { method: "POST", body: payload, auth: true });
    },
    getFavorites: () => request("/favorites?user_id=" + encodeURIComponent(requireAuthUserId()), { auth: true }),
    toggleFavorite: (productId, action) => request("/favorites", {
      method: "POST",
      body: {
        user_id: requireAuthUserId(),
        product_id: productId,
        action: action || "add"
      },
      auth: true
    })
  };

  function getHeartIconMarkup() {
    return [
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>',
      '</svg>'
    ].join("");
  }

  function initGlobalUI() {
    document.querySelectorAll(".nav_search-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        var searchSection = document.getElementById("tim-kiem");
        if (searchSection) {
          searchSection.scrollIntoView({ behavior: "smooth" });
          window.setTimeout(() => document.getElementById("searchKeyword")?.focus(), 500);
        } else {
          window.location.href = "./index.html#tim-kiem";
        }
      });
    });

    document.getElementById("btnLogout")?.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      window.location.href = "./login.html";
    });

    document.addEventListener("click", async (event) => {
      var button = event.target.closest(".fav-btn");
      if (!button) return;

      event.preventDefault();
      var productId = button.dataset.id;
      if (!productId) return;

      var userId = getAuthUserId();
      if (!userId) {
        showToast("Phiên đăng nhập hết hạn", "error");
        return;
      }

      var previousActive = button.classList.contains("active");
      var nextActive = !previousActive;
      updateFavoriteCardButton(button, nextActive);

      try {
        await window.BikeApi.toggleFavorite(productId, nextActive ? "add" : "remove");
        showToast(nextActive ? "Đã lưu vào yêu thích" : "Đã bỏ khỏi yêu thích", "success");
      } catch (error) {
        updateFavoriteCardButton(button, previousActive);
        showToast("Không thể cập nhật yêu thích lúc này.", "error");
      }
    });
  }

  function updateFavoriteCardButton(button, isActive) {
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
    button.setAttribute("aria-label", isActive ? "Bỏ yêu thích" : "Yêu thích");
  }

  window.renderProductCard = function (product) {
    var title = product.title || product.name || "Xe đạp";
    var imageUrl = resolveImageUrl(
      product.image_url ||
      product.primary_image ||
      (product.images && product.images[0] && product.images[0].image_url)
    );
    var price = formatCurrency(product.price);

    var isFavorite = Boolean(product.is_favorite || product.isFavorite || product.favorite_id);
    var column = document.createElement("div");
    column.className = "col-6 col-md-6 col-lg-4 mb-4";
    column.innerHTML = `
      <div class="box h-100 d-flex flex-column shadow-sm border rounded overflow-hidden">
        <div class="img-box product-card-media">
          <a href="./product-detail.html?id=${product.id}" class="product-card-link">
            <img src="${imageUrl}" alt="${title}" class="img-fluid product-card-image">
          </a>
          <button class="fav-btn${isFavorite ? " active" : ""}" data-id="${product.id}" aria-pressed="${isFavorite ? "true" : "false"}" aria-label="${isFavorite ? "Bỏ yêu thích" : "Yêu thích"}">
            <span class="fav-btn-icon" aria-hidden="true">${getHeartIconMarkup()}</span>
          </button>
        </div>
        <div class="detail-box flex-grow-1 d-flex flex-column p-3">
          <div class="small text-muted text-truncate mb-1">${product.brand_name || "Thương hiệu"}</div>
          <h6 class="mb-1 text-truncate"><a href="./product-detail.html?id=${product.id}" class="text-dark font-weight-bold">${title}</a></h6>
          <div class="mt-auto pt-2 border-top">
            <h6 class="mb-0 font-weight-bold text-warning product-card-price">${price}</h6>
          </div>
        </div>
      </div>
    `;

    return column;
  };

  document.addEventListener("DOMContentLoaded", initGlobalUI);
})();
