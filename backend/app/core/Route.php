<?php

namespace App\Core;

use Closure;
use App\Core\Request;

class Route
{
    private string $method;
    private string $path;
    private mixed $action;
    private array $middleware = [];
    private array $parameters = [];

    public function __construct(string $method, string $path, mixed $action)
    {
        $this->method = $method;
        $this->path = $path;
        $this->action = $action;
    }

    public function matches(string $method, string $path): bool
    {
        if ($this->method !== $method) {
            return false;
        }

        $this->parameters = [];
        $pattern = $this->pathToRegex($this->path);

        if (preg_match($pattern, $path, $matches)) {
            array_shift($matches);
            $this->parameters = $matches;
            return true;
        }

        return false;
    }

    private function pathToRegex(string $path): string
    {
        $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $path);
        return '#^' . $pattern . '$#';
    }

    public function dispatch(Request $request)
    {
        if (is_array($this->action) && count($this->action) === 2) {
            [$controllerClass, $method] = $this->action;
            $controller = new $controllerClass();
            return $controller->$method($request);
        }

        if (is_callable($this->action)) {
            return call_user_func($this->action, $request);
        }

        throw new \Exception('Invalid action');
    }

    public function middleware(string|array $middleware): static
    {
        $middlewares = is_array($middleware) ? $middleware : [$middleware];
        $this->middleware = array_merge($this->middleware, $middlewares);
        return $this;
    }

    public function getMiddleware(): array
    {
        return array_map(function ($middleware) {
            if (is_string($middleware)) {
                return $this->resolveMiddleware($middleware);
            }
            return $middleware;
        }, $this->middleware);
    }

    private function resolveMiddleware(string $middleware)
    {
        $parts = explode(':', $middleware);
        $middlewareName = $parts[0];
        $parameters = array_slice($parts, 1);

        $middlewareClass = match ($middlewareName) {
            'auth' => \App\Http\Middleware\AuthMiddleware::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            default => throw new \Exception("Unknown middleware: $middlewareName"),
        };

        $instance = app($middlewareClass);

        if ($parameters && method_exists($instance, 'setParameters')) {
            $instance->setParameters($parameters);
        }

        return $instance;
    }
}
