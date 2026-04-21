(function () {
  "use strict";

  const BikeApi = window.BikeApi;

  function showMessage(messageBox, message, type) {
    if (!messageBox) return;
    const alertType = type === "success" ? "success" : "danger";
    messageBox.textContent = message;
    messageBox.className = "alert alert-" + alertType;
    messageBox.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setButtonLoading(button, loadingText) {
    if (!button) return () => {};
    const idleText = button.textContent;
    button.disabled = true;
    button.textContent = loadingText;
    return () => {
      button.disabled = false;
      button.textContent = idleText;
    };
  }

  async function initLookups() {
    const categorySelect = document.getElementById("productCategory");
    const brandSelect = document.getElementById("productBrand");

    try {
      const [categories, brands] = await Promise.all([
        BikeApi.getCategories(),
        BikeApi.getBrands()
      ]);

      if (categorySelect) {
        categorySelect.innerHTML = '<option value="" disabled selected>Chọn loại xe</option>';
        BikeApi.pickList(categories).forEach(cat => {
          const opt = document.createElement("option");
          opt.value = cat.id;
          opt.textContent = cat.name;
          categorySelect.appendChild(opt);
        });
      }

      if (brandSelect) {
        brandSelect.innerHTML = '<option value="" disabled selected>Chọn thương hiệu</option>';
        BikeApi.pickList(brands).forEach(brand => {
          const opt = document.createElement("option");
          opt.value = brand.id;
          opt.textContent = brand.name;
          brandSelect.appendChild(opt);
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục/thương hiệu:", error);
    }
  }

  function initImagePreview() {
    const dropZone = document.getElementById("dropZone");
    const imageInput = document.getElementById("productImage");
    const previewContainer = document.getElementById("imagePreviewContainer");
    let selectedFiles = [];

    if (!dropZone || !imageInput || !previewContainer) return;

    // Trigger file input
    dropZone.addEventListener("click", () => imageInput.click());

    // Drag & Drop events
    ["dragenter", "dragover"].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
      });
    });

    dropZone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      handleFiles(files);
    });

    imageInput.addEventListener("change", (e) => {
      handleFiles(e.target.files);
    });

    function handleFiles(files) {
      const newFiles = Array.from(files);
      if (selectedFiles.length + newFiles.length > 5) {
        alert("Bạn chỉ có thể đăng tối đa 5 hình ảnh.");
        return;
      }

      selectedFiles = [...selectedFiles, ...newFiles];
      updatePreview();
      syncInput();
    }

    function updatePreview() {
      previewContainer.innerHTML = "";
      selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const div = document.createElement("div");
          div.className = "preview-item";
          
          div.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button type="button" class="remove-btn">&times;</button>
          `;
          
          div.querySelector(".remove-btn").onclick = (event) => {
            event.stopPropagation();
            selectedFiles.splice(index, 1);
            updatePreview();
            syncInput();
          };
          
          previewContainer.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    }

    function syncInput() {
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach(file => dataTransfer.items.add(file));
      imageInput.files = dataTransfer.files;
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const messageBox = document.getElementById("productFormMessage");
    const submitBtn = document.getElementById("submitProductButton");
    
    const formData = new FormData(form);
    
    // Log for debugging
    console.log("Submitting form data...");

    const restoreBtn = setButtonLoading(submitBtn, "Đang đăng tin...");

    try {
      const response = await BikeApi.request("/products", {
        method: "POST",
        body: formData,
        auth: true
      });

      if (response.success) {
        showMessage(messageBox, "Đăng tin bán xe thành công! Tin của bạn sẽ được hiển thị ngay.", "success");
        form.reset();
        document.getElementById("imagePreviewContainer").innerHTML = "";
      } else {
        throw new Error(response.message || "Đăng tin thất bại.");
      }
    } catch (error) {
      showMessage(messageBox, error.message || "Không thể kết nối đến máy chủ.", "danger");
    } finally {
      restoreBtn();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLookups();
    initImagePreview();
    const form = document.getElementById("createProductForm");
    if (form) form.addEventListener("submit", onSubmit);
  });
})();
