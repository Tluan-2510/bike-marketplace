/**
 * Bike Market - Toast notifications.
 */

(function () {
  "use strict";

  var TOAST_DURATION = 3000;
  var container = null;

  function ensureContainer() {
    if (container) return container;

    container = document.createElement("div");
    container.className = "bike-toast-container";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");
    if (document.querySelector(".sticky-actions")) {
      document.body.classList.add("has-sticky-actions");
    }
    document.body.appendChild(container);
    return container;
  }

  function showToast(message, type) {
    var text = String(message || "").trim();
    var toastType = ["success", "error", "info"].indexOf(type) !== -1 ? type : "info";
    if (!text) return null;

    var wrapper = ensureContainer();
    while (wrapper.children.length >= 4) {
      wrapper.removeChild(wrapper.firstElementChild);
    }

    var toast = document.createElement("div");
    toast.className = "bike-toast bike-toast-" + toastType;
    toast.setAttribute("role", "status");
    toast.innerHTML = '<span class="bike-toast-dot"></span><span class="bike-toast-message"></span>';
    toast.querySelector(".bike-toast-message").textContent = text;
    wrapper.appendChild(toast);

    window.setTimeout(function () {
      toast.classList.add("is-hiding");
      window.setTimeout(function () {
        toast.remove();
      }, 240);
    }, TOAST_DURATION);

    return toast;
  }

  window.BikeToast = { show: showToast };
  window.BikeUI = window.BikeUI || {};
  window.BikeUI.showToast = showToast;
  window.showToast = showToast;
})();
