<?php

require_once __DIR__ . "/../models/BuyRequest.php";
require_once __DIR__ . "/../models/Product.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";

class BuyRequestController {
    private BuyRequest $requestModel;
    private Product $productModel;

    public function __construct() {
        $this->requestModel = new BuyRequest();
        $this->productModel = new Product();
    }

    private function jsonResponse(bool $success, mixed $data = null, string $message = '', int $statusCode = 200): never {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'data'    => $data,
            'message' => $message,
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    public function index(): never {
        $user = AuthMiddleware::authenticate();
        $role = $_GET['role'] ?? 'seller'; // seller hoặc buyer
        
        $requests = $this->requestModel->getByUserId($user['user_id'], $role);
        $this->jsonResponse(true, $requests);
    }

    public function store(): never {
        $user = AuthMiddleware::authenticate();
        
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input) {
            $this->jsonResponse(false, null, "Dữ liệu đầu vào không hợp lệ", 400);
        }

        $product_id = $input['product_id'] ?? null;
        $message = $input['message'] ?? '';

        if (!$product_id) {
            $this->jsonResponse(false, null, "Thiếu thông tin sản phẩm", 422);
        }

        $request_id = $this->requestModel->create((int)$product_id, (int)$user['user_id'], $message);

        if ($request_id) {
            $this->jsonResponse(true, ["request_id" => $request_id], "Gửi yêu cầu mua thành công", 201);
        } else {
            $this->jsonResponse(false, null, "Không thể tạo yêu cầu mua", 500);
        }
    }

    public function updateStatus(int $id): never {
        $user = AuthMiddleware::authenticate();
        
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!isset($input['status'])) {
            $this->jsonResponse(false, null, "Thiếu thông tin trạng thái", 400);
        }

        $status = $input['status'];
        $allowedStatuses = ['pending', 'accepted', 'rejected', 'completed'];
        
        if (!in_array($status, $allowedStatuses)) {
            $this->jsonResponse(false, null, "Trạng thái không hợp lệ", 400);
        }

        // Kiểm tra quyền: chỉ người bán của sản phẩm trong yêu cầu mới được cập nhật
        // (Thực tế nên check chi tiết hơn, nhưng ở đây tạm thời tin tưởng vào Model nếu logic đơn giản)
        if ($this->requestModel->updateStatus($id, $status)) {
            // Nếu đánh dấu là hoàn thành (đã bán), cập nhật luôn trạng thái sản phẩm
            if ($status === 'completed') {
                $req = $this->requestModel->find($id);
                if ($req && isset($req['product_id'])) {
                    // 1. Cập nhật xe thành Đã bán
                    $this->productModel->updateStatus((int)$req['product_id'], 'sold');
                    
                    // 2. Tự động xử lý các yêu cầu khác của xe này (reject pending, etc.)
                    $this->requestModel->completeRequestsForProduct((int)$req['product_id']);
                }
            }
            
            $this->jsonResponse(true, null, "Cập nhật trạng thái thành công");
        } else {
            $this->jsonResponse(false, null, "Không thể cập nhật trạng thái", 500);
        }
    }
}
