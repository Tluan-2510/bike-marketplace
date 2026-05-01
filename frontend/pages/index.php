<?php include '../includes/head.php'; ?>

  <body>
    <div class="hero_area">
      <?php include '../includes/navbar.php'; ?>

      <section class="slider_section">
        <div
          id="customCarousel1"
          class="carousel slide"
          data-ride="carousel"
          data-interval="3000"
        >
          <div class="carousel-inner">
            <!-- Slide 1 -->
            <div class="carousel-item active">
              <div class="bg-box">
                <img src="../assets/images/hero-bg.jpg" alt="Slide 1" />
              </div>
              <div class="container">
                <div class="row">
                  <div class="col-md-8 col-lg-7">
                    <div class="detail-box">
                      <h1>Mua bán xe đạp thể thao cũ</h1>
                      <p>
                        Nền tảng kết nối người mua và người bán xe đạp cũ minh
                        bạch. Tìm đúng mẫu xe phù hợp ngân sách và nhu cầu tập
                        luyện của bạn chỉ trong vài phút.
                      </p>
                      <div class="btn-box mt-4">
                        <a href="#xe-noi-bat" class="btn-premium"
                          >Tìm xe ngay</a
                        >
                        <a
                          href="./create_product.php"
                          class="btn-outline-premium"
                          >Đăng bán xe</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Slide 2 -->
            <div class="carousel-item">
              <div class="bg-box">
                <img
                  src="../assets/images/hero-bg-2.jpg"
                  alt="Slide 2"
                  class="img-flipped"
                />
              </div>
              <div class="container">
                <div class="row">
                  <div class="col-md-8 col-lg-7">
                    <div class="detail-box">
                      <h1>Nâng tầm trải nghiệm đạp xe</h1>
                      <p>
                        Khám phá các dòng xe Road, MTB cao cấp từ những thương
                        hiệu hàng đầu thế giới như Giant, Trek, Specialized với
                        mức giá không thể tốt hơn.
                      </p>
                      <div class="btn-box mt-4">
                        <a href="./products.php" class="btn-premium"
                          >Xem sản phẩm</a
                        >
                        <a
                          href="./create_product.php"
                          class="btn-outline-premium"
                          >Đăng tin ngay</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Slide 3 -->
            <div class="carousel-item">
              <div class="bg-box">
                <img src="../assets/images/hero-bg-3.jpg" alt="Slide 3" />
              </div>
              <div class="container">
                <div class="row">
                  <div class="col-md-8 col-lg-7">
                    <div class="detail-box">
                      <h1>Cộng đồng yêu xe đạp uy tín</h1>
                      <p>
                        Mọi tin đăng đều được kiểm duyệt minh bạch. Kết nối trực
                        tiếp giữa người mua và người bán, đảm bảo giao dịch an
                        toàn và tin cậy.
                      </p>
                      <div class="btn-box mt-4">
                        <a href="#xe-noi-bat" class="btn-premium"
                          >Khám phá ngay</a
                        >
                        <a href="./register.php" class="btn-outline-premium"
                          >Tham gia ngay</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ol class="carousel-indicators">
            <li
              data-target="#customCarousel1"
              data-slide-to="0"
              class="active"
            ></li>
            <li data-target="#customCarousel1" data-slide-to="1"></li>
            <li data-target="#customCarousel1" data-slide-to="2"></li>
          </ol>
        </div>
      </section>
    </div>

    <section class="search_section layout_padding" id="tim-kiem">
      <div class="container">
        <div class="heading_container heading_center">
          <h2>Tìm kiếm xe đạp nhanh</h2>
          <p class="sub-heading">
            Lọc theo từ khóa, khoảng giá và loại xe để tìm đúng mẫu phù hợp.
          </p>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="search-card">
              <form id="bikeSearchForm" class="search-form-premium" novalidate>
                <div class="search-input-group">
                  <input
                    id="searchKeyword"
                    type="text"
                    class="search-input"
                    placeholder="Bạn đang tìm xe gì? (Hãng, tên xe...)"
                  />
                </div>
                <div class="search-input-group">
                  <select id="searchPrice" class="search-select">
                    <option value="all">Tất cả mức giá</option>
                    <option value="0-10">Dưới 10 triệu</option>
                    <option value="10-30">10 - 30 triệu</option>
                    <option value="30-70">30 - 70 triệu</option>
                    <option value="70-999">Trên 70 triệu</option>
                  </select>
                </div>
                <div class="search-input-group">
                  <select id="searchType" class="search-select">
                    <option value="all">Tất cả loại xe</option>
                    <option value="road">Road Bike</option>
                    <option value="mtb">MTB</option>
                    <option value="touring">Touring</option>
                    <option value="city">Hybrid</option>
                    <option value="fixed">Fixed Gear</option>
                    <option value="bmx">BMX</option>
                    <option value="gravel">Gravel</option>
                    <option value="triathlon">Triathlon / TT</option>
                  </select>
                </div>
                <button
                  id="searchButton"
                  type="submit"
                  class="btn-search-premium"
                >
                  TÌM KIẾM
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="category_section layout_padding bg-white" id="danh-muc">
      <div class="container">
        <div class="heading_container heading_center mb-5">
          <h2>Khám phá theo <span>Danh mục</span></h2>
          <p class="sub-heading">
            Chọn dòng xe phù hợp với nhu cầu và phong cách của bạn
          </p>
        </div>
        <div class="row justify-content-center">
          <!-- Road Bike -->
          <div class="col-6 col-md-4 col-lg-2 mb-4">
            <a href="./products.php?category=road" class="category-card">
              <div class="category-img-box">
                <img src="../assets/images/category_road.png" alt="Road Bike" />
              </div>
              <div class="category-detail text-center">
                <h5 class="mb-0">Road Bike</h5>
              </div></a
            >
          </div>
          <!-- MTB -->
          <div class="col-6 col-md-4 col-lg-2 mb-4">
            <a href="./products.php?category=mtb" class="category-card">
              <div class="category-img-box">
                <img src="../assets/images/category_mtb.png" alt="MTB" />
              </div>
              <div class="category-detail text-center">
                <h5 class="mb-0">MTB</h5>
              </div></a
            >
          </div>
          <!-- Touring -->
          <div class="col-6 col-md-4 col-lg-2 mb-4">
            <a href="./products.php?category=touring" class="category-card">
              <div class="category-img-box">
                <img
                  src="../assets/images/category_touring.png"
                  alt="Touring"
                />
              </div>
              <div class="category-detail text-center">
                <h5 class="mb-0">Touring</h5>
              </div></a
            >
          </div>
          <!-- City Bike -->
          <div class="col-6 col-md-4 col-lg-2 mb-4">
            <a href="./products.php?category=city" class="category-card">
              <div class="category-img-box">
                <img src="../assets/images/category_city.png" alt="City Bike" />
              </div>
              <div class="category-detail text-center">
                <h5 class="mb-0">Hybrid</h5>
              </div></a
            >
          </div>
          <!-- Fixed Gear -->
          <div class="col-6 col-md-4 col-lg-2 mb-4">
            <a href="./products.php?category=fixed" class="category-card">
              <div class="category-img-box">
                <img
                  src="../assets/images/category_fixed.png"
                  alt="Fixed Gear"
                />
              </div>
              <div class="category-detail text-center">
                <h5 class="mb-0">Fixed Gear</h5>
              </div></a
            >
          </div>
          <!-- Gravel -->
          <div class="col-6 col-md-4 col-lg-2 mb-4">
            <a href="./products.php?category=gravel" class="category-card">
              <div class="category-img-box">
                <img
                  src="../assets/images/category_gravel.png"
                  alt="Gravel Bike"
                />
              </div>
              <div class="category-detail text-center">
                <h5 class="mb-0">Gravel</h5>
              </div></a
            >
          </div>
        </div>
        <div class="text-center mt-3">
          <a href="./products.php" class="explore-link-premium"
            >Khám phá tất cả các dòng xe</a
          >
        </div>
      </div>
    </section>

    <section class="bike_section layout_padding" id="xe-noi-bat">
      <div class="container">
        <div class="heading_container heading_center">
          <h2>Xe đạp nổi bật / Mới đăng</h2>
        </div>

        <div class="filters-content">
          <div class="row grid" id="productGrid">
            <!-- Các sản phẩm sẽ được tải động từ API -->

            <div class="col-12 text-center py-5" id="productGridLoader">
              <div class="spinner-border text-warning" role="status"></div>
              <p class="mt-3 text-muted">Đang kết nối đến kho xe...</p>
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <a href="./products.php" class="explore-link-premium"
            >Xem tất cả xe</a
          >
        </div>
      </div>
    </section>

    <?php include '../includes/footer.php'; ?>

    <?php include '../includes/scripts.php'; ?>
    <script src="../assets/js/products.js"></script>
  </body>
</html>
