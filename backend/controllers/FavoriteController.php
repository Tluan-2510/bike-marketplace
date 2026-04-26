<?php

require_once __DIR__ . '/../models/Favorite.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class FavoriteController {
    private Favorite $favoriteModel;

    public function __construct() {
        $this->favoriteModel = new Favorite();
    }

    // ─── Helper ──────────────────────────────────────────────────────────────

    private function jsonResponse(bool $success, mixed $data = null, string $message = '', int $statusCode = 200): never {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'data'    => $data,
            'message' => $message,
        ]);
        exit();
    }

    // ─── POST /api/favorites ─────────────────────────────────────────────────
    // Toggle: nếu đã yêu thích → xóa (removed), chưa → thêm (added)

    public function toggle(): never {
        // Xác thực JWT bắt buộc
        $payload = AuthMiddleware::authenticate();
        $userId = (int)$payload['user_id'];

        $raw   = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!is_array($input) || empty($input['product_id'])) {
            $this->jsonResponse(false, null, 'product_id là bắt buộc', 422);
        }

        $productId = filter_var($input['product_id'], FILTER_VALIDATE_INT);
        if ($productId === false || $productId <= 0) {
            $this->jsonResponse(false, null, 'product_id không hợp lệ', 422);
        }

        if ($this->favoriteModel->exists($userId, $productId)) {
            // Đã có trong danh sách → xóa
            $this->favoriteModel->remove($userId, $productId);
            $this->jsonResponse(true, ['status' => 'removed'], 'Đã xóa khỏi danh sách yêu thích');
        } else {
            // Chưa có → thêm vào
            $this->favoriteModel->add($userId, $productId);
            $this->jsonResponse(true, ['status' => 'added'], 'Đã thêm vào danh sách yêu thích', 201);
        }
    }

    // ─── GET /api/favorites ──────────────────────────────────────────────────
    // Trả về danh sách yêu thích có JOIN với bảng products

    public function index(): never {
        // Xác thực JWT bắt buộc
        $payload = AuthMiddleware::authenticate();
        $userId = (int)$payload['user_id'];

        $favorites = $this->favoriteModel->getByUserId($userId);

        $this->jsonResponse(true, $favorites, '');
    }
}
