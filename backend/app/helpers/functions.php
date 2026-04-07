<?php

use App\Http\Router;
use Illuminate\Support\Carbon;

function route(string $path, mixed $action): \App\Http\Route
{
    $router = app(Router::class);

    // Parse method and path
    [$method, $actualPath] = explode(' ', trim($path), 2);
    $method = strtoupper($method);

    $method = match ($method) {
        'GET' => 'get',
        'POST' => 'post',
        'PUT' => 'put',
        'PATCH' => 'patch',
        'DELETE' => 'delete',
        default => throw new \Exception("Invalid HTTP method: $method"),
    };

    return $router->$method($actualPath, $action);
}

function app($abstract = null)
{
    static $container = null;

    if ($container === null) {
        $container = $GLOBALS['container'] ?? new \App\Container();
    }

    if ($abstract === null) {
        return $container;
    }

    return $container->make($abstract);
}


