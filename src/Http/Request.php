<?php

namespace App\Http;

class Request
{
    public function getMethod(): string
    {
        return $_SERVER['REQUEST_METHOD'] ?? 'GET';
    }

    public function getPath(): string
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        return rtrim($path, '/') ?: '/';
    }

    public function getQueryParams(): array
    {
        return $_GET;
    }

    public function getPostData(): array
    {
        return $_POST;
    }

    public function getSession(): array
    {
        return $_SESSION ?? [];
    }

    public function input(string $key, $default = null)
    {
        return $this->getPostData()[$key] ?? $this->getQueryParams()[$key] ?? $default;
    }
}
