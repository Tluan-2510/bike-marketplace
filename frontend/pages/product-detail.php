<?php include '../includes/head.php'; ?>

  <body class="sub_page">
    <div class="hero_area">
      <?php include '../includes/navbar.php'; ?>
    </div>

    <section class="product-detail-section">
      <div class="container">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-5">
          <ol class="breadcrumb bg-transparent p-0">
            <li class="breadcrumb-item"><a href="./index.php" class="text-dark opacity-50">Trang chủ</a></li>
            <li class="breadcrumb-item"><a href="./products.php" class="text-dark opacity-50">Xe đạp</a></li>
            <li id="breadcrumbName" class="breadcrumb-item active text-dark font-weight-bold" aria-current="page">...</li>
          </ol>
        </nav>

        <div class="row">
          <!-- GALLERY SIDE -->
          <div class="col-lg-7">
            <div class="detail-gallery-container">
              <div class="main-img-wrapper" id="mainImgWrapper">
                <img id="mainProductImg" src="../assets/images/placeholder-bike.png" alt="Sản phẩm" />
              </div>
              <div id="imageThumbnails" class="thumb-grid">
                 <!-- Thumbs populated by JS -->
              </div>
            </div>
          </div>

          <!-- INFO SIDE -->
          <div class="col-lg-5">
            <div class="product-info-card">
              <div id="productBadge" class="product-type-badge">Đang tải...</div>
              <h1 id="productName" class="detail-product-name">...</h1>
              <div id="productPrice" class="detail-product-price">...</div>

              <!-- Seller Profile -->
              <div class="seller-profile-card">
                <div class="seller-avatar-wrapper">
                  <img id="sellerAvatar" class="seller-avatar" src="" alt="Avatar người bán" />
                </div>
                <div class="seller-meta">
                  <h6 id="sellerName">Người bán</h6>
                  <p class="seller-location">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span id="sellerLocation">Toàn quốc</span>
                  </p>
                </div>
              </div>

              <h2 class="detail-section-heading">Thông số sản phẩm</h2>
              <div id="productSpecs" class="specs-grid" aria-live="polite"></div>

              <div class="actions mt-4">
                <a href="#" id="btnCall" class="btn-premium btn-block product-action-btn btn-product-call"><span id="phoneText">Gọi cho người bán</span></a>
                <a href="#" id="btnZalo" target="_blank" rel="noopener noreferrer" class="btn btn-outline-info btn-block product-action-btn btn-product-zalo"><span>Chat qua Zalo</span></a>
                <button id="btnFavorite" class="btn-outline-premium btn-block product-action-btn btn-favorite-detail" aria-label="Yêu thích" aria-pressed="false">
                  <span class="favorite-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg></span>
                  <span class="favorite-text">Yêu thích</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTENT ROW -->
        <div class="row mt-5 pt-4">
          <div class="col-lg-7">
            <div class="bg-white p-5 rounded shadow-sm detail-desc-box">
              <h3 class="section-title-premium">Mô tả chi tiết</h3>
              <div id="productDesc" class="text-muted lead" style="white-space: pre-line; font-size: 1rem;">Đang tải mô tả...
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="safety-tips-card">
              <h5>Giao dịch an toàn</h5>
              <ul>
                <li>Tuyệt đối không đặt cọc tiền khi chưa xem xe trực tiếp.</li>
                <li>Nên đi cùng người có kinh nghiệm để kiểm tra tình trạng khung sườn và bộ đề.</li>
                <li>Hẹn gặp ở nơi công cộng hoặc các cửa hàng xe đạp uy tín.</li>
                <li>Kiểm tra kỹ các hóa đơn mua hàng hoặc giấy tờ xe (nếu có).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="recommendation-section layout_padding bg-white border-top mb-5">
      <div class="container">
        <div class="heading_container heading_center mb-5">
          <h2>Sản phẩm <span>tương tự</span></h2>
          <p class="sub-heading">Có thể bạn cũng sẽ quan tâm đến các mẫu xe này</p>
        </div>
        <div id="relatedProductsGrid" class="row">
          <div class="col-12 text-center py-5">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="mt-3">Đang tìm kiếm xe tương tự...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sticky Action Bar for Mobile -->
    <div class="sticky-actions">
      <button class="btn-fav-sticky" id="btnFavoriteSticky" aria-label="Yêu thích" aria-pressed="false">
        <span class="favorite-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg></span>
        <span class="favorite-sticky-text">Yêu thích</span>
      </button>
      <a href="#" class="btn-zalo-sticky d-flex align-items-center justify-content-center" id="btnZaloSticky" target="_blank" rel="noopener noreferrer">Zalo</a>
      <a href="#" class="btn-buy-now d-flex align-items-center justify-content-center" id="btnCallSticky">Gọi ngay</a>
    </div>

    <?php include '../includes/footer.php'; ?>

    <script src="../assets/js/jquery-3.4.1.min.js"></script>
    <script src="../assets/js/bootstrap.js"></script>
    <script src="../assets/js/toast.js"></script>
    <script src="../assets/js/core.js?v=2"></script>
    <script src="../assets/js/product-detail.js"></script>
  </body>
</html>
