<?php

namespace App\Core;

use Closure;
use App\Core\Request;

class Router
{
    private array $routes = [];
    private array $middleware = [];
    private array $globalMiddleware = [];

    public function post(string $path, mixed $action): Route
    {
        return $this->addRoute('POST', $path, $action);
    }

    public function get(string $path, mixed $action): Route
    {
        return $this->addRoute('GET', $path, $action);
    }

    public function put(string $path, mixed $action): Route
    {
        return $this->addRoute('PUT', $path, $action);
    }

    public function patch(string $path, mixed $action): Route
    {
        return $this->addRoute('PATCH', $path, $action);
    }

    public function delete(string $path, mixed $action): Route
    {
        return $this->addRoute('DELETE', $path, $action);
    }

    private function addRoute(string $method, string $path, mixed $action): Route
    {
        $route = new Route($method, $path, $action);
        $this->routes[] = $route;
        return $route;
    }

    public function dispatch(Request $request)
    {
        $method = $request->getMethod();
        $path = $request->getPathInfo();

        // Match route
        $route = $this->matchRoute($method, $path);

        if (!$route) {
            return response()->json([
                'success' => false,
                'message' => 'Route not found',
            ], 404);
        }

        // Build middleware stack
        $middlewares = array_merge($this->globalMiddleware, $route->getMiddleware());

        // Handle middleware
        $response = $this->handleMiddleware($request, $middlewares, function () use ($request, $route) {
            return $route->dispatch($request);
        });

        return $response;
    }

    private function matchRoute(string $method, string $path): ?Route
    {
        foreach ($this->routes as $route) {
            if ($route->matches($method, $path)) {
                return $route;
            }
        }
        return null;
    }

    private function handleMiddleware(Request $request, array $middlewares, Closure $callback)
    {
        if (empty($middlewares)) {
            return $callback();
        }

        $middleware = array_shift($middlewares);
        $next = fn() => $this->handleMiddleware($request, $middlewares, $callback);

        return $middleware->handle($request, $next);
    }

    public function middleware(string|array $middleware): static
    {
        $middlewares = is_array($middleware) ? $middleware : [$middleware];
        $this->globalMiddleware = array_merge($this->globalMiddleware, $middlewares);
        return $this;
    }

    public function getRoutes(): array
    {
        return $this->routes;
    }
}

