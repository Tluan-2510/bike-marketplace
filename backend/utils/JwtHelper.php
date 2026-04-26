<?php

/**
 * JwtHelper – lightweight HS256 JWT implementation.
 * Không dùng thư viện bên ngoài, đảm bảo tương thích với mọi môi trường PHP 8+.
 */
class JwtHelper {

    private static function getSecret(): string {
        $secret = getenv('JWT_SECRET');
        if (!$secret) {
            // Fallback (không nên xảy ra khi .env đã load)
            $secret = 'bike_marketplace_default_secret';
        }
        return $secret;
    }

    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Tạo JWT token chứa user_id và role.
     */
    public static function encode(array $payload): string {
        $expire = (int)(getenv('JWT_EXPIRE') ?: 86400);

        $header = self::base64UrlEncode(json_encode([
            'alg' => 'HS256',
            'typ' => 'JWT',
        ]));

        $payload['iat'] = time();
        $payload['exp'] = time() + $expire;

        $payloadEncoded = self::base64UrlEncode(json_encode($payload));

        $signature = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payloadEncoded", self::getSecret(), true)
        );

        return "$header.$payloadEncoded.$signature";
    }

    /**
     * Giải mã và xác thực JWT token.
     * Trả về payload array nếu hợp lệ, false nếu không hợp lệ / hết hạn.
     */
    public static function decode(string $token): array|false {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }

        [$headerEncoded, $payloadEncoded, $signatureProvided] = $parts;

        // Kiểm tra chữ ký
        $expectedSignature = self::base64UrlEncode(
            hash_hmac('sha256', "$headerEncoded.$payloadEncoded", self::getSecret(), true)
        );

        if (!hash_equals($expectedSignature, $signatureProvided)) {
            return false;
        }

        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);

        if (!is_array($payload)) {
            return false;
        }

        // Kiểm tra hạn token
        if (isset($payload['exp']) && time() > $payload['exp']) {
            return false;
        }

        return $payload;
    }
}
