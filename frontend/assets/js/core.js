/**
 * Bike Market - Core Utils
 * Combined: api-client & global UI interactions
 */

(function () {
  "use strict";

  // --- API CLIENT ---
  function trimSlashesRight(value) {
    return String(value || "").replace(/\/+$/, "");
  }

  function resolveApiBaseUrl() {
    var fromWindow = trimSlashesRight(window.BIKE_API_BASE_URL || "");
    var fromStorage = "";
    try {
      fromStorage = trimSlashesRight(localStorage.getItem("bike_api_base_url") || "");
    } catch (e) { fromStorage = ""; }
    if (fromWindow) return fromWindow;
    if (fromStorage) return fromStorage;
    return "http://localhost/bike-marketplace/backend/api";
  }

  function buildApiUrl(path) {
    var cleanPath = String(path || "");
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
    return resolveApiBaseUrl() + cleanPath;
  }

  function getAuthToken() {
    try {
      return localStorage.getItem("access_token") || localStorage.getItem("token") || "";
    } catch (e) { return ""; }
  }

  function parseJSON(text) {
    try { return JSON.parse(text); } catch (e) { return {}; }
  }

  function normalizeApiError(payload, status) {
    if (payload && typeof payload.message === "string" && payload.message.trim()) return payload.message;
    if (payload && payload.errors && typeof payload.errors === "object") {
      var firstKey = Object.keys(payload.errors)[0];
      if (firstKey) {
        var firstError = payload.errors[firstKey];
        if (Array.isArray(firstError) && firstError.length) return String(firstError[0]);
        if (typeof firstError === "string") return firstError;
      }
    }
    if (status === 401) return "Vui lòng đăng nhập.";
    return "Yêu cầu không thành công.";
  }

  async function request(path, options) {
    var config = options || {};
    var method = config.method || "GET";
    var body = config.body;
    var auth = Boolean(config.auth);
    var controller = new AbortController();
    var timer = window.setTimeout(() => controller.abort(), config.timeoutMs || 15000);

    try {
      var headers = { Accept: "application/json" };
      if (auth) {
        var token = getAuthToken();
        if (!token) throw new Error("Vui lòng đăng nhập.");
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
        throw error;
      }
      return payload;
    } finally {
      window.clearTimeout(timer);
    }
  }

  window.BikeApi = {
    request,
    formatCurrency: (val) => Number(val || 0).toLocaleString("vi-VN") + "đ",
    resolveImageUrl: (path) => {
      if (!path) return "../assets/images/placeholder-bike.png";
      if (path.startsWith("http")) return path;
      return resolveApiBaseUrl().replace("/api", "/uploads") + "/" + path;
    },
    pickList: (p) => p?.data?.items || p?.data || p?.items || (Array.isArray(p) ? p : []),
    getProducts: (params) => request("/products" + (params ? "?" + new URLSearchParams(params).toString() : "")),
    getProduct: (id) => request("/products?id=" + id),
    getCategories: () => request("/categories"),
    getBrands: () => request("/brands"),
    toggleFavorite: (id) => request("/favorites", { method: "POST", body: { product_id: id }, auth: true }),
    getFavorites: () => request("/favorites", { auth: true }),
    getUserProfile: () => request("/user/profile", { auth: true }),
    updateProfile: (data) => request("/user/profile", { method: "POST", body: data, auth: true }),
    getMyProducts: () => request("/user/products", { auth: true }),
    createProduct: (data) => request("/products", { method: "POST", body: data, auth: true }),
    login: (data) => request("/auth/login", { method: "POST", body: data }),
    register: (data) => request("/auth/register", { method: "POST", body: data })
  };

  // --- SHARED UI LOGIC ---
  function initGlobalUI() {
    // Navbar Search Scroll
    document.querySelectorAll(".nav_search-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const searchSec = document.getElementById("tim-kiem");
        if (searchSec) {
            searchSec.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => document.getElementById("searchKeyword")?.focus(), 500);
        } else {
            window.location.href = "./index.html#tim-kiem";
        }
      });
    });

    // Logout
    document.getElementById("btnLogout")?.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("access_token");
      window.location.href = "./login.html";
    });

    // Favorite Toggle
    document.addEventListener("click", async e => {
      const btn = e.target.closest(".fav-btn");
      if (!btn) return;
      e.preventDefault();
      const id = btn.dataset.id;
      if (!id) return;
      try {
        const res = await window.BikeApi.toggleFavorite(id);
        const isAdded = res.message.includes("thêm");
        btn.classList.toggle("active", isAdded);
        const icon = btn.querySelector("i");
        if (icon) icon.className = isAdded ? "fa-solid fa-heart text-danger" : "fa-solid fa-heart";
      } catch (err) {
        if (err.status === 401) alert("Vui lòng đăng nhập để lưu tin.");
      }
    });
  }

  // Common Product Card Renderer
  window.renderProductCard = function(p) {
    const col = document.createElement("div");
    col.className = "col-6 col-md-6 col-lg-4 mb-4";
    const img = window.BikeApi.resolveImageUrl(p.image_url);
    const price = window.BikeApi.formatCurrency(p.price);
    col.innerHTML = `
      <div class="box h-100 d-flex flex-column shadow-sm border rounded overflow-hidden">
        <div class="img-box position-relative" style="height: 200px; overflow: hidden;">
          <a href="./product-detail.html?id=${p.id}" class="d-block w-100 h-100">
            <img src="${img}" alt="${p.name}" class="img-fluid w-100 h-100" style="object-fit: cover;">
          </a>
          <button class="fav-btn" data-id="${p.id}" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.8); border: none; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-heart"></i></button>
        </div>
        <div class="detail-box flex-grow-1 d-flex flex-column p-3">
          <h6 class="mb-1 text-truncate"><a href="./product-detail.html?id=${p.id}" class="text-dark font-weight-bold">${p.name}</a></h6>
          <div class="mt-auto pt-2 border-top">
            <h6 class="mb-0 font-weight-bold text-warning">${price}</h6>
          </div>
        </div>
      </div>
    `;
    return col;
  };

  document.addEventListener("DOMContentLoaded", initGlobalUI);

})();
