<?php

require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";

/**
 * UserController – Quản lý thông tin người dùng.
 */
class UserController {
    private User $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    /**
     * Helper gửi phản hồi JSON đồng nhất.
     */
    private function jsonResponse(bool $success, mixed $data = null, string $message = '', int $statusCode = 200): never {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => $success,
            'data'    => $data,
            'message' => $message,
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    /**
     * Lấy thông tin cá nhân hiện tại.
     * GET /api/user/me
     */
    public function me(): never {
        $authUser = AuthMiddleware::authenticate();
        $user = $this->userModel->findById($authUser['user_id']);
        
        if ($user) {
            $this->jsonResponse(true, $user, "Lấy thông tin cá nhân thành công");
        }
        
        $this->jsonResponse(false, null, "Không tìm thấy người dùng", 404);
    }

    /**
     * Cập nhật thông tin cá nhân.
     * PUT /api/user/profile
     */
    public function updateProfile(): never {
        $authUser = AuthMiddleware::authenticate();
        
        // Hỗ trợ JSON body
        $input = json_decode(file_get_contents('php://input'), true);
        
        $data = [
            'full_name'    => $input['full_name']    ?? null,
            'phone_number' => $input['phone_number'] ?? null,
        ];
        
        // Loại bỏ null
        $data = array_filter($data, fn($v) => !is_null($v));

        if (empty($data)) {
            $this->jsonResponse(false, null, "Không có dữ liệu thay đổi", 422);
        }

        $success = $this->userModel->update($authUser['user_id'], $data);
        if ($success) {
            $this->jsonResponse(true, null, "Cập nhật thông tin thành công");
        }
        
        $this->jsonResponse(false, null, "Không thể cập nhật thông tin", 500);
    }
}
