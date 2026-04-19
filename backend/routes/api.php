<!-- định nghĩa API -->

<?php

require_once "../controllers/ProductController.php";
require_once "../controllers/AuthController.php";
require_once "../controllers/OrderController.php";
require_once "../controllers/FavoriteController.php";

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

/* ================= PRODUCTS ================= */

if ($uri == "/api/products" && $method == "GET") {
    (new ProductController())->index();
}

if ($uri == "/api/products" && $method == "POST") {
    (new ProductController())->store();
}

/* ================= AUTH ================= */

if ($uri == "/api/auth/login") {
    (new AuthController())->login();
}

if ($uri == "/api/auth/register") {
    (new AuthController())->register();
}

/* ================= ORDER ================= */

if ($uri == "/api/orders" && $method == "POST") {
    (new OrderController())->create();
}

/* ================= FAVORITE ================= */

if ($uri == "/api/favorites" && $method == "POST") {
    (new FavoriteController())->add();
}