<?php

namespace App\Controllers;

use App\Http\Request;
use App\Services\AuthService;

class AuthController
{
    private AuthService $authService;
    private string $viewsPath;
    private string $appName;

    public function __construct(AuthService $authService, string $appName)
    {
        $this->authService = $authService;
        $this->viewsPath = __DIR__ . '/../Views';
        $this->appName = $appName;
    }

    public function showLogin(Request $request)
    {
        $error = $request->getQueryParams()['error'] ?? null;
        $appName = $this->appName;
        include $this->viewsPath . '/auth/login.php';
    }

    public function login(Request $request)
    {
        $username = trim($request->input('username', ''));
        $password = trim($request->input('password', ''));

        if ($username === '' || $password === '') {
            header('Location: /login?error=Missing+credentials');
            return;
        }

        if (!$this->authService->login($username, $password)) {
            header('Location: /login?error=Invalid+credentials');
            return;
        }

        header('Location: /');
    }

    public function logout(): void
    {
        $this->authService->logout();
        header('Location: /login');
    }
}
