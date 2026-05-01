<?php include '../includes/head.php'; ?>

  <body class="sub_page">
    <div class="hero_area">
      <?php include '../includes/navbar.php'; ?>
    </div>

    <section class="layout_padding bg-light" style="min-height: 80vh;">
      <div class="container">
        <div class="heading_container heading_center mb-5">
          <h2>Xe Đã <span>Lưu</span></h2>
          <p class="sub-heading">Danh sách các mẫu xe bạn đang quan tâm</p>
        </div>

        <div id="favoritesLoading" class="text-center py-5">
           <div class="spinner-border text-warning" role="status"></div>
           <p class="mt-2 text-muted">Đang tải danh sách yêu thích...</p>
        </div>

        <div class="row" id="favoritesList"></div>

        <div id="favoritesEmpty" class="text-center py-5 d-none"> <p class="text-muted">Bạn chưa lưu sản phẩm nào.</p>
           <a href="./products.php" class="explore-link-premium mt-3">Khám phá xe ngay</a>
        </div>
      </div>
    </section>

    <?php include '../includes/footer.php'; ?>

    <?php include '../includes/scripts.php'; ?>
    <script src="../assets/js/products.js"></script>
  </body>
</html>
