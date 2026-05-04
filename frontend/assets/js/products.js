/**
 * Bike Market - Products Logic
 * Combined: Homepage listings, Shop filtering, and Favorites
 */

(function () {
  "use strict";

  function cleanFilters(filters) {
    return Object.entries(filters).reduce((result, entry) => {
      const [key, value] = entry;
      if (value && value !== "all") result[key] = value;
      return result;
    }, {});
  }

  function getUrlFilters() {
    const params = new URLSearchParams(window.location.search);
    return cleanFilters({
      keyword: params.get("keyword") || "",
      category: params.get("category") || "",
      category_id: params.get("category_id") || "",
      price_range: params.get("price_range") || "",
      min_price: params.get("min_price") || "",
      max_price: params.get("max_price") || "",
      seller_id: params.get("seller_id") || "",
      page: params.get("page") || "",
      limit: params.get("limit") || ""
    });
  }

  function syncFilterControls(filters) {
    const keyword = document.getElementById("filterKeyword");
    const category = document.getElementById("filterCategory");
    const price = document.getElementById("filterPrice");

    if (keyword && filters.keyword) keyword.value = filters.keyword;
    if (category && filters.category) category.value = filters.category;
    if (price && filters.price_range) price.value = filters.price_range;
  }

  function getControlFilters() {
    return cleanFilters({
      keyword: document.getElementById("filterKeyword")?.value.trim() || "",
      category: document.getElementById("filterCategory")?.value || "",
      price_range: document.getElementById("filterPrice")?.value || "",
      limit: "12"
    });
  }

  function updateProductsUrl(filters) {
    const params = new URLSearchParams(filters);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  function initHomeSearch() {
    const form = document.getElementById("bikeSearchForm");
    if (!form) return;

    form.addEventListener("submit", event => {
      event.preventDefault();

      const filters = cleanFilters({
        keyword: document.getElementById("searchKeyword")?.value.trim() || "",
        category: document.getElementById("searchType")?.value || "",
        price_range: document.getElementById("searchPrice")?.value || ""
      });
      const params = new URLSearchParams(filters);
      window.location.href = `./products.php${params.toString() ? `?${params.toString()}` : ""}`;
    });
  }

  async function initProducts() {
    const api = window.BikeApi;
    const render = window.renderProductCard;
    initHomeSearch();

    // Homepage Products
    const homeGrid = document.getElementById("productGrid");
    if (homeGrid && !document.getElementById("shopProductGrid")) {
      try {
        homeGrid.innerHTML = "";
        for (let i = 0; i < 3; i++) {
          homeGrid.appendChild(window.renderProductSkeleton());
        }
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
      const renderPagination = (currentPage, totalPages, onPageChange) => {
        const container = document.getElementById("shopPagination");
        if (!container) return;
        container.innerHTML = "";
        if (totalPages <= 1) return;

        const nav = document.createElement("nav");
        const ul = document.createElement("ul");
        ul.className = "pagination custom-pagination";

        // Previous
        const prevLi = document.createElement("li");
        prevLi.className = `page-item ${currentPage <= 1 ? "disabled" : ""}`;
        prevLi.innerHTML = `<a class="page-link" href="javascript:void(0)" aria-label="Previous"><i class="fa fa-chevron-left"></i></a>`;
        prevLi.onclick = () => currentPage > 1 && onPageChange(currentPage - 1);
        ul.appendChild(prevLi);

        // Pages
        for (let i = 1; i <= totalPages; i++) {
          const li = document.createElement("li");
          li.className = `page-item ${i === currentPage ? "active" : ""}`;
          li.innerHTML = `<a class="page-link" href="javascript:void(0)">${i}</a>`;
          li.onclick = () => onPageChange(i);
          ul.appendChild(li);
        }

        // Next
        const nextLi = document.createElement("li");
        nextLi.className = `page-item ${currentPage >= totalPages ? "disabled" : ""}`;
        nextLi.innerHTML = `<a class="page-link" href="javascript:void(0)" aria-label="Next"><i class="fa fa-chevron-right"></i></a>`;
        nextLi.onclick = () => currentPage < totalPages && onPageChange(currentPage + 1);
        ul.appendChild(nextLi);

        nav.appendChild(ul);
        container.appendChild(nav);
      };

      const loadShop = async (filters = {}) => {
        shopGrid.innerHTML = "";
        for (let i = 0; i < 6; i++) {
          shopGrid.appendChild(window.renderProductSkeleton());
        }
        document.getElementById("shopLoader")?.classList.remove("d-none");
        document.getElementById("shopPagination").innerHTML = "";

        try {
          const res = await api.getProducts(filters);
          // API returns { success: true, data: { items: [], total_items: 0, total_pages: 0, ... } }
          const data = res.data || {};
          const items = data.items || [];
          
          shopGrid.innerHTML = items.length ? "" : '<div class="col-12 text-center py-5">Không tìm thấy xe phù hợp.</div>';
          items.forEach(p => shopGrid.appendChild(render(p)));

          // Render pagination
          renderPagination(data.current_page || 1, data.total_pages || 0, (newPage) => {
            const currentFilters = getControlFilters();
            currentFilters.page = newPage;
            updateProductsUrl(currentFilters);
            loadShop(currentFilters);
            window.scrollTo({ top: shopGrid.offsetTop - 100, behavior: "smooth" });
          });
          
        } catch (e) {
          console.error(e);
          shopGrid.innerHTML = '<div class="col-12 text-center py-5 text-danger">Không thể tải danh sách sản phẩm.</div>';
        } finally {
          document.getElementById("shopLoader")?.classList.add("none");
          document.getElementById("shopLoader")?.classList.add("d-none");
        }
      };

      const initialFilters = getUrlFilters();
      syncFilterControls(initialFilters);
      loadShop(initialFilters);

      document.getElementById("filterForm")?.addEventListener("submit", e => {
        e.preventDefault();
        const filters = getControlFilters();
        filters.page = 1; // Reset to page 1 on new search
        updateProductsUrl(filters);
        loadShop(filters);
      });
    }

    // Favorites Page
    const favGrid = document.getElementById("favoritesGrid") || document.getElementById("favoritesList");
    if (favGrid) {
      const loading = document.getElementById("favLoader") || document.getElementById("favoritesLoading");
      const empty = document.getElementById("favEmpty") || document.getElementById("favoritesEmpty");

      try {
        favGrid.innerHTML = "";
        for (let i = 0; i < 3; i++) {
          favGrid.appendChild(window.renderProductSkeleton());
        }
        const res = await api.getFavorites();
        const items = api.pickList(res);
        favGrid.innerHTML = "";
        if (empty) empty.classList.toggle("d-none", Boolean(items.length));
        items.forEach(p => favGrid.appendChild(render(p)));
      } catch (e) {
        if (empty) empty.classList.add("d-none");
        favGrid.innerHTML = '<div class="col-12 text-center py-5 text-danger">Không thể tải danh sách yêu thích.</div>';
        if (window.BikeApi && typeof window.BikeApi.showToast === "function") {
          window.BikeApi.showToast("Không thể tải danh sách yêu thích.", "error");
        }
      } finally {
        if (loading) loading.classList.add("d-none");
      }
    }
  }

  document.addEventListener("DOMContentLoaded", initProducts);
})();
