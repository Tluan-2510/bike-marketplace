/**
 * Bike Market - User & Profile Logic
 * Combined: Profile management and Product creation
 */

(function () {
  "use strict";

  async function initUser() {
    const api = window.BikeApi;

    // Profile View/Edit
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
      try {
        const res = await api.getUserProfile();
        const u = res.data;
        if (u) {
          document.getElementById("userName").textContent = u.full_name;
          document.getElementById("userEmail").textContent = u.email;
          document.getElementById("inputName").value = u.full_name;
          document.getElementById("inputPhone").value = u.phone || "";
        }
      } catch (e) { console.error(e); }
    }

    // Product Creation
    const pForm = document.getElementById("productForm");
    if (pForm) {
      pForm.addEventListener("submit", async e => {
        e.preventDefault();
        const fd = new FormData(pForm);
        try {
          await api.createProduct(fd);
          alert("Đăng bán thành công!");
          window.location.href = "./user.html";
        } catch (err) { alert(err.message); }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initUser);
})();
