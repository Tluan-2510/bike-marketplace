<?php

require_once __DIR__ . "/../models/BuyRequest.php";

class BuyRequestController {
    private $requestModel;

    public function __construct() {
        $this->requestModel = new BuyRequest();
    }

    private function jsonResponse($success, $data = null, $message = "") {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            "success" => $success,
            "data" => $data,
            "message" => $message
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    public function index() {
        if (!isset($_GET['user_id'])) {
            $this->jsonResponse(false, null, "Thiếu tham số user_id");
        }

        $user_id = intval($_GET['user_id']);
        $requests = $this->requestModel->getByUserId($user_id);
        $this->jsonResponse(true, $requests);
    }

    public function store() {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);

        if (!$input) {
            $this->jsonResponse(false, null, "Dữ liệu đầu vào không hợp lệ");
        }

        $buyer_id = $input['buyer_id'] ?? null;
        $product_id = $input['product_id'] ?? null;
        $message = $input['message'] ?? '';

        if (!$buyer_id || !$product_id) {
            $this->jsonResponse(false, null, "Thiếu thông tin bắt buộc");
        }

        $request_id = $this->requestModel->create($buyer_id, $product_id, $message);

        if ($request_id) {
            $this->jsonResponse(true, ["request_id" => $request_id], "Tạo yêu cầu mua thành công");
        } else {
            $this->jsonResponse(false, null, "Không thể tạo yêu cầu mua");
        }
    }
}
