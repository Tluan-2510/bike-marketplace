<?php include '../includes/head.php'; ?>

  <body class="sub_page">
    <div class="hero_area">
      <?php include '../includes/navbar.php'; ?>
    </div>

    <section class="layout_padding">
      <div class="container">
        <div class="heading_container heading_center mb-5">
          <h2>Đăng bán chiếc xe <span>Của Bạn</span></h2>
          <p class="sub-heading">Điền đầy đủ thông tin bên dưới để tiếp cận hàng ngàn người mua tiềm năng.</p>
        </div>

        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="bg-white p-4 p-md-5 rounded shadow-sm border">
              <form id="productForm" novalidate>
                <div class="row">
                  <div class="col-md-12 mb-3">
                    <label for="productName"><b>Tiêu đề tin đăng</b><span class="text-danger">*</span></label>
                    <input
                      type="text"
                      id="productName"
                      name="title"
                      class="form-control"
                      minlength="10"
                      maxlength="100"
                      aria-describedby="error-title"
                      placeholder="VD: Specialized Tarmac SL7 - Size 52 - Group Ultegra Di2"
                      required
                    />
                    <small id="error-title" class="field-error" data-error-for="title"></small>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="productCategory"><b>Loại xe</b><span class="text-danger">*</span></label>
                    <select id="productCategory" name="category_id" class="form-control" aria-describedby="error-category_id" required>
                      <option value="">-- Đang tải loại xe --</option>
                    </select>
                    <small id="error-category_id" class="field-error" data-error-for="category_id"></small>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="productPrice"><b>Giá bán (VNĐ)</b><span class="text-danger">*</span></label>
                    <input
                      type="text"
                      id="productPrice"
                      name="price"
                      class="form-control"
                      inputmode="numeric"
                      aria-describedby="error-price"
                      placeholder="VD: 45000000"
                      required
                    />
                    <small id="error-price" class="field-error" data-error-for="price"></small>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="productBrand"><b>Hãng sản xuất</b></label>
                    <select id="productBrand" name="brand_id" class="form-control">
                      <option value="">-- Đang tải thương hiệu --</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="productCondition"><b>Tình trạng xe</b></label>
                    <select id="productCondition" name="condition_state" class="form-control">
                      <option value="Mới">Mới</option>
                      <option value="Như mới">Như mới (99%)</option>
                      <option value="Sử dụng tốt">Đã qua sử dụng</option>
                      <option value="Có hao mòn">Cũ (đã sửa chữa)</option>
                    </select>
                  </div>
                </div>

                <h5 class="font-weight-bold mt-4 mb-3 border-bottom pb-2">Thông số kỹ thuật</h5>
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="productFrame"><b>Chất liệu khung</b></label>
                    <select id="productFrame" name="frame_material" class="form-control">
                      <option value="">-- Chọn chất liệu --</option>
                      <option value="Carbon">Carbon</option>
                      <option value="Nhôm (Alloy)">Nhôm (Alloy)</option>
                      <option value="Thép (Steel)">Thép (Steel)</option>
                      <option value="Titan">Titan</option>
                    </select>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="productSize"><b>Kích cỡ (Size)</b></label>
                    <input type="text" id="productSize" name="size" class="form-control" placeholder="VD: 52, S, M...">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="productBrake"><b>Hệ thống phanh</b></label>
                    <select id="productBrake" name="brake_type" class="form-control">
                      <option value="">-- Chọn hệ phanh --</option>
                      <option value="Phanh đĩa (Disc Brake)">Phanh đĩa (Disc Brake)</option>
                      <option value="Phanh vành (Rim Brake)">Phanh vành (Rim Brake)</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="productGroupset"><b>Bộ truyền động (Groupset)</b></label>
                    <input type="text" id="productGroupset" name="groupset" class="form-control" placeholder="VD: Shimano Ultegra R8000...">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="productWheel"><b>Kích thước bánh</b></label>
                    <input type="text" id="productWheel" name="wheel_size" class="form-control" placeholder="VD: 700c, 29 inch...">
                  </div>
                </div>

                <div class="mb-3">
                  <label for="productDescription"><b>Mô tả chi tiết</b></label>
                  <textarea
                    id="productDescription"
                    name="description"
                    class="form-control"
                    rows="5"
                    aria-describedby="error-description"
                    placeholder="Mô tả chi tiết về tình trạng xe, phụ tùng đã thay thế..."
                    required
                  ></textarea>
                  <small id="error-description" class="field-error" data-error-for="description"></small>
                </div>

                <div class="mb-4">
                  <label class="form-label"><b>Hình ảnh thực tế</b></label>
                  <div id="dropZone" class="upload-dropzone"> <p class="mb-1 font-weight-bold">Kéo thả hình ảnh vào đây hoặc nhấp để chọn</p>
                    <p class="small text-muted">Hỗ trợ JPG, PNG, WEBP (Tối đa 5 ảnh)</p>
                    <input
                      type="file"
                      id="productImage"
                      name="images[]"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      class="d-none"
                    />
                  </div>
                  <small id="error-images" class="field-error" data-error-for="images"></small>
                  <div id="imagePreviewContainer" class="d-flex flex-wrap mt-3"></div>
                </div>

                <div class="text-center mt-4">
                  <button
                    id="submitProductButton"
                    type="submit"
                    class="explore-link-premium border-0"
                  >Đăng sản phẩm ngay</button>
                </div>
              </form>
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
