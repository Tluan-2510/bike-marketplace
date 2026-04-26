<?php

// Fix: Sử dụng __DIR__ để đường dẫn luôn chính xác bất kể file nào include file này
require_once __DIR__ . "/../controllers/ProductController.php";
require_once __DIR__ . "/../controllers/AuthController.php";
require_once __DIR__ . "/../controllers/BuyRequestController.php";
require_once __DIR__ . "/../controllers/FavoriteController.php";
require_once __DIR__ . "/../controllers/CategoryController.php";
require_once __DIR__ . "/../controllers/BrandController.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = $_GET['route'] ?? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Loại bỏ tiền tố /backend/ nếu có để khớp với route
$uri = str_replace('/backend', '', $uri);

/* ================= CATEGORIES & BRANDS ================= */

if ($uri == "/api/categories" && $method == "GET") {
    (new CategoryController())->index();
    exit();
}

if ($uri == "/api/brands" && $method == "GET") {
    (new BrandController())->index();
    exit();
}

/* ================= PRODUCTS ================= */

if ($uri == "/api/products" && $method == "GET") {
    (new ProductController())->index();
    exit();
}

if ($uri == "/api/products" && $method == "POST") {
    (new ProductController())->store();
    exit();
}

/* ================= AUTH ================= */

if ($uri == "/api/auth/login" && $method == "POST") {
    (new AuthController())->login();
    exit();
}

if ($uri == "/api/auth/register" && $method == "POST") {
    (new AuthController())->register();
    exit();
}

/* ================= BUY REQUESTS ================= */

if ($uri == "/api/buy-requests" && $method == "GET") {
    (new BuyRequestController())->index();
    exit();
}

if ($uri == "/api/buy-requests" && $method == "POST") {
    (new BuyRequestController())->store();
    exit();
}

/* ================= FAVORITE ================= */

if ($uri == "/api/favorites" && $method == "GET") {
    (new FavoriteController())->index();
    exit();
}

if ($uri == "/api/favorites" && $method == "POST") {
    (new FavoriteController())->store();
    exit();
}

// 404 Fallback
http_response_code(404);
echo json_encode(["success" => false, "message" => "Không tìm thấy API"], JSON_UNESCAPED_UNICODE);
exit();
