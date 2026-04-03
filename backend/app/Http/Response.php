<?php

namespace App\Http;

class ResponseFactory
{
    public function json(array $data, int $statusCode = 200): JsonResponse
    {
        return new JsonResponse($data, $statusCode);
    }
}

class JsonResponse
{
    private array $data;
    private int $statusCode;

    public function __construct(array $data, int $statusCode = 200)
    {
        $this->data = $data;
        $this->statusCode = $statusCode;
    }

    public function send(): void
    {
        header('Content-Type: application/json');
        http_response_code($this->statusCode);
        echo json_encode($this->data);
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }
}
