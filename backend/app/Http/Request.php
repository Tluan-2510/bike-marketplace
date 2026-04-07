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

}
