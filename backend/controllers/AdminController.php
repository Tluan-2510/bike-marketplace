<?php

require_once __DIR__ . "/../models/Product.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";

/**
 * AdminController – Quản lý các tác vụ dành riêng cho quản trị viên.
 * Ưu tiên: Duyệt tin đăng (is_approved).
 */
class AdminController {
    private Product $productModel;

    public function __construct() {
        $this->productModel = new Product();
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
     * Kiểm tra quyền Admin.
     */
    private function checkAdmin(): array {
        $user = AuthMiddleware::authenticate();
        if ($user['role'] !== 'admin') {
            $this->jsonResponse(false, null, "Bạn không có quyền truy cập chức năng này", 403);
        }
        return $user;
    }

    /**
     * Lấy danh sách sản phẩm đang chờ duyệt (is_approved = 0).
     * GET /api/admin/pending-products
     */
    public function pending(): never {
        $this->checkAdmin();
        $page = $_GET['page'] ?? 1;
        $limit = $_GET['limit'] ?? 20;
        
        $products = $this->productModel->getPending((int)$page, (int)$limit);
        $this->jsonResponse(true, $products, "Lấy danh sách tin chờ duyệt thành công");
    }

    /**
     * Phê duyệt một sản phẩm.
     * POST /api/admin/approve
     */
    public function approve(): never {
        $this->checkAdmin();
        
        // Hỗ trợ cả JSON body và POST form
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['product_id'] ?? ($_POST['product_id'] ?? null);
        
        if (!$id) {
            $this->jsonResponse(false, null, "Thiếu ID sản phẩm (product_id)", 422);
        }

        $success = $this->productModel->approve((int)$id);
        if ($success) {
            $this->jsonResponse(true, null, "Đã duyệt sản phẩm thành công");
        }
        
        $this->jsonResponse(false, null, "Không thể duyệt sản phẩm (ID không tồn tại hoặc lỗi server)", 500);
    }
}
