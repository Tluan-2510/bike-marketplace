<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/JwtHelper.php';

class AuthController {
    private User $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    

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

    private function getInput(): array {
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);
        if (!is_array($input)) {
            $this->jsonResponse(false, null, 'Invalid JSON input', 400);
        }
        return $input;
    }

    // ─── POST /api/auth/register ──────────────────────────────────────────────

    public function register(): never {
        $input = $this->getInput();

        // Lấy & sanitize đầu vào
        $username    = filter_var(trim($input['username'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);
        $email       = filter_var(trim($input['email']    ?? ''), FILTER_SANITIZE_EMAIL);
        $password    = trim($input['password'] ?? '');
        $fullName    = filter_var(trim($input['full_name'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);
        $phoneNumber = filter_var(trim($input['phone_number'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);

        // Validate
        if (empty($username) || empty($email) || empty($password)) {
            $this->jsonResponse(false, null, 'Vui lòng điền đầy đủ username, email và password', 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse(false, null, 'Email không hợp lệ', 422);
        }

        if (strlen($password) < 6) {
            $this->jsonResponse(false, null, 'Password phải có ít nhất 6 ký tự', 422);
        }

        // Kiểm tra email trùng
        $existingUser = $this->userModel->findByEmail($email);
        if ($existingUser) {
            $this->jsonResponse(false, null, 'Email đã được sử dụng', 409);
        }

        // Hash password bằng BCRYPT (yêu cầu bắt buộc)
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $userId = $this->userModel->create($username, $email, $hashedPassword, 'user', $fullName ?: null, $phoneNumber ?: null);

        if ($userId) {
            $this->jsonResponse(true, [
                'user_id'      => $userId,
                'username'     => $username,
                'email'        => $email,
                'full_name'    => $fullName,
                'phone_number' => $phoneNumber,
                'role'         => 'user',
            ], 'Đăng ký thành công', 201);
        }

        $this->jsonResponse(false, null, 'Đăng ký thất bại. Vui lòng thử lại', 500);
    }

    // ─── POST /api/auth/login ─────────────────────────────────────────────────

    public function login(): never {
        $input = $this->getInput();

        $email    = filter_var(trim($input['email']    ?? ''), FILTER_SANITIZE_EMAIL);
        $password = trim($input['password'] ?? '');

        if (empty($email) || empty($password)) {
            $this->jsonResponse(false, null, 'Vui lòng nhập email và password', 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse(false, null, 'Email không hợp lệ', 422);
        }

        $user = $this->userModel->findByEmail($email);

        // Kiểm tra user tồn tại và password hợp lệ bằng password_verify()
        if (!$user || !password_verify($password, $user['password'])) {
            $this->jsonResponse(false, null, 'Email hoặc password không đúng', 401);
        }

        // Tạo JWT chứa user_id và role
        $token = JwtHelper::encode([
            'user_id' => $user['id'],
            'role'    => $user['role'],
        ]);

        // Không trả về password
        unset($user['password']);

        $this->jsonResponse(true, [
            'token' => $token,
            'user'  => $user,
        ], 'Đăng nhập thành công');
    }
}
