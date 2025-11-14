<?php

namespace App\Http;

class Router
{
    private array $routes = [];

    public function get(string $path, callable $handler): void
    {
        $this->routes['GET'][$path] = $handler;
    }

    public function post(string $path, callable $handler): void
    {
        $this->routes['POST'][$path] = $handler;
    }

    public function dispatch(Request $request)
    {
        $method = $request->getMethod();
        $path = $request->getPath();

        if (isset($this->routes[$method][$path])) {
            return call_user_func($this->routes[$method][$path], $request);
        }

        if ($method === 'GET' && isset($this->routes['GET']['/module/:module']) && preg_match('#^/module/([^/]+)$#', $path, $matches)) {
            return call_user_func($this->routes['GET']['/module/:module'], $request, $matches[1]);
        }

        if ($method === 'GET' && isset($this->routes['GET']['/module/:module/:id']) && preg_match('#^/module/([^/]+)/([^/]+)$#', $path, $matches)) {
            return call_user_func($this->routes['GET']['/module/:module/:id'], $request, $matches[1], $matches[2]);
        }

        if ($method === 'POST' && isset($this->routes['POST']['/module/:module/:id']) && preg_match('#^/module/([^/]+)/([^/]+)$#', $path, $matches)) {
            return call_user_func($this->routes['POST']['/module/:module/:id'], $request, $matches[1], $matches[2]);
        }

        http_response_code(404);
        echo '404 Not Found';
    }
}
