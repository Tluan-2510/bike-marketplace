<?php

require_once __DIR__ . "/../models/User.php";

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
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

    public function register() {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);

        if (!$input) {
            $this->jsonResponse(false, null, "Dữ liệu đầu vào không hợp lệ");
        }

        $username = $input['username'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $phone_number = $input['phone_number'] ?? '';
        $full_name = $input['full_name'] ?? '';

        if (empty($username) || empty($email) || empty($password) || empty($phone_number)) {
            $this->jsonResponse(false, null, "Thiếu thông tin bắt buộc");
        }

        $existingUser = $this->userModel->findByEmail($email);
        if ($existingUser) {
            $this->jsonResponse(false, null, "Email đã tồn tại");
        }

        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $userId = $this->userModel->create($username, $email, $password_hash, $phone_number, $full_name);

        if ($userId) {
            $data = [
                "user_id" => $userId,
                "username" => $username,
                "email" => $email,
                "phone_number" => $phone_number,
                "full_name" => $full_name
            ];
            $this->jsonResponse(true, $data);
        } else {
            $this->jsonResponse(false, null, "Không thể đăng ký người dùng");
        }
    }

    public function login() {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);

        if (!$input) {
            $this->jsonResponse(false, null, "Dữ liệu đầu vào không hợp lệ");
        }

        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            $this->jsonResponse(false, null, "Thiếu email hoặc mật khẩu");
        }

        $user = $this->userModel->findByEmail($email);

        if ($user && password_verify($password, $user['password_hash'])) {
            unset($user['password_hash']); // Don't return hash to client
            $this->jsonResponse(true, $user);
        } else {
            $this->jsonResponse(false, null, "Email hoặc mật khẩu không đúng");
        }
    }
}
