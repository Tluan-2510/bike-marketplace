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
    if (window.BikeApi && typeof window.BikeApi.resolveApiBaseUrl === "function") {
      return window.BikeApi.resolveApiBaseUrl();
    }
    return "http://localhost/bike-marketplace/backend/index.php?route=/api";
  }

  function buildApiUrl(path) {
    var cleanPath = String(path || "");
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
    var baseUrl = resolveApiBaseUrl();
    if (baseUrl.indexOf("?") !== -1) {
      return baseUrl + cleanPath;
    }
    return baseUrl + cleanPath;
  }

  var API = {
    login: buildApiUrl("/auth/login"),
    register: buildApiUrl("/auth/register"),
  };

  var STORAGE_KEYS = {
    accessToken: "access_token",
    refreshToken: "refresh_token",
    user: "auth_user",
  };

  function getMessageBox(form) {
    return form.querySelector("#formMessage") || document.getElementById("formMessage");
  }

  function showMessage(messageBox, message, type) {
    if (!messageBox) return;
    var alertType = type === "success" ? "success" : "danger";
    messageBox.textContent = message;
    messageBox.className = "alert alert-" + alertType;
  }

  function hideMessage(messageBox) {
    if (!messageBox) return;
    messageBox.textContent = "";
    messageBox.className = "alert d-none";
  }

  function setButtonLoading(button, loadingText) {
    if (!button) return function () {};
    var idleText = button.textContent;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = loadingText;

    return function restoreButton() {
      button.disabled = false;
      button.setAttribute("aria-busy", "false");
      button.textContent = idleText;
    };
  }

  function normalizeValue(value) {
    return String(value || "").trim();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function isValidPhone(phone) {
    var digits = String(phone || "").replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 11;
  }

  function validateLoginInput(payload) {
    if (!payload.email || !payload.password) {
      return "Vui lòng nhập đầy đủ email và mật khẩu.";
    }

    if (!isValidEmail(payload.email)) {
      return "Email không đúng định dạng.";
    }

    if (payload.password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    return "";
  }

  function validateRegisterInput(payload) {
    if (
      !payload.fullName ||
      !payload.email ||
      !payload.password ||
      !payload.phone
    ) {
      return "Vui lòng điền đầy đủ tất cả thông tin đăng ký.";
    }

    if (payload.fullName.length < 2) {
      return "Tên người dùng phải có ít nhất 2 ký tự.";
    }

    if (!isValidEmail(payload.email)) {
      return "Email không đúng định dạng.";
    }

    if (payload.password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!isValidPhone(payload.phone)) {
      return "Số điện thoại không hợp lệ.";
    }

    return "";
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
        if (Array.isArray(firstError) && firstError.length) {
          return String(firstError[0]);
        }
        if (typeof firstError === "string") {
          return firstError;
        }
      }
    }

    if (status >= 500) {
      return "Hệ thống đang bận. Vui lòng thử lại sau.";
    }

    if (status === 404) {
      return "Không tìm thấy API xác thực. Kiểm tra backend base URL.";
    }

    if (status === 405) {
      return "Sai phương thức gọi API. Kiểm tra backend routing.";
    }

    if (status === 401) {
      return "Thông tin đăng nhập không chính xác.";
    }

    return "Không thể xử lý yêu cầu. Vui lòng thử lại.";
  }

  async function requestJSON(url, body) {
    var controller = new AbortController();
    var timeout = window.setTimeout(function () {
      controller.abort();
    }, 12000);

    try {
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      var raw = await response.text();
      var payload = parseJSON(raw);

      if (!response.ok || payload.success === false) {
        throw new Error(normalizeApiError(payload, response.status));
      }

      return payload;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Kết nối quá thời gian. Vui lòng thử lại.");
      }
      if (error instanceof TypeError) {
        throw new Error("Không thể kết nối đến máy chủ.");
      }
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function persistAuthData(data) {
    var source = data || {};
    var tokens = source.tokens || {};
    var accessToken = source.access_token || source.token || tokens.access_token || "";
    var refreshToken = source.refresh_token || tokens.refresh_token || "";
    var user = source.user || source;

    if (!accessToken && user && (user.id || user.user_id || user.email)) {
      accessToken = "local_session_" + (user.id || user.user_id || user.email);
    }

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
      localStorage.setItem("token", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }

  function resolveRedirect(form, fallback) {
    var target = normalizeValue(form.getAttribute("data-redirect"));
    return target || fallback;
  }

  async function onSubmitLogin(form) {
    var messageBox = getMessageBox(form);
    var submitButton = form.querySelector('button[type="submit"]');

    var payload = {
      email: normalizeValue(form.querySelector('input[name="email"]').value).toLowerCase(),
      password: String(form.querySelector('input[name="password"]').value || ""),
    };

    var validationMessage = validateLoginInput(payload);
    hideMessage(messageBox);

    if (validationMessage) {
      showMessage(messageBox, validationMessage, "danger");
      return;
    }

    var restoreButton = setButtonLoading(submitButton, "Đang đăng nhập...");

    // MOCK LOGIN FOR TESTING
    if (payload.email === 'test@bikemarket.vn') {
      setTimeout(function() {
        persistAuthData({
          access_token: 'mock_token_12345',
          user: {
            id: 999,
            name: "Người Dùng Test",
            username: "testuser",
            email: "test@bikemarket.vn",
            role: "seller",
            phone: "0901234567",
            address: "Quận 1, TP. HCM"
          }
        });
        showMessage(messageBox, "Đăng nhập giả lập thành công. Đang chuyển hướng...", "success");
        window.setTimeout(function () {
          window.location.href = resolveRedirect(form, "./user.html");
        }, 500);
      }, 500);
      return;
    }

    try {
      var response = await requestJSON(API.login, payload);
      persistAuthData(response.data || response);
      showMessage(messageBox, "Đăng nhập thành công. Đang chuyển hướng...", "success");

      window.setTimeout(function () {
        window.location.href = resolveRedirect(form, "./user.html");
      }, 500);
    } catch (error) {
      showMessage(messageBox, error.message || "Đăng nhập thất bại.", "danger");
      restoreButton();
    }
  }

  async function onSubmitRegister(form) {
    var messageBox = getMessageBox(form);
    var submitButton = form.querySelector('button[type="submit"]');

    var payload = {
      fullName: normalizeValue(form.querySelector('input[name="full_name"]').value),
      email: normalizeValue(form.querySelector('input[name="email"]').value).toLowerCase(),
      password: String(form.querySelector('input[name="password"]').value || ""),
      phone: normalizeValue(form.querySelector('input[name="phone"]').value),
    };

    var validationMessage = validateRegisterInput(payload);
    hideMessage(messageBox);

    if (validationMessage) {
      showMessage(messageBox, validationMessage, "danger");
      return;
    }

    var restoreButton = setButtonLoading(submitButton, "Đang đăng ký...");

    try {
      var requestBody = {
        username: payload.email,
        full_name: payload.fullName,
        name: payload.fullName,
        email: payload.email,
        password: payload.password,
        phone_number: payload.phone,
      };

      var response = await requestJSON(API.register, requestBody);
      persistAuthData(response.data || {});
      showMessage(messageBox, "Đăng ký thành công. Đang chuyển hướng...", "success");

      window.setTimeout(function () {
        window.location.href = resolveRedirect(form, "./login.html");
      }, 700);
    } catch (error) {
      showMessage(messageBox, error.message || "Đăng ký thất bại.", "danger");
      restoreButton();
    }
  }

  function attachSubmitHandlers() {
    var loginForm = document.getElementById("loginForm");
    var registerForm = document.getElementById("registerForm");

    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        onSubmitLogin(loginForm);
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        onSubmitRegister(registerForm);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", attachSubmitHandlers);
})();
