console.log("[Admin] Script loading...");
document.addEventListener("DOMContentLoaded", function () {
  console.log("[Admin] DOM loaded, initializing...");
  checkAdminAccess();
  loadStats();
  loadPendingProducts();
});

function checkAdminAccess() {
  var user = window.BikeApi.getAuthUser();
  if (!user || user.role !== "admin") {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href = "index.php";
  }
}

async function loadStats() {
  try {
    var response = await window.BikeApi.getAdminStats();
    if (response.success) {
      var stats = response.data;
      document.getElementById("adminStatUsers").textContent = stats.total_users || 0;
      document.getElementById("adminStatActive").textContent = stats.total_active_bikes || 0;
      // Note: We don't have a direct pending count in getStats yet, but we'll infer it or update the model later.
      // For now, we'll let loadPendingProducts update it if possible.
    }
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

async function loadPendingProducts() {
  var container = document.getElementById("pendingProductsContainer");
  if (!container) return;

  try {
    var response = await window.BikeApi.getPendingProducts();
    var products = window.BikeApi.pickList(response);

    document.getElementById("adminStatPending").textContent = products.length;

    if (!products.length) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-5">
            <div class="py-4">
              <i class="fa fa-check-circle text-success fa-3x mb-3"></i>
              <p class="text-muted lead">Tuyệt vời! Không có tin nào đang chờ duyệt.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = products
      .map(function (p) {
        var imageUrl = window.BikeApi.resolveImageUrl(p.image_url);
        var price = window.BikeApi.formatCurrency(p.price);
        var date = new Date(p.created_at).toLocaleDateString("vi-VN");

        return `
        <tr id="product-row-${p.id}">
          <td class="align-middle">
            <img src="${imageUrl}" class="rounded shadow-sm" style="width: 60px; height: 60px; object-fit: cover;">
          </td>
          <td class="align-middle">
            <div class="font-weight-bold text-dark">${p.title}</div>
            <div class="small text-muted">${p.category_name || "Xe đạp"} • ${price}</div>
          </td>
          <td class="align-middle">
            <div class="small"><i class="fa fa-user-circle-o mr-1"></i> ${p.seller_name || "N/A"}</div>
          </td>
          <td class="align-middle small text-muted">${date}</td>
          <td class="align-middle text-center">
            <div class="d-flex justify-content-center" style="gap: 10px;">
              <button onclick="approveProduct(${p.id})" class="btn-action btn-approve" title="Duyệt tin">
                <i class="fa fa-check mr-1"></i> Duyệt
              </button>
              <button onclick="deleteProduct(${p.id})" class="btn-action btn-reject" title="Xóa tin">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  } catch (error) {
    container.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-danger">Lỗi tải dữ liệu.</td></tr>`;
  }
}

window.approveProduct = async function(id) {
  const result = await Swal.fire({
    title: 'Xác nhận duyệt?',
    text: "Tin đăng này sẽ được hiển thị công khai trên trang chủ.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#27ae60',
    cancelButtonColor: '#95a5a6',
    confirmButtonText: 'Đồng ý duyệt',
    cancelButtonText: 'Hủy'
  });

  if (!result.isConfirmed) return;

  try {
    var response = await window.BikeApi.approveProduct(id);
    if (response.success) {
      Swal.fire({
        title: 'Thành công!',
        text: 'Tin đăng đã được duyệt thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      var row = document.getElementById("product-row-" + id);
      if (row) row.remove();
      
      var pendingCount = document.getElementById("adminStatPending");
      if (pendingCount) {
        var current = parseInt(pendingCount.textContent || "0");
        pendingCount.textContent = Math.max(0, current - 1);
      }
      
      try { loadStats(); } catch(e) {}
    } else {
      Swal.fire('Lỗi!', response.message || 'Không thể duyệt tin.', 'error');
    }
  } catch (error) {
    console.error("[Admin] Approve error:", error);
    Swal.fire('Lỗi!', 'Đã xảy ra lỗi hệ thống.', 'error');
  }
}

window.deleteProduct = async function(id) {
  const result = await Swal.fire({
    title: 'Xác nhận xóa?',
    text: "Thao tác này sẽ xóa vĩnh viễn tin đăng và không thể hoàn tác!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#95a5a6',
    confirmButtonText: 'Xóa ngay',
    cancelButtonText: 'Hủy'
  });

  if (!result.isConfirmed) return;

  try {
    var response = await window.BikeApi.deleteProduct(id);
    if (response.success) {
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Tin đăng đã được gỡ khỏi hệ thống.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      var row = document.getElementById("product-row-" + id);
      if (row) row.remove();
      
      var pendingCount = document.getElementById("adminStatPending");
      if (pendingCount) {
        var current = parseInt(pendingCount.textContent || "0");
        pendingCount.textContent = Math.max(0, current - 1);
      }
    } else {
      Swal.fire('Lỗi!', response.message || 'Không thể xóa tin.', 'error');
    }
  } catch (error) {
    console.error("[Admin] Delete error:", error);
    Swal.fire('Lỗi!', 'Đã xảy ra lỗi hệ thống.', 'error');
  }
}

window.loadPendingProducts = loadPendingProducts;
