/**
 * Bike Market - Auth Logic
 */

(function () {
  "use strict";

  function normalizeValue(value) {
    return String(value || "").trim();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function setLoading(button, text) {
    if (!button) return function () {};
    var oldText = button.textContent;
    button.disabled = true;
    button.textContent = text;
    return function restore() {
      button.disabled = false;
      button.textContent = oldText;
    };
  }

  function persistAuthData(data) {
    var source = data || {};
    var tokens = source.tokens || {};
    var user = source.user || source;
    var accessToken = source.access_token || source.token || tokens.access_token || "";

    if (!accessToken && user && (user.id || user.user_id || user.email)) {
      accessToken = "local_session_" + (user.id || user.user_id || user.email);
    }

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("token", accessToken);
    }

    localStorage.setItem("auth_user", JSON.stringify(user));
  }

  function resolveRedirect(form, fallback) {
    return normalizeValue(form.getAttribute("data-redirect")) || fallback;
  }

  async function handleLogin(form) {
    var button = form.querySelector('button[type="submit"]');
    var restore = setLoading(button, "Đang đăng nhập...");

    try {
      var payload = {
        email: normalizeValue(form.querySelector('[name="email"]').value).toLowerCase(),
        password: String(form.querySelector('[name="password"]').value || "")
      };

      if (!isValidEmail(payload.email) || payload.password.length < 6) {
        throw new Error("Email hoặc mật khẩu không hợp lệ.");
      }

      var response = await window.BikeApi.login(payload);
      persistAuthData(response.data || response);

      if (window.BikeToast && typeof window.BikeToast.show === "function") {
        window.BikeToast.show("Đăng nhập thành công!", "success");
      }

      window.setTimeout(function () {
        window.location.href = resolveRedirect(form, "./user.php");
      }, 1200);
    } catch (error) {
      if (window.BikeToast && typeof window.BikeToast.show === "function") {
        window.BikeToast.show(error.message || "Đăng nhập thất bại.", "error");
      }
      restore();
    }
  }

  async function handleRegister(form) {
    var button = form.querySelector('button[type="submit"]');
    var restore = setLoading(button, "Đang đăng ký...");

    try {
      var fullName = normalizeValue(form.querySelector('[name="full_name"]').value);
      var email = normalizeValue(form.querySelector('[name="email"]').value).toLowerCase();
      var phone = normalizeValue(form.querySelector('[name="phone"]').value);
      var password = String(form.querySelector('[name="password"]').value || "");

      if (!fullName || !isValidEmail(email) || !phone || password.length < 6) {
        throw new Error("Thông tin đăng ký không hợp lệ.");
      }

      await window.BikeApi.register({
        username: email,
        full_name: fullName,
        email: email,
        phone_number: phone,
        password: password
      });

      if (window.BikeToast && typeof window.BikeToast.show === "function") {
        window.BikeToast.show("Đăng ký thành công!", "success");
      }
      window.setTimeout(function () {
        window.location.href = resolveRedirect(form, "./login.php");
      }, 1200);
    } catch (error) {
      if (window.BikeToast && typeof window.BikeToast.show === "function") {
        window.BikeToast.show(error.message || "Đăng ký thất bại.", "error");
      }
      restore();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        handleLogin(loginForm);
      });
    }

    var registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        handleRegister(registerForm);
      });
    }
  });
})();
