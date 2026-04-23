/**
 * Bike Market - Auth Logic
 * Combined: Login and Registration
 */

(function () {
  "use strict";

  function initAuth() {
    const api = window.BikeApi;

    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(loginForm));
        try {
          const res = await api.login(data);
          localStorage.setItem("access_token", res.data.token);
          window.location.href = "./index.html";
        } catch (err) { alert(err.message); }
      });
    }

    // Register
    const regForm = document.getElementById("registerForm");
    if (regForm) {
      regForm.addEventListener("submit", async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(regForm));
        try {
          await api.register(data);
          alert("Đăng ký thành công! Hãy đăng nhập.");
          window.location.href = "./login.html";
        } catch (err) { alert(err.message); }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initAuth);
})();
