/**
 * Bike Market - Products Logic
 * Combined: Homepage listings, Shop filtering, and Favorites
 */

(function () {
  "use strict";

  async function initProducts() {
    const api = window.BikeApi;
    const render = window.renderProductCard;

    // Homepage Products
    const homeGrid = document.getElementById("productGrid");
    if (homeGrid && !document.getElementById("shopProductGrid")) {
      try {
        const res = await api.getProducts({ limit: 6 });
        const items = api.pickList(res);
        if (items.length) {
          homeGrid.innerHTML = "";
          items.forEach(p => homeGrid.appendChild(render(p)));
          document.getElementById("productGridLoader")?.classList.add("d-none");
        }
      } catch (e) { console.error(e); }
    }

    // Shop/Products Page
    const shopGrid = document.getElementById("shopProductGrid");
    if (shopGrid) {
      const loadShop = async (filters = {}) => {
        document.getElementById("shopLoader")?.classList.remove("d-none");
        try {
          const res = await api.getProducts(filters);
          const items = api.pickList(res);
          shopGrid.innerHTML = items.length ? "" : '<div class="col-12 text-center py-5">Không tìm thấy xe phù hợp.</div>';
          items.forEach(p => shopGrid.appendChild(render(p)));
          document.getElementById("shopLoader")?.classList.add("d-none");
        } catch (e) { console.error(e); }
      };
      
      loadShop();

      document.getElementById("filterForm")?.addEventListener("submit", e => {
        e.preventDefault();
        const filters = {
          keyword: document.getElementById("filterKeyword")?.value,
          category: document.getElementById("filterCategory")?.value,
          price_range: document.getElementById("filterPrice")?.value
        };
        loadShop(filters);
      });
    }

    // Favorites Page
    const favGrid = document.getElementById("favoritesGrid");
    if (favGrid) {
      try {
        const res = await api.getFavorites();
        const items = api.pickList(res);
        favGrid.innerHTML = items.length ? "" : '<div class="col-12 text-center py-5">Danh sách yêu thích trống.</div>';
        items.forEach(p => favGrid.appendChild(render(p)));
        document.getElementById("favLoader")?.classList.add("d-none");
      } catch (e) { console.error(e); }
    }
  }

  document.addEventListener("DOMContentLoaded", initProducts);
})();
