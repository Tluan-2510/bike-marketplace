<?php

require_once __DIR__ . "/../models/Favorite.php";

class FavoriteController {
    private $favoriteModel;

    public function __construct() {
        $this->favoriteModel = new Favorite();
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
        $favorites = $this->favoriteModel->getByUserId($user_id);
        $this->jsonResponse(true, $favorites);
    }

    public function store() {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);

        if (!$input) {
            $this->jsonResponse(false, null, "Dữ liệu đầu vào không hợp lệ");
        }

        $user_id = $input['user_id'] ?? null;
        $product_id = $input['product_id'] ?? null;
        $action = $input['action'] ?? 'add'; // 'add' hoặc 'remove'

        if (!$user_id || !$product_id) {
            $this->jsonResponse(false, null, "Thiếu thông tin bắt buộc");
        }

        if ($action === 'add') {
            $success = $this->favoriteModel->add($user_id, $product_id);
            $message = $success ? "Đã thêm vào danh sách yêu thích" : "Không thể thêm vào danh sách yêu thích hoặc mục này đã tồn tại";
        } else {
            $success = $this->favoriteModel->remove($user_id, $product_id);
            $message = $success ? "Đã xóa khỏi danh sách yêu thích" : "Không thể xóa khỏi danh sách yêu thích";
        }

        $this->jsonResponse($success, null, $message);
    }
}
