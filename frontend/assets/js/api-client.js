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
      if (pathParts[1]) {
        url += "&" + pathParts[1];
      }
      return url;
    }
    return baseUrl + cleanPath;
  }

  function getAuthToken() {
    try {
      return (
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        ""
      );
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
    if (!userId) {
      throw new Error("Thiếu thông tin người dùng");
    }
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

    if (payload && payload.errors && typeof payload.errors === "object") {
      var firstKey = Object.keys(payload.errors)[0];
      if (firstKey) {
        var firstError = payload.errors[firstKey];
        if (Array.isArray(firstError) && firstError.length) return String(firstError[0]);
        if (typeof firstError === "string") return firstError;
      }
    }

    if (status === 401) return "Bạn cần đăng nhập để tiếp tục.";
    if (status === 404) return "API không tồn tại trên backend hiện tại.";
    if (status === 405) return "Sai phương thức gọi API.";
    if (status >= 500) return "Hệ thống backend đang lỗi hoặc chưa kết nối database.";
    return "Yêu cầu không thành công.";
  }

  async function request(path, options) {
    var config = options || {};
    var method = config.method || "GET";
    var body = config.body;
    var auth = Boolean(config.auth);
    var timeoutMs = Number(config.timeoutMs || 12000);

    var controller = new AbortController();
    var timer = window.setTimeout(function () {
      controller.abort();
    }, timeoutMs);

    try {
      var headers = {
        Accept: "application/json",
      };

      if (auth) {
        var token = getAuthToken();
        if (!token) {
          throw new Error("Bạn cần đăng nhập để tiếp tục.");
        }
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
      if (error.name === "AbortError") {
        throw new Error("Kết nối quá thời gian.");
      }
      if (error instanceof TypeError) {
        throw new Error("Không thể kết nối đến backend API.");
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  function pickList(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.items)) return payload.items;
    if (payload.data && Array.isArray(payload.data.items)) return payload.data.items;
    return [];
  }

  function formatCurrency(value) {
    var amount = Number(value || 0);
    return amount.toLocaleString("vi-VN") + "đ";
  }

  function resolveImageUrl(path) {
    if (!path) return "../assets/images/placeholder-bike.png";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/backend/uploads/")) {
      return "http://localhost/bike-marketplace" + path;
    }
    if (path.startsWith("/bike-marketplace/")) {
      return "http://localhost" + path;
    }
    // Assuming uploads are in the same parent dir as api
    var baseUrl = "http://localhost/bike-marketplace/backend/uploads";
    return baseUrl + "/" + path;
  }

  window.BikeApi = {
    resolveApiBaseUrl: resolveApiBaseUrl,
    buildApiUrl: buildApiUrl,
    getAuthToken: getAuthToken,
    getAuthUser: getAuthUser,
    getAuthUserId: getAuthUserId,
    requireAuthUserId: requireAuthUserId,
    request: request,
    pickList: pickList,
    formatCurrency: formatCurrency,
    resolveImageUrl: resolveImageUrl,
    
    // API Helpers
    getProducts: (params) => {
      let query = "";
      if (params) {
        query = "?" + new URLSearchParams(params).toString();
      }
      return request("/products" + query);
    },
    getProduct: (id) => request("/products?id=" + id),
    getCategories: () => request("/categories"),
    getBrands: () => request("/brands"),
    sendBuyRequest: (data) => {
      const payload = Object.assign({}, data || {}, { buyer_id: requireAuthUserId() });
      return request("/buy-requests", {
        method: "POST",
        body: payload,
        auth: true
      });
    },
    getFavorites: () => {
      const userId = requireAuthUserId();
      return request("/favorites?user_id=" + encodeURIComponent(userId), { auth: true });
    },
    toggleFavorite: (productId, action) => {
      return request("/favorites", {
        method: "POST",
        body: {
          user_id: requireAuthUserId(),
          product_id: productId,
          action: action || "add"
        },
        auth: true
      });
    }
  };
})();
