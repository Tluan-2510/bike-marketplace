<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;

class AuthMiddleware
{
    private JwtService $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    public function handle(Request $request, Closure $next)
    {
        // Get Authorization header
        $authHeader = $request->header('Authorization');

        if (!$authHeader) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header is missing',
            ], 401);
        }

        // Extract token
        $token = JwtService::extractToken($authHeader);

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Authorization header format. Use: Bearer <token>',
            ], 401);
        }

        // Verify token
        $decoded = $this->jwtService->verifyToken($token);

        if (!$decoded) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        // Get user
        $user = User::find($decoded->sub);

        if (!$user || !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'User not found or inactive',
            ], 401);
        }

        // Attach user to request
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}
