(function () {
  "use strict";

  function initProductDetailLinks() {
    var cards = document.querySelectorAll("#productGrid > [data-name]");
    if (!cards.length) return;

    cards.forEach(function (card, index) {
      var productId = card.getAttribute("data-product-id") || String(index + 1);
      card.setAttribute("data-product-id", productId);

      var detailBox = card.querySelector(".detail-box");
      if (!detailBox) return;

      var old = detailBox.querySelector(".detail-link");
      if (old) return;

      var link = document.createElement("a");
      link.className = "detail-link d-inline-block mt-2";
      link.href = "./product-detail.html?id=" + encodeURIComponent(productId);
      link.textContent = "Xem chi tiết";
      detailBox.appendChild(link);
    });
  }

  document.addEventListener("DOMContentLoaded", initProductDetailLinks);
})();
