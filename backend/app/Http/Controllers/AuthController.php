<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Services\JwtService;
use App\Core\Request;
use App\Core\JsonResponse;

class AuthController extends Controller
{
    private AuthService $authService;
    private JwtService $jwtService;

    public function __construct(AuthService $authService, JwtService $jwtService)
    {
        $this->authService = $authService;
        $this->jwtService = $jwtService;
    }

    /**
     * Register new user
     * POST /api/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $this->validateRegister($request);
            $result = $this->authService->register($validated);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => $result,
            ], 201);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validated = $this->validateLogin($request);
            $result = $this->authService->login($validated['email'], $validated['password']);

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $refreshToken = $request->input('refresh_token');

            if (!$refreshToken) {
                throw new \Exception('Refresh token is required', 400);
            }

            $result = $this->authService->refreshAccessToken($refreshToken);

            return response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                throw new \Exception('User not authenticated', 401);
            }

            $this->authService->logout($user);

            return response()->json([
                'success' => true,
                'message' => 'Logout successful',
            ], 200);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    /**
     * Request password reset
     * POST /api/auth/forgot-password
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $email = $request->input('email');

            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new \Exception('Valid email is required', 400);
            }

            $this->authService->requestPasswordReset($email);

            return response()->json([
                'success' => true,
                'message' => 'If the email exists, you will receive a password reset link',
            ], 200);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    /**
     * Reset password
     * POST /api/auth/reset-password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'email' => 'required|email',
                'token' => 'required|string',
                'password' => 'required|string|min:6|confirmed',
            ]);

            $result = $this->authService->resetPassword(
                $data['email'],
                $data['token'],
                $data['password']
            );

            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    /**
     * Get current user
     * GET /api/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                throw new \Exception('User not authenticated', 401);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'avatar_url' => $user->avatar_url,
                    'bio' => $user->bio,
                    'address' => $user->address,
                    'is_active' => $user->is_active,
                    'email_verified_at' => $user->email_verified_at,
                    'last_login_at' => $user->last_login_at,
                ],
            ], 200);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    // Validation helpers
    private function validateRegister(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|in:user,seller,admin',
        ]);
    }

    private function validateLogin(Request $request): array
    {
        return $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
        ]);
    }
}
