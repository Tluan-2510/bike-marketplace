/**
 * Bike Market - User profile and product creation.
 */

(function () {
  "use strict";

  var MAX_IMAGES = 5;
  var MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  var ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  var selectedProductImages = [];

  function showToast(message, type) {
    if (window.BikeApi && typeof window.BikeApi.showToast === "function") {
      return window.BikeApi.showToast(message, type);
    }
    if (window.BikeToast && typeof window.BikeToast.show === "function") {
      return window.BikeToast.show(message, type);
    }
    return null;
  }

  function getDisplayName(user) {
    return user.full_name || user.name || user.username || "Người dùng";
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

    return user || { id: 1, full_name: "Người dùng", email: "", phone_number: "" };
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
            <p class="text-muted">Bạn chưa đăng bán sản phẩm nào.</p>
            <a href="./create_product.html" class="explore-link-premium mt-2">Đăng bán xe ngay</a>
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
      container.innerHTML = '<div class="col-12 text-center py-4 text-danger">Không thể tải danh sách sản phẩm.</div>';
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
        categorySelect.innerHTML = '<option value="">-- Chọn loại xe --</option>';
        categories.forEach(function (category) {
          var option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      }

      if (brandSelect) {
        brandSelect.innerHTML = '<option value="">-- Chọn thương hiệu --</option>';
        brands.forEach(function (brand) {
          var option = document.createElement("option");
          option.value = brand.id;
          option.textContent = brand.name;
          brandSelect.appendChild(option);
        });
      }
    } catch (error) {
      showToast("Không thể tải danh mục hoặc thương hiệu.", "error");
    }
  }

  function getFieldControl(fieldName) {
    if (fieldName === "images") return document.getElementById("dropZone");
    return document.querySelector('[name="' + fieldName + '"]');
  }

  function setFieldError(fieldName, message) {
    var error = document.querySelector('[data-error-for="' + fieldName + '"]');
    var control = getFieldControl(fieldName);

    if (error) error.textContent = message || "";
    if (control) control.classList.toggle("is-invalid-field", Boolean(message));
  }

  function clearFieldError(fieldName) {
    setFieldError(fieldName, "");
  }

  function normalizePriceInput(value) {
    var rawValue = String(value || "").trim();
    if (!rawValue) return NaN;
    if (!/^[0-9.,\s]+$/.test(rawValue)) return NaN;

    var numericText = rawValue.replace(/[.,\s]/g, "");
    if (!/^\d+$/.test(numericText)) return NaN;
    return Number(numericText);
  }

  function validateProductTitle(form) {
    var title = String(form.elements.title.value || "").trim();

    if (!title) {
      setFieldError("title", "Vui lòng nhập tiêu đề tin đăng.");
      return false;
    }

    if (title.length < 10) {
      setFieldError("title", "Tiêu đề cần tối thiểu 10 ký tự.");
      return false;
    }

    if (title.length > 100) {
      setFieldError("title", "Tiêu đề không được vượt quá 100 ký tự.");
      return false;
    }

    clearFieldError("title");
    return true;
  }

  function validateProductPrice(form) {
    var price = normalizePriceInput(form.elements.price.value);

    if (!Number.isFinite(price) || price <= 0) {
      setFieldError("price", "Vui lòng nhập đúng giá tiền.");
      return false;
    }

    if (price < 100000) {
      setFieldError("price", "Giá bán tối thiểu là 100.000 VNĐ.");
      return false;
    }

    clearFieldError("price");
    return true;
  }

  function validateRequiredSelect(form, fieldName, message) {
    if (!String(form.elements[fieldName].value || "").trim()) {
      setFieldError(fieldName, message);
      return false;
    }

    clearFieldError(fieldName);
    return true;
  }

  function validateDescription(form) {
    if (!String(form.elements.description.value || "").trim()) {
      setFieldError("description", "Vui lòng nhập mô tả chi tiết.");
      return false;
    }

    clearFieldError("description");
    return true;
  }

  function validateProductImages(files, existingCount) {
    var validFiles = [];
    var messages = [];
    var availableSlots = Math.max(0, MAX_IMAGES - Number(existingCount || 0));

    Array.from(files || []).forEach(function (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        messages.push("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        messages.push("Mỗi ảnh không được vượt quá 5MB.");
        return;
      }

      if (validFiles.length >= availableSlots) {
        messages.push("Bạn chỉ được chọn tối đa 5 ảnh.");
        return;
      }

      validFiles.push(file);
    });

    return {
      validFiles: validFiles,
      messages: messages
    };
  }

  function syncImageInput(imageInput) {
    if (!imageInput || typeof DataTransfer === "undefined") return;

    var dataTransfer = new DataTransfer();
    selectedProductImages.forEach(function (file) {
      dataTransfer.items.add(file);
    });
    imageInput.files = dataTransfer.files;
  }

  function renderImagePreviews() {
    var previewContainer = document.getElementById("imagePreviewContainer");
    var imageInput = document.getElementById("productImage");
    if (!previewContainer) return;

    previewContainer.innerHTML = "";
    selectedProductImages.forEach(function (file, index) {
      var item = document.createElement("div");
      var imageUrl = URL.createObjectURL(file);

      item.className = "preview-item";
      item.innerHTML = [
        '<img src="' + imageUrl + '" alt="Ảnh xem trước">',
        '<button type="button" class="remove-btn" aria-label="Xóa ảnh">&times;</button>',
        '<span class="preview-meta"></span>'
      ].join("");

      item.querySelector("img").addEventListener("load", function () {
        URL.revokeObjectURL(imageUrl);
      });
      item.querySelector(".preview-meta").textContent = file.name;
      item.querySelector(".remove-btn").addEventListener("click", function (event) {
        event.stopPropagation();
        selectedProductImages.splice(index, 1);
        renderImagePreviews();
        syncImageInput(imageInput);
        if (selectedProductImages.length) {
          clearFieldError("images");
        }
      });

      previewContainer.appendChild(item);
    });
  }

  function validateCreateProductForm(form) {
    var checks = [
      validateProductTitle(form),
      validateRequiredSelect(form, "category_id", "Vui lòng chọn loại xe."),
      validateProductPrice(form),
      validateDescription(form)
    ];

    if (!selectedProductImages.length) {
      setFieldError("images", "Vui lòng chọn ít nhất 1 ảnh.");
      checks.push(false);
    } else {
      clearFieldError("images");
    }

    return checks.every(Boolean);
  }

  function handleImageFiles(files) {
    var imageInput = document.getElementById("productImage");
    var result = validateProductImages(files, selectedProductImages.length);

    if (result.validFiles.length) {
      selectedProductImages = selectedProductImages.concat(result.validFiles).slice(0, MAX_IMAGES);
      clearFieldError("images");
      renderImagePreviews();
      syncImageInput(imageInput);
    }

    if (result.messages.length) {
      var message = result.messages[0];
      setFieldError("images", message);
      showToast(message, "error");
    }
  }

  function initImagePreview() {
    var dropZone = document.getElementById("dropZone");
    var imageInput = document.getElementById("productImage");

    if (!dropZone || !imageInput) return;

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
      handleImageFiles(event.dataTransfer.files);
    });

    imageInput.addEventListener("change", function (event) {
      handleImageFiles(event.target.files);
    });
  }

  function initCreateProductValidation(form) {
    form.elements.title.addEventListener("input", function () {
      validateProductTitle(form);
    });
    form.elements.title.addEventListener("blur", function () {
      validateProductTitle(form);
    });
    form.elements["category_id"].addEventListener("change", function () {
      validateRequiredSelect(form, "category_id", "Vui lòng chọn loại xe.");
    });
    form.elements.price.addEventListener("input", function () {
      validateProductPrice(form);
    });
    form.elements.price.addEventListener("blur", function () {
      validateProductPrice(form);
    });
    form.elements.description.addEventListener("input", function () {
      validateDescription(form);
    });
    form.elements.description.addEventListener("blur", function () {
      validateDescription(form);
    });
  }

  function getFriendlyCreateError(error) {
    if (error && /dang nhap|người dùng|nguoi dung|token|401/i.test(error.message || "")) {
      return "Phiên đăng nhập hết hạn";
    }
    return "Không thể đăng tin lúc này. Vui lòng thử lại.";
  }

  function initProductForm() {
    var form = document.getElementById("productForm") || document.getElementById("createProductForm");
    if (!form) return;

    initCreateProductValidation(form);

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      var submitButton = document.getElementById("submitProductButton");
      if (!validateCreateProductForm(form)) {
        var priceError = document.querySelector('[data-error-for="price"]');
        if (priceError && priceError.textContent) {
          showToast("Vui lòng nhập đúng giá tiền", "error");
        }
        var firstInvalid = form.querySelector(".is-invalid-field");
        if (firstInvalid && typeof firstInvalid.focus === "function") firstInvalid.focus();
        return;
      }

      var userId = window.BikeApi.getAuthUserId();
      if (!userId) {
        showToast("Phiên đăng nhập hết hạn", "error");
        return;
      }

      try {
        if (submitButton) submitButton.disabled = true;

        var formData = new FormData(form);
        formData.set("seller_id", userId);
        formData.set("price", String(normalizePriceInput(form.elements.price.value)));
        if (!formData.get("title") && formData.get("name")) formData.set("title", formData.get("name"));
        if (!formData.get("wheel_size") && formData.get("size")) formData.set("wheel_size", formData.get("size"));

        formData.delete("images[]");
        selectedProductImages.forEach(function (file) {
          formData.append("images[]", file, file.name);
        });

        await window.BikeApi.createProduct(formData);
        showToast("Đăng tin thành công!", "success");
        form.reset();
        selectedProductImages = [];
        renderImagePreviews();
        syncImageInput(document.getElementById("productImage"));
        window.setTimeout(function () {
          window.location.href = "./user.html";
        }, 900);
      } catch (error) {
        showToast(getFriendlyCreateError(error), "error");
      } finally {
        if (submitButton) submitButton.disabled = false;
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
        showToast("Chức năng cập nhật thông tin đang được phát triển.", "error");
      });
    }
  });
})();
