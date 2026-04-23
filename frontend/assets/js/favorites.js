(function () {
  "use strict";

  const BikeApi = window.BikeApi;

  async function loadFavorites() {
    const list = document.getElementById("favoritesList");
    const loading = document.getElementById("favoritesLoading");
    const empty = document.getElementById("favoritesEmpty");

    const token = BikeApi.getAuthToken();
    const user = BikeApi.getAuthUser ? BikeApi.getAuthUser() : null;
    if (!token && !user) {
      if (loading) loading.classList.add("d-none");
      if (empty) {
          empty.classList.remove("d-none");
          empty.querySelector("p").textContent = "Vui lòng đăng nhập để xem danh sách yêu thích.";
          empty.querySelector("a").textContent = "Đăng nhập ngay";
          empty.querySelector("a").href = "./login.html";
      }
      return;
    }

    try {
      const response = await BikeApi.getFavorites();
      const products = BikeApi.pickList(response);

      if (loading) loading.classList.add("d-none");

      if (products.length === 0) {
        if (empty) empty.classList.remove("d-none");
        return;
      }

      list.innerHTML = "";
      products.forEach(product => {
        const card = createFavoriteCard(product);
        list.appendChild(card);
      });
    } catch (error) {
      console.error("Lỗi khi tải yêu thích:", error);
      if (loading) loading.innerHTML = '<p class="text-danger">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>';
    }
  }

  function createFavoriteCard(product) {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4 mb-4";
    
    const imageUrl = BikeApi.resolveImageUrl(product.image_url);
    const price = BikeApi.formatCurrency(product.price);
    
    col.innerHTML = `
      <div class="box h-100 d-flex flex-column bg-white shadow-sm rounded">
        <div class="img-box">
          <img src="${imageUrl}" alt="${product.name}" class="img-fluid w-100 object-fit-cover" style="height: 250px;">
        </div>
        <div class="detail-box p-3 flex-grow-1 d-flex flex-column">
          <h5>${product.name}</h5>
          <h6 class="text-warning font-weight-bold mb-3">${price}</h6>
          <div class="mt-auto d-flex justify-content-between">
             <button class="btn btn-sm btn-outline-danger remove-btn"><i class="fa-light fa-trash"></i> Bỏ lưu</button>
             <a href="./product-detail.html?id=${product.id}" class="btn btn-sm btn-dark">Chi tiết</a>
          </div>
        </div>
      </div>
    `;

    col.querySelector(".remove-btn").onclick = async () => {
        try {
            await BikeApi.toggleFavorite(product.id, "remove");
            col.remove();
            const list = document.getElementById("favoritesList");
            if (list.children.length === 0) {
                document.getElementById("favoritesEmpty").classList.remove("d-none");
            }
        } catch (e) {
            alert("Lỗi khi bỏ lưu: " + e.message);
        }
    };

    return col;
  }

  document.addEventListener("DOMContentLoaded", loadFavorites);
})();
