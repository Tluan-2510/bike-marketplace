<?php include '../includes/head.php'; ?>

  <body class="sub_page">
    <div class="hero_area">
      <?php include '../includes/navbar.php'; ?>
    </div>

    <section class="layout_padding">
      <div class="container">
        <div class="heading_container heading_center mb-5">
          <h2>Tạo <span>Tài Khoản</span></h2>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="bg-white p-5 shadow-sm rounded">
              <form id="registerForm" data-redirect="./login.html">
                 <div class="form-group mb-3">
                  <label class="font-weight-bold">Họ và tên</label>
                  <input type="text" class="form-control" name="full_name" placeholder="Nguyễn Văn A" required />
                </div>
                <div class="form-group mb-3">
                  <label class="font-weight-bold">Email</label>
                  <input type="email" class="form-control" name="email" placeholder="email@example.com" required />
                </div>
                <div class="form-group mb-3">
                  <label class="font-weight-bold">Số điện thoại</label>
                  <input type="text" class="form-control" name="phone" placeholder="090..." required />
                </div>
                <div class="form-group mb-4">
                  <label class="font-weight-bold">Mật khẩu</label>
                  <input type="password" class="form-control" name="password" placeholder="********" required />
                </div>
                <button type="submit" class="explore-link-premium border-0 btn-block justify-content-center py-3">Đăng ký ngay</button>
                <div class="text-center mt-4"><span class="text-muted">Đã có tài khoản?</span>
                  <a href="./login.php" class="text-warning font-weight-bold">Đăng nhập</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <?php include '../includes/footer.php'; ?>

    <?php include '../includes/scripts.php'; ?>
    <script src="../assets/js/auth.js"></script>
  </body>
</html>
