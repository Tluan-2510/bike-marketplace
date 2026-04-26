<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/JwtHelper.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/FavoriteController.php';
require_once __DIR__ . '/../controllers/OrderController.php';

header('Content-Type: application/json');

// Trích xuất URI sạch (bỏ query string)
$uri    = strtok($_SERVER['REQUEST_URI'], '?');
$method = $_SERVER['REQUEST_METHOD'];

/* ═══════════════════════════════════════════
   AUTH  (public – không cần token)
   ═══════════════════════════════════════════ */

if ($uri === '/api/auth/register' && $method === 'POST') {
    (new AuthController())->register();
}

if ($uri === '/api/auth/login' && $method === 'POST') {
    (new AuthController())->login();
}

/* ═══════════════════════════════════════════
   PRODUCTS
   ═══════════════════════════════════════════ */

if ($uri === '/api/products' && $method === 'GET') {
    (new ProductController())->index();
}

if ($uri === '/api/products' && $method === 'POST') {
    (new ProductController())->store();
}

// GET /api/products/:id  và  PUT/DELETE /api/products/:id
if (preg_match('/^\/api\/products\/(\d+)$/', $uri, $m)) {
    $controller = new ProductController();
    $id = (int)$m[1];
    if ($method === 'GET')    $controller->show($id);
    if ($method === 'PUT')    $controller->update($id);
    if ($method === 'DELETE') $controller->destroy($id);
}

/* ═══════════════════════════════════════════
   FAVORITES  (protected – cần JWT)
   ═══════════════════════════════════════════ */

if ($uri === '/api/favorites' && $method === 'POST') {
    (new FavoriteController())->toggle();
}

if ($uri === '/api/favorites' && $method === 'GET') {
    (new FavoriteController())->index();
}

/* ═══════════════════════════════════════════
   ORDERS  (protected – cần JWT)
   ═══════════════════════════════════════════ */

if ($uri === '/api/orders' && $method === 'POST') {
    (new OrderController())->create();
}

if ($uri === '/api/orders' && $method === 'GET') {
    (new OrderController())->index();
}

/* ═══════════════════════════════════════════
   404 fallback
   ═══════════════════════════════════════════ */
http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Route not found']);