/**
 * Bike Market - Auth Logic
 */

(function () {
  "use strict";

  function getMessageBox() {
    return document.getElementById("formMessage");
  }

  function showMessage(message, type) {
    var box = getMessageBox();
    if (!box) return;
    box.textContent = message;
    box.className = "alert alert-" + (type === "success" ? "success" : "danger");
  }

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
    var restore = setLoading(button, "Dang dang nhap...");

    try {
      var payload = {
        email: normalizeValue(form.querySelector('[name="email"]').value).toLowerCase(),
        password: String(form.querySelector('[name="password"]').value || "")
      };

      if (!isValidEmail(payload.email) || payload.password.length < 6) {
        throw new Error("Email hoac mat khau khong hop le.");
      }

      var response = await window.BikeApi.login(payload);
      persistAuthData(response.data || response);
      showMessage("Dang nhap thanh cong.", "success");

      window.setTimeout(function () {
        window.location.href = resolveRedirect(form, "./user.html");
      }, 400);
    } catch (error) {
      showMessage(error.message || "Dang nhap that bai.", "danger");
      restore();
    }
  }

  async function handleRegister(form) {
    var button = form.querySelector('button[type="submit"]');
    var restore = setLoading(button, "Dang dang ky...");

    try {
      var fullName = normalizeValue(form.querySelector('[name="full_name"]').value);
      var email = normalizeValue(form.querySelector('[name="email"]').value).toLowerCase();
      var phone = normalizeValue(form.querySelector('[name="phone"]').value);
      var password = String(form.querySelector('[name="password"]').value || "");

      if (!fullName || !isValidEmail(email) || !phone || password.length < 6) {
        throw new Error("Thong tin dang ky khong hop le.");
      }

      await window.BikeApi.register({
        username: email,
        full_name: fullName,
        email: email,
        phone_number: phone,
        password: password
      });

      showMessage("Dang ky thanh cong.", "success");
      window.setTimeout(function () {
        window.location.href = resolveRedirect(form, "./login.html");
      }, 500);
    } catch (error) {
      showMessage(error.message || "Dang ky that bai.", "danger");
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
