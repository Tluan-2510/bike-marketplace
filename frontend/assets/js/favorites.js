(function () {
  "use strict";

  if (!window.BikeApi) return;

  var elements = {
    message: document.getElementById("favoritesMessage"),
    loading: document.getElementById("favoritesLoading"),
    list: document.getElementById("favoritesList"),
    empty: document.getElementById("favoritesEmpty"),
  };

  var state = {
    items: [],
  };

  function showMessage(text, type) {
    if (!elements.message) return;
    elements.message.textContent = text;
    elements.message.className =
      "alert alert-" + (type === "success" ? "success" : "danger");
  }

  function hideMessage() {
    if (!elements.message) return;
    elements.message.textContent = "";
    elements.message.className = "alert d-none";
  }

  function normalizeItem(item) {
    return {
      id: item.id || item.product_id || item.productId,
      name: item.name || item.product_name || item.title || "Sản phẩm",
      price: Number(item.price || 0),
      category: item.category || item.type || "-",
      status: item.status || "-",
      image:
        item.image_url ||
        item.image ||
        item.thumbnail ||
        "../assets/images/f1.png",
    };
  }

  function setLoading(visible) {
    if (!elements.loading) return;
    elements.loading.style.display = visible ? "block" : "none";
  }

  function setEmpty(visible) {
    if (!elements.empty) return;
    elements.empty.classList.toggle("d-none", !visible);
  }

  function clearList() {
    if (!elements.list) return;
    elements.list.innerHTML = "";
  }

  function removeItemFromState(productId) {
    state.items = state.items.filter(function (item) {
      return String(item.id) !== String(productId);
    });
  }

  async function removeFavorite(productId) {
    try {
      await window.BikeApi.request("/favorites/" + productId, {
        method: "DELETE",
        auth: true,
      });
      return;
    } catch (error) {
      if (error.status !== 404 && error.status !== 405) {
        throw error;
      }
    }

    await window.BikeApi.request("/favorites", {
      method: "POST",
      auth: true,
      body: { product_id: productId, action: "remove" },
    });
  }

  function createCard(item) {
    var col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.setAttribute("data-product-id", String(item.id || ""));

    col.innerHTML =
      '<div class="card shadow border-0 h-100">' +
      '<div class="img-card p-3 text-center">' +
      '<img src="' +
      item.image +
      '" class="img-fluid" style="max-height: 160px" alt="Ảnh sản phẩm" />' +
      "</div>" +
      '<div class="card-body d-flex flex-column">' +
      "<h5 class=\"card-title\">" +
      item.name +
      "</h5>" +
      "<p class=\"mb-1\"><b>Giá:</b> " +
      window.BikeApi.formatCurrency(item.price) +
      "</p>" +
      "<p class=\"mb-1\"><b>Loại:</b> " +
      item.category +
      "</p>" +
      "<p class=\"mb-3\"><b>Trạng thái:</b> " +
      item.status +
      "</p>" +
      '<div class="mt-auto d-flex justify-content-between">' +
      '<a href="./product-detail.html?id=' +
      encodeURIComponent(item.id || "") +
      '" class="btn btn-outline-dark">Chi tiết</a>' +
      '<button type="button" class="btn btn-outline-warning favorite-remove-btn">' +
      '<span class="text-danger" aria-hidden="true">♥</span> Bỏ thích' +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>";

    var removeBtn = col.querySelector(".favorite-remove-btn");
    removeBtn.addEventListener("click", async function () {
      removeBtn.disabled = true;
      hideMessage();
      try {
        await removeFavorite(item.id);
        removeItemFromState(item.id);
        renderList();
        showMessage("Đã bỏ sản phẩm khỏi danh sách yêu thích.", "success");
      } catch (error) {
        showMessage("Không thể bỏ yêu thích: " + error.message, "danger");
      } finally {
        removeBtn.disabled = false;
      }
    });

    return col;
  }

  function renderList() {
    if (!elements.list) return;
    clearList();

    if (!state.items.length) {
      setEmpty(true);
      return;
    }

    setEmpty(false);
    state.items.forEach(function (item) {
      elements.list.appendChild(createCard(item));
    });
  }

  async function loadFavorites() {
    hideMessage();
    setLoading(true);
    setEmpty(false);
    clearList();

    if (!window.BikeApi.getAuthToken()) {
      setLoading(false);
      showMessage("Bạn cần đăng nhập để xem danh sách yêu thích.", "danger");
      return;
    }

    try {
      var payload = await window.BikeApi.request("/favorites", {
        method: "GET",
        auth: true,
      });
      state.items = window.BikeApi.pickList(payload).map(normalizeItem);
      renderList();
    } catch (error) {
      state.items = [];
      clearList();
      setEmpty(false);
      showMessage("Không thể tải danh sách yêu thích: " + error.message, "danger");
    } finally {
      setLoading(false);
    }
  }

  document.addEventListener("DOMContentLoaded", loadFavorites);
})();
