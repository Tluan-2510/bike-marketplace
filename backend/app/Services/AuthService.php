<?php

namespace App\Services;

use App\Models\User;
use App\Models\RefreshToken;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Exception;

class AuthService
{
    private JwtService $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Register new user
     */
    public function register(array $data): array
    {
        // Check if user already exists
        if (User::where('email', $data['email'])->exists()) {
            throw new Exception('Email already registered', 400);
        }

        // Validate role
        $role = $data['role'] ?? User::ROLE_USER;
        if (!in_array($role, [User::ROLE_USER, User::ROLE_SELLER, User::ROLE_ADMIN])) {
            $role = User::ROLE_USER;
        }

        // Create user
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role' => $role,
            'is_active' => true,
        ]);

        return $this->loginUser($user);
    }

    /**
     * Login user
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw new Exception('Invalid credentials', 401);
        }

        if (!$user->is_active) {
            throw new Exception('Account is inactive', 403);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        return $this->loginUser($user);
    }

    /**
     * Login user helper function
     */
    private function loginUser(User $user): array
    {
        $accessToken = $this->jwtService->createToken($user);
        $refreshTokenRecord = $this->createRefreshToken($user);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshTokenRecord->token,
            'token_type' => 'Bearer',
            'expires_in' => (int) env('JWT_EXPIRATION_TIME', 15) * 60,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
                'is_active' => $user->is_active,
            ],
        ];
    }

    /**
     * Create refresh token
     */
    private function createRefreshToken(User $user): RefreshToken
    {
        // Revoke old refresh tokens
        RefreshToken::where('user_id', $user->id)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);

        // Create new refresh token
        return RefreshToken::create([
            'user_id' => $user->id,
            'token' => Str::random(64),
            'expires_at' => now()->addMinutes((int) env('REFRESH_TOKEN_EXPIRATION_TIME', 10080)),
        ]);
    }

    /**
     * Refresh access token
     */
    public function refreshAccessToken(string $refreshToken): array
    {
        $token = RefreshToken::where('token', $refreshToken)
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->first();

        if (!$token) {
            throw new Exception('Invalid or expired refresh token', 401);
        }

        $user = $token->user;

        if (!$user->is_active) {
            throw new Exception('Account is inactive', 403);
        }

        $newAccessToken = $this->jwtService->createToken($user);

        return [
            'access_token' => $newAccessToken,
            'token_type' => 'Bearer',
            'expires_in' => (int) env('JWT_EXPIRATION_TIME', 15) * 60,
        ];
    }

    /**
     * Logout user
     */
    public function logout(User $user): bool
    {
        // Revoke all refresh tokens
        RefreshToken::where('user_id', $user->id)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);

        return true;
    }

    /**
     * Request password reset
     */
    public function requestPasswordReset(string $email): bool
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            // Don't reveal if email exists for security
            return true;
        }

        // Generate reset token
        $resetToken = Str::random(64);

        // Store reset token (in real app, send via email)
        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => hash('sha256', $resetToken),
                'created_at' => now(),
            ]
        );

        // In production: send email with reset link
        // $this->sendResetEmail($user, $resetToken);

        return true;
    }

    /**
     * Reset password
     */
    public function resetPassword(string $email, string $resetToken, string $newPassword): array
    {
        $record = \DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (!$record || !hash_equals($record->token, hash('sha256', $resetToken))) {
            throw new Exception('Invalid or expired reset token', 400);
        }

        // Check if token is not older than 1 hour
        if ($record->created_at->addHour() < now()) {
            throw new Exception('Reset token has expired', 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            throw new Exception('User not found', 404);
        }

        $user->update(['password' => Hash::make($newPassword)]);

        // Delete reset token
        \DB::table('password_reset_tokens')->where('email', $email)->delete();

        // Revoke all refresh tokens for security
        RefreshToken::where('user_id', $user->id)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);

        return $this->loginUser($user);
    }
}
