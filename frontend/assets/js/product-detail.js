/**
 * Bike Market - Product Detail Logic
 */

(function () {
  "use strict";

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = value || "N/A";
  }

  async function initDetail() {
    var api = window.BikeApi;
    var params = new URLSearchParams(window.location.search);
    var productId = params.get("id");

    if (!productId) {
      window.location.href = "./products.html";
      return;
    }

    try {
      var response = await api.getProduct(productId);
      var product = response.data;
      if (!product) throw new Error("Khong tim thay san pham.");

      renderProduct(product);
      initActions(product);
      loadRelatedProducts(product.category_id, product.id);
    } catch (error) {
      alert(error.message || "Khong the tai chi tiet san pham.");
    }
  }

  function renderProduct(product) {
    var api = window.BikeApi;
    var title = product.title || product.name || "Xe dap";
    var images = Array.isArray(product.images) ? product.images : [];
    var firstImage = product.image_url || product.primary_image || (images[0] && images[0].image_url);

    document.title = title + " - Bike Market";
    setText("breadcrumbName", title);
    setText("productName", title);
    setText("productPrice", api.formatCurrency(product.price));
    setText("productBadge", product.category_name || "Xe dap");
    setText("productDesc", product.description || "Khong co mo ta.");
    setText("sellerName", product.seller_name || "Nguoi ban");
    setText("sellerLocation", product.location || product.seller_city || "Toan quoc");
    setText("specBrand", product.brand_name || product.brand);
    setText("specFrame", product.frame_material || product.frame);
    setText("specWheel", product.wheel_size || product.wheel);
    setText("specGroupset", product.groupset);
    setText("specBrake", product.brake_type || product.brake);
    setText("specCondition", product.condition_state || product.condition);

    var mainImage = document.getElementById("mainProductImg");
    if (mainImage) mainImage.src = api.resolveImageUrl(firstImage);

    var thumbContainer = document.getElementById("imageThumbnails");
    if (thumbContainer && images.length > 1) {
      thumbContainer.innerHTML = "";
      images.forEach(function (image) {
        var thumb = document.createElement("img");
        thumb.src = api.resolveImageUrl(image.image_url);
        thumb.className = "img-thumbnail mr-2 mb-2";
        thumb.style.width = "80px";
        thumb.style.height = "80px";
        thumb.style.objectFit = "cover";
        thumb.addEventListener("click", function () {
          if (mainImage) mainImage.src = thumb.src;
        });
        thumbContainer.appendChild(thumb);
      });
    }
  }

  function initActions(product) {
    var phone = product.seller_phone || "";
    var callButtons = document.querySelectorAll("#btnCall, #btnCallSticky, #btnZalo");

    callButtons.forEach(function (button) {
      if (!phone) {
        button.classList.add("d-none");
        return;
      }

      button.href = button.id === "btnZalo" ? "https://zalo.me/" + phone : "tel:" + phone;
    });

    document.querySelectorAll("#btnFavorite, #btnFavoriteSticky").forEach(function (button) {
      button.addEventListener("click", async function (event) {
        event.preventDefault();
        try {
          var active = button.classList.contains("active");
          await window.BikeApi.toggleFavorite(product.id, active ? "remove" : "add");
          button.classList.toggle("active", !active);
        } catch (error) {
          alert(error.message || "Khong the luu tin.");
        }
      });
    });
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
        grid.innerHTML = '<div class="col-12 text-center text-muted">Khong co san pham tuong tu.</div>';
        return;
      }

      items.forEach(function (item) {
        grid.appendChild(window.renderProductCard(item));
      });
    } catch (error) {
      grid.innerHTML = "";
    }
  }

  document.addEventListener("DOMContentLoaded", initDetail);
})();
