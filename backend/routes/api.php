<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/JwtHelper.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/FavoriteController.php';

// Conditional Controllers
if (file_exists(__DIR__ . '/../controllers/BuyRequestController.php')) {
    require_once __DIR__ . '/../controllers/BuyRequestController.php';
}
if (file_exists(__DIR__ . '/../controllers/CategoryController.php')) {
    require_once __DIR__ . '/../controllers/CategoryController.php';
}
if (file_exists(__DIR__ . '/../controllers/BrandController.php')) {
    require_once __DIR__ . '/../controllers/BrandController.php';
}

header('Content-Type: application/json; charset=utf-8');

// Trích xuất URI sạch
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Loại bỏ prefix /backend nếu có
if (strpos($uri, '/backend') === 0) {
    $uri = substr($uri, 8);
}
$method = $_SERVER['REQUEST_METHOD'];

/* ═══════════════════════════════════════════
   AUTH (public)
   ═══════════════════════════════════════════ */

if ($uri === '/api/auth/register' && $method === 'POST') {
    (new AuthController())->register();
    exit();
}

if ($uri === '/api/auth/login' && $method === 'POST') {
    (new AuthController())->login();
    exit();
}

/* ═══════════════════════════════════════════
   CATEGORIES & BRANDS (public)
   ═══════════════════════════════════════════ */

if ($uri === '/api/categories' && $method === 'GET') {
    if (class_exists('CategoryController')) {
        (new CategoryController())->index();
        exit();
    }
}

if ($uri === '/api/brands' && $method === 'GET') {
    if (class_exists('BrandController')) {
        (new BrandController())->index();
        exit();
    }
}

/* ═══════════════════════════════════════════
   PRODUCTS
   ═══════════════════════════════════════════ */

if ($uri === '/api/products' && $method === 'GET') {
    (new ProductController())->index();
    exit();
}

if ($uri === '/api/products' && $method === 'POST') {
    (new ProductController())->store();
    exit();
}

// GET/PUT/DELETE /api/products/:id
if (preg_match('/^\/api\/products\/(\d+)$/', $uri, $m)) {
    $controller = new ProductController();
    $id = (int)$m[1];
    if ($method === 'GET')    { $controller->show($id);    exit(); }
    if ($method === 'PUT')    { $controller->update($id);  exit(); }
    if ($method === 'DELETE') { $controller->destroy($id); exit(); }
}

/* ═══════════════════════════════════════════
   FAVORITES (protected)
   ═══════════════════════════════════════════ */

if ($uri === '/api/favorites' && $method === 'POST') {
    (new FavoriteController())->toggle();
    exit();
}

if ($uri === '/api/favorites' && $method === 'GET') {
    (new FavoriteController())->index();
    exit();
}

/* ═══════════════════════════════════════════
   BUY REQUESTS (protected)
   ═══════════════════════════════════════════ */

if ($uri === '/api/buy-requests' && $method === 'POST') {
    if (class_exists('BuyRequestController')) {
        (new BuyRequestController())->store();
        exit();
    }
}

if ($uri === '/api/buy-requests' && $method === 'GET') {
    if (class_exists('BuyRequestController')) {
        (new BuyRequestController())->index();
        exit();
    }
}

/* ═══════════════════════════════════════════
   404 fallback
   ═══════════════════════════════════════════ */
http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Không tìm thấy API'], JSON_UNESCAPED_UNICODE);
exit();
