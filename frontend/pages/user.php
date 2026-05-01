<?php include '../includes/head.php'; ?>

  <body class="sub_page">
    <div class="hero_area">
      <?php include '../includes/navbar.php'; ?>
    </div>

    <section class="layout_padding bg-light" style="min-height: 80vh;">
      <div class="container">
        
        <div class="row">
          <!-- Sidebar -->
          <div class="col-lg-3 col-md-4 mb-4">
            <div class="profile-card mb-4">
              <img id="userAvatar" src="https://ui-avatars.com/api/?name=User&background=FFD700&color=000&size=150" alt="Avatar" class="profile-avatar">
              <h4 id="userName" class="font-weight-bold mb-1">Người Dùng</h4>
              <p id="userEmail" class="text-muted small mb-3">user@example.com</p>
              
              <div class="nav flex-column nav-pills text-left" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <a class="nav-link active" id="v-pills-dashboard-tab" data-toggle="pill" href="#v-pills-dashboard" role="tab" aria-controls="v-pills-dashboard" aria-selected="true">Tổng quan</a>
                <a class="nav-link" id="v-pills-listings-tab" data-toggle="pill" href="#v-pills-listings" role="tab" aria-controls="v-pills-listings" aria-selected="false">Xe đang bán</a>
                <a class="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">Cài đặt tài khoản</a>
                <a class="nav-link text-danger mt-3" href="javascript:void(0)" onclick="logout()" id="btnLogout">Đăng xuất</a>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-lg-9 col-md-8">
            <div class="tab-content" id="v-pills-tabContent">
              
              <!-- Tab Dashboard -->
              <div class="tab-pane fade show active" id="v-pills-dashboard" role="tabpanel" aria-labelledby="v-pills-dashboard-tab">
                <h3 class="font-weight-bold mb-4">Tổng quan tài khoản</h3>
                <div class="row mb-5">
                  <div class="col-md-6 mb-3">
                    <div class="stat-card">
                      <div>
                        <h3 class="mb-0 font-weight-bold" id="statListings">0</h3>
                        <p class="text-muted mb-0 small text-uppercase">Tin đang bán</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="stat-card">
                      <div>
                        <h3 class="mb-0 font-weight-bold" id="statFavorites">0</h3>
                        <p class="text-muted mb-0 small text-uppercase">Xe đã lưu</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h4 class="font-weight-bold m-0">Tin đăng mới nhất</h4>
                  <a href="#" onclick="$('#v-pills-listings-tab').tab('show'); return false;" class="explore-link-premium py-2 px-3" style="font-size: 14px; margin-top: 0;">Xem tất cả</a>
                </div>
                
                <div class="row shop_section" id="recentListingsContainer">
                   <!-- Recent listings will be injected here -->
                   <div class="col-12 text-center text-muted py-4" id="recentListingsEmpty">Bạn chưa đăng bán chiếc xe nào.
                   </div>
                </div>
              </div>

              <!-- Tab Listings -->
              <div class="tab-pane fade" id="v-pills-listings" role="tabpanel" aria-labelledby="v-pills-listings-tab">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h3 class="font-weight-bold m-0">Xe đang bán</h3>
                  <a href="./create_product.php" class="btn-premium py-2 px-4 shadow-sm" style="font-size: 14px; border-radius: 50px; text-decoration: none;">+ Đăng bán xe</a>
                </div>
                
                <div class="row shop_section" id="myListingsContainer">
                   <div class="col-12 text-center py-5">
                      <div class="spinner-border text-warning" role="status"></div>
                   </div>
                </div>
              </div>

              <!-- Tab Settings -->
              <div class="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
                <h3 class="font-weight-bold mb-4">Cài đặt tài khoản</h3>
                <div class="profile-card text-left p-4 bg-white shadow-sm border-0">
                  <form id="profileForm">
                    <div class="row mb-3">
                      <div class="col-12 text-center mb-3">
                        <label for="inputAvatar" style="cursor: pointer;" class="position-relative">
                          <img id="formAvatarPreview" src="https://ui-avatars.com/api/?name=User&background=FFD700&color=000&size=100" alt="Avatar Preview" class="rounded-circle border" style="width: 100px; height: 100px; object-fit: cover;">
                          <div class="position-absolute d-flex justify-content-center align-items-center bg-dark text-white rounded-pill" style="min-width: 42px; height: 30px; bottom: 0; right: 0; opacity: 0.8; font-size: 12px; font-weight: 700;">Sửa</div>
                        </label>
                        <input type="file" id="inputAvatar" class="d-none" accept="image/png, image/jpeg">
                        <p class="small text-muted mt-1">Bấm vào ảnh để thay đổi Avatar</p>
                      </div>
                    </div>
                    
                    <h5 class="font-weight-bold mb-3 border-bottom pb-2">Thông tin cơ bản</h5>
                    <div class="row">
                      <div class="col-md-6 form-group">
                        <label class="font-weight-bold">Họ và Tên <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="inputName" required>
                      </div>
                      <div class="col-md-6 form-group">
                        <label class="font-weight-bold">Email</label>
                        <input type="email" class="form-control" id="inputEmail" readonly style="background-color: #f8f9fa;">
                        <small class="form-text text-muted">Không thể thay đổi email.</small>
                      </div>
                      <div class="col-md-6 form-group">
                        <label class="font-weight-bold">Số điện thoại</label>
                        <input type="tel" class="form-control" id="inputPhone">
                      </div>
                      <div class="col-md-6 form-group">
                        <label class="font-weight-bold">Giới tính</label>
                        <select class="form-control" id="inputGender">
                          <option value="">-- Chọn giới tính --</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                      <div class="col-md-6 form-group">
                        <label class="font-weight-bold">Ngày sinh</label>
                        <input type="date" class="form-control" id="inputDob">
                      </div>
                      <div class="col-md-6 form-group">
                        <label class="font-weight-bold">Số CMND/CCCD</label>
                        <input type="text" class="form-control" id="inputIdCard" placeholder="Dùng để xác minh danh tính">
                      </div>
                    </div>

                    <h5 class="font-weight-bold mt-4 mb-3 border-bottom pb-2">Liên hệ & Địa chỉ</h5>
                    <div class="row">
                      <div class="col-md-6 form-group">
                        <label class="font-weight-bold">Tỉnh/Thành phố</label>
                        <input type="text" class="form-control" id="inputCity" placeholder="VD: TP. Hồ Chí Minh">
                      </div>
                      <div class="col-md-6 form-group">
                        <label class="font-weight-bold">Địa chỉ chi tiết</label>
                        <input type="text" class="form-control" id="inputAddress" placeholder="Số nhà, Tên đường, Phường/Xã...">
                      </div>
                      <div class="col-md-12 form-group">
                        <label class="font-weight-bold">Link Facebook / Zalo</label>
                        <input type="url" class="form-control" id="inputSocial" placeholder="https://facebook.com/your-profile">
                      </div>
                      <div class="col-md-12 form-group">
                        <label class="font-weight-bold">Giới thiệu bản thân (Bio)</label>
                        <textarea class="form-control" id="inputBio" rows="3" placeholder="Chia sẻ kinh nghiệm hoặc niềm đam mê xe đạp của bạn..."></textarea>
                      </div>
                    </div>
                    
                    <div class="text-right mt-3">
                      <button type="submit" class="btn-premium px-5 py-2">Lưu thay đổi</button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <?php include '../includes/footer.php'; ?>

    <?php include '../includes/scripts.php'; ?>
    <script src="../assets/js/user.js"></script>
  </body>
</html>
