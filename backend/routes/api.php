<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../controllers/ProductController.php";
require_once "../controllers/AuthController.php";
require_once "../controllers/BuyRequestController.php";
require_once "../controllers/FavoriteController.php";
require_once "../controllers/CategoryController.php";
require_once "../controllers/BrandController.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

/* ================= CATEGORIES & BRANDS ================= */

if ($uri == "/api/categories" && $method == "GET") {
    (new CategoryController())->index();
}

if ($uri == "/api/brands" && $method == "GET") {
    (new BrandController())->index();
}

/* ================= PRODUCTS ================= */

if ($uri == "/api/products" && $method == "GET") {
    (new ProductController())->index();
}

if ($uri == "/api/products" && $method == "POST") {
    (new ProductController())->store();
}

/* ================= AUTH ================= */

if ($uri == "/api/auth/login" && $method == "POST") {
    (new AuthController())->login();
}

if ($uri == "/api/auth/register" && $method == "POST") {
    (new AuthController())->register();
}

/* ================= BUY REQUESTS ================= */

if ($uri == "/api/buy-requests" && $method == "GET") {
    (new BuyRequestController())->index();
}

if ($uri == "/api/buy-requests" && $method == "POST") {
    (new BuyRequestController())->store();
}

/* ================= FAVORITE ================= */

if ($uri == "/api/favorites" && $method == "GET") {
    (new FavoriteController())->index();
}

if ($uri == "/api/favorites" && $method == "POST") {
    (new FavoriteController())->store();
}

// 404 Fallback
http_response_code(404);
echo json_encode(["success" => false, "message" => "API endpoint not found"]);
exit();