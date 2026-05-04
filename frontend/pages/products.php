<?php include '../includes/head.php'; ?>

    <style>
        .custom-pagination .page-item .page-link {
            color: #333;
            border: none;
            margin: 0 5px;
            border-radius: 5px;
            font-weight: 600;
            padding: 8px 16px;
            transition: all 0.3s;
        }
        .custom-pagination .page-item.active .page-link {
            background-color: #f3c93e;
            color: #000;
            box-shadow: 0 4px 10px rgba(243, 201, 62, 0.3);
        }
        .custom-pagination .page-item .page-link:hover:not(.active) {
            background-color: #f8f9fa;
            color: #f3c93e;
        }
        .custom-pagination .page-item.disabled .page-link {
            color: #ccc;
            background: transparent;
        }
    </style>
    <body class="sub_page">
        <div class="hero_area">
            <?php include '../includes/navbar.php'; ?>
        </div>

        <section class="shop_section layout_padding">
            <div class="container">
                <div class="heading_container heading_center mb-5">
                    <h2>Danh sách <span>Sản phẩm</span></h2>
                    <p class="sub-heading">Khám phá kho xe thể thao đa dạng, được kiểm duyệt minh bạch.</p>
                </div>

                <div class="bg-white p-3 rounded shadow-sm border mb-5">
                    <form id="filterForm" class="row align-items-end">
                        <div class="col-md-4 mb-2 mb-md-0">
                            <label class="small font-weight-bold">Từ khóa</label>
                            <input type="text" id="filterKeyword" class="form-control" placeholder="Tên xe, hãng xe...">
                        </div>
                        <div class="col-md-3 mb-2 mb-md-0">
                            <label class="small font-weight-bold">Loại xe</label>
                            <select id="filterCategory" class="form-control">
                                <option value="">Tất cả loại xe</option>
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
                        <div class="col-md-3 mb-2 mb-md-0">
                            <label class="small font-weight-bold">Mức giá</label>
                            <select id="filterPrice" class="form-control">
                                <option value="">Mọi mức giá</option>
                                <option value="0-10">Dưới 10 triệu</option>
                                <option value="10-30">10 - 30 triệu</option>
                                <option value="30-70">30 - 70 triệu</option>
                                <option value="70-999">Trên 70 triệu</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button type="submit" class="explore-link-premium border-0 w-100 justify-content-center py-2" style="margin-top: 0; font-size: 14px;">Lọc</button>
                        </div>
                    </form>
                </div>

                <div class="row grid" id="shopProductGrid">
                    <!-- Products will be injected here -->
                    <div class="col-12 text-center py-5" id="shopLoader">
                        <div class="spinner-border text-warning" role="status"><span class="sr-only">Đang tải...</span>
                        </div>
                        <p class="mt-2 text-muted">Đang tải kho xe...</p>
                    </div>
                </div>

                <div id="shopEmpty" class="text-center py-5 d-none"> 
                  <p class="text-muted">Không tìm thấy xe phù hợp với tiêu chí của bạn.</p>
                </div>

                <!-- Pagination Container -->
                <div class="pagination-container d-flex justify-content-center mt-5" id="shopPagination">
                </div>
            </div>
        </section>

        <?php include '../includes/footer.php'; ?>

        <?php include '../includes/scripts.php'; ?>
        <script src="../assets/js/products.js"></script>
    </body>
</html>
