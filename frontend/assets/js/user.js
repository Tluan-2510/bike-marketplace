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
      window.location.href = "./login.php";
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

    // Hiển thị skeleton loading
    container.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        container.appendChild(window.renderProductSkeleton());
    }
    if (recentContainer) {
        recentContainer.innerHTML = "";
        for (let i = 0; i < 3; i++) {
            recentContainer.appendChild(window.renderProductSkeleton());
        }
    }

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
            <a href="./create_product.php" class="explore-link-premium mt-2">Đăng bán xe ngay</a>
          </div>
        `;
        return;
      }

      container.innerHTML = "";
      products.forEach(function (product) {
        product.is_owner = true; // Flag to show delete button
        container.appendChild(window.renderProductCard(product));
      });

      if (recentContainer) {
        recentContainer.innerHTML = "";
        products.slice(0, 3).forEach(function (product) {
          product.is_owner = true;
          recentContainer.appendChild(window.renderProductCard(product));
        });
      }

      var recentEmpty = document.getElementById("recentListingsEmpty");
      if (recentEmpty) recentEmpty.classList.add("d-none");
    } catch (error) {
      container.innerHTML = '<div class="col-12 text-center py-4 text-danger">Không thể tải danh sách sản phẩm.</div>';
    }
  }

  async function loadBuyRequests() {
    var container = document.getElementById("buyRequestsContainer");
    if (!container) return;

    try {
      container.innerHTML = '<tr><td colspan="4" class="text-center py-4"><i class="fa fa-spinner fa-spin"></i> Đang tải...</td></tr>';
      var response = await window.BikeApi.getBuyRequests('buyer');
      var requests = window.BikeApi.pickList(response);

      if (!requests.length) {
        container.innerHTML = '<tr><td colspan="4" class="text-center py-5 text-muted">Bạn chưa gửi yêu cầu mua nào.</td></tr>';
        return;
      }

      container.innerHTML = requests.map(req => `
        <tr>
          <td class="align-middle">
            <div class="d-flex align-items-center">
              <img src="${window.BikeApi.resolveImageUrl(req.image_url)}" class="rounded mr-2 shadow-sm" style="width: 45px; height: 45px; object-fit: cover;">
              <div>
                <div class="font-weight-bold">${req.title || "Xe đạp"}</div>
                <div class="small text-muted">${window.BikeApi.formatCurrency(req.price)}</div>
              </div>
            </div>
          </td>
          <td class="align-middle small">${new Date(req.created_at).toLocaleDateString('vi-VN')}</td>
          <td class="align-middle small text-muted">${req.message || '<i class="text-muted">Không có lời nhắn</i>'}</td>
          <td class="align-middle">
            <span class="badge badge-pill badge-${getStatusColor(req.status)} px-3 py-2">
              ${translateStatus(req.status)}
            </span>
          </td>
        </tr>
      `).join('');
    } catch (error) {
      container.innerHTML = '<tr><td colspan="4" class="text-center text-danger py-4">Lỗi tải dữ liệu.</td></tr>';
    }
  }

  async function loadSellRequests() {
    var container = document.getElementById("sellRequestsContainer");
    if (!container) return;

    try {
      container.innerHTML = '<tr><td colspan="5" class="text-center py-4"><i class="fa fa-spinner fa-spin"></i> Đang tải...</td></tr>';
      var response = await window.BikeApi.getBuyRequests('seller');
      var requests = window.BikeApi.pickList(response);

      if (!requests.length) {
        container.innerHTML = '<tr><td colspan="5" class="text-center py-5 text-muted">Chưa có yêu cầu mua nào từ khách.</td></tr>';
        return;
      }

      container.innerHTML = requests.map(req => `
        <tr>
          <td class="align-middle">
            <div class="font-weight-bold">${req.buyer_name || "Khách hàng"}</div>
            <div class="small text-muted">${req.buyer_phone || ""}</div>
          </td>
          <td class="align-middle">
            <div class="font-weight-bold small">${req.title || "Sản phẩm"}</div>
            <div class="text-muted" style="font-size: 11px;">#${req.product_id}</div>
          </td>
          <td class="align-middle small text-muted">${req.message || '-'}</td>
          <td class="align-middle small">${new Date(req.created_at).toLocaleDateString('vi-VN')}</td>
          <td class="align-middle">
            <div class="btn-group btn-group-sm shadow-sm">
              <a href="tel:${req.buyer_phone}" class="btn btn-outline-success" title="Gọi điện"><i class="fa fa-phone"></i></a>
              <a href="https://zalo.me/${req.buyer_phone}" target="_blank" class="btn btn-outline-info" title="Zalo"><i class="fa fa-comment"></i></a>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (error) {
      container.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4">Lỗi tải dữ liệu.</td></tr>';
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  }

  function translateStatus(status) {
    switch (status) {
      case 'pending': return 'Đang chờ';
      case 'accepted': return 'Đã chấp nhận';
      case 'rejected': return 'Từ chối';
      case 'completed': return 'Hoàn thành';
      default: return status;
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
          window.location.href = "./user.php";
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
    loadBuyRequests();
    loadSellRequests();

    // Tab switching logic for lazy loading
    $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
      var targetId = $(e.target).attr('href');
      if (targetId === '#v-pills-buying') loadBuyRequests();
      if (targetId === '#v-pills-selling') loadSellRequests();
      if (targetId === '#v-pills-listings') loadUserListings(user);
    });

    var profileForm = document.getElementById("profileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        var submitBtn = profileForm.querySelector('button[type="submit"]');
        var data = {
          full_name: document.getElementById("inputName").value,
          phone_number: document.getElementById("inputPhone").value
        };

        try {
          if (submitBtn) submitBtn.disabled = true;
          var res = await window.BikeApi.updateProfile(data);
          if (res.success) {
            showToast("Cập nhật thông tin thành công!", "success");
            // Cập nhật lại UI và LocalStorage
            var updatedUser = Object.assign({}, user, data);
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            renderUserInfo(updatedUser);
          } else {
            showToast(res.message || "Không thể cập nhật thông tin.", "error");
          }
        } catch (error) {
          showToast("Lỗi kết nối máy chủ.", "error");
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    // Handle delete buttons
    document.addEventListener("click", async function (event) {
      var deleteBtn = event.target.closest(".btn-delete-product");
      if (!deleteBtn) return;

      var productId = deleteBtn.dataset.id;
      if (!productId) return;

      if (!confirm("Bạn có chắc chắn muốn xóa tin đăng này không? Thao tác này không thể hoàn tác.")) {
        return;
      }

      try {
        var response = await window.BikeApi.deleteProduct(productId);
        if (response.success) {
          showToast("Đã xóa tin đăng thành công.", "success");
          loadUserListings(user); // Refresh the list
        } else {
          showToast(response.message || "Không thể xóa tin đăng.", "error");
        }
      } catch (error) {
        showToast("Lỗi khi kết nối đến máy chủ.", "error");
      }
    });
  });
})();
