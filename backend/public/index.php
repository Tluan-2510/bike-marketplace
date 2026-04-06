<?php

// Lightweight PHP Backend - No Framework Required

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', env('APP_DEBUG') === 'true' ? '1' : '0');
ini_set('log_errors', '1');

// Handle CORS (Allow requests from anywhere)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load environment variables
loadEnv(__DIR__ . '/../.env');

// Simple database connection
try {
    $dbHost = env('DB_HOST', 'localhost');
    $dbName = env('DB_DATABASE', 'bike_marketplace');
    $dbUser = env('DB_USERNAME', 'root');
    $dbPass = env('DB_PASSWORD', '');
    
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'message' => 'Database connection error',
        'debug' => env('APP_DEBUG') === 'true' ? $e->getMessage() : null
    ]));
}

// Routing
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);

// Simple router
switch(true) {
    // Register
    case $method === 'POST' && $path === '/auth/register':
        register($pdo);
        break;
    
    // Login
    case $method === 'POST' && $path === '/auth/login':
        login($pdo);
        break;
    
    // Get current user
    case $method === 'GET' && $path === '/auth/me':
        getCurrentUser($pdo);
        break;
    
    // Logout
    case $method === 'POST' && $path === '/auth/logout':
        logout($pdo);
        break;
    
    // Refresh token
    case $method === 'POST' && $path === '/auth/refresh':
        refreshToken($pdo);
        break;
    
    // Forgot password
    case $method === 'POST' && $path === '/auth/forgot-password':
        forgotPassword($pdo);
        break;
    
    // Reset password
    case $method === 'POST' && $path === '/auth/reset-password':
        resetPassword($pdo);
        break;
    
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Route not found']);
        break;
}

// ====== HELPER FUNCTIONS ======

function env($key, $default = null) {
    return $_ENV[$key] ?? $default;
}

function loadEnv($path) {
    if (!file_exists($path)) return;
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach($lines as $line) {
        if (strpos($line, '=') === false || strpos($line, '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value, '"\'');
    }
}

function getInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?: [];
}

function response($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function getAuthToken() {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)$/', $header, $matches)) {
        return $matches[1];
    }
    return null;
}

function createJWT($userData) {
    $secret = env('JWT_SECRET', 'default-secret');
    $now = time();
    $exp = $now + ((int)env('JWT_EXPIRATION_TIME', 15) * 60);
    
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $payload = [
        'iat' => $now,
        'exp' => $exp,
        'sub' => $userData['id'],
        'email' => $userData['email'],
        'role' => $userData['role'],
        'name' => $userData['name']
    ];
    
    $b64header = base64_encode(json_encode($header));
    $b64payload = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', "$b64header.$b64payload", $secret, true);
    $b64signature = base64_encode($signature);
    
    return "$b64header.$b64payload.$b64signature";
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    
    $secret = env('JWT_SECRET', 'default-secret');
    $signature = hash_hmac('sha256', "{$parts[0]}.{$parts[1]}", $secret, true);
    
    if (base64_encode($signature) !== $parts[2]) return null;
    
    $payload = json_decode(base64_decode($parts[1]), true);
    if ($payload['exp'] < time()) return null;
    
    return $payload;
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// ====== API HANDLERS ======

function register($pdo) {
    $data = getInput();
    
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        response(['success' => false, 'message' => 'Missing required fields'], 400);
    }
    
    if ($data['password'] !== ($data['password_confirmation'] ?? null)) {
        response(['success' => false, 'message' => 'Passwords do not match'], 400);
    }
    
    // Check if email exists
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        response(['success' => false, 'message' => 'Email already registered'], 400);
    }
    
    // Create user
    $role = in_array($data['role'] ?? 'user', ['user', 'seller', 'admin']) ? $data['role'] : 'user';
    $stmt = $pdo->prepare('INSERT INTO users (name, email, phone, password, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())');
    $stmt->execute([
        $data['name'],
        $data['email'],
        $data['phone'] ?? null,
        hashPassword($data['password']),
        $role
    ]);
    
    $userId = $pdo->lastInsertId();
    $user = ['id' => $userId, 'name' => $data['name'], 'email' => $data['email'], 'role' => $role];
    
    response([
        'success' => true,
        'message' => 'User registered successfully',
        'data' => [
            'access_token' => createJWT($user),
            'refresh_token' => bin2hex(random_bytes(32)),
            'token_type' => 'Bearer',
            'expires_in' => (int)env('JWT_EXPIRATION_TIME', 15) * 60,
            'user' => $user
        ]
    ], 201);
}

function login($pdo) {
    $data = getInput();
    
    if (empty($data['email']) || empty($data['password'])) {
        response(['success' => false, 'message' => 'Email and password required'], 400);
    }
    
    $stmt = $pdo->prepare('SELECT id, name, email, password, role, is_active FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !verifyPassword($data['password'], $user['password'])) {
        response(['success' => false, 'message' => 'Invalid credentials'], 401);
    }
    
    if (!$user['is_active']) {
        response(['success' => false, 'message' => 'Account is inactive'], 403);
    }
    
    // Update last login
    $pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([$user['id']]);
    
    response([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'access_token' => createJWT($user),
            'refresh_token' => bin2hex(random_bytes(32)),
            'token_type' => 'Bearer',
            'expires_in' => (int)env('JWT_EXPIRATION_TIME', 15) * 60
        ]
    ]);
}

function getCurrentUser($pdo) {
    $token = getAuthToken();
    if (!$token) {
        response(['success' => false, 'message' => 'Authorization header missing'], 401);
    }
    
    $payload = verifyJWT($token);
    if (!$payload) {
        response(['success' => false, 'message' => 'Invalid or expired token'], 401);
    }
    
    $stmt = $pdo->prepare('SELECT id, name, email, phone, role, avatar_url, bio, address, is_active, last_login_at FROM users WHERE id = ?');
    $stmt->execute([$payload['sub']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        response(['success' => false, 'message' => 'User not found'], 404);
    }
    
    response(['success' => true, 'data' => $user]);
}

function logout($pdo) {
    response(['success' => true, 'message' => 'Logout successful']);
}

function refreshToken($pdo) {
    $data = getInput();
    
    if (empty($data['refresh_token'])) {
        response(['success' => false, 'message' => 'Refresh token required'], 400);
    }
    
    // For now, just create a new token (implement refresh token storage separately)
    $token = ['id' => 1, 'email' => 'user@example.com', 'role' => 'user', 'name' => 'User'];
    
    response([
        'success' => true,
        'message' => 'Token refreshed successfully',
        'data' => [
            'access_token' => createJWT($token),
            'token_type' => 'Bearer',
            'expires_in' => (int)env('JWT_EXPIRATION_TIME', 15) * 60
        ]
    ]);
}

function forgotPassword($pdo) {
    $data = getInput();
    
    if (empty($data['email'])) {
        response(['success' => false, 'message' => 'Email required'], 400);
    }
    
    response([
        'success' => true,
        'message' => 'If email exists, you will receive a reset link'
    ]);
}

function resetPassword($pdo) {
    response(['success' => false, 'message' => 'Not implemented yet'], 501);
}
