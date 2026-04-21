(function () {
  "use strict";

  function trimSlashesRight(value) {
    return String(value || "").replace(/\/+$/, "");
  }

  function resolveApiBaseUrl() {
    var fromWindow = trimSlashesRight(window.BIKE_API_BASE_URL || "");
    var fromStorage = "";

    try {
      fromStorage = trimSlashesRight(localStorage.getItem("bike_api_base_url") || "");
    } catch (error) {
      fromStorage = "";
    }

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
      return (
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        ""
      );
    } catch (error) {
      return "";
    }
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
    // Assuming uploads are in the same parent dir as api
    var baseUrl = resolveApiBaseUrl().replace("/api", "/uploads");
    return baseUrl + "/" + path;
  }

  window.BikeApi = {
    resolveApiBaseUrl: resolveApiBaseUrl,
    buildApiUrl: buildApiUrl,
    getAuthToken: getAuthToken,
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
    sendBuyRequest: (data) => request("/buy-requests", {
      method: "POST",
      body: data,
      auth: true
    }),
    getFavorites: () => request("/favorites", { auth: true }),
    toggleFavorite: (productId) => request("/favorites", {
      method: "POST",
      body: { product_id: productId },
      auth: true
    })
  };
})();
