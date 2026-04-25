<!-- Header Section -->
<div class="hero_area">
    <div class="bg-box">
        <img src="assets/images/hero-bg.webp" alt="Nền trang chủ xe đạp thể thao" />
    </div>
    <header class="header_section">
        <div class="container">
            <nav class="navbar navbar-expand-lg custom_nav-container">
                <a class="navbar-brand" href="index.php">
                    <span>Bike Marketplace</span>
                </a>

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Mở menu điều hướng">
                    <span class=""></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mx-auto">
                        <li class="nav-item <?php echo ($currentPage ?? '') === 'home' ? 'active' : ''; ?>">
                            <a class="nav-link" href="index.php">Trang chủ <?php if (($currentPage ?? '') === 'home'): ?><span class="sr-only">(current)</span><?php endif; ?></a>
                        </li>
                        <li class="nav-item <?php echo ($currentPage ?? '') === 'products' ? 'active' : ''; ?>">
                            <a class="nav-link" href="pages/products.php">Sản phẩm</a>
                        </li>
                        <li class="nav-item <?php echo ($currentPage ?? '') === 'create' ? 'active' : ''; ?>">
                            <a class="nav-link" href="pages/create_product.php">Đăng bán</a>
                        </li>
                        <li class="nav-item <?php echo ($currentPage ?? '') === 'favorites' ? 'active' : ''; ?>">
                            <a class="nav-link" href="pages/favorites.php">Yêu thích</a>
                        </li>
                    </ul>
                    <div class="user_option">
                        <a href="pages/profile.php" class="user_link" aria-label="Tài khoản">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <circle cx="12" cy="7" r="4"></circle>
                                <path d="M20 21a8 8 0 0 0-16 0"></path>
                            </svg>
                        </a>
                        <a class="cart_link" href="pages/order.php" aria-label="Giỏ hàng">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 456.029 456.029" style="enable-background: new 0 0 456.029 456.029" xml:space="preserve">
                                <g>
                                    <g>
                                        <path d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248 c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z" />
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48 C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064 c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4 C457.728,97.71,450.56,86.958,439.296,84.91z" />
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296 c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z" />
                                    </g>
                                </g>
                            </svg>
                        </a>
                        <form class="form-inline">
                            <button class="btn my-2 my-sm-0 nav_search-btn" type="button" aria-label="Tìm kiếm">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <circle cx="11" cy="11" r="7"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    </header>
</div>