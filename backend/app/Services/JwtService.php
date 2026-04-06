<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use stdClass;
use Exception;

class JwtService
{
    private string $secretKey;
    private string $algorithm;
    private int $expirationTime;

    public function __construct()
    {
        $this->secretKey = env('JWT_SECRET', 'default-secret-key');
        $this->algorithm = env('JWT_ALGORITHM', 'HS256');
        $this->expirationTime = (int) env('JWT_EXPIRATION_TIME', 15) * 60; // Convert to seconds
    }

    /**
     * Create JWT token
     */
    public function createToken(User $user): string
    {
        $issuedAt = now()->timestamp;
        $expiresAt = $issuedAt + $this->expirationTime;

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'sub' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'name' => $user->name,
        ];

        return JWT::encode($payload, $this->secretKey, $this->algorithm);
    }

    /**
     * Verify JWT token
     */
    public function verifyToken(string $token): ?stdClass
    {
        try {
            return JWT::decode($token, new Key($this->secretKey, $this->algorithm));
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Decode token without verification (get claims)
     */
    public function decodeToken(string $token): ?stdClass
    {
        try {
            return JWT::decode($token, new Key($this->secretKey, $this->algorithm));
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Extract token from Authorization header
     */
    public static function extractToken(string $authHeader): ?string
    {
        if (preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Get user from token
     */
    public function getUserFromToken(string $token): ?User
    {
        $decoded = $this->verifyToken($token);
        if (!$decoded) {
            return null;
        }

        return User::find($decoded->sub);
    }
}
