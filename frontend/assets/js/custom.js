(function () {
  "use strict";

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
    setFooterYear();
    initSearchAndFilter();
    initSafeBootstrap();
  });
})();
