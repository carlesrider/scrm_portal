<?php

namespace App\Middleware;

use App\Services\AuthService;

class AuthMiddleware
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(): void
    {
        if (!$this->authService->check()) {
            header('Location: /login');
            exit;
        }
    }
}
