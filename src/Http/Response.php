<?php

namespace App\Http;

class Response
{
    public function redirect(string $url): void
    {
        header('Location: ' . $url);
        exit;
    }

    public function render(string $view, array $params = []): void
    {
        extract($params);
        include $view;
    }
}
