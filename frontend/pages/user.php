<?php include '../includes/head.php'; ?>

  <body class="sub_page">
    <div class="hero_area">
      <?php include '../includes/navbar.php'; ?>
    </div>

    <section class="layout_padding bg-light" style="min-height: 80vh;">
      <div class="container">
        
        <div class="row">
          <div class="col-lg-3 col-md-4 mb-4">
            <div class="profile-card sidebar-sticky shadow-sm">
              <div class="profile-header text-center p-4">
                <div class="avatar-wrapper mb-3">
                  <img id="userAvatar" src="https://ui-avatars.com/api/?name=User&background=FFD700&color=000&size=150" alt="Avatar" class="profile-avatar shadow-sm">
                  <div class="online-indicator"></div>
                </div>
                <h5 id="userName" class="font-weight-bold mb-1">Người Dùng</h5>
                <p id="userEmail" class="text-muted small mb-0">user@example.com</p>
              </div>
              
              <div class="sidebar-nav p-2">
                <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <a class="nav-link active d-flex align-items-center mb-1" id="v-pills-dashboard-tab" data-toggle="pill" href="#v-pills-dashboard" role="tab" aria-controls="v-pills-dashboard" aria-selected="true">
                    <i class="fa fa-th-large mr-3"></i> <span>Tổng quan</span>
                  </a>
                  <a class="nav-link d-flex align-items-center mb-1" id="v-pills-listings-tab" data-toggle="pill" href="#v-pills-listings" role="tab" aria-controls="v-pills-listings" aria-selected="false">
                    <i class="fa fa-bicycle mr-3"></i> <span>Xe đang bán</span>
                  </a>
                  <a class="nav-link d-flex align-items-center mb-1" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">
                    <i class="fa fa-user-circle mr-3"></i> <span>Cài đặt tài khoản</span>
                  </a>
                  <a class="nav-link d-flex align-items-center mb-1" id="v-pills-buying-tab" data-toggle="pill" href="#v-pills-buying" role="tab" aria-controls="v-pills-buying" aria-selected="false">
                    <i class="fa fa-shopping-bag mr-3"></i> <span>Lịch sử mua hàng</span>
                  </a>
                  <a class="nav-link d-flex align-items-center mb-1" id="v-pills-selling-tab" data-toggle="pill" href="#v-pills-selling" role="tab" aria-controls="v-pills-selling" aria-selected="false">
                    <i class="fa fa-handshake-o mr-3"></i> <span>Yêu cầu từ khách</span>
                  </a>
                  <hr class="my-2">
                  <a class="nav-link logout-link d-flex align-items-center text-danger" href="javascript:void(0)" onclick="logout()" id="btnLogout">
                    <i class="fa fa-sign-out mr-3"></i> <span>Đăng xuất</span>
                  </a>
                </div>
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
                  <div class="col-md-4 mb-3">
                    <div class="stat-card d-flex align-items-center p-4">
                      <div class="stat-icon bg-warning-light text-warning mr-4">
                        <i class="fa fa-bicycle"></i>
                      </div>
                      <div>
                        <h3 class="mb-0 font-weight-bold" id="statListings">0</h3>
                        <p class="text-muted mb-0 small text-uppercase font-weight-bold">Tin đã duyệt</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="stat-card d-flex align-items-center p-4">
                      <div class="stat-icon bg-pending-light text-warning mr-4" style="background-color: rgba(255, 193, 7, 0.1);">
                        <i class="fa fa-clock-o"></i>
                      </div>
                      <div>
                        <h3 class="mb-0 font-weight-bold" id="statPending">0</h3>
                        <p class="text-muted mb-0 small text-uppercase font-weight-bold">Chờ duyệt</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="stat-card d-flex align-items-center p-4">
                      <div class="stat-icon bg-info-light text-info mr-4">
                        <i class="fa fa-heart"></i>
                      </div>
                      <div>
                        <h3 class="mb-0 font-weight-bold" id="statFavorites">0</h3>
                        <p class="text-muted mb-0 small text-uppercase font-weight-bold">Xe đã lưu</p>
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

              <!-- Tab Buying (Buy History) -->
              <div class="tab-pane fade" id="v-pills-buying" role="tabpanel" aria-labelledby="v-pills-buying-tab">
                <h3 class="font-weight-bold mb-4">Lịch sử mua hàng</h3>
                <div class="profile-table-container">
                  <div class="table-responsive">
                    <table class="premium-table">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Ngày gửi</th>
                          <th>Lời nhắn</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody id="buyRequestsContainer">
                        <tr>
                          <td colspan="4" class="text-center py-5"><i class="fa fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Tab Selling (Customer Requests) -->
              <div class="tab-pane fade" id="v-pills-selling" role="tabpanel" aria-labelledby="v-pills-selling-tab">
                <h3 class="font-weight-bold mb-4">Yêu cầu từ khách hàng</h3>
                <div class="profile-table-container">
                  <div class="table-responsive">
                    <table class="premium-table">
                      <thead>
                        <tr>
                          <th>Khách hàng</th>
                          <th>Sản phẩm</th>
                          <th>Lời nhắn</th>
                          <th>Ngày nhận</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody id="sellRequestsContainer">
                        <tr>
                          <td colspan="5" class="text-center py-5"><i class="fa fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...</td>
                        </tr>
                      </tbody>
                    </table>
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
    <script src="../assets/js/user.js?v=12.0"></script>
  </body>
</html>
