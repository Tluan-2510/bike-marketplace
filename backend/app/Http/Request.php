<?php

namespace Illuminate\Http;

class Request
{
    private array $query = [];
    private array $post = [];
    private array $files = [];
    private array $headers = [];
    private array $server = [];
    private string $method = '';
    private string $path = '';
    private $user = null;
    private array $userResolver = [];
    private string $body = '';
    private array $jsonData = [];

    public function __construct()
    {
        $this->query = $_GET;
        $this->post = $_POST;
        $this->files = $_FILES;
        $this->server = $_SERVER;
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $this->path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '/';
        $this->headers = $this->parseHeaders();
        $this->body = file_get_contents('php://input');
        $this->parseJson();
    }

    private function parseHeaders(): array
    {
        $headers = [];
        foreach ($this->server as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $headerKey = str_replace('HTTP_', '', $key);
                $headerKey = str_replace('_', '-', ucwords(strtolower($headerKey), '_'));
                $headers[$headerKey] = $value;
            }
        }
        return $headers;
    }

    private function parseJson(): void
    {
        if ($this->body && $this->isJson()) {
            $this->jsonData = json_decode($this->body, true) ?? [];
        }
    }

    private function isJson(): bool
    {
        $contentType = $this->header('Content-Type', '');
        return strpos($contentType, 'application/json') !== false;
    }

    public function getMethod(): string
    {
        return strtoupper($this->server['REQUEST_METHOD'] ?? 'GET');
    }

    public function getPathInfo(): string
    {
        // Remove query string
        return strtok($_SERVER['REQUEST_URI'] ?? '/', '?');
    }

    public function input(string $key, $default = null)
    {
        return $this->jsonData[$key] ?? $this->post[$key] ?? $this->query[$key] ?? $default;
    }

    public function query(string $key = null, $default = null)
    {
        if ($key === null) {
            return $this->query;
        }
        return $this->query[$key] ?? $default;
    }

    public function all(): array
    {
        return array_merge($this->query, $this->post, $this->jsonData);
    }

    public function header(string $key = null, $default = null)
    {
        if ($key === null) {
            return $this->headers;
        }

        $key = str_replace('_', '-', ucwords(strtolower($key), '_'));
        return $this->headers[$key] ?? $default;
    }

    public function validate(array $rules): array
    {
        $data = $this->all();
        $validated = [];

        foreach ($rules as $field => $rule) {
            if (isset($data[$field])) {
                $validated[$field] = $data[$field];
            }
        }

        return $validated;
    }

    public function user()
    {
        return $this->user;
    }

    public function setUserResolver(callable $resolver): void
    {
        $this->userResolver = $resolver;
        $this->user = $resolver();
    }

    public function getBody(): string
    {
        return $this->body;
    }

    public function getJsonData(): array
    {
        return $this->jsonData;
    }

}
