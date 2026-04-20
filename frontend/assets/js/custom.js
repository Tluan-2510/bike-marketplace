(function () {
  "use strict";

  function getCurrentPageName() {
    var path = window.location.pathname || "";
    var parts = path.split("/");
    var file = parts[parts.length - 1] || "index.html";
    return file.toLowerCase();
  }

  function isActivePage(currentPage, pageNames) {
    return pageNames.indexOf(currentPage) !== -1;
  }

  function buildNavItem(href, label, active) {
    var activeClass = active ? " active" : "";
    var current = active ? ' <span class="sr-only">(current)</span>' : "";
    return (
      '<li class="nav-item' +
      activeClass +
      '"><a class="nav-link" href="' +
      href +
      '">' +
      label +
      current +
      "</a></li>"
    );
  }

  function syncHeader() {
    var nav = document.querySelector(".header_section .custom_nav-container");
    if (!nav) return;

    var navList = nav.querySelector(".navbar-nav.mx-auto");
    var userOption = nav.querySelector(".user_option");
    if (!navList || !userOption) return;

    var currentPage = getCurrentPageName();

    var homeActive = isActivePage(currentPage, ["index.html", ""]);
    var productActive = isActivePage(currentPage, ["product-detail.html"]);
    var createActive = isActivePage(currentPage, ["create_product.html"]);
    var favoriteActive = isActivePage(currentPage, ["favorites.html"]);
    var authActive = isActivePage(currentPage, ["login.html", "register.html"]);

    navList.innerHTML =
      buildNavItem("./index.html", "Trang chủ", homeActive) +
      buildNavItem("./index.html#xe-noi-bat", "Sản phẩm", productActive) +
      buildNavItem("./create_product.html", "Đăng bán", createActive) +
      buildNavItem("./favorites.html", "Yêu thích", favoriteActive);

    userOption.innerHTML =
      '<a href="./login.html" class="user_link' +
      (authActive ? " active" : "") +
      '" aria-label="Tài khoản">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>' +
      "</a>" +
      '<a class="cart_link' +
      (favoriteActive ? " active" : "") +
      '" href="./favorites.html" aria-label="Yêu thích">' +
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 456.029 456.029" style="enable-background:new 0 0 456.029 456.029;" xml:space="preserve"><g><g><path d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248 c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z"/></g></g><g><g><path d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48 C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064 c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4 C457.728,97.71,450.56,86.958,439.296,84.91z"/></g></g><g><g><path d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296 c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z"/></g></g></svg>' +
      "</a>" +
      '<form class="form-inline">' +
      '<button class="btn my-2 my-sm-0 nav_search-btn" type="button" aria-label="Tìm kiếm">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
      "</button>" +
      "</form>";
  }

  function setFooterYear() {
    var year = String(new Date().getFullYear());
    var yearNodes = document.querySelectorAll("#displayYear");
    if (!yearNodes.length) return;
    yearNodes.forEach(function (node) {
      node.textContent = year;
    });
  }

  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function parsePrice(priceValue) {
    var price = Number(priceValue);
    if (Number.isNaN(price)) return 0;
    return price;
  }

  function inRange(price, range) {
    if (!range || range === "all") return true;
    if (range === "lt5") return price < 5000000;
    if (range === "5to10") return price >= 5000000 && price <= 10000000;
    if (range === "10to20") return price > 10000000 && price <= 20000000;
    if (range === "gt20") return price > 20000000;
    return true;
  }

  function createState() {
    return {
      category: "*",
      keyword: "",
      priceRange: "all",
      type: "all",
    };
  }

  function applyProductFilters(state, cards, emptyState) {
    var visibleCount = 0;

    cards.forEach(function (card) {
      var categoryClass = state.category === "*" ? "" : state.category.slice(1);
      var cardCategory = String(card.getAttribute("data-category") || "");
      var cardPrice = parsePrice(card.getAttribute("data-price"));
      var cardName = normalizeText(card.getAttribute("data-name"));

      var categoryMatch = !categoryClass || cardCategory === categoryClass;
      var keywordMatch = !state.keyword || cardName.indexOf(state.keyword) !== -1;
      var priceMatch = inRange(cardPrice, state.priceRange);
      var typeMatch = state.type === "all" || cardCategory === state.type;

      var show = categoryMatch && keywordMatch && priceMatch && typeMatch;
      card.style.display = show ? "" : "none";
      if (show) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  function setFilterActiveItem(menu, selectedItem) {
    if (!menu || !selectedItem) return;
    var items = menu.querySelectorAll("li");
    items.forEach(function (item) {
      item.classList.remove("active");
    });
    selectedItem.classList.add("active");
  }

  function withButtonLoading(button, loadingText, idleText) {
    if (!button) return function () {};
    button.disabled = true;
    button.classList.add("is-loading");
    button.setAttribute("aria-busy", "true");
    button.textContent = loadingText;

    return function restoreButton() {
      button.disabled = false;
      button.classList.remove("is-loading");
      button.setAttribute("aria-busy", "false");
      button.textContent = idleText;
    };
  }

  function initHeaderSearchButton() {
    var searchButtons = document.querySelectorAll(".header_section .nav_search-btn");
    if (!searchButtons.length) return;

    var currentPage = getCurrentPageName();
    var onHomePage = isActivePage(currentPage, ["index.html", ""]);

    searchButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();

        if (!onHomePage) {
          window.location.href = "./index.html#tim-kiem";
          return;
        }

        var searchSection = document.getElementById("tim-kiem");
        if (searchSection) {
          searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        var keywordInput = document.getElementById("searchKeyword");
        if (keywordInput) {
          window.setTimeout(function () {
            keywordInput.focus();
          }, 280);
        }
      });
    });
  }

  function initSearchAndFilter() {
    var filterMenu = document.querySelector(".filters_menu");
    var cards = Array.prototype.slice.call(
      document.querySelectorAll("#productGrid > [data-name]")
    );
    var searchForm = document.getElementById("bikeSearchForm");

    if (!cards.length) return;

    var emptyState = document.getElementById("searchEmptyState");
    var keywordInput = document.getElementById("searchKeyword");
    var priceInput = document.getElementById("searchPrice");
    var typeInput = document.getElementById("searchType");
    var searchButton = document.getElementById("searchButton");
    var baseButtonText = searchButton ? searchButton.textContent : "";

    var state = createState();

    if (filterMenu) {
      filterMenu.addEventListener("click", function (event) {
        var target = event.target.closest("li[data-filter]");
        if (!target) return;
        state.category = target.getAttribute("data-filter") || "*";
        if (state.category !== "*") {
          state.type = state.category.replace(".", "");
          if (typeInput) typeInput.value = state.type;
        }
        setFilterActiveItem(filterMenu, target);
        applyProductFilters(state, cards, emptyState);
      });
    }

    if (searchForm) {
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        state.keyword = normalizeText(keywordInput ? keywordInput.value : "");
        state.priceRange = priceInput ? priceInput.value : "all";
        state.type = typeInput ? typeInput.value : "all";

        if (state.type === "all") {
          state.category = "*";
          if (filterMenu) {
            var allItem = filterMenu.querySelector('li[data-filter="*"]');
            setFilterActiveItem(filterMenu, allItem);
          }
        } else {
          state.category = "." + state.type;
          if (filterMenu) {
            var match = filterMenu.querySelector('li[data-filter=".' + state.type + '"]');
            if (match) setFilterActiveItem(filterMenu, match);
          }
        }

        var restore = withButtonLoading(searchButton, "Đang lọc...", baseButtonText);
        window.setTimeout(function () {
          applyProductFilters(state, cards, emptyState);
          restore();
        }, 220);
      });
    }

    applyProductFilters(state, cards, emptyState);
  }

  function initSafeBootstrap() {
    if (!window.jQuery || !window.jQuery.fn) return;
    var $ = window.jQuery;

    if ($.fn.tooltip) {
      $("[data-toggle='tooltip']").tooltip();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    syncHeader();
    initHeaderSearchButton();
    setFooterYear();
    initSearchAndFilter();
    initSafeBootstrap();
  });
})();
