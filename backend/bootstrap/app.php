<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;
use App\Core\Container;
use App\Core\Router;
use App\Core\Request;
use App\Services\JwtService;
use App\Services\AuthService;

// Load environment variables
try {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
} catch (\Exception $e) {
    // .env file not found
}

// Initialize container
$container = new Container();

// Register services
$container->singleton(JwtService::class, fn() => new JwtService());
$container->singleton(AuthService::class, fn($app) => new AuthService($app->make(JwtService::class)));
$container->singleton(Router::class, fn() => new Router());

// Make container globally accessible
$GLOBALS['container'] = $container;

// Setup database connection
try {
    $capsule = new Capsule();
    $capsule->addConnection([
        'driver' => env('DB_CONNECTION', 'mysql'),
        'host' => env('DB_HOST', 'localhost'),
        'port' => env('DB_PORT', 3306),
        'database' => env('DB_DATABASE'),
        'username' => env('DB_USERNAME'),
        'password' => env('DB_PASSWORD'),
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
    ]);

    $capsule->setAsGlobal();
    $capsule->bootEloquent();
} catch (\Exception $e) {
    // Database connection error - will be handled in router
}

// Register routes
require_once __DIR__ . '/../routes/api.php';

// Handle request
$request = new Request();
$router = $container->make(Router::class);

try {
    $response = $router->dispatch($request);
    
    if (method_exists($response, 'send')) {
        $response->send();
    } else {
        header('Content-Type: application/json');
        echo json_encode($response);
    }
} catch (\Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => env('APP_DEBUG') ? $e->getMessage() : 'Internal server error',
        'debug' => env('APP_DEBUG') ? [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ] : null,
    ]);
}
