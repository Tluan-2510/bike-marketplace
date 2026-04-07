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
    return "http://localhost/api";
  }

  function buildApiUrl(path) {
    var cleanPath = String(path || "");
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
    return resolveApiBaseUrl() + cleanPath;
  }

  var API = {
    createProduct: buildApiUrl("/products"),
  };

  var STORAGE_KEYS = {
    accessToken: "access_token",
  };

  function normalizeValue(value) {
    return String(value || "").trim();
  }

  function getToken() {
    return (
      localStorage.getItem(STORAGE_KEYS.accessToken) ||
      localStorage.getItem("token") ||
      ""
    );
  }

  function parseJSON(text) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return {};
    }
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

    if (status === 401) return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    if (status === 404) return "Backend chưa hỗ trợ API tạo sản phẩm (/products).";
    if (status === 405) return "Sai phương thức gọi API. Kiểm tra backend routing.";
    if (status >= 500) return "Hệ thống đang bận. Vui lòng thử lại sau.";
    return "Không thể đăng sản phẩm. Vui lòng kiểm tra dữ liệu.";
  }

  function validatePayload(payload) {
    if (
      !payload.name ||
      !payload.category ||
      !payload.status ||
      !payload.description
    ) {
      return "Vui lòng nhập đầy đủ thông tin bắt buộc.";
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      return "Giá phải lớn hơn 0.";
    }

    if (!Number.isInteger(payload.quantity) || payload.quantity <= 0) {
      return "Số lượng phải là số nguyên lớn hơn 0.";
    }

    return "";
  }

  function buildPayload(form) {
    var price = Number(form.querySelector('input[name="price"]').value);
    var quantity = Number(form.querySelector('input[name="quantity"]').value);

    return {
      name: normalizeValue(form.querySelector('input[name="name"]').value),
      price: price,
      category: normalizeValue(form.querySelector('select[name="category"]').value),
      quantity: Number.isFinite(quantity) ? Math.trunc(quantity) : quantity,
      status: normalizeValue(form.querySelector('select[name="status"]').value),
      description: normalizeValue(form.querySelector('textarea[name="description"]').value),
    };
  }

  function createRequestOptions(payload, imageFile, token) {
    var headers = {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    };

    if (imageFile) {
      var formData = new FormData();
      formData.append("name", payload.name);
      formData.append("price", String(payload.price));
      formData.append("category", payload.category);
      formData.append("quantity", String(payload.quantity));
      formData.append("status", payload.status);
      formData.append("description", payload.description);
      formData.append("image", imageFile);

      return {
        method: "POST",
        headers: headers,
        body: formData,
      };
    }

    headers["Content-Type"] = "application/json";
    return {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    };
  }

  function initImagePreview(imageInput, imagePreview) {
    if (!imageInput || !imagePreview) return;

    imageInput.addEventListener("change", function () {
      var file = imageInput.files && imageInput.files[0];
      if (!file) {
        imagePreview.classList.add("d-none");
        imagePreview.removeAttribute("src");
        return;
      }

      var objectUrl = URL.createObjectURL(file);
      imagePreview.src = objectUrl;
      imagePreview.classList.remove("d-none");
      imagePreview.onload = function () {
        URL.revokeObjectURL(objectUrl);
      };
    });
  }

  async function onSubmitCreateProduct(form, messageBox, submitButton, imageInput, imagePreview) {
    hideMessage(messageBox);

    var token = getToken();
    if (!token) {
      showMessage(messageBox, "Bạn cần đăng nhập trước khi đăng sản phẩm.", "danger");
      return;
    }

    var payload = buildPayload(form);
    var validationMessage = validatePayload(payload);
    if (validationMessage) {
      showMessage(messageBox, validationMessage, "danger");
      return;
    }

    var imageFile = imageInput && imageInput.files ? imageInput.files[0] : null;
    var restoreButton = setButtonLoading(submitButton, "Đang đăng sản phẩm...");

    try {
      var options = createRequestOptions(payload, imageFile, token);
      var response = await fetch(API.createProduct, options);
      var raw = await response.text();
      var result = parseJSON(raw);

      if (!response.ok || result.success === false) {
        throw new Error(normalizeApiError(result, response.status));
      }

      form.reset();
      if (imagePreview) {
        imagePreview.classList.add("d-none");
        imagePreview.removeAttribute("src");
      }
      showMessage(messageBox, "Đăng sản phẩm thành công.", "success");
    } catch (error) {
      showMessage(messageBox, error.message || "Đăng sản phẩm thất bại.", "danger");
    } finally {
      restoreButton();
    }
  }

  function initCreateProductForm() {
    var form = document.getElementById("createProductForm");
    if (!form) return;

    var messageBox = document.getElementById("productFormMessage");
    var submitButton = document.getElementById("submitProductButton");
    var imageInput = document.getElementById("productImage");
    var imagePreview = document.getElementById("productImagePreview");

    initImagePreview(imageInput, imagePreview);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      onSubmitCreateProduct(form, messageBox, submitButton, imageInput, imagePreview);
    });
  }

  document.addEventListener("DOMContentLoaded", initCreateProductForm);
})();
