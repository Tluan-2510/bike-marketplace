<?php

require_once __DIR__ . "/../models/BuyRequest.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";

class BuyRequestController {
    private BuyRequest $requestModel;

    public function __construct() {
        $this->requestModel = new BuyRequest();
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
        $seller_id = $input['seller_id'] ?? null;
        $message = $input['message'] ?? '';

        if (!$product_id || !$seller_id) {
            $this->jsonResponse(false, null, "Thiếu thông tin sản phẩm hoặc người bán", 422);
        }

        $request_id = $this->requestModel->create((int)$product_id, (int)$user['user_id'], (int)$seller_id, $message);

        if ($request_id) {
            $this->jsonResponse(true, ["request_id" => $request_id], "Gửi yêu cầu mua thành công", 201);
        } else {
            $this->jsonResponse(false, null, "Không thể tạo yêu cầu mua", 500);
        }
    }
}
