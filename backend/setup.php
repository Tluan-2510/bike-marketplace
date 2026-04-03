#!/usr/bin/env php
<?php

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;
use Database\Migrator;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Setup database connection
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

echo "╔════════════════════════════════════════╗\n";
echo "║  Bike Marketplace - Database Setup     ║\n";
echo "╚════════════════════════════════════════╝\n\n";

echo "Database: " . env('DB_DATABASE') . "\n";
echo "Host: " . env('DB_HOST') . ":" . env('DB_PORT') . "\n\n";

try {
    Migrator::runMigrations();
    echo "\n✓ Setup completed successfully!\n";
} catch (\Exception $e) {
    echo "\n✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
