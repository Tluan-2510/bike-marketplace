/**
 * Bike Market - Product Detail Logic
 */

(function () {
  "use strict";

  var favoriteActive = false;

  function showToast(message, type) {
    if (window.BikeApi && typeof window.BikeApi.showToast === "function") {
      return window.BikeApi.showToast(message, type);
    }
    if (window.BikeToast && typeof window.BikeToast.show === "function") {
      return window.BikeToast.show(message, type);
    }
    return null;
  }

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = value || "N/A";
  }

  function pickProduct(payload) {
    if (!payload) return null;
    return payload.data || payload.product || payload;
  }

  function pickValue(source, keys) {
    for (var i = 0; i < keys.length; i++) {
      var value = source && source[keys[i]];
      if (value !== null && typeof value !== "undefined" && String(value).trim() !== "") {
        return value;
      }
    }
    return "";
  }

  function extractImageUrl(image) {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.image_url || image.url || image.src || image.path || "";
  }

  function collectProductImages(product) {
    var urls = [];
    var imageCollections = [product.images, product.product_images, product.gallery];

    [product.image_url, product.primary_image, product.thumbnail].forEach(function (url) {
      if (url) urls.push(url);
    });

    imageCollections.forEach(function (collection) {
      if (!Array.isArray(collection)) return;
      collection.forEach(function (image) {
        var url = extractImageUrl(image);
        if (url) urls.push(url);
      });
    });

    urls = urls.filter(function (url, index) {
      return url && urls.indexOf(url) === index;
    });

    return urls.length ? urls : ["../assets/images/placeholder-bike.png"];
  }

  function iconSvg(type) {
    var icons = {
      brand: 'fa-tag',
      frame: 'fa-bicycle',
      wheel: 'fa-life-ring',
      groupset: 'fa-cogs',
      brake: 'fa-dot-circle-o',
      condition: 'fa-star-o',
      heart: 'fa-heart'
    };
    var iconClass = icons[type] || 'fa-info-circle';
    return '<i class="fa ' + iconClass + '" aria-hidden="true"></i>';
  }

  async function initDetail() {
    var api = window.BikeApi;
    var params = new URLSearchParams(window.location.search);
    var productId = params.get("id");

    if (!productId) {
      window.location.href = "./products.php";
      return;
    }

    try {
      var response = await api.getProduct(productId);
      var product = pickProduct(response);
      if (!product) throw new Error("Không tìm thấy sản phẩm.");

      renderProduct(product);
      await initActions(product);
      loadRelatedProducts(product.category_id, product.id || product.product_id || productId);
    } catch (error) {
      showToast(/không tìm thấy sản phẩm/i.test(error.message || "") ? "Không tìm thấy sản phẩm" : "Không thể tải chi tiết sản phẩm.", "error");
    }
  }

  function renderProduct(product) {
    var api = window.BikeApi;
    var title = pickValue(product, ["title", "name"]) || "Xe đạp";
    var images = collectProductImages(product);

    document.title = title + " - Bike Market";
    setText("breadcrumbName", title);
    setText("productName", title);
    setText("productPrice", api.formatCurrency(product.price));
    var categoryName = product.category_name || "Xe đạp";
    var badgeHtml = categoryName;
    if (product.is_approved == 0 || product.is_approved === '0' || product.is_approved === false) {
      badgeHtml += ' <span class="badge badge-warning ml-2" style="background: #ffc107; color: #212529; font-size: 0.7em; vertical-align: middle;">Chờ duyệt</span>';
      var badgeElem = document.getElementById("productBadge");
      if (badgeElem) {
        badgeElem.innerHTML = badgeHtml;
      }
    } else {
      setText("productBadge", categoryName);
    }
    setText("productDesc", product.description || "Không có mô tả.");
    var sellerName = product.seller_name || product.full_name || "Người bán";
    setText("sellerName", sellerName);
    setText("sellerLocation", product.location || product.seller_city || product.city || "Toàn quốc");

    var sellerAvatar = document.getElementById("sellerAvatar");
    if (sellerAvatar) {
      sellerAvatar.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(sellerName) + "&background=FFD700&color=000&size=100&bold=true";
    }
    renderProductSpecs(product);

    favoriteActive = Boolean(product.is_favorite || product.isFavorite || product.favorite_id);
    updateFavoriteButtonState(favoriteActive);
    initProductGallery(images, title);
  }

  function renderProductSpecs(product) {
    var container = document.getElementById("productSpecs");
    if (!container) return;

    var specs = [
      { icon: "brand", title: "Hãng", value: pickValue(product, ["brand_name", "brand"]) },
      { icon: "frame", title: "Khung", value: pickValue(product, ["frame_material", "frame"]) },
      { icon: "wheel", title: "Bánh", value: pickValue(product, ["wheel_size", "wheel"]) },
      { icon: "groupset", title: "Truyền động", value: pickValue(product, ["groupset"]) },
      { icon: "brake", title: "Phanh", value: pickValue(product, ["brake_type", "brake"]) },
      { icon: "condition", title: "Tình trạng", value: pickValue(product, ["condition_state", "condition"]) }
    ].filter(function (spec) {
      return String(spec.value || "").trim();
    });

    container.innerHTML = "";
    if (!specs.length) {
      container.innerHTML = '<div class="spec-empty">Không đủ dữ liệu để hiển thị thông số sản phẩm.</div>';
      return;
    }

    specs.forEach(function (spec) {
      var item = document.createElement("div");
      item.className = "spec-item";
      item.innerHTML = [
        '<span class="spec-icon">' + iconSvg(spec.icon) + '</span>',
        '<span class="spec-content">',
        '<span class="spec-title"></span>',
        '<span class="spec-text"></span>',
        '</span>'
      ].join("");
      item.querySelector(".spec-title").textContent = spec.title;
      item.querySelector(".spec-text").textContent = spec.value;
      container.appendChild(item);
    });
  }

  function initProductGallery(images, title) {
    var api = window.BikeApi;
    var mainImage = document.getElementById("mainProductImg");
    var thumbContainer = document.getElementById("imageThumbnails");
    if (!mainImage || !thumbContainer) return;

    var imageUrls = images.map(function (url) {
      return api.resolveImageUrl(url);
    });

    function setActiveImage(url, index) {
      mainImage.classList.remove("fade-in");
      mainImage.src = url;
      mainImage.alt = title || "Sản phẩm";
      void mainImage.offsetWidth;
      mainImage.classList.add("fade-in");

      thumbContainer.querySelectorAll(".thumb-item").forEach(function (button, buttonIndex) {
        button.classList.toggle("active", buttonIndex === index);
        button.setAttribute("aria-selected", buttonIndex === index ? "true" : "false");
      });
    }

    thumbContainer.innerHTML = "";
    imageUrls.forEach(function (url, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "thumb-item" + (index === 0 ? " active" : "");
      button.setAttribute("aria-label", "Xem ảnh sản phẩm " + (index + 1));
      button.setAttribute("aria-selected", index === 0 ? "true" : "false");
      button.innerHTML = '<img src="' + url + '" alt="' + (title || "Sản phẩm") + '">';
      button.addEventListener("click", function () {
        setActiveImage(url, index);
      });
      thumbContainer.appendChild(button);
    });

    setActiveImage(imageUrls[0], 0);
  }

  function normalizeVietnamesePhone(phone) {
    var rawPhone = String(phone || "").trim();
    if (!rawPhone) return "";

    var cleaned = rawPhone.replace(/[\s.-]/g, "");
    if (cleaned.indexOf("+84") === 0) return "84" + cleaned.slice(3);
    cleaned = cleaned.replace(/\D/g, "");
    if (cleaned.indexOf("84") === 0) return cleaned;
    if (cleaned.indexOf("0") === 0) return "84" + cleaned.slice(1);
    if (cleaned.length === 9) return "84" + cleaned;
    return cleaned;
  }

  function normalizePhoneForCall(phone) {
    var cleaned = String(phone || "").replace(/[\s.-]/g, "");
    if (cleaned.indexOf("+84") === 0) return cleaned;
    cleaned = cleaned.replace(/\D/g, "");
    if (cleaned.indexOf("84") === 0) return "+" + cleaned;
    return cleaned;
  }

  async function resolveSellerPhone(product) {
    var directPhone = pickValue(product, ["seller_phone", "phone_number", "phone", "sellerPhone"]);
    if (directPhone) return directPhone;

    var sellerId = product.seller_id || product.user_id;
    if (!sellerId || !window.BikeApi.getUser) return "";

    try {
      var response = await window.BikeApi.getUser(sellerId);
      var seller = pickProduct(response);
      return pickValue(seller, ["phone_number", "phone", "seller_phone"]);
    } catch (error) {
      return "";
    }
  }

  var currentProduct = null;

  async function initActions(product) {
    currentProduct = product;
    var api = window.BikeApi;
    var currentUserId = api.getAuthUserId();
    var sellerId = product.seller_id || product.user_id;

    // Show/Hide actions based on ownership
    var ownerBox = document.getElementById("ownerActions");
    var visitorBox = document.getElementById("visitorActions");

    if (currentUserId && String(currentUserId) === String(sellerId)) {
      if (ownerBox) ownerBox.classList.remove("d-none");
      if (visitorBox) visitorBox.classList.add("d-none");
      
      // Update status if already sold
      var btnMarkSold = document.getElementById("btnMarkSold");
      if (product.status === "sold" && btnMarkSold) {
        btnMarkSold.disabled = true;
        btnMarkSold.innerHTML = '<i class="fa fa-check-circle mr-2"></i> TIN ĐÃ BÁN';
        btnMarkSold.className = "btn-sold-status mb-3";
      }
    } else {
      if (ownerBox) ownerBox.classList.add("d-none");
      if (visitorBox) visitorBox.classList.remove("d-none");
      
      // Show "Sold Out" badge if status is sold
      if (product.status === "sold") {
        var btnBuyNow = document.getElementById("btnBuyNow");
        if (btnBuyNow) {
          btnBuyNow.disabled = true;
          btnBuyNow.innerHTML = '<i class="fa fa-lock mr-2"></i> SẢN PHẨM ĐÃ BÁN';
          btnBuyNow.className = "btn-sold-status mb-3";
        }

        // Cập nhật thanh sticky trên mobile
        var btnCallSticky = document.getElementById("btnCallSticky");
        if (btnCallSticky) {
          btnCallSticky.textContent = "HẾT HÀNG";
          btnCallSticky.style.background = "#ccc";
          btnCallSticky.style.pointerEvents = "none";
          btnCallSticky.href = "javascript:void(0)";
        }
        var btnZaloSticky = document.getElementById("btnZaloSticky");
        if (btnZaloSticky) {
          btnZaloSticky.style.display = "none";
        }
      }
    }

    var phone = await resolveSellerPhone(product);
    setupPhoneActions(phone);
  }

  // Global listeners attached on load
  function initGlobalListeners() {
    // Buy Now Button
    var btnBuyNow = document.getElementById("btnBuyNow");
    if (btnBuyNow) {
      btnBuyNow.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Buy Now clicked");
        var userId = window.BikeApi.getAuthUserId();
        if (!userId) {
          showToast("Vui lòng đăng nhập để gửi yêu cầu mua.", "info");
          window.setTimeout(() => window.location.href = "./login.php", 1500);
          return;
        }
        
        if (typeof $ !== "undefined" && typeof $.fn.modal === "function") {
          $('#buyRequestModal').modal('show');
        } else {
          console.error("Bootstrap Modal or jQuery not found");
          showToast("Có lỗi xảy ra với giao diện. Vui lòng thử lại sau.", "error");
        }
      });
    }

    // Confirm Buy Request
    var confirmBtn = document.getElementById("confirmBuyRequest");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", async function () {
        if (!currentProduct) {
          showToast("Đang tải thông tin sản phẩm, vui lòng đợi...", "info");
          return;
        }
        
        var message = document.getElementById("buyRequestMessage").value;
        var productId = currentProduct.id || currentProduct.product_id;
        
        try {
          confirmBtn.disabled = true;
          confirmBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Đang gửi...';
          
          var res = await window.BikeApi.createBuyRequest({
            product_id: productId,
            message: message
          });
          
          if (res.success) {
            showToast("Gửi yêu cầu thành công! Người bán sẽ sớm liên hệ với bạn.", "success");
            $('#buyRequestModal').modal('hide');
            document.getElementById("buyRequestMessage").value = "";
          } else {
            showToast(res.message || "Không thể gửi yêu cầu.", "error");
          }
        } catch (error) {
          console.error("Buy request error:", error);
          showToast("Không thể gửi yêu cầu. Vui lòng thử lại.", "error");
        } finally {
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Gửi yêu cầu";
        }
      });
    }

    // Favorite Buttons
    document.querySelectorAll("#btnFavorite, #btnFavoriteSticky").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        if (currentProduct) {
          toggleFavorite(currentProduct);
        } else {
          showToast("Đang tải sản phẩm...", "info");
        }
      });
    });

    // Mark as Sold Button
    var btnMarkSold = document.getElementById("btnMarkSold");
    if (btnMarkSold) {
      btnMarkSold.addEventListener("click", async function() {
        if (!currentProduct) return;
        
        const result = await Swal.fire({
          title: 'Xác nhận đã bán?',
          text: "Tin đăng sẽ không hiển thị trên chợ nữa sau khi bạn xác nhận.",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1a1a1a',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Đúng, tôi đã bán xe',
          cancelButtonText: 'Hủy',
          background: '#ffffff',
          color: '#1a1a1a',
          borderRadius: '15px',
          customClass: {
            confirmButton: 'btn-swal-confirm',
            cancelButton: 'btn-swal-cancel'
          }
        });

        if (!result.isConfirmed) return;

        try {
          btnMarkSold.disabled = true;
          var res = await window.BikeApi.updateProductStatus(currentProduct.id || currentProduct.product_id, "sold");
          if (res.success) {
            window.location.reload();
          } else {
            showToast(res.message || "Không thể cập nhật trạng thái.", "error");
            btnMarkSold.disabled = false;
          }
        } catch (error) {
          showToast("Có lỗi xảy ra. Vui lòng thử lại.", "error");
          btnMarkSold.disabled = false;
        }
      });
    }

    // Delete Product Button
    var btnDeleteProduct = document.getElementById("btnDeleteProduct");
    if (btnDeleteProduct) {
      btnDeleteProduct.addEventListener("click", async function() {
        if (!currentProduct) return;

        const result = await Swal.fire({
          title: 'Gỡ tin đăng?',
          text: "Bạn có chắc chắn muốn gỡ tin này? Hành động này không thể hoàn tác.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#dc3545',
          cancelButtonColor: '#1a1a1a',
          confirmButtonText: 'Gỡ tin ngay',
          cancelButtonText: 'Quay lại',
          background: '#ffffff',
          color: '#1a1a1a',
          borderRadius: '15px'
        });

        if (!result.isConfirmed) return;

        try {
          btnDeleteProduct.disabled = true;
          var res = await window.BikeApi.deleteProduct(currentProduct.id || currentProduct.product_id);
          if (res.success) {
            window.location.href = "./user.php";
          } else {
            showToast(res.message || "Không thể xóa tin.", "error");
            btnDeleteProduct.disabled = false;
          }
        } catch (error) {
          showToast("Có lỗi xảy ra. Vui lòng thử lại.", "error");
          btnDeleteProduct.disabled = false;
        }
      });
    }
  }

  function setupPhoneActions(phone) {
    var zaloPhone = normalizeVietnamesePhone(phone);
    var callPhone = normalizePhoneForCall(phone);
    var callButtons = document.querySelectorAll("#btnCall, #btnCallSticky");
    var zaloButtons = document.querySelectorAll("#btnZalo, #btnZaloSticky");

    callButtons.forEach(function (button) {
      if (!callPhone) {
        button.classList.add("d-none");
        return;
      }

      button.classList.remove("d-none");
      button.href = "tel:" + callPhone;
    });

    zaloButtons.forEach(function (button) {
      if (!zaloPhone) {
        button.classList.add("d-none");
        button.removeAttribute("href");
        return;
      }

      button.classList.remove("d-none");
      button.href = "https://zalo.me/" + zaloPhone;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
    });
  }

  function updateFavoriteButtonState(isActive) {
    favoriteActive = Boolean(isActive);
    document.querySelectorAll("#btnFavorite, #btnFavoriteSticky").forEach(function (button) {
      var text = button.querySelector(".favorite-text");
      var stickyText = button.querySelector(".favorite-sticky-text");

      button.classList.toggle("active", favoriteActive);
      button.setAttribute("aria-pressed", favoriteActive ? "true" : "false");
      button.setAttribute("aria-label", favoriteActive ? "Bỏ yêu thích" : "Yêu thích");

      if (text) {
        text.textContent = favoriteActive ? "Bỏ yêu thích" : "Yêu thích";
      }
      if (stickyText) {
        stickyText.textContent = favoriteActive ? "Bỏ yêu thích" : "Yêu thích";
      }
    });
  }

  async function toggleFavorite(product) {
    var productId = product.id || product.product_id;
    if (!productId) {
      showToast("Không thể xác định sản phẩm.", "error");
      return;
    }
    var userId = window.BikeApi.getAuthUserId();
    if (!userId) {
      showToast("Phiên đăng nhập hết hạn", "error");
      return;
    }

    var previousState = favoriteActive;
    var nextState = !previousState;
    updateFavoriteButtonState(nextState);

    try {
      await window.BikeApi.toggleFavorite(productId, nextState ? "add" : "remove");
      showToast(nextState ? "Đã lưu vào yêu thích" : "Đã bỏ khỏi yêu thích", "success");
    } catch (error) {
      updateFavoriteButtonState(previousState);
      showToast("Không thể cập nhật yêu thích lúc này.", "error");
    }
  }

  async function loadRelatedProducts(categoryId, excludeId) {
    var grid = document.getElementById("relatedProductsGrid");
    if (!grid || !categoryId) return;

    try {
      var response = await window.BikeApi.getProducts({ category_id: categoryId, limit: 4 });
      var items = window.BikeApi.pickList(response).filter(function (item) {
        return String(item.id) !== String(excludeId);
      }).slice(0, 3);

      grid.innerHTML = "";
      if (!items.length) {
        grid.innerHTML = '<div class="col-12 text-center text-muted">Không có sản phẩm tương tự.</div>';
        return;
      }

      items.forEach(function (item) {
        grid.appendChild(window.renderProductCard(item));
      });
    } catch (error) {
      grid.innerHTML = '<div class="col-12 text-center text-muted">Không thể tải sản phẩm tương tự.</div>';
    }
  }

  function start() {
    initGlobalListeners();
    initDetail();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
