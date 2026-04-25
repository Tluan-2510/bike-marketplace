/**
 * Bike Market - User profile and product creation.
 */

(function () {
  "use strict";

  function getDisplayName(user) {
    return user.full_name || user.name || user.username || "Nguoi dung";
  }

  function getPhone(user) {
    return user.phone_number || user.phone || "";
  }

  function requireUser() {
    var user = window.BikeApi.getAuthUser();
    var token = window.BikeApi.getAuthToken();

    if (!user && !token) {
      window.location.href = "./login.html";
      return null;
    }

    return user || { id: 1, full_name: "Nguoi dung", email: "", phone_number: "" };
  }

  function renderUserInfo(user) {
    var name = getDisplayName(user);
    var avatarUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=FFD700&color=000&size=150";

    if (document.getElementById("userName")) document.getElementById("userName").textContent = name;
    if (document.getElementById("userEmail")) document.getElementById("userEmail").textContent = user.email || "";
    if (document.getElementById("userAvatar")) document.getElementById("userAvatar").src = avatarUrl;
    if (document.getElementById("formAvatarPreview")) document.getElementById("formAvatarPreview").src = avatarUrl;
    if (document.getElementById("inputName")) document.getElementById("inputName").value = name;
    if (document.getElementById("inputEmail")) document.getElementById("inputEmail").value = user.email || "";
    if (document.getElementById("inputPhone")) document.getElementById("inputPhone").value = getPhone(user);
  }

  async function loadUserListings(user) {
    var container = document.getElementById("myListingsContainer");
    var recentContainer = document.getElementById("recentListingsContainer");
    if (!container) return;

    try {
      var userId = String(user.id || user.user_id || "");
      var response = await window.BikeApi.getProducts(userId ? { seller_id: userId, limit: 100 } : {});
      var products = window.BikeApi.pickList(response).filter(function (product) {
        return !userId || String(product.seller_id || "") === userId;
      });

      if (document.getElementById("statListings")) {
        document.getElementById("statListings").textContent = String(products.length);
      }

      if (!products.length) {
        container.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
            <p class="text-muted">Ban chua dang ban san pham nao.</p>
            <a href="./create_product.html" class="explore-link-premium mt-2">Dang ban xe ngay</a>
          </div>
        `;
        return;
      }

      container.innerHTML = "";
      products.forEach(function (product) {
        container.appendChild(window.renderProductCard(product));
      });

      if (recentContainer) {
        recentContainer.innerHTML = "";
        products.slice(0, 3).forEach(function (product) {
          recentContainer.appendChild(window.renderProductCard(product));
        });
      }

      var recentEmpty = document.getElementById("recentListingsEmpty");
      if (recentEmpty) recentEmpty.classList.add("d-none");
    } catch (error) {
      container.innerHTML = '<div class="col-12 text-center py-4 text-danger">Khong the tai danh sach san pham.</div>';
    }
  }

  async function loadFavoritesCount() {
    if (!document.getElementById("statFavorites")) return;

    try {
      var response = await window.BikeApi.getFavorites();
      document.getElementById("statFavorites").textContent = String(window.BikeApi.pickList(response).length);
    } catch (error) {
      document.getElementById("statFavorites").textContent = "0";
    }
  }

  async function loadLookups() {
    var categorySelect = document.getElementById("productCategory");
    var brandSelect = document.getElementById("productBrand");
    if (!categorySelect && !brandSelect) return;

    try {
      var results = await Promise.all([window.BikeApi.getCategories(), window.BikeApi.getBrands()]);
      var categories = window.BikeApi.pickList(results[0]);
      var brands = window.BikeApi.pickList(results[1]);

      if (categorySelect) {
        categorySelect.innerHTML = '<option value="">-- Chon loai xe --</option>';
        categories.forEach(function (category) {
          var option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      }

      if (brandSelect) {
        brandSelect.innerHTML = '<option value="">-- Chon thuong hieu --</option>';
        brands.forEach(function (brand) {
          var option = document.createElement("option");
          option.value = brand.id;
          option.textContent = brand.name;
          brandSelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  function initImagePreview() {
    var dropZone = document.getElementById("dropZone");
    var imageInput = document.getElementById("productImage");
    var previewContainer = document.getElementById("imagePreviewContainer");
    var selectedFiles = [];

    if (!dropZone || !imageInput || !previewContainer) return;

    dropZone.addEventListener("click", function () {
      imageInput.click();
    });

    ["dragenter", "dragover"].forEach(function (eventName) {
      dropZone.addEventListener(eventName, function (event) {
        event.preventDefault();
        dropZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(function (eventName) {
      dropZone.addEventListener(eventName, function (event) {
        event.preventDefault();
        dropZone.classList.remove("dragover");
      });
    });

    dropZone.addEventListener("drop", function (event) {
      handleFiles(event.dataTransfer.files);
    });

    imageInput.addEventListener("change", function (event) {
      handleFiles(event.target.files);
    });

    function handleFiles(files) {
      var newFiles = Array.from(files || []);
      if (selectedFiles.length + newFiles.length > 5) {
        alert("Chi duoc dang toi da 5 hinh anh.");
        return;
      }

      selectedFiles = selectedFiles.concat(newFiles);
      renderPreview();
      syncInput();
    }

    function renderPreview() {
      previewContainer.innerHTML = "";
      selectedFiles.forEach(function (file, index) {
        var reader = new FileReader();
        reader.onload = function (event) {
          var item = document.createElement("div");
          item.className = "preview-item";
          item.innerHTML = '<img src="' + event.target.result + '" alt="Preview"><button type="button" class="remove-btn">&times;</button>';
          item.querySelector(".remove-btn").addEventListener("click", function (clickEvent) {
            clickEvent.stopPropagation();
            selectedFiles.splice(index, 1);
            renderPreview();
            syncInput();
          });
          previewContainer.appendChild(item);
        };
        reader.readAsDataURL(file);
      });
    }

    function syncInput() {
      var dataTransfer = new DataTransfer();
      selectedFiles.forEach(function (file) {
        dataTransfer.items.add(file);
      });
      imageInput.files = dataTransfer.files;
    }
  }

  function initProductForm() {
    var form = document.getElementById("productForm") || document.getElementById("createProductForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      try {
        var userId = window.BikeApi.requireAuthUserId();
        var formData = new FormData(form);

        formData.set("seller_id", userId);
        if (!formData.get("title") && formData.get("name")) formData.set("title", formData.get("name"));
        if (!formData.get("wheel_size") && formData.get("size")) formData.set("wheel_size", formData.get("size"));

        await window.BikeApi.createProduct(formData);
        alert("Dang ban thanh cong.");
        form.reset();
        var preview = document.getElementById("imagePreviewContainer");
        if (preview) preview.innerHTML = "";
        window.location.href = "./user.html";
      } catch (error) {
        alert(error.message || "Dang ban that bai.");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var productForm = document.getElementById("productForm") || document.getElementById("createProductForm");
    if (productForm) {
      loadLookups();
      initImagePreview();
      initProductForm();
      return;
    }

    var user = requireUser();
    if (!user) return;

    renderUserInfo(user);
    loadUserListings(user);
    loadFavoritesCount();

    var profileForm = document.getElementById("profileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Tinh nang cap nhat thong tin dang duoc phat trien.");
      });
    }
  });
})();
