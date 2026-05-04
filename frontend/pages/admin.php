<?php include '../includes/head.php'; ?>
<head>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <style>
    .admin-page .stat-card {
      transition: all 0.3s ease;
      cursor: default;
    }
    .admin-page .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
    }
    .btn-action {
      border-radius: 6px;
      padding: 6px 16px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn-approve {
      background: #27ae60;
      color: white;
      border: none;
    }
    .btn-approve:hover {
      background: #219150;
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
    }
    .btn-reject {
      background: #f8f9fa;
      color: #e74c3c;
      border: 1px solid #e74c3c;
    }
    .btn-reject:hover {
      background: #e74c3c;
      color: white;
    }
  </style>
</head>
<body class="sub_page admin-page">
  <div class="hero_area">
    <?php include '../includes/navbar.php'; ?>
  </div>

  <section class="layout_padding bg-light" style="min-height: 80vh;">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="font-weight-bold m-0">Bảng điều khiển Quản trị</h2>
        <div class="text-muted small">Quyền hạn: <span class="badge badge-danger px-2">Administrator</span></div>
      </div>

      <!-- Stats Row -->
      <div class="row mb-5">
        <div class="col-md-4 mb-3">
          <div class="stat-card shadow-sm p-4 bg-white rounded border-0 d-flex align-items-center">
            <div class="stat-icon bg-primary-light text-primary mr-3" style="width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(52, 152, 219, 0.1);">
              <i class="fa fa-users"></i>
            </div>
            <div>
              <h3 class="mb-0 font-weight-bold" id="adminStatUsers">0</h3>
              <p class="text-muted mb-0 small text-uppercase font-weight-bold">Người dùng</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stat-card shadow-sm p-4 bg-white rounded border-0 d-flex align-items-center">
            <div class="stat-icon bg-success-light text-success mr-3" style="width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(46, 204, 113, 0.1);">
              <i class="fa fa-bicycle"></i>
            </div>
            <div>
              <h3 class="mb-0 font-weight-bold" id="adminStatActive">0</h3>
              <p class="text-muted mb-0 small text-uppercase font-weight-bold">Tin đang bán</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stat-card shadow-sm p-4 bg-white rounded border-0 d-flex align-items-center border-warning" style="border-left: 4px solid #f1c40f !important;">
            <div class="stat-icon bg-warning-light text-warning mr-3" style="width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(241, 196, 15, 0.1);">
              <i class="fa fa-clock-o"></i>
            </div>
            <div>
              <h3 class="mb-0 font-weight-bold" id="adminStatPending">0</h3>
              <p class="text-muted mb-0 small text-uppercase font-weight-bold">Đang chờ duyệt</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Products Table -->
      <div class="card shadow-sm border-0 rounded overflow-hidden">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 class="m-0 font-weight-bold text-dark"><i class="fa fa-hourglass-start mr-2 text-warning"></i> Tin đăng chờ phê duyệt</h5>
          <button class="btn btn-sm btn-outline-secondary" onclick="loadPendingProducts()"><i class="fa fa-refresh"></i> Làm mới</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="bg-light">
                <tr>
                  <th style="width: 80px;">Ảnh</th>
                  <th>Thông tin xe</th>
                  <th>Người đăng</th>
                  <th>Ngày đăng</th>
                  <th class="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody id="pendingProductsContainer">
                <tr>
                  <td colspan="5" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2 text-muted">Đang tải danh sách...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  <?php include '../includes/footer.php'; ?>
  <?php include '../includes/scripts.php'; ?>
  <script src="../assets/js/admin.js?v=1.1"></script>
</body>
</html>
