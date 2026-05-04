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
      var response = await window.BikeApi.getProducts(userId ? { seller_id: userId, limit: 100, show_all: 1 } : {});
      var products = window.BikeApi.pickList(response).filter(function (product) {
        return !userId || String(product.seller_id || "") === userId;
      });

      var approvedProducts = products.filter(p => String(p.is_approved) === '1');
      var pendingProducts = products.filter(p => String(p.is_approved) !== '1');

      if (document.getElementById("statListings")) {
        document.getElementById("statListings").textContent = String(approvedProducts.length);
      }
      if (document.getElementById("statPending")) {
        document.getElementById("statPending").textContent = String(pendingProducts.length);
      }

      // Sort products: Pending first, then by date descending
      products.sort(function(a, b) {
        if (a.is_approved != b.is_approved) {
          return a.is_approved - b.is_approved; // 0 comes before 1
        }
        return new Date(b.created_at) - new Date(a.created_at);
      });

      if (!products.length) {
        container.innerHTML = `
          <div class="col-12 text-center py-5">
            <p class="text-muted">Bạn chưa đăng bán sản phẩm nào.</p>
            <a href="./create_product.php" class="explore-link-premium mt-2">Đăng bán xe ngay</a>
          </div>
        `;
        if (recentContainer) {
          recentContainer.innerHTML = '<div class="col-12 text-center py-4 text-muted small">Chưa có tin đăng nào.</div>';
        }
        return;
      }

      container.innerHTML = "";
      products.forEach(function (product) {
        product.is_owner = true; // Flag to show delete button
        container.appendChild(window.renderProductCard(product));
      });

      if (recentContainer) {
        recentContainer.innerHTML = "";
        // Show up to 4 recent items
        products.slice(0, 4).forEach(function (product) {
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
      container.innerHTML = '<tr><td colspan="4" class="text-center py-5"><i class="fa fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...</td></tr>';
      var response = await window.BikeApi.getBuyRequests('buyer');
      var list = window.BikeApi.pickList(response);

      if (!list || list.length === 0) {
        container.innerHTML = '<tr><td colspan="4" class="text-center py-5 text-muted">Bạn chưa gửi yêu cầu mua nào.</td></tr>';
        return;
      }

      container.innerHTML = list.map(req => {
        var statusClass = `status-badge-${req.status || 'pending'}`;
        var statusText = {
          'pending': 'Chờ phản hồi',
          'accepted': 'Đã chấp nhận',
          'completed': 'Hoàn thành',
          'rejected': 'Đã từ chối'
        }[req.status] || req.status;

        return `
          <tr>
            <td>
              <div class="table-product-item">
                <img src="${window.BikeApi.resolveImageUrl(req.image_url)}" class="table-product-img">
                <div class="table-product-info">
                  <a href="product-detail.php?id=${req.product_id}" class="table-product-title">${req.title || "Sản phẩm"}</a>
                  <span class="table-product-price">${window.BikeApi.formatCurrency(req.price)}</span>
                </div>
              </div>
            </td>
            <td class="text-nowrap">${new Date(req.created_at).toLocaleDateString('vi-VN')}</td>
            <td><div class="table-message-cell" title="${req.message || ''}">${req.message || ""}</div></td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          </tr>
        `;
      }).join('');
    } catch (error) {
      container.innerHTML = '<tr><td colspan="4" class="text-center py-5 text-danger">Không thể tải dữ liệu.</td></tr>';
    }
  }

  async function loadSellRequests() {
    var container = document.getElementById("sellRequestsContainer");
    if (!container) return;

    try {
      container.innerHTML = '<tr><td colspan="5" class="text-center py-5"><i class="fa fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...</td></tr>';
      var response = await window.BikeApi.getBuyRequests('seller');
      var list = window.BikeApi.pickList(response);

      if (!list || list.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center py-5 text-muted">Chưa có yêu cầu mua nào từ khách.</td></tr>';
        return;
      }

      container.innerHTML = list.map(req => {
        var statusClass = `status-badge-${req.status || 'pending'}`;
        var statusText = {
          'pending': 'Mới',
          'accepted': 'Đã chấp nhận',
          'completed': 'Đã bán',
          'rejected': 'Đã từ chối'
        }[req.status] || req.status;

        var actions = "";
        if (req.status === 'pending') {
          actions = `
            <div class="table-actions">
              <button class="btn-table-action btn-table-action-icon btn-table-action-accept update-req-status" onclick="window.updateRequestStatus(${req.id}, 'accepted')" title="Chấp nhận">
                <i class="fa fa-check"></i>
              </button>
              <button class="btn-table-action btn-table-action-icon btn-table-action-reject update-req-status" onclick="window.updateRequestStatus(${req.id}, 'rejected')" title="Từ chối">
                <i class="fa fa-times"></i>
              </button>
            </div>
          `;
        } else if (req.status === 'accepted') {
          actions = `
            <div class="table-actions">
              <button class="btn-table-action btn-table-action-complete update-req-status" onclick="window.updateRequestStatus(${req.id}, 'completed')">
                <i class="fa fa-handshake-o"></i> Đã bán
              </button>
            </div>
          `;
        } else {
          actions = `<span class="status-badge ${statusClass}">${statusText}</span>`;
        }

        return `
          <tr>
            <td>
              <div class="table-user-meta">
                <span class="table-user-name">${req.buyer_name || "Khách hàng"}</span>
                <span class="table-user-sub">${req.buyer_phone ? `<i class="fa fa-phone"></i> ${req.buyer_phone}` : ''}</span>
                <div class="contact-links">
                  <a href="tel:${req.buyer_phone || ''}" class="contact-link contact-link-call"><i class="fa fa-phone"></i> Gọi</a>
                  <a href="https://zalo.me/${req.buyer_phone || ''}" target="_blank" class="contact-link contact-link-zalo"><i class="fa fa-comment"></i> Zalo</a>
                </div>
              </div>
            </td>
            <td>
              <div class="table-product-item">
                <img src="${window.BikeApi.resolveImageUrl(req.image_url)}" class="table-product-img">
                <div class="table-product-info">
                  <a href="product-detail.php?id=${req.product_id}" class="table-product-title">${req.title || "Sản phẩm"}</a>
                  <span class="table-product-price">${window.BikeApi.formatCurrency(req.price)}</span>
                </div>
              </div>
            </td>
            <td><div class="table-message-cell" title="${req.message || ''}">${req.message || ""}</div></td>
            <td class="text-nowrap small">${new Date(req.created_at).toLocaleDateString('vi-VN')}</td>
            <td>${actions}</td>
          </tr>
        `;
      }).join('');
    } catch (error) {
      container.innerHTML = '<tr><td colspan="5" class="text-center py-5 text-danger">Không thể tải dữ liệu.</td></tr>';
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
    if (error && /dang nhap|người dùng|nguoi dung|token|session|bearer|401/i.test(error.message || "")) {
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
      console.log("[CreateProduct] Submitting form. User ID:", userId);

      if (!userId) {
        showToast("Phiên đăng nhập hết hạn", "error");
        console.error("[CreateProduct] Cannot submit: userId is null");
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

        console.log("[CreateProduct] Calling API createProduct...");
        var response = await window.BikeApi.createProduct(formData);
        console.log("[CreateProduct] API Response:", response);

        if (response && response.success) {
          window.BikeApi.showToast("Đăng tin thành công! Tin của bạn đang chờ quản trị viên duyệt.", "success");
          form.reset();
          selectedProductImages = [];
          renderImagePreviews();
          syncImageInput(document.getElementById("productImage"));
          window.setTimeout(function () {
            window.location.href = "user.php";
          }, 1500);
        } else {
          var errorMsg = response && response.message ? response.message : "Không thể đăng tin lúc này";
          showToast(errorMsg, "error");
          console.error("[CreateProduct] API Error:", errorMsg);
        }
      } catch (error) {
        console.error("[CreateProduct] Exception during submission:", error);
        showToast(getFriendlyCreateError(error), "error");
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  function start() {
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

      const result = await Swal.fire({
        title: 'Xác nhận xóa?',
        text: "Bạn có chắc chắn muốn xóa tin đăng này không? Thao tác này không thể hoàn tác.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
      });

      if (!result.isConfirmed) return;

      try {
        var response = await window.BikeApi.deleteProduct(productId);
        if (response.success) {
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Tin đăng của bạn đã được gỡ bỏ.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          
          // Refresh lists
          var currentUser = window.BikeApi.getAuthUser();
          loadUserListings(currentUser || user); 
        } else {
          Swal.fire('Lỗi!', response.message || 'Không thể xóa tin đăng.', 'error');
        }
      } catch (error) {
        console.error("[UserPage] Delete error:", error);
        Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi kết nối đến máy chủ.', 'error');
      }
    });
  }

  window.updateRequestStatus = async function(id, status) {
    const statusLabels = {
      'accepted': 'chấp nhận',
      'rejected': 'từ chối',
      'completed': 'hoàn thành'
    };

    const result = await Swal.fire({
      title: 'Xác nhận?',
      text: `Bạn có chắc muốn ${statusLabels[status]} yêu cầu này?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    });

    if (!result.isConfirmed) return;

    try {
      var res = await window.BikeApi.updateBuyRequestStatus(id, status);
      if (res.success) {
        showToast("Cập nhật trạng thái thành công!", "success");
        loadSellRequests(); // Refresh table
      } else {
        showToast(res.message || "Lỗi khi cập nhật.", "error");
      }
    } catch (error) {
      showToast("Lỗi kết nối máy chủ.", "error");
    }
  };

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
      case 'pending': return 'Chờ phản hồi';
      case 'accepted': return 'Đã chấp nhận';
      case 'rejected': return 'Đã từ chối';
      case 'completed': return 'Đã hoàn thành';
      default: return status;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
