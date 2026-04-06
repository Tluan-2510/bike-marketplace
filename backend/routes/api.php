<?php

use App\Http\Controllers\AuthController;

/**
 * Authentication Routes
 */

// Public auth routes (no middleware required)
route('POST /auth/register', [AuthController::class, 'register']);
route('POST /auth/login', [AuthController::class, 'login']);
route('POST /auth/refresh', [AuthController::class, 'refresh']);
route('POST /auth/forgot-password', [AuthController::class, 'forgotPassword']);
route('POST /auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes (auth middleware required)
route('POST /auth/logout', [AuthController::class, 'logout'])->middleware('auth');
route('GET /auth/me', [AuthController::class, 'me'])->middleware('auth');

/**
 * Example: Protected admin routes with role check
 */
// route('GET /admin/users', [AdminController::class, 'getAllUsers'])
//     ->middleware(['auth', 'role:admin']);

/**
 * Example: Seller routes
 */
// route('POST /bikes', [BikeController::class, 'store'])
//     ->middleware(['auth', 'role:seller,admin']);
