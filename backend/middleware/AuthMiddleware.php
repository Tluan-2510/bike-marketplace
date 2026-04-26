<?php

require_once __DIR__ . '/../utils/JwtHelper.php';

/**
 * AuthMiddleware – kiểm tra JWT trong header Authorization: Bearer <token>.
 * Dùng cho mọi route cần bảo mật.
 */
class AuthMiddleware {

    /**
     * Xác thực token và trả về payload.
     * Tự động dừng request với HTTP 401 nếu token không hợp lệ.
     *
     * @return array Payload đã decode (bao gồm user_id, role, iat, exp)
     */
    public static function authenticate(): array {
        $headers = getallheaders();

        // Tương thích nhiều server: tìm Authorization header (case-insensitive)
        $authHeader = null;
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $authHeader = $value;
                break;
            }
        }

        if (!$authHeader) {
            self::unauthorized('Missing Authorization header');
        }

        // Kiểm tra định dạng "Bearer <token>"
        if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
            self::unauthorized('Invalid Authorization format. Expected: Bearer <token>');
        }

        $token = trim($matches[1]);
        $payload = JwtHelper::decode($token);

        if ($payload === false) {
            self::unauthorized('Invalid or expired token');
        }

        return $payload;
    }

    /**
     * Trả về HTTP 401 và dừng request.
     */
    private static function unauthorized(string $message): never {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => $message,
            'data'    => null,
        ]);
        exit();
    }
}
