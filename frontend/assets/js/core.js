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
    if (!userId) throw new Error("Thieu thong tin nguoi dung");
    return userId;
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

    if (status === 401) return "Ban can dang nhap de tiep tuc.";
    if (status === 404) return "API khong ton tai tren backend hien tai.";
    if (status === 405) return "Sai phuong thuc goi API.";
    if (status >= 500) return "Backend dang loi hoac chua ket noi database.";
    return "Yeu cau khong thanh cong.";
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
        if (!token) throw new Error("Ban can dang nhap de tiep tuc.");
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
      if (error.name === "AbortError") throw new Error("Ket noi qua thoi gian.");
      if (error instanceof TypeError) throw new Error("Khong the ket noi den backend API.");
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
    getProducts: (params) => request("/products" + (params ? "?" + new URLSearchParams(params).toString() : "")),
    getProduct: (id) => request("/products?id=" + encodeURIComponent(id)),
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

      try {
        var isActive = button.classList.contains("active");
        await window.BikeApi.toggleFavorite(productId, isActive ? "remove" : "add");
        button.classList.toggle("active", !isActive);

        var icon = button.querySelector("i");
        if (icon) {
          icon.className = !isActive ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart";
        }
      } catch (error) {
        if (error.status === 401 || /dang nhap/i.test(error.message)) {
          alert("Vui long dang nhap de luu tin.");
          window.location.href = "./login.html";
        } else {
          alert(error.message);
        }
      }
    });
  }

  window.renderProductCard = function (product) {
    var title = product.title || product.name || "Xe dap";
    var imageUrl = resolveImageUrl(
      product.image_url ||
      product.primary_image ||
      (product.images && product.images[0] && product.images[0].image_url)
    );
    var price = formatCurrency(product.price);

    var column = document.createElement("div");
    column.className = "col-6 col-md-6 col-lg-4 mb-4";
    column.innerHTML = `
      <div class="box h-100 d-flex flex-column shadow-sm border rounded overflow-hidden">
        <div class="img-box position-relative" style="height: 200px; overflow: hidden;">
          <a href="./product-detail.html?id=${product.id}" class="d-block w-100 h-100">
            <img src="${imageUrl}" alt="${title}" class="img-fluid w-100 h-100" style="object-fit: cover;">
          </a>
          <button class="fav-btn" data-id="${product.id}" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.8); border: none; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;"><i class="fa-regular fa-heart"></i></button>
        </div>
        <div class="detail-box flex-grow-1 d-flex flex-column p-3">
          <div class="small text-muted text-truncate mb-1">${product.brand_name || "Thuong hieu"}</div>
          <h6 class="mb-1 text-truncate"><a href="./product-detail.html?id=${product.id}" class="text-dark font-weight-bold">${title}</a></h6>
          <div class="mt-auto pt-2 border-top">
            <h6 class="mb-0 font-weight-bold text-warning">${price}</h6>
          </div>
        </div>
      </div>
    `;

    return column;
  };

  document.addEventListener("DOMContentLoaded", initGlobalUI);
})();
